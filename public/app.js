Ext.application({
	name: 'IGLoo',

	views: ['DeviceIcon','VideoPanel','ConfigurePanel','MainPanel'],
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
	
	var devices = {}
	
	Ext.Msg.prompt(
		'Device Connected!',
		'What is your device\'s name?',
		function (buttonId, name) {

			// Add Main Panel
			Ext.Viewport.add(Ext.create('IGLoo.view.MainPanel'));

			now.ready(function(){
				
				// Add user's name
				now.name = name
				
				// Adds device to device list and creates new item
				now.addDevice = function(deviceName) {
					console.log("Request to add device: "+deviceName)
					if(!devices[deviceName]) {
						Ext.getCmp('config-panel').add({
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
						devices[deviceName] = true
						console.log("Device Added: "+deviceName);
					}
					else {
						console.log("Device Exists: "+deviceName);
					}
				}
				
				// Removes device
				now.removeDevice = function(deviceName) {
					devices[deviceName] = false;
					console.log("Request to Remove Device: "+deviceName);
					for(var i = 5; i < Ext.getCmp('config-panel').getItems().length; i++ ) {
						if(Ext.getCmp('config-panel').getAt(i).getName() == deviceName) {
							Ext.getCmp('config-panel').getAt(i).destroy()
							console.log("Device Removed: "+deviceName);
						}
					}
				}
				
				now.loaded(name);
			});
		},
		null,
		false,
		null,
		{ autoCapitalize : true, placeHolder : 'Alice\'s Ipad' }
	);
	}
});
