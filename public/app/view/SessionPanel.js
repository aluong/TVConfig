Ext.define('IGLoo.view.SessionPanel', {
	extend: 'Ext.Panel',
	alias: 'widget.sessionPanel',
	config: {
		layout: 'auto',
		cls:'sessionpanel',
		height:'200px',
		style:[
			'border:1px solid #acacac;',
			'border-radius:25px;',
			'margin:20px;',
			'text-align:center;'
		].join(''),
		items:[
			{
				xtype: 'container',
				layout: 'hbox',
				items: [
					{
				        xtype: 'spacer',
				    	flex:1
					},
					{
						xtype:'button',
						text:'Session Details',
						flex: 2,
						// On Tap we can detect which session-details was clicked 
						handler: function() {
							var sessionDetails = Ext.getCmp('session-details');
						if(sessionDetails.isHidden()) {
							sessionDetails.currentSession = this.getParent().getParent().getId();
							sessionDetails.show('pop');
								}
								else
									sessionDetails.hide();
							}
					},
					{
				    	xtype: 'spacer',
				       	flex:1
				    }
				]
			}
		]
	}
});
