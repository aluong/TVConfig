Ext.define('IGLoo.view.SessionPanel', {
	extend: 'Ext.Panel',
	alias: 'widget.sessionPanel',
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
				// On Tap we can detect which session-details was clicked 
				handler: function() {
					var sessionDetails = Ext.getCmp('session-details');
					if(sessionDetails.isHidden()) {
						sessionDetails.setHtml('This will be the session detail for ' + this.getParent().getId());
						sessionDetails.currentSession = this.getParent().getId();
						sessionDetails.show('pop');
					}
					else
						sessionDetails.hide();
				}
			}
		]
	}
});
