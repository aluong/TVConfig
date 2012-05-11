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
					})
					
					
				},
				dragend:function(e){
					console.log('drag ended');
					
					// Grab Device
					var deviceId = e.getTarget().id;
					var dragPoint = Ext.util.Point.fromEvent(e);
					
					// Determine what session is the device in
					var deviceSession = null;
					var sessionpanels = Ext.ComponentQuery.query('.sessionPanel');
					var sessionRegion;
					Ext.each(sessionpanels, function(session) {
						sessionRegion = Ext.util.Region.getRegion(session.getId());
						
						// Found a session with the device
						if(!sessionRegion.isOutOfBound(dragPoint)) {
							console.log("Device: "+deviceId+" Moved To Session: "+session.getId());
							Ext.getCmp(deviceId).getDraggable().setOffset(sessionRegion.left,sessionRegion.top);
							deviceSession = session.getId();
							
							// Add Device to Session
							now.serverAddDeviceToSession(Ext.getCmp(deviceId).getName(), deviceSession);
						}
						session.setStyle('border: 1px solid #acacac;');
					});
					
					// If the device was tied to a session
					if(deviceSession == null) {
						// Snap back effect
						if(sessionRegion != null && dragPoint.x > sessionRegion.left) {
							Ext.getCmp(deviceId).getDraggable().setOffset(100,100);
						}
						
						// Remove device from session
						now.serverRemoveDeviceFromSession(Ext.getCmp(deviceId).getName())
						
            			console.log("Device: "+deviceId+" is not in a session. ");
					}
					
					var configpanel = Ext.getCmp('config-panel');
					configpanel.setScrollable(true);
				}
        	}
        }
    }
});