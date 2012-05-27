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
					var icon = Ext.getCmp(e.getTarget().id);
					IGLoo.tmpOffset.x = icon.getDraggable().offset.x;
					IGLoo.tmpOffset.y = icon.getDraggable().offset.y;
				},
				drag:function(e) {
					var cId = e.getTarget().id;
					if(cId !== IGLoo.cId){
						return;
					}

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
					var cId = e.getTarget().id;
					if(cId !== IGLoo.cId){
						var icon = Ext.getCmp(cId);
						icon.getDraggable().setOffset(IGLoo.tmpOffset.x, IGLoo.tmpOffset.y);
						var configpanel = Ext.getCmp('config-panel');
						configpanel.setScrollable(true);

						return;
					}
					
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
							now.serverAddDeviceToSession(cId, sId);
							
							deviceInSession = true;
						}
						session.setStyle('border: 1px solid #acacac;');
					});
					
					// Device ended up not in a session box
					if(!deviceInSession) {
						
						// Remove device from its previous session
						now.serverRemoveDeviceFromSession(cId);
						
						// Reset the Device (Snap back to offset)
						now.serverSetDeviceOffset(cId, IGLoo.offset.x, IGLoo.offset.y);
						
            			console.log("Device is not in a session: "+cId);
					}
					
					var configpanel = Ext.getCmp('config-panel');
					configpanel.setScrollable(true);
				}
        	}
        }
    }
});

now.clientMoveDeviceIconToSession = function(cId, sId, indent) {
	console.log("Device: "+cId+" Moved To Session: "+sId + " with indent "+indent);
	var sessionRegion = Ext.util.Region.getRegion(sId);
	Ext.getCmp(cId).getDraggable().setOffset(sessionRegion.left+100*indent, sessionRegion.top);
};

now.clientSetDeviceOffset = function(cId, x, y, indent) {
	console.log('Device: '+cId+" offset to ("+x+', '+y+')');
	Ext.getCmp(cId).getDraggable().setOffset(x+100*indent,y);	
};
