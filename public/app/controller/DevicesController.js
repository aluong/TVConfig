Ext.define('IGLoo.controller.DevicesController',{
    extend:'Ext.app.Controller',
    
    config: {
        refs: {
            device: 'deviceicon'
        },
        control: {
        	device: {
	            dragstart:function(e){
					console.log('drag started');
					var configpanel = Ext.getCmp('config-panel');
					configpanel.setScrollable(false);
				},
				drag:function(e) {
					//console.log('drag: '+e.pageX + ' ' + e.pageY);
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
				dragend:function(e){
					console.log('drag ended');
					
					// Grab Device
					var deviceId = e.getTarget().id;
					var device = Ext.getCmp(deviceId);
					var dragPoint = Ext.util.Point.fromEvent(e);
					
					// Determine what session is the device located
					var deviceInSession = false;
					var sessionpanels = Ext.ComponentQuery.query('.sessionPanel');
					Ext.each(sessionpanels, function(session) {
						var sessionRegion = Ext.util.Region.getRegion(session.getId());
						var sId = session.getId();
						
						// Found a session with the device
						if(!sessionRegion.isOutOfBound(dragPoint)) {
							
							// Move Device to Session
							now.clientMoveDeviceIconToSession(deviceId, sId);
							
							// Add Device to Session
							now.serverAddDeviceToSession(device.getName(), sId);
							
							deviceInSession = true;
						}
						session.setStyle('border: 1px solid #acacac;');
					});
					
					// Device ended up not in a session box
					if(!deviceInSession) {
						
						// Remove device from its previous session
						now.serverRemoveDeviceFromSession(device.getName());
						
						// Reset the Device (Snap back to offset)
						now.serverSetDeviceOffset(deviceId, IGLoo.offset.x, IGLoo.offset.y);
						
						
            			console.log("Device: "+deviceId+" is not in a session. ");
					}
					
					var configpanel = Ext.getCmp('config-panel');
					configpanel.setScrollable(true);
				}
        	}
        }
    }
});

now.clientMoveDeviceIconToSession = function(did, sid) {
	console.log("Device: "+did+" Moved To Session: "+sid);
	var device = Ext.getCmp(did);
	var sessionRegion = Ext.util.Region.getRegion(sid);
	device.getDraggable().setOffset(sessionRegion.left, sessionRegion.top);
};

now.clientSetDeviceOffset = function(dId, x, y) {
	console.log('Set '+dId+"'s offset to ("+x+', '+y+')');
	Ext.getCmp(dId).getDraggable().setOffset(x,y);	
};