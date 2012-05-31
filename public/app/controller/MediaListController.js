Ext.define('IGLoo.controller.MediaListController', {
	extend:'Ext.app.Controller',
	config: {
		refs:{
			mediaList: '#session-details-media'
		},
		control: {
			mediaList: {
				itemdoubletap:function(dv, index, item, e){
					var url = dv.getStore().getAt(index).getData().url;
					var cover = dv.getStore().getAt(index).getData().cover;

					now.clientSetMediaContent(url, cover);
					var videoPanel = Ext.getCmp('video-panel');
					var sessionDetails = Ext.getCmp('session-details');
					if(videoPanel.isHidden()){
						videoPanel.show('pop');
						sessionDetails.hide();
					}
					else{
						videoPanel.hide();
						sessionDetails.show('pop');
					}
				}
			}
		}
	}
});

now.clientSetMediaContent = function(url, cover) {
	var video = Ext.getCmp('video-media-content');
	if(url == null && url == null) {
		video.setUrl();
		video.setPosterUrl('');
		console.log('Media Content set to empty');
	}
	else {
		video.setUrl(url);
		video.setPosterUrl(cover);
		console.log('Media Content set to '+url);
	}
}


now.clientUpdateSelectedMedia = function(cId, url) {
	// Update Video Source and Cover for specific Client
	if(cId == IGLoo.cId) {
		IGLoo.url = url;
		now.clientSetMediaContent(url, Ext.data.StoreManager.lookup('MediaStore').findRecord('url', url).get('cover'));
	}
	
	var currentSelection = Ext.getCmp('session-details-devices').currentSelection;
	if(currentSelection == null)
		return;
		
	var currentSelectedCId= currentSelection.getRecord().get('cId');
	if(currentSelectedCId == cId) {
		selectMedia(url);
	}
}