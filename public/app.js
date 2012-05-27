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
		IGLoo.tmpOffset = {}; // tmp offset used to record the location
				
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

// ----------- CLIENT SIDE NOWJS FUNCTIONS ------------- //
					
nowJSfunctionDefinitions = function() {

	// Set the clientId
	now.clientSetClientId = function(cId) {
		IGLoo.cId = cId;
		console.log('cid: '+IGLoo.cId);
	};
	
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
		//
		now.serverSetDeviceOffset(cId, IGLoo.offset.x, IGLoo.offset.y);
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

};
					
