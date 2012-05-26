Ext.define('IGLoo.view.DevicesList', {
	extend: 'Ext.List',
	alias: 'widget.devicesList',
	config: {
		store: 'DevicesStore',
		itemTpl: new Ext.XTemplate(
			"<img src='resources/img/ipad-icon.jpg' style='width:10%;'/>",	
			'<tpl if="values.leader == 1">',
	            ' <b>{[values.name]} (Session Leader)</b>',
	        '<tpl else>',
	            ' {[values.name]}',
	        '</tpl>'
		)
	}
	
});
