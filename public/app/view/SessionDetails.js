Ext.define('IGLoo.view.SessionDetails', {
	extend: 'Ext.Panel',
	alias: 'widget.sessionDetails',
	config: {
		id: 'session-details',	
		html: 'This will be the session details',
		currentSession: null,
		modal: true,
		hideOnMaskTap: true,
		centered: true,
		hidden: true,
		width: '50%',
		height: '50%',
		zIndex: 10000,
		layout: 'vbox',
		items: [
			{
				xtype: 'button',
				text: 'Delete Session'
			}
		]
	}
});
