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
	}
	else {
		video.setUrl(url);
		video.setPosterUrl(cover);
	}
}
