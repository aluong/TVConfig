Ext.define('IGLoo.store.DevicesStore', {
	extend:'Ext.data.Store',
    config: {
    	storeId: 'DevicesStore',
     	model: 'IGLoo.model.Device',
     	sorters: 'name',
     	openLoad: true,
		proxy: {
				type: 'ajax',
				url : '/sessionDevices?sId=',
				reader: 'json'
		},
		listeners: {
			load: function() {
				if(this.getOpenLoad()) {
					console.log('Loading Defaults...');
					// Default Select the current Device
					var cId =  Ext.getCmp('session-details').currentSession == IGLoo.sId ? IGLoo.cId : null; 
					var record = selectDevice(cId, Ext.getCmp('session-details').currentSession);
					var media = record == null ? null : record.get('media');
					// Select the current media item (implied from above we are the session)
					selectMedia(media);

					// First Load completed
					this.setOpenLoad(false)
				}
			}
		}
		
    }
});