Ext.define('IGLoo.view.DevicesList', {
	extend: 'Ext.List',
	alias: 'widget.devicesList',
	config: {
		store: 'DevicesStore',
		itemTpl: new Ext.XTemplate(
			"<img src='resources/img/ipad-icon.jpg' style='width:10%;'/>",	
			'<tpl if="values.leader == 1">',
	            ' <b>{[this.deviceName(values.device)]} (Session Leader)</b>',
	        '<tpl else>',
	            ' {[this.deviceName(values.device)]}',
	        '</tpl>',
			{
				deviceName: function(name) {
					return name.substring(7);
				}
			}
		)
	}
	
});
