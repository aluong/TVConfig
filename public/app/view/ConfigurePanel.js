Ext.define('IGLoo.view.ConfigurePanel',{
    extend:'Ext.Panel',
	xtype:'configurepanel',
    requires: ['IGLoo.view.DeviceIcon', 'IGLoo.view.SessionPanel'],
		
    config:{

        title:'Configure',
        iconCls:'settings',
		layout:'hbox',
		displayField: 'title',
		id: 'config-panel',
		scrollable:true,
		items:[
			{
				xtype:'panel',
				id:'add-session-panel',
				modal:true,
				hidden:true,
				left: true,
				hideOnMaskTap: true,
				layout:'vbox',
				items:[
					{
						xtype:'button',
						text:'Add a New Device',
						disabled: true, // Feature Not Present yet
						flex:1
					},
					{
						xtype:'button',
						id: 'create-session-button',
						text:'Create a New Session',
						flex:1
					}
				]
			},
			{
				xtype: 'titlebar',
				docked: 'top',
			    title: 'Configuration Panel',
			    items: [
			        {
			        	xtype: 'button',
			        	id: 'titlebar-add-session-button',
			            iconCls: 'add',
			            iconMask: true,
			            align: 'left'
			        }
			    ]
			},
			{
				xtype:'panel',
				layout:'auto',
				id:'devices-panel',
				html:[
					'<h1>Devices</h1><hr/>'
				].join(''),
				style:[
					'border:1px solid #acacac;',
					'border-radius:25px;',
					'margin:20px;',
					'text-align:center;',
					'float:left;'
				].join(''),
				flex:1
			},
			{
				xtype:'panel',
				layout:'vbox',
				id:'sessions-panel',	
				flex:1
			},
			{
				xtype: 'sessionDetails'
			}
		]
    }
})
