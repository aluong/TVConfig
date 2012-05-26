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
				url:'resources/videos/BigBuck.m4v',
				loop:true,
				posterUrl:'resources/img/cover.png'
			}
		]
    }
})
