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
				xtype:'container',
				layout:
				{
					type: 'vbox',
					align: 'center'
				},
				id:'sessionpanel',
				//html:'<h1>Sessions</h1><hr/>',
				style:[
					'border:1px solid #acacac;',
					'border-radius:25px;',
					'margin:20px;',
					'text-align:center;'
				].join(''),
				flex:1,
				items: [
					{	
						xtype: 'container',
						layout: 'fit',
						html:'<h1>Sessions</h1>',
						height:'10%',
						width: '95%',
						style:
						[
							'border:1px solid #acacac;',
							'border-radius:25px;',
							'text-align:center;',
						].join(''),
						flex: 1
					},		
					{
						xtype: 'sessionPanel',
						sessionsName: "session 1",
						style:
						[
							'border:1px solid #acacac;',
							'border-radius:25px;',
							'margin:20px;',
							'text-align:center;',
							'background-color:red'
						].join('')
					},
					{
						xtype: 'sessionPanel',
						sessionsName: "session 2",
						style:
						[
							'border:1px solid #acacac;',
							'border-radius:25px;',
							'margin:20px;',
							'text-align:center;',
							'background-color:#00ff00'
						].join('')
					},
					{
						xtype: 'sessionPanel',
						sessionsName: "session 3",
						style:
						[
							'border:1px solid #acacac;',
							'border-radius:25px;',
							'margin:20px;',
							'text-align:center;',
							'background-color:red'
						].join('')
					},
				]
			}
		]
    }
})