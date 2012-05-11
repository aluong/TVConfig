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
					//prepare the drop effect
					//get sessionpanel position
					/*var sessionpanels = $('.sessionpanel');
					if(sessionpanels.length === 0)
						return;
						
					sessionpanels.each(function(){
						var offset = $(this).offset();
						var tlx = offset.left;
						var tly = offset.top;
						var brx = tlx + $(this).width();
						var bry = tly + $(this).height();
						if(e.pageX > tlx && e.pageX < brx && e.pageY > tly && e.pageY < bry) {
							$(this).css('border','2px dashed #000');
						}
						else
							$(this).css('border','1px solid #acacac');
					});*/
					
					var sessionpanels = Ext.ComponentQuery.query('.sessionPanel');
					Ext.each(sessionpanels, function(session) {
						var sessionBox = $('#'+session.getId());
						var offset = sessionBox.offset();
						var tlx = offset.left;
						var tly = offset.top;
						var brx = tlx + sessionBox.width();
						var bry = tly + sessionBox.height();
						if(e.pageX > tlx && e.pageX < brx && e.pageY > tly && e.pageY < bry)
							session.setStyle('border: 2px dashed #000;');
						else
							session.setStyle('border: 1px solid #acacac;');
					})
					
					
				},
				dragend:function(e){
					console.log('drag ended');
					
					// Grab Device
					var deviceId = e.getTarget().id;
					
					// Determine what session is the device in
					var deviceSession = null;
					var sessionpanels = Ext.ComponentQuery.query('.sessionPanel');
					var tlx, tly, brx, bry;
					Ext.each(sessionpanels, function(session) {
						var sessionBox = $('#'+session.getId());
						var offset = sessionBox.offset();
						tlx = offset.left;
						tly = offset.top;
						brx = tlx + sessionBox.width();
						bry = tly + sessionBox.height();
						if(e.pageX > tlx && e.pageX < brx && e.pageY > tly && e.pageY < bry) {
							console.log("Device: "+deviceId+" Moved To Session: "+session.getId());
							deviceSession = session.getId();
						}
						session.setStyle('border: 1px solid #acacac;');
					});
					
					if(deviceSession == null) {
						// Snap back Effect
						if(tlx != null && e.pageX > tlx)
							Ext.getCmp(deviceId).getDraggable().setOffset(100,100);
            			console.log("Device: "+deviceId+" is not in a session. ");
					}
					
					var configpanel = Ext.getCmp('config-panel');
					configpanel.setScrollable(true);
				}
        	}
        }
    }
});