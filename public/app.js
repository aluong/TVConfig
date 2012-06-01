Ext.application({
	name: 'IGLoo',

	views: [
		'DeviceIcon','VideoPanel','ConfigurePanel', 'SessionPanel', 
		'SessionDetails', 'DevicesList', 'DevicesItem', 'MediaList', 'MediaItem'],
	stores: ['DevicesStore', 'MediaStore'],
	models: ['Device', 'Media'], 
	controllers: ['ConfigureController', 'DevicesController', 'AddSessionController', 'MediaListController'],
	requires: ['Ext.MessageBox'],
	
	icon: {
        57: 'resources/icons/Icon.png',
        72: 'resources/icons/Icon~ipad.png',
        114: 'resources/icons/Icon@2x.png',
        144: 'resources/icons/Icon~ipad@2x.png'
    },

	phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg',

	launch: function () {
	
		// Globals under the IGLoo namespace
		IGLoo.devices = {};
		IGLoo.sessions = {};
		IGLoo.sessions.nextId = 0;
		IGLoo.name = ''; // Device name ex: "iPad"
		IGLoo.cId = ''; // ClientId from socket.io
		IGLoo.offset = {}; // Offset for devices
		IGLoo.offset.x = 100;
		IGLoo.offset.y = 100;
		IGLoo.offset.space = 100;
		IGLoo.tmpOffset = {}; // tmp offset used to record the location
		IGLoo.isLeader = false;
		IGLoo.sId = null;
		IGLoo.url = '';
				
		Ext.Msg.prompt(
			'Device Connected!',
			'What is your device\'s name?',
			function (buttonId, name) {
	
				// Add Main Panel
				Ext.Viewport.add(Ext.create('IGLoo.view.ConfigurePanel'));
	
				now.ready(function(){
					
					// Define NowJS Functions
					nowJSfunctionDefinitions();
					
					// Add user's name
					IGLoo.name = name;
					now.name = name;
					
					// Add Device to Server
					now.serverAddDevice(name);
					
					// Load Devices and Sessions
					// Initial Delay 1 second
					Ext.defer(now.serverLoadDevices,200);
					Ext.defer(now.serverLoadSessions,200);
					
				});
			},
			this,
			false,
			Ext.browser.name, // Helpful for debugging
			{ autoCapitalize : true, placeHolder : 'Alice\'s Ipad' }
		);
	}
});


// ----------------------------------------------------- //	
// ----------- CLIENT SIDE NOWJS FUNCTIONS ------------- //
// ----------------------------------------------------- //				

