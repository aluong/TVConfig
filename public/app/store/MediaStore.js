Ext.define('IGLoo.store.MediaStore', {
	extend:'Ext.data.Store',
    config: {
    	storeId: 'MediaStore',
     	model: 'IGLoo.model.Media',
     	sorters: 'name',
		proxy: {
				type: 'ajax',
				url : '/media?sId=',
				reader: 'json'
		},
		autoLoad: true
    }
});