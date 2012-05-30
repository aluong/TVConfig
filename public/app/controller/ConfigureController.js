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
        			now.reloadSessionDetails(sessionDetailsPanel.currentSession);
					
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
					Ext.data.StoreManager.lookup('DevicesStore').setOpenLoad(true);
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

function selectDevice(cId, sId) {
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
}

function selectMedia(media) {
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
}


now.reloadSessionDetails = function(sId) {
	var sessionDetailsPanel = Ext.getCmp('session-details');
	var sessionDetailStore = Ext.getCmp('session-details-devices').getStore();
	if(sId == sessionDetailsPanel.currentSession) {
		console.log('Reloading Session Details: '+sId);
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
	}
}
