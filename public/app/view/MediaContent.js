Ext.define('IGLoo.view.MediaContent', {
	extend: 'Ext.Video',
	xtype: 'mediacontent',
	initialize: function() {
		this.callParent(arguments);
		this.ghost.un({
			tap: 'onGhostTap',
			scope:this
		});
	},
	config: {
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
				
			}
		}
	}
});