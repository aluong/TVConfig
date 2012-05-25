Ext.define('IGLoo.view.DevicesList', {
	extend: 'Ext.List',
	alias: 'widget.devicesList',
	config: {
		store: 'DevicesStore',
		itemTpl: new Ext.XTemplate(
			"<img src='resources/img/ipad-icon.jpg' style='width:10%;'/>",
			" {[this.deviceName(values.device)]}",	
			{
				deviceName: function(name){
				   return name.substring(7);
				}
			}
		)
	}
	
});
