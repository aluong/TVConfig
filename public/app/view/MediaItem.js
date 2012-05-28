Ext.define('IGLoo.view.MediaItem', {
    extend: 'Ext.dataview.component.DataItem',
	xtype: 'mediaitem',
	requires: ['Ext.Img']
,    config: {
        dataMap: {
        	getCover: {
        		setSrc: 'cover'
        	},
			getName: {
				setHtml: 'name'
			}
        },
       	cover: {
       		width: '150px',
       		height: '150px',
       		mode: 'element',
       		docked: 'left'
       	},
		name: {
			flex: 1,
			style: 'line-height:4em'
		},
		layout: {
			type: 'vbox',
			align: 'center',
			pack: 'center'
			
		}
		
    },
    applyCover: function(config) {
        return Ext.factory(config, 'Ext.Img', this.getCover());
    },

    updateCover: function(newCover, oldCover) {
        if (newCover) {
            this.add(newCover);
            this.add(Ext.create(Ext.Spacer, {width:15}));
        }

        if (oldCover) {
            this.remove(oldCover);
        }
    },
    
	applyName: function(config) {
		return Ext.factory(config, 'Ext.Component', this.getName());
	},

	updateName: function(newText, oldText) {
        if (newText) {
            this.add(newText);
        }

        if (oldText) {
            this.remove(oldText);
        }		
	},
	
	updateRecord: function(record) {
		this.callParent(arguments);
		this.add([
			{
				xtype:'container',
				layout: 'hbox',
				align: 'center',
				flex: 1,
				items: [
					{
						xtype:'button',
						height: 40,
						width: 40,
						iconAlign: 'center',
						cls: 'play-pause-icon',
						padding: 0,
						icon: '/resources/icons/play.png',
						listeners: {
							tap: function() {
								if(this.getIcon() == '/resources/icons/play.png') {
									this.setIcon('/resources/icons/pause.png')
								}
								else {
									this.setIcon('/resources/icons/play.png')
								}
							}
						}
						
					},
					{
						xtype: 'spacer',
						width: 5
					},
					{
						xtype:'button',
						height: 40,
						width: 40,
						padding: 0,
						iconAlign: 'center',
						cls: 'stop-icon',
						icon: '/resources/icons/stop.png',
						listeners: {
						tap: function() {
								this.getParent().getAt(0).setIcon('/resources/icons/play.png')
							}
						}
					}
				]
			}
		]);
	}
});
