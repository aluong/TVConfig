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
					var sid = 'session-'+IGLoo.name+'-'+IGLoo.sessions.nextid;
					now.serverCreateSession(sid);
					IGLoo.sessions.nextid += 1;
					
					Ext.getCmp('add-session-panel').hide();
        		}
        	},
        	titleBarAddSessionButton: {
        		tap: function() {
					var addpanel = Ext.getCmp('add-session-panel');
					console.log(addpanel);
					if(addpanel.isHidden())
						addpanel.show('pop');
					else
						addpanel.hide();
        		}
        	}
        }
    }
});