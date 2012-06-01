Ext.define('IGLoo.view.DevicesList', {
	extend: 'Ext.DataView',
	alias: 'widget.devicesList',
	requires: ['IGLoo.view.DevicesItem'],
	config: {
		useComponents: true,
        defaultType: 'devicesitem',
		store: 'DevicesStore',
		currentSelection: null,
		listeners: {
	        itemtap: function (list, idx, target, record, evt) {
				if(this.currentSelection == null) {
	        		this.currentSelection = target;
	        	}
	        	else {
	        		this.currentSelection.setStyle('background-color:white;');
	        	}
	        	target.setStyle('background-color:blue;');
	        	this.currentSelection = target;
	        	
	        	// Set the media to be the client's current media
	        	var media = Ext.StoreMgr.lookup('DevicesStore').findRecord('cId', record.get('cId')).get('media');
	        	now.clientSelectMedia(media);
	        }   
		}
	}
});
