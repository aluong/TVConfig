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
		IGLoo.url = null;
				
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
					
					// Load Devices and Sessions
					now.serverLoadDevices();
					now.serverLoadSessions();
					
					// Add Device to Server
					// Delay .2 seconds
					Ext.defer(now.serverAddDevice, 200, this, [name]);
										
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
	
	// Set the leader
	now.clientSetIsLeader = function(val) {
		IGLoo.isLeader = val;
		console.log('Set isLeader to: '+val);
	}
	
	// Set the url
	now.clientSetUrl = function(url) {
		IGLoo.url = url;
		console.log('Set url to: '+url);
	}
	
	// --------------------------------- //
	// ----------- DEVICES ------------- //
	// --------------------------------- //	
	
	// Adds device to device list and creates new item
	now.clientAddDevice = function(deviceName, cId, isPublic) {
		if(!IGLoo.devices[cId]) {							
			var configPanel = Ext.getCmp('config-panel');
			var device = Ext.create('IGLoo.view.DeviceIcon', {
				name: deviceName,
				id: cId
			});
			
			device.getAt(1).setHtml('<b>'+deviceName+'</b>');
			
			// Hide Private/Public if Client's device
			if( IGLoo.cId == cId) {
				device.getAt(3).enable();
				device.getAt(3).show();
			}
			
			// Set device's public status
			now.clientSetPublicStatus(cId, isPublic);
			
			configPanel.add(device);
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
	
	// Set Public Status of Device
	now.clientSetPublicStatus = function(cId, isPublic) {
		var device = Ext.getCmp(cId).getAt(3);
		if (isPublic == 0) {
			device.getParent().setIsPublic(0);
			device.getParent().getAt(2).setHtml('<b>Public<b>');
			device.getParent().getAt(2).setStyle("color: green");
			console.log(cId+' is Public Toggled');
		} else {
			device.getParent().setIsPublic(1);
			device.getParent().getAt(2).setHtml('<b>Private<b>');
			device.getParent().getAt(2).setStyle("color: red");
			console.log(cId+' is Private Toggled');
		}
	}
	
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
		
		//Hide the control buttons if it's not clients's current session
		if(sId !== IGLoo.sId){
			now.clientHideWatchButton(sId);
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
	}
	
	// ----------------------------------------- //		
	// ----------- SESSION-DETAILS ------------- //
	// ----------------------------------------- //	
	
	// Reload the Session Details Devices List
	now.clientReloadSessionDetailsDeviceList = function(sId) {
		var sessionDetailsPanel = Ext.getCmp('session-details');
		var sessionDetailDevicesStore = Ext.StoreMgr.lookup('DevicesStore');
		if(sId == sessionDetailsPanel.currentSession) {
			console.log('Reloading Session Device List: '+sId);
			sessionDetailDevicesStore.getProxy().setUrl('/sessionDevices?sId='+sessionDetailsPanel.currentSession);
			
			var currentDeviceSelected = null;
			if(Ext.getCmp('session-details-devices').currentSelection != null)
				currentDeviceSelected = Ext.getCmp('session-details-devices').currentSelection.getRecord().get('cId');
			
			sessionDetailDevicesStore.load({
				//call back after the store has been loaded
				callback: function(records, operation, success){
					
					// Reselect the Device since store reloaded
					if(currentDeviceSelected != null) {
						var record = now.clientSelectDevice(currentDeviceSelected, sessionDetailsPanel.currentSession);
						
						// Can't find device, because session changes
						if( record == null ) {
							console.log('Previous selected device cannot be found so loading defaults');
							now.clientSetDefaultDevice();
						}
						else {
							console.log('Previous selected device loaded');
						}
					}
					
				},
				scope:this
			});
		}
	};
	
	// Reload the Session Details Media List
	now.clientReloadSessionDetailsMediaList = function(sId) {
		var sessionDetailsPanel = Ext.getCmp('session-details');
		var sessionDetailMediaStore = Ext.StoreMgr.lookup('MediaStore');
		if(sId == sessionDetailsPanel.currentSession) {
			console.log('Reloading Session Media List: '+sId);
			sessionDetailMediaStore.load();
		}
	};
	
	// Set default device and select it's media
	now.clientSetDefaultDevice = function() {
		console.log('Loading Default Device');
		// Default Select the current Device
		var cId =  Ext.getCmp('session-details').currentSession == IGLoo.sId ? IGLoo.cId : null; 
		var record = now.clientSelectDevice(cId, Ext.getCmp('session-details').currentSession);
		var media = record == null ? null : record.get('media');
		
		// Select the current media item (implied from above we are the session)
		now.clientSelectMedia(media);
	}
	
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
	now.clientPlayVideo = function(sId, url) {
		if(sId == IGLoo.sId && url == IGLoo.url && !IGLoo.isLeader) {
			Ext.Msg.confirm("Confirmation", "Session leader has started video, should we switch to the video?", function(value) {
					// If confirmed 
					if( value == 'yes') {
						// Hide Session Panel
						Ext.getCmp('session-details').hide();
						
						// Show Video panel
						Ext.getCmp('video-panel').show();
						
						// Need to fire ghost's tap event to properly hide the poster
						// and start the video
						//Ext.getCmp('video-media-content').ghost.fireEvent('tap');
						Ext.getCmp('video-media-content').onGhostTap();
						
						console.log('Playing Video');
					}
			});
		}
	};
	
	// Pause the Video
	now.clientPauseVideo = function(sId, url) {
		if(sId == IGLoo.sId && url == IGLoo.url && !IGLoo.isLeader) {
			Ext.getCmp('video-media-content').pause();
			console.log('Pausing Video');
		}
	};
	
	// Stop the Video
	now.clientStopVideo = function(sId, url) {
		if(sId == IGLoo.sId && url == IGLoo.url && !IGLoo.isLeader) {
			Ext.getCmp('video-media-content').stop();
			console.log('Stopping Video');
		}
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
	
	// Set Media Control State
	now.clientMediaControlState = function(states) {
		console.log('Setting Control State');
		for(var i = 0; i < states.length; i++) {
			var control = Ext.getCmp('session-details-media').getAt(0).getAt(i).getAt(4).getAt(0);
			console.log(i+' state: '+states[i]);
			// If we are playing, we want to see pause
			if(states[i] == 'play' ) {
				control.setIcon('/resources/icons/pause.png');
			}
			else {
				control.setIcon('/resources/icons/play.png');
			}
		}
	};
	
	// Session Leader controls 
	now.clientSetSessionLeaderVideoControls = function(leader) {
		var mediaContent = Ext.getCmp('video-media-content');
		if(leader) {
			mediaContent.ghost.on('tap', mediaContent.onGhostTap, mediaContent);
			mediaContent.setEnableControls(true)
			console.log('Enable Leader Controls');
		}
		else {
			mediaContent.ghost.un('tap', mediaContent.onGhostTap, mediaContent);
			mediaContent.setEnableControls(false)
			console.log('Disable Leader Controls');
		}	
	}
};
					
