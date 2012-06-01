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
					// Load Default Device
					now.clientSetDefaultDevice();
					
					// First Load completed
					this.setOpenLoad(false)
				}
				
				// Hide/Show delete button
				var model = this.findRecord('cId', IGLoo.cId);
				var deleteButton = Ext.getCmp('delete-session-button');
				if(model == null || model.getData().leader != 1){
					deleteButton.hide();
				}
				else{
					deleteButton.show();
				}	
			}
		}
		
    }
});