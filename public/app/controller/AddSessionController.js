Ext.define('IGLoo.controller.AddSessionController',{
    extend:'Ext.app.Controller',
    
    config: {
        refs: {
        	createSession: '#create-session-button',
        	titleBarAddSessionButton: '#titlebar-add-session-button'
        },
        control: {
        	createSession: {
        		tap: function() {
					console.log("Request to Add Session")
					// Create a New Session
					var sId = 'session-'+IGLoo.name+'-'+IGLoo.cId+'-'+IGLoo.sessions.nextId;
					now.serverCreateSession(sId);
					IGLoo.sessions.nextId += 1;
					
					// Hide old Session Watch
					now.clientHideWatchButton(IGLoo.sId);
					
					// Reset Session-Details Varaibles for Client
					Ext.StoreMgr.lookup('DevicesStore').setOpenLoad(true);
					
					// Reset all of the Media Control Buttons
					// Selects the Media in the Session Details
					Ext.each(Ext.ComponentQuery.query('mediaitem'), 
						function(item) {
							item.getAt(4).getAt(0).setIcon('/resources/icons/play.png');
						}
					);

					Ext.getCmp('add-session-panel').hide();	
        		}
        	},
        	titleBarAddSessionButton: {
        		tap: function() {
					var addpanel = Ext.getCmp('add-session-panel');
					if(addpanel.isHidden())
						addpanel.show('pop');
					else
						addpanel.hide();
        		}
        	}
        }
    }
});