Ext.application({
	name: 'IGLoo',

	views: ['DeviceIcon','VideoPanel','ConfigurePanel','MainPanel', 'SessionPanel', 'SessionDetails'],
	controllers:['ConfigureController', 'DevicesController', 'AddSessionController'],
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
		IGLoo.dId = ''; // Device name ex: "iPad"
		IGLoo.cId = ''; // ClientId from socket.io
		IGLoo.offset = {}; // Offset for devices
		IGLoo.offset.x = 100;
		IGLoo.offset.y = 100;
		
		Ext.Msg.prompt(
			'Device Connected!',
			'What is your device\'s name?',
			function (buttonId, name) {
	
				// Add Main Panel
				Ext.Viewport.add(Ext.create('IGLoo.view.MainPanel'));
	
				now.ready(function(){
					
					// ----------- CLIENT SIDE NOWJS FUNCTIONS ------------- //
					
					// Set the clientId
					now.clientSetClientId = function(cId) {
						IGLoo.cId = cId;
						console.log('cid: '+IGLoo.cId);
					};
					
					// Adds device to device list and creates new item
					now.clientAddDevice = function(dId) {
						console.log("Request to add device: "+dId)
						if(!IGLoo.devices[dId]) {							
							var configPanel = Ext.getCmp('config-panel');		
							configPanel.add( {
								xclass: 'IGLoo.view.DeviceIcon',
								name: dId,
								id: 'device-'+dId,
								items:
									[
										{
											html:[
												"<img src='resources/img/ipad-icon.jpg' style='width:90%;'/>",
												"<p>",dId,"</p>"
											].join(''),
											zindex:1
										}
									]
							});
							IGLoo.devices[dId] = true
							console.log("Device Added: "+dId);
						}
						else {
							console.log("Device Exists: "+dId);
						}
					};
					
					// Removes device
					now.clientRemoveDevice = function(dId) {
						console.log("Request to Remove Device: "+dId);
						IGLoo.devices[dId] = false;
						var configPanel = Ext.getCmp('config-panel');
						for(var i = 5; i < configPanel.getItems().length; i++ ) {
							if(configPanel.getAt(i).getName() == dId) {
								configPanel.getAt(i).destroy()
								console.log("Device Removed: "+dId);
							}
						}
					}
					
					// Adds Sessions
					now.clientAddSession = function(sId) {
						if(!IGLoo.sessions[sId]) {
							console.log("Creating Session: "+sId);
							Ext.getCmp('sessions-panel').add({
								xtype:'sessionPanel',
								id:sId
							});
						}
						IGLoo.sessions[sId] = true;
					};
					
					// Delete Session
					now.clientDeleteSession = function(sId) {
						if(IGLoo.sessions[sId]) {
							console.log("Destroying Session: "+sId);
							Ext.getCmp(sId).destroy();
						}
						IGLoo.sessions[sId] = false;
						Ext.getCmp('session-details').hide();
					};
					
					// -------------------------------------------- //
					
					// Add user's name
					IGLoo.dId = name;
					now.dId = name;
					
					// Add Device to Server
					now.serverAddDevice(name);
					
					// Load Devices and Sessions
					// Initial Delay 1 second
					Ext.defer(now.serverLoadDevices,1000);
					Ext.defer(now.serverLoadSessions,1000);

					
				});
			},
			null,
			false,
			null,
			{ autoCapitalize : true, placeHolder : 'Alice\'s Ipad' }
		);
	}
});
					
