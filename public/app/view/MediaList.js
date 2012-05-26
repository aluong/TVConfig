Ext.define('IGLoo.view.MediaList', {
	extend: 'Ext.List',
	alias: 'widget.mediaList',
	config: {
		store: 'MediaStore',
		itemTpl: new Ext.XTemplate(
			"<img src='{[values.cover]}' style='width:40%;'/>",	
	        ' {[(values.name)]}'
			)
	}
	
});
