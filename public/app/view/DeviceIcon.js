Ext.define('IGLoo.view.DeviceIcon', {
    extend:'Ext.Panel',
    xtype:'deviceicon',
    initialize: function() {
			this.callParent(arguments);
			// Push these events down from the element level of the DOM tree.
			this.relayEvents(this.element, ['dragstart', 'drag', 'dragend']);
	},
    config:{
		cls:'deviceicon',
		left: 0,
		top:0,
		isPublic: 0, // 0 == public, 1 == private
		name: "Current Device",
		items:[
			{
				xtype: 'image',
				src: 'resources/img/ipad-icon.jpg',
				mode: 'element'
			},
			{
				xtype: 'label',
				html: "<p>DEFAULT NAME/p>"
			},
			{
				xtype: 'label',
				html: "<b>Public</b>",
				style: "color: green"
			},
			{
				xtype: 'togglefield',
				disabled: true,
				hidden: true,
				listeners: {
					change: function(me, slider, thumb, newValue, oldValue, eOpts) {
						if (newValue == 0) {
							now.serverSetPublicStatus(IGLoo.cId, 0);
							console.log(IGLoo.cId+' is Public Toggled');
						} else {
							now.serverSetPublicStatus(IGLoo.cId, 1);
							console.log(IGLoo.cId+' is Private Toggled');
						}
					},
					initialize: function() {
						// Start Toggled
						this.toggle();
					}
				}
			}
		],
		style:[
			'font-size:60%;',
			'text-align:center;',
			'background-color:transparent;'
		].join(''),
		draggable:{
			initialOffset:{
				x:100,
				y:100
			}
		}
    }
});