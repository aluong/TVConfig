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
					var sid = 'session-'+IGLoo.name+'-'+IGLoo.cId+'-'+IGLoo.sessions.nextId;
					now.serverCreateSession(sid);
					IGLoo.sessions.nextId += 1;
					//set isLeader
					IGLoo.isLeader = true;
					
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