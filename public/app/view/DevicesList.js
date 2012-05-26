Ext.define('IGLoo.view.DevicesList', {
	extend: 'Ext.DataView',
	alias: 'widget.devicesList',
	requires: ['IGLoo.view.DevicesItem'],
	config: {
		useComponents: true,
        defaultType: 'devicesitem',
		store: 'DevicesStore',
		listeners: {
	        itemtap: function (list, idx, target, record, evt) {
				if(target.getStyle() == 'background-color:blue;') {
					target.setStyle('background-color:white;');
				}
				else {
	        		target.setStyle('background-color:blue;');
				}
	        }
		}


	}
	
});
