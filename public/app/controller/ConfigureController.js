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
        			now.reloadSessionDetailsDeviceList(sessionDetailsPanel.currentSession);
					
        			// Hide Click-Here if client not in session or it's not the leader
        			if(sessionDetailsPanel.currentSession != IGLoo.sId || !IGLoo.isLeader) {
        				// Hide the button
        				Ext.each(Ext.ComponentQuery.query('mediaitem'), 
        					function(item) {
	        					//item.getAt(0).hide();
	        					item.getAt(0).setHtml('Selected <br>Indicator');
								//hide all PLAY, STOP buttons
								item.getAt(4).hide();
	        				}
        				);
        				console.log('Hide all session-details click buttons');
        			}
        			else {
    					// Show the click button button
						Ext.each(Ext.ComponentQuery.query('mediaitem'), 
							function(item) {
								//item.getAt(0).show();
								item.getAt(0).setHtml('<b>Click Here <br>To <br>Select Media</b>');
							}
						);
						console.log('Show all session-details click buttons');
					}
        			
					// lock config panel
					Ext.getCmp('config-panel').setScrollable(false);
        		},
        		hide: function() {
        			// unlock config panel
					Ext.getCmp('config-panel').setScrollable(true);
					Ext.getCmp('session-details').currentSession = null;
					Ext.StoreMgr.lookup('DevicesStore').setOpenLoad(true);
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