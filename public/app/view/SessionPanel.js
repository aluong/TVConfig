Ext.define('IGLoo.view.SessionPanel', {
	extend: 'Ext.Panel',
	alias: 'widget.sessionPanel',
	xtype:'sessionpanel',
	config: {
		layout: 'fit',
		cls:'sessionpanel',
		height:'200px',
		html:'<h1>Sessions</h1><hr/>',
		style:[
			'border:1px solid #acacac;',
			'border-radius:25px;',
			'margin:20px;',
			'text-align:center;'
		].join(''),
		items:[
			{
				xtype:'button',
				text:'details',
				style:[
					'height:20px;',
					'width:100px;'
				].join(''),
			}
		]
	},
	
	initialize: function () {      
		this.callParent();
		this.items.get(0).on({
			scope:this,
			tap:'tappedSessionsPanel'
		});
	},

	tappedSessionsPanel: function(e) {
		var sessionDetails = Ext.getCmp('sesssion-details');
		if(sessionDetails.isHidden()) {
			sessionDetails.setHtml('This will be the session detail for ' + this.getId());
			sessionDetails.show('pop');
		}
		else
			sessionDetails.hide();
	},
});
