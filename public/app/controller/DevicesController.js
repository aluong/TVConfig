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
					var commitDrag = true;
					
					var dragPoint = Ext.util.Point.fromEvent(e);
					
					// Determine what session is the device located
					var deviceInSession = false;
					var sessionpanels = Ext.ComponentQuery.query('.sessionPanel');
					

					Ext.each(sessionpanels, function(session) {
					var sessionRegion = Ext.util.Region.getRegion(session.getId());
					var sId = session.getId();
					
					// Found a session with the device
					if(!sessionRegion.isOutOfBound(dragPoint)) {
						if(cId == IGLoo.cId){
							// Add Device to Session
							now.serverAddDeviceToSession(cId, sId);
							
							// Hide old watch button
							IGLoo.hideWatchButton(sId);
							
							// Set session-id
							IGLoo.sId = sId;
							
							// Show the watch button
							IGLoo.showWatchButton(sId);

							deviceInSession = true;
						}else{
							commitDrag = false;
						}
					}
					session.setStyle('border: 1px solid #acacac;');
					});

					// Device ended up not in a session box
					if(!deviceInSession && commitDrag) {
						
						// Remove device from its previous session
						// request server to do the remove
						// it's possible that server will choose not to commit the REMOVE
						now.serverRemoveDeviceFromSession(IGLoo.cId, cId, function(aborted){
							//abort callback
							if(aborted){
								//if aborted then revert back
								var icon = Ext.getCmp(cId);
								icon.getDraggable().setOffset(IGLoo.tmpOffset.x, IGLoo.tmpOffset.y);
							}else{
								now.serverSetDeviceOffset(cId, IGLoo.offset.x, IGLoo.offset.y);
								
								//notify cId to hide watch button of sId
								now.serverHideWatchButton(cId, IGLoo.sId);
							}
						});
            			console.log("Device is not in a session: "+cId);
					}
					
					if(!commitDrag){
						var icon = Ext.getCmp(cId);
						icon.getDraggable().setOffset(IGLoo.tmpOffset.x, IGLoo.tmpOffset.y);	
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

// Called from a Session Leader Client
now.clientHideWatchButton = function(sId){
	console.log('Request to remove watch button from Session: '+ sId);
	IGLoo.hideWatchButton(sId);
}