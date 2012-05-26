Ext.define('IGLoo.view.MediaList', {
	extend: 'Ext.DataView',
	xtype: 'mediaList',
	config: {
		useComponents: true,
        defaultType: 'mediaitem',
		store: 'MediaStore',
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
