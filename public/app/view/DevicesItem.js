Ext.define('IGLoo.view.DevicesItem', {
    extend: 'Ext.dataview.component.DataItem',
	xtype: 'devicesitem',
	requires: ['Ext.Img']
,    config: {
        dataMap: {
			getName: {
				setHtml: 'name'
			}
        },

       	image: {
       		width: '70px',
       		height: '89px',
       		src: "/resources/img/ipad-icon.jpg"
       	},
		name: true,
        
		layout: {
			type: 'hbox',
			align: 'center'
		}
		
    },

    applyImage: function(config) {
        return Ext.factory(config, 'Ext.Img', this.getImage());
    },

    updateImage: function(newImage, oldImage) {
        if (newImage) {
            this.add(newImage);
            this.add(Ext.create(Ext.Spacer, {width:15}));
        }

        if (oldImage) {
            this.remove(oldImage);
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
		if(record.get('leader') == 1) {
			this.getName().setHtml("<b>"+this.getName().getHtml()+" (Session Leader)<b>");
		}
	}
});
