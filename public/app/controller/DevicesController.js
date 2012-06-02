Ext.define('IGLoo.controller.DevicesController',{
    extend:'Ext.app.Controller',
    
    config: {
        refs: {
            device: 'deviceicon'
        },
        control: {
        	device: {
        		// Sets the device icons initial location
	            dragstart:function(e){
					var configpanel = Ext.getCmp('config-panel');
					configpanel.setScrollable(false);
					var icon = Ext.getCmp(e.getTarget().id);
					IGLoo.tmpOffset.x = icon.getDraggable().offset.x;
					IGLoo.tmpOffset.y = icon.getDraggable().offset.y;
				},
				// When a device is in a session panel, the panel's border is changed
				// to indiciate selection
				drag:function(e) {
					var dragPoint = Ext.util.Point.fromEvent(e);
					var sessionpanels = Ext.ComponentQuery.query('.sessionPanel');
					Ext.each(sessionpanels, function(session) {
						var sessionRegion = Ext.util.Region.getRegion(session.getId());
						if(!sessionRegion.isOutOfBound(dragPoint))
							session.setStyle('border: 2px dashed #000;');
						else
							session.setStyle('border: 1px solid #acacac;');
					});
				},
				// Handles the final destination of a device
				// The device will snap to particular locations depending on destination
				dragend:function(e){
					// Grab Device
					var cId = e.getTarget().id;
					var dragPoint = Ext.util.Point.fromEvent(e);
					
					// Determine what session is the device located
					var deviceSession = this.checkDeviceInSession(dragPoint);

					// Only the client can move it's device icon to a session
					// Only move the device icon if the session is different
					if(deviceSession != null && deviceSession != IGLoo.sId && cId == IGLoo.cId) {
						
						// Hide old watch button if device is moved to a new session
						now.clientHideWatchButton(IGLoo.sId);
						
						// Add Device to Session
						// Inside will set new sId and show watch button
						now.serverAddDeviceToSession(cId, deviceSession);
						
						// Can't be leader
						now.clientSetIsLeader(false);
						now.clientSetSessionLeaderVideoControls(false);
						
					}
					// Device ended up not in a session box
					else if(deviceSession == null) {
						
						var prevSession = IGLoo.sId;
						
						// Remove device from its previous session
						// request server to do the remove
						// it's possible that server will choose not to commit the REMOVE
						now.serverRemoveDeviceFromSession(IGLoo.cId, cId, function(aborted){
							//abort callback
							if(aborted) {
								//if aborted then revert back
								var icon = Ext.getCmp(cId);
								icon.getDraggable().setOffset(IGLoo.tmpOffset.x, IGLoo.tmpOffset.y);
							}
							else {
								console.log('Commiting Device Removal');
								
								// Update Devices Offsets
								now.serverSetDevicesOffset(null);
								
								//notify cId to hide watch button of sId
								now.serverHideWatchButton(cId, prevSession);
								
								// Can't be leader
								now.clientSetIsLeader(false);
								now.clientSetSessionLeaderVideoControls(false);
							}
						});
						
						// Reset Session-Details Varaibles for Client
						Ext.StoreMgr.lookup('DevicesStore').setOpenLoad(true);
						
            			console.log("Device is not in a session: "+cId);
					}
					// Revert the move
					else {
						var icon = Ext.getCmp(cId);
						icon.getDraggable().setOffset(IGLoo.tmpOffset.x, IGLoo.tmpOffset.y);
						console.log('Device moved back to last position');
					}
					
					var configpanel = Ext.getCmp('config-panel');
					configpanel.setScrollable(true);
					
				}
        	}
        }
    },
    checkDeviceInSession: function(dragPoint) {
    	var sessionpanels = Ext.ComponentQuery.query('.sessionPanel');
    	var inside = null;
		Ext.each(sessionpanels, function(session) {
			var sessionRegion = Ext.util.Region.getRegion(session.getId());
			
			// Reset the border
			session.setStyle('border: 1px solid #acacac;');
		
			// Check if device is in the session
			if(!sessionRegion.isOutOfBound(dragPoint)) {
				console.log('Client moved itself to new session');
				inside = session.getId();
	
				// Break out
				return false;
			}
		});
		
		return inside;
    }
});