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
						listeners:{
							tap:function(){
								/*
								Ext.getCmp('session').add({
									xtype:'sessionPanel',
									id:'sessionbox'+IGLoo.name+IGLoo.sessions.nextid,
								});
								*/
								var sid = 'sessionbox'+IGLoo.name+IGLoo.sessions.nextid;
								now.addSession(sid);

								IGLoo.sessions.nextid += 1;
								Ext.getCmp('addpanel').hide();
							}
						},
						flex:1
					}
				]
			},
			{
				xtype: 'panel',
				id: 'sesssion-details',	
				html: 'This will be the session detail',
				modal: true,
				hideOnMaskTap: true,
				centered: true,
				hidden: true,
				width: '50%',
				height: '50%'
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
				layout:'vbox',
				id:'session',	
				flex:1
			}
		]
    }
})
