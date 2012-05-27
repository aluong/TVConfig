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
            deleteSessionsButton: '#delete-session-button'
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

					// lock config panel
					Ext.getCmp('config-panel').setScrollable(false);
        		},
        		hide: function() {
        			// unlock config panel
					Ext.getCmp('config-panel').setScrollable(true);
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
