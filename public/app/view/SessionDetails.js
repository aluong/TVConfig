Ext.define('IGLoo.view.SessionDetails', {
	extend: 'Ext.Panel',
	alias: 'widget.sessionDetails',
	config: {
		id: 'session-details',
		currentSession: null,
		modal: true,
		hideOnMaskTap: true,
		centered: true,
		hidden: true,
		width: '80%',
		height: '80%',
		zIndex: 100000,
		layout: 'vbox',
		items: [
			{
				xtype: 'label',
				html: 'Session Details',
				dock: 'top'
			},
			{
				xtype: 'container',
				layout: 'hbox',
				items: [
					{
						xtype: 'label',
    					html: '<b>List of Devices</b>',
    					flex: 1
					},
					{
						xtype: 'label',
    					html: '<b>List of Media</b>',
    					flex: 1
					}
				]
			},
			{
				xtype: 'container',
				layout: 'hbox',
				flex: 1,
				items: [
					{
						xtype: 'devicesList',
						id: 'session-details-devices',
						flex: 1
					},
					{
						xtype: 'container',
						id: 'session-details-media',
						flex: 1
					}
				]
			},
			{
				xtype: 'button',
				text: 'Delete Session'
			}
		]
	}
});
