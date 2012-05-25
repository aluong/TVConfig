Ext.define('IGLoo.store.DevicesStore', {
	extend:'Ext.data.Store',
    config: {
    	storeId: 'DevicesStore',
     	model: 'IGLoo.model.Device',
     	sorters: 'device',
		proxy: {
				type: 'ajax',
				url : '/sessionDevices?sId=',
				reader: 'json'
		}
    }
});