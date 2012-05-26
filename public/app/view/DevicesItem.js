Ext.define('IGLoo.view.DevicesItem', {
    extend: 'Ext.dataview.component.DataItem',
	xtype: 'devicesitem',
    config: {
        dataMap: {
			getName: {
				setHtml: 'name'
			}
        },

       	image:{
       		width: '35%'
        },
		name: true,
        
		layout: {
			type: 'hbox',
			align: 'center'
		}
		
    },

    applyImage: function(config) {
        return Ext.factory(config, 'Ext.Component', this.getImage());
    },

    updateImage: function(newImage, oldImage) {
        if (newImage) {
            this.add(newImage);
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
		this.getImage().setHtml("<img src='resources/img/ipad-icon.jpg' style='width:30%;'/>");
		if(record.get('leader') == 1) {
			this.getName().setHtml("<b>"+this.getName().getHtml()+" (Session Leader)<b>");
		}
	}
});
