Ext.define('IGLoo.view.MainPanel', {
    extend: 'Ext.TabPanel',
    requires: [
		'Ext.TitleBar',
	],
    
    config: {
        tabBarPosition: 'bottom',
        
        items: [
            {
                xtype:'configurepanel'
            },
			{
                xtype:'videopanel'
            }
        ]
    }
});