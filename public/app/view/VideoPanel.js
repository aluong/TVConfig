Ext.define('IGLoo.view.VideoPanel', {
    extend:'Ext.Container',
    xtype:'videopanel',
//	alias: 'widget.videopanel',

	requires:[
		'Ext.Video'
	],
    config:{
		id:'video-panel',
		modal:true,
		hidden:true,
		centered:true,
		hideOnMaskTap:true,
		zIndex:90000,
		width:'80%',
		height:'80%',
		layout:'fit',
        items:[
			{
				xtype:'video',
				url:'',
				loop:true,
				posterUrl:'',
				id: 'video-media-content',
				enableControls: false,
				listeners: {
					pause: function(video, time) {
						
					},
					play: function(video) {
						
					},
					initialize: function() {
						this.ghost.un('tap', this.onGhostTap);
					}
				}
			}
		]
    }
});
