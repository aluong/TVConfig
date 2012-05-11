Ext.define('IGLoo.controller.ConfigureController',{
    extend:'Ext.app.Controller',
    
    init: function(){
        //detect device
		if (Ext.os.is.iPad) {
			Ext.Msg.alert('iPad Connected');
		}
		else {
			Ext.Msg.alert('Other Device Connected');
		}
    } ,
    
    config: {
        refs: {
        	sessionDetails: '#session-details',
            deleteSessionsButton: '#session-details button'
        },
        control: {
        	sessionDetails: {
        		show: function() {
        			var sessionDetailsPanel = Ext.getCmp('session-details');
        			now.serverGetDevicesFromSession(sessionDetailsPanel.currentSession);
        		}
        	},
            deleteSessionsButton: {
            	tap: function() {
            		var sessionDetailsPanel = Ext.getCmp('session-details');
            		console.log('Deleting Session: '+sessionDetailsPanel.currentSession);
            		
            		
            		now.serverDeleteSession(sessionDetailsPanel.currentSession);
            		sessionDetailsPanel.hide();
            	}
            }
        }
    }
});

// Callback form of serverGetDevicesFromSession obtaining 
// listOfDevices from a particular session
now.clientGetDevicesFromSession = function(listOfDevices) {
	var sessionDetailsPanel = Ext.getCmp('session-details');

	// very simple display
	sessionDetailsPanel.setHtml(sessionDetailsPanel.getHtml()+'<p>Current Devices:');
	for(var name in listOfDevices)
		sessionDetailsPanel.setHtml(sessionDetailsPanel.getHtml()+'<br>'+listOfDevices[name]);
}