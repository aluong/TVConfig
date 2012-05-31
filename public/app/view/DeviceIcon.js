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
		name: "Current Device",
		items:[
			{
				html:[
					"<img src='resources/img/ipad-icon.jpg'/>",
					"<p>DEFAULT NAME/p>"
				].join('')
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