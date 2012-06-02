Ext.define('IGLoo.view.MediaList', {
	extend: 'Ext.DataView',
	xtype: 'mediaList',
	config: {
		id: 'session-details-media',
		useComponents: true,
        defaultType: 'mediaitem',
		store: 'MediaStore',
		currentSelection: null,
		listeners: {
	        itemtap: function (list, idx, target, record, evt) {
				var sessionDetailsPanel = Ext.getCmp('session-details');
		        var currentSelectedCId= Ext.getCmp('session-details-devices').currentSelection.getRecord().get('cId');
		        // Only Allow Users the Session Leader to modify media content
		        if(sessionDetailsPanel.currentSession == IGLoo.sId && (IGLoo.isLeader || IGLoo.cId == currentSelectedCId)) {
					if(this.currentSelection == null) {
		        		this.currentSelection = target;
		        	}
		        	else {
		        		this.currentSelection.setStyle('background-color:white;');
		        	}
		        	target.setStyle('background-color:blue;');
		        	this.currentSelection = target;
	        	
		        	// Update Device on Server
		        	now.serverSetDeviceMedia(currentSelectedCId, record.get('url'));
	        	}
	        }
	        
		}
	}
	
});
