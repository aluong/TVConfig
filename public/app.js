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
					now.clientAddDevice = function(deviceName) {
						console.log("Request to add device: "+deviceName)
						if(!IGLoo.devices[deviceName]) {							
							var configPanel = Ext.getCmp('config-panel');		
							configPanel.add( {
								xclass: 'IGLoo.view.DeviceIcon',
								name: deviceName,
								id: 'device-'+deviceName,
								items:
									[
										{
											html:[
												"<img src='resources/img/ipad-icon.jpg' style='width:90%;'/>",
												"<p>",deviceName,"</p>"
											].join(''),
											zindex:1
										}
									]
							});
							IGLoo.devices[deviceName] = true
							console.log("Device Added: "+deviceName);
						}
						else {
							console.log("Device Exists: "+deviceName);
						}
					};
					
					// Removes device
					now.clientRemoveDevice = function(deviceName) {
						console.log("Request to Remove Device: "+deviceName);
						IGLoo.devices[deviceName] = false;
						var configPanel = Ext.getCmp('config-panel');
						for(var i = 5; i < configPanel.getItems().length; i++ ) {
							if(configPanel.getAt(i).getName() == deviceName) {
								configPanel.getAt(i).destroy()
								console.log("Device Removed: "+deviceName);
							}
						}
					}
					
					// Adds Sessions
					now.clientAddSession = function(session_id) {
						Ext.getCmp('sessions-panel').add({
							xtype:'sessionPanel',
							id:session_id
						});
						IGLoo.sessions[session_id] = true;
					};
					
					// Delete Session
					now.clientDeleteSession = function(session_id) {
						IGLoo.sessions[session_id] = false;
						Ext.getCmp(session_id).destroy();
						Ext.getCmp('session-details').hide();
					};
					
					// -------------------------------------------- //
					
					// Add user's name
					IGLoo.dId = name;
					now.did = name;
					
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
					
