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
				id:'add-panel',
				modal:true,
				hidden:true,
				left: true,
				hideOnMaskTap: true,
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
						flex:1,
						handler:function(){
							console.log("Request to Add Session")
							var sid = 'session-'+IGLoo.name+'-'+IGLoo.sessions.nextid;
							now.serverCreateSession(sid);
							IGLoo.sessions.nextid += 1;
							Ext.getCmp('add-panel').hide();
						}
					}
				]
			},
			{
				xtype: 'titlebar',
				docked: 'top',
			    title: 'Configure Panel',
			    items: [
			        {
			        	xtype: 'button',
			            iconCls: 'add',
			            iconMask: true,
			            align: 'left',
						handler:function() {
							var addpanel = Ext.getCmp('add-panel');
							console.log(addpanel);
							if(addpanel.isHidden())
								addpanel.show('pop');
							else
								addpanel.hide();
						}
						
			        }
			    ]
			},
			{
				xtype:'panel',
				layout:'auto',
				id:'device-panel',
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
				xtype: 'panel',
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
		]
    }
})