nowJSfunctionDefinitions = function() {
	
	// ------------------------------------------------ //
	// ----------- IGLoo Global Variables ------------- //
	// ------------------------------------------------ //	
	
	// Set the clientId
	now.clientSetClientId = function(cId) {
		IGLoo.cId = cId;
		console.log('Set cId to: '+IGLoo.cId);
	};
	
	// Set the sId
	now.clientSetSId = function(sId) {
		IGLoo.sId = sId;
		console.log('Set sId to: '+IGLoo.sId);
	};
	
	// --------------------------------- //
	// ----------- DEVICES ------------- //
	// --------------------------------- //	
	
	// Adds device to device list and creates new item
	now.clientAddDevice = function(deviceName, cId) {
		if(!IGLoo.devices[cId]) {							
			var configPanel = Ext.getCmp('config-panel');		
			configPanel.add( {
				xclass: 'IGLoo.view.DeviceIcon',
				name: deviceName,
				id: cId,
				items: [
					{
						html:[
							"<img src='resources/img/ipad-icon.jpg'/>",
							"<p>",deviceName,"</p>"
						].join(''),
						zindex:1
					}
				]
			});
			IGLoo.devices[cId] = true
			console.log("Device Added: "+cId);

		}
		else {
			console.log("Device Exists: "+cId);
		}

	};
	
	// Remove Device
	now.clientRemoveDevice = function(cId) {
		IGLoo.devices[cId] = false;
		var configPanel = Ext.getCmp('config-panel');
		for(var i = 5; i < configPanel.getItems().length; i++ ) {
			if(configPanel.getAt(i).getId() == cId) {
				configPanel.getAt(i).destroy()
				console.log("Device Removed: "+cId);
			}
		}
	}
	
	// Set the Client Device Icon's Offset
	now.clientSetDeviceOffset = function(cId, index, sId) {
		var x, y;
		// Check if moving into session
		if(sId == null) {
			x = IGLoo.offset.x + (IGLoo.offset.space * index);
			y = IGLoo.offset.y;
		}
		else {
			console.log("Device: "+cId+" Moved To Session: "+sId);
			var sessionRegion = Ext.util.Region.getRegion(sId);
			x = sessionRegion.left + (IGLoo.offset.space * index);
			y = sessionRegion.top;
		}
		console.log('Device: '+cId+" offset to ("+x+', '+y+')');
		Ext.getCmp(cId).getDraggable().setOffset(x,y);	
	};
	
	// --------------------------------- //
	// ----------- SESSION ------------- //
	// --------------------------------- //	
	
	// Adds Sessions
	now.clientAddSession = function(sId) {
		if(!IGLoo.sessions[sId]) {
			Ext.getCmp('sessions-panel').add({
				xtype:'sessionPanel',
				id:sId
			});
			console.log("Session Created: "+sId);
		}
		IGLoo.sessions[sId] = true;
		//Hide the control buttons if it's not the session that this device is currently in
		if(sId !== IGLoo.sId){
			//query the watch button
			//please change it if you know a better method 
			//Hide watch button at session panel
			var buttons = Ext.ComponentQuery.query('#'+sId+' button');
			var watchButton = buttons[1];
			watchButton.hide();
		}
	};
	
	// Delete Session
	now.clientDeleteSession = function(sId) {
		// Hide Session if viewing the one getting deleted
		if(Ext.getCmp('session-details').currentSession == sId) {
			Ext.getCmp('session-details').hide();
		}
		
		if(IGLoo.sessions[sId]) {
			Ext.getCmp(sId).destroy();
			console.log("Session Deleted: "+sId);
		}
		IGLoo.sessions[sId] = false;
	};

	// ---------------------------------------- //
	// ----------- SESSION-PANELS ------------- //
	// ---------------------------------------- //	
	
	// Show Watch Button
	now.clientShowWatchButton = function(sId) {
		console.log('Show watch button: '+sId);
		if(sId != null) {
			var buttons = Ext.ComponentQuery.query('#'+sId+' button');
			var watchButton = buttons[1];
			if(typeof(watchButton) != 'undefined')
				watchButton.show();
		}
	}
	
	// Hide Watch Button
	now.clientHideWatchButton = function(sId) {
		console.log('Hide watch button: '+sId);
		if(sId != null) {
			var buttons = Ext.ComponentQuery.query('#'+sId+' button');
			var watchButton = buttons[1];
			if(typeof(watchButton) != 'undefined')
				watchButton.hide();
	}
	
	// ----------------------------------------- //		
	// ----------- SESSION-DETAILS ------------- //
	// ----------------------------------------- //	
	
	// Reload the Session Details Devices
	now.reloadSessionDetails = function(sId) {
		var sessionDetailsPanel = Ext.getCmp('session-details');
		var sessionDetailStore = Ext.getCmp('session-details-devices').getStore();
		if(sId == sessionDetailsPanel.currentSession) {
			console.log('Reloading Session Details: '+sId);
			sessionDetailStore.getProxy().setUrl('/sessionDevices?sId='+sessionDetailsPanel.currentSession);
			sessionDetailStore.load({
				//call back after the store has been loaded
				callback: function(records, operation, success){
					var index = sessionDetailStore.findExact('cId', IGLoo.cId);
					var model = sessionDetailStore.getAt(index);
					var deleteButton = Ext.getCmp('delete-session-button');
					if(index === -1 || model.getData().leader !== 1){
						deleteButton.hide();
					}
					else{
						deleteButton.show();
					}
				},
				scope:this
			});
		}
	};
	
	// Selects the Device in the Session Details
	now.clientSelectDevice = function(cId, sId) {
		var record = null;
		Ext.each(Ext.ComponentQuery.query('devicesitem'), 
			function(item) {
				if(item.getRecord().get('cId') == cId && item.getRecord().get('sId') == sId) {
					Ext.getCmp('session-details-devices').currentSelection = item;
					item.setStyle('background-color:blue;');
					record = item.getRecord();
					console.log('Selected Device: '+cId);
				}
				else {
					item.setStyle('background-color:white;');
				}
			}
		);
		return record;
	};
	
	// Selects the Media in the Session Details
	now.clientSelectMedia = function(media) {
		var record = null;
		Ext.each(Ext.ComponentQuery.query('mediaitem'), 
			function(item) {
				if(item.getRecord().get('url') == media) {
					Ext.getCmp('session-details-media').currentSelection = item;
					item.setStyle('background-color:blue;');
					record = item.getRecord();
					console.log('Selected Media: '+media);
				}
				else {
					item.setStyle('background-color:white;');
				}
			}
		);
		return record;
	};	
	
	// Updates the selected media content and updates the media list selected item
	now.clientUpdateSelectedMedia = function(cId, url) {
		// Update Video Source and Cover for specific Client
		if(cId == IGLoo.cId) {
			IGLoo.url = url;
			now.clientSetMediaContent(url, Ext.data.StoreManager.lookup('MediaStore').findRecord('url', url).get('cover'));
		}
		
		var currentSelection = Ext.getCmp('session-details-devices').currentSelection;
		if(currentSelection == null)
			return;
			
		var currentSelectedCId= currentSelection.getRecord().get('cId');
		if(currentSelectedCId == cId) {
			now.clientSelectMedia(url);
		}
	};

	// --------------------------------------------- //		
	// ----------- VIDEO-MEDIA-CONTENT ------------- //
	// --------------------------------------------- //	
	
	// Set the current videos clock
	now.syncClock = function(clock){
		IGLoo.clock = clock;
	};
	
	// Play the Video
	now.clientPlayVideo = function() {
		// Hide the Poster
		Ext.getCmp('video-media-content').ghost.hide()
		Ext.getCmp('video-media-content').play();
		console.log('Playing Video');
	};
	
	// Pause the Video
	now.clientPauseVideo = function() {
		Ext.getCmp('video-media-content').pause();
		console.log('Pausing Video');
	};
	
	// Stop the Video
	now.clientStopVideo = function() {
		Ext.getCmp('video-media-content').stop();
		console.log('Stopping Video');
	};
	
	// Sets the Media Content being watched 
	now.clientSetMediaContent = function(url, cover) {
		var video = Ext.getCmp('video-media-content');
		if(url == null && url == null) {
			video.setUrl();
			video.setPosterUrl('');
			console.log('Media Content set to empty');
		}
		else {
			video.setUrl(url);
			video.setPosterUrl(cover);
			console.log('Media Content set to '+url);
		}
	};

}
};
					
