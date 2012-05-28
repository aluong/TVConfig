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
				    	width: 10
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
				       	width: 10
				    },			
				    {
						xtype:'button',
						text:'Watch Video',
						flex: 2,
						cls:'watch-video-button',
						style:[
							'height:20px;',
							'width:100px;',
							'float:right;'
						].join(''),
						handler: function(){
							var videoPanel = Ext.getCmp('video-panel');
							if(videoPanel.isHidden()){
								videoPanel.show('pop');
							}
							else{
								videoPanel.hide();
							}
						}
				    },
				    {
				    	xtype: 'spacer',
				       	width: 10
				    }
				]
			}
		]
	}
});

// Show Watch Button
IGLoo.showWatchButton = function(sId) {
	if(sId != null) {
		var buttons = Ext.ComponentQuery.query('#'+sId+' button');
		var watchButton = buttons[1];
		watchButton.show();
	}
}

// Hide Watch Button
IGLoo.hideWatchButton = function(sId) {
	if(sId != null) {
		var buttons = Ext.ComponentQuery.query('#'+sId+' button');
		var watchButton = buttons[1];
		watchButton.hide();
	}
}



