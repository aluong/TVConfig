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
		width: '90%',
		height: '90%',
		zIndex: 100000,
		layout: 'vbox',
		items: [
			{
				xtype: 'label',
				html: 'Session Details',
				style: 'color: blue;',
				dock: 'top'
			},
			{
				xtype: 'container',
				layout: 'hbox',
				items: [
					{
						xtype: 'label',
    					html: '<b><center>List of Devices</center></b>',
    					flex: 1
					},
					{
						xtype: 'label',
    					html: '<b><center>List of Media</center></b>',
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
						flex: 1
					},
					{
						xtype: 'mediaList',
						flex: 1
					}
				]
			},
			{
				xtype: 'button',
				id: 'delete-session-button',
				text: 'Delete Session'
			}
		]
	}
});
