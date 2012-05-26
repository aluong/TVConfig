Ext.define('IGLoo.controller.MediaListController', {
	extend:'Ext.app.Controller',
	config: {
		refs:{
			mediaList: '#session-details-media'
		},
		control: {
			mediaList: {
				itemtap:function(dv, index, item, e){
					var url = dv.getStore().getAt(index).getData().url;
					var cover = dv.getStore().getAt(index).getData().cover;
					//set up the video panel
					var videoPanel = Ext.getCmp('video-panel');
					videoPanel.add(new Ext.Video({
						url:url,
						posterUrl:cover
					}));
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