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
					
					// Set isLeader
					IGLoo.isLeader = true;
					
					// Hide old Session Watch
					IGLoo.hideWatchButton(IGLoo.sId);
					
					// Set session-id
					IGLoo.sId = sId;
					
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