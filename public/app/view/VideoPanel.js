Ext.define('IGLoo.view.VideoPanel', {
    extend:'Ext.Container',
    xtype:'videopanel',
	requires:[
		'Ext.Video'
	],
    
    config:{
		layout:'fit',
        title:'Video',
        iconCls:'star',
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