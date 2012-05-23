Ext.define('IGLoo.controller.DevicesController',{
    extend:'Ext.app.Controller',
    
    config: {
        refs: {
            device: 'deviceicon'
        },
        control: {
        	device: {
	            dragstart:function(e){
					var configpanel = Ext.getCmp('config-panel');
					configpanel.setScrollable(false);
				},
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
				dragend:function(e){
					// Grab Device
					var dId = e.getTarget().id;
					var device = Ext.getCmp(dId);
					var dragPoint = Ext.util.Point.fromEvent(e);
					
					// Determine what session is the device located
					var deviceInSession = false;
					var sessionpanels = Ext.ComponentQuery.query('.sessionPanel');
					Ext.each(sessionpanels, function(session) {
						var sessionRegion = Ext.util.Region.getRegion(session.getId());
						var sId = session.getId();
						
						// Found a session with the device
						if(!sessionRegion.isOutOfBound(dragPoint)) {
							
							// Add Device to Session
							now.serverAddDeviceToSession(dId, sId);
							
							deviceInSession = true;
						}
						session.setStyle('border: 1px solid #acacac;');
					});
					
					// Device ended up not in a session box
					if(!deviceInSession) {
						
						// Remove device from its previous session
						now.serverRemoveDeviceFromSession(dId);
						
						// Reset the Device (Snap back to offset)
						now.serverSetDeviceOffset(dId, IGLoo.offset.x, IGLoo.offset.y);
						
            			console.log("Device is not in a session: "+dId);
					}
					
					var configpanel = Ext.getCmp('config-panel');
					configpanel.setScrollable(true);
				}
        	}
        }
    }
});

now.clientMoveDeviceIconToSession = function(dId, sId) {
	console.log("Device: "+dId+" Moved To Session: "+sId);
	var sessionRegion = Ext.util.Region.getRegion(sId);
	Ext.getCmp(dId).getDraggable().setOffset(sessionRegion.left, sessionRegion.top);
};

now.clientSetDeviceOffset = function(dId, x, y) {
	console.log('Device: '+dId+" offset to ("+x+', '+y+')');
	Ext.getCmp(dId).getDraggable().setOffset(x,y);	
};