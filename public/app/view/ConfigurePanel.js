Ext.define('IGLoo.view.ConfigurePanel',{
    extend:'Ext.Panel',
	xtype:'configurepanel',
    requires: ['IGLoo.view.DeviceIcon'],
		
    config:{

        title:'Configure',
        iconCls:'settings',
		layout:'hbox',
		displayField: 'title',
		id: 'config-panel',
		listeners: {
			newUserConnect: function() {
          		console.log("New User Connected");
        	}
		},
		items:[
			{
				xtype:'panel',
				id:'addpanel',
				floating:true,
				modal:true,
				hidden:true,
				width:'200px',
				height:'100px',
				layout:'vbox',
				items:[
					{
						xtype:'button',
						text:'Add a New Device',
						flex:1
					},
					{
						xtype:'button',
						text:'Create a New Session',
						flex:1
					}
				]
			},
			{
				xtype: 'titlebar',
				docked: 'top',
			    title: 'Configure Panel',
			    items: [
			        {
			            iconCls: 'add',
			            iconMask: true,
			            align: 'left',
						listeners:{
							tap:function(){
								var addpanel = Ext.ComponentQuery.query('#addpanel')[0];
								if(addpanel.isHidden())
									addpanel.show('pop');
								else
									addpanel.hide();
							}
						}
			        }
			    ]
			},
			{
				xtype:'panel',
				layout:'auto',
				id:'devicepanel',
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
				layout:'fit',
				id:'sessionpanel',
				html:'<h1>Sessions</h1><hr/>',
				style:[
					'border:1px solid #acacac;',
					'border-radius:25px;',
					'margin:20px;',
					'text-align:center;'
				].join(''),
				
				flex:1
			}
		]
    }
})