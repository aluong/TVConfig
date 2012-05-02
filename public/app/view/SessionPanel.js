Ext.define('IGLoo.view.SessionPanel', {
	extend: 'Ext.Panel',
	alias: 'widget.sessionPanel',
	config: {
		layout: 'fit',
		width: '95%',
		sessionsName: "generic session",
		flex: 1
	},
	initialize: function () {      
		this.callParent();                                                     
		this.element.on ({
			scope: this,
			tap: 'tappedSessionsPanel'
		});
		
		this.setHtml(['<h1>',this.getSessionsName(),'</h1><hr/>'].join(''));
	},
	tappedSessionsPanel: function(e) {
		var sessionDetails = Ext.getCmp('sesssion-details');
		if(sessionDetails.isHidden()) {
			sessionDetails.setHtml('This will be the session detail for '+this.getSessionsName());
			sessionDetails.show('pop');
		}
		else
			sessionDetails.hide();
	},
});
