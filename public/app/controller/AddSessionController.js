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
					var sid = 'session-'+IGLoo.dId+'-'+IGLoo.cId+'-'+IGLoo.sessions.nextId;
					now.serverCreateSession(sid);
					IGLoo.sessions.nextId += 1;
					
					Ext.getCmp('add-session-panel').hide();
					
					// Move device icon to session
					// HACK! SHOULD NOT RELY ON TIMER
					Ext.defer(now.serverMoveDeviceIconToSession, 500, this, ['device-'+IGLoo.dId, sid]);
					
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

now.clientMoveDeviceIconToSession = function(did, sid) {
	var device = Ext.getCmp(did);
	var sessionRegion = Ext.util.Region.getRegion(sid);
	device.getDraggable().setOffset(sessionRegion.left, sessionRegion.top);
};