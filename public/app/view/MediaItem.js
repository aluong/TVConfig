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
       		width: '100px',
       		height: '100px',
       		mode: 'element'
       	},
		name: true,
		play: {
			itemCls: 'add'
		},
        
		layout: {
			type: 'hbox',
			align: 'center'
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
		
	applyPlay: function(config) {
		return Ext.factory(config, 'Ext.Button', this.getPlay());
	},

	updatePlay: function(newPlay, oldPlay) {
        if (newPlay) {
            this.add(newPlay);
        }

        if (oldPlay) {
            this.remove(oldPlay);
        }		
	}
});
