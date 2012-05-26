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
        			
        			// Update Session Label
        			sessionDetailsPanel.getAt(0).setHtml('<center>'+sessionDetailsPanel.currentSession+'<center>');
        		
        			// Update the Devices List
        			var sessionDetailStore = Ext.getCmp('session-details-devices').getStore();
        			sessionDetailStore.getProxy().setUrl('/sessionDevices?sId='+sessionDetailsPanel.currentSession);
					sessionDetailStore.load();
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