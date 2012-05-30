Ext.define('IGLoo.view.MediaList', {
	extend: 'Ext.DataView',
	xtype: 'mediaList',
	config: {
		useComponents: true,
        defaultType: 'mediaitem',
		store: 'MediaStore',
		currentSelection: null,
		listeners: {
	        itemtap: function (list, idx, target, record, evt) {
				var sessionDetailsPanel = Ext.getCmp('session-details');
				var sId = sessionDetailsPanel.currentSession;
				if(IGLoo.isLeader && IGLoo.sId == sId){
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
	}
	
});

now.clientUpdateSelectedMedia = function(cId, url) {
	var currentSession = Ext.getCmp('session-details-devices').currentSelection;
	if(currentSession == null)
		return;
		
	var currentSelectedCId= currentSession.getRecord().get('cId');
	if(currentSelectedCId == cId) {
		selectMedia(url);
	}
	
	// Update Video Source and Cover for specific Client
	if(cId == IGLoo.cId) {
		now.clientSetMediaContent(url, Ext.data.StoreManager.lookup('MediaStore').findRecord('url', url).get('cover'));
	}
	
}
