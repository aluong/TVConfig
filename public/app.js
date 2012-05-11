Ext.application({
	name: 'IGLoo',

	views: ['DeviceIcon','VideoPanel','ConfigurePanel','MainPanel', 'SessionPanel'],
	controllers:['ConfigureController'],
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
		IGLoo.sessions.nextid = 0;
		
		Ext.Msg.prompt(
			'Device Connected!',
			'What is your device\'s name?',
			function (buttonId, name) {
	
				// Add Main Panel
				Ext.Viewport.add(Ext.create('IGLoo.view.MainPanel'));
	
				now.ready(function(){
					
					// Add user's name
					now.name = name;
					IGLoo.name = name;
					
					// Adds device to device list and creates new item
					now.clientAddDevice = function(deviceName) {
						console.log("Request to add device: "+deviceName)
						if(!IGLoo.devices[deviceName]) {							
							var configPanel = Ext.getCmp('config-panel');		
							configPanel.add( {
								xclass: 'IGLoo.view.DeviceIcon',
								name: deviceName,
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
					}
					
					// Removes device
					now.clientRemoveDevice = function(deviceName) {
						console.log("Request to Remove Device: "+deviceName);
						IGLoo.devices[deviceName] = false;
						var configPanel = Ext.getCmp('config-panel');
						for(var i = 4; i < configPanel.getItems().length-1; i++ ) {
							if(configPanel.getAt(i).getName() == deviceName) {
								configPanel.getAt(i).destroy()
								console.log("Device Removed: "+deviceName);
							}
						}
					}
	
					// Adds Sessions
					now.clientReceiveSession = function(session_id){
						Ext.getCmp('sessions-panel').add({
							xtype:'sessionPanel',
							id:session_id
						});
						IGLoo.sessions[session_id] = true;
					};
	
					//remove session
					/*
					now.removeSession = function(sid){
						IGLoo.sessions[sid] = false;
						Ext.getCmp(sid).destroy();
					};
					*/
					
					// Add Device to Server and then load all current devices and sessions
					now.serverAddDevice(name);
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
