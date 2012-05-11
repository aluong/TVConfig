Ext.define('IGLoo.view.DeviceIcon', {
    extend:'Ext.Panel',
    xtype:'deviceicon',
    initialize: function() {
			this.callParent();
			this.relayEvents(this.element, ['dragstart', 'drag', 'dragend']);
	},
    config:{
		cls:'deviceicon',
		centered:true,
		width:'10%',
		name: "Current Device",
//		height:'25%',
		items:[
			{
				html:[
					"<img src='resources/img/ipad-icon.jpg' style='width:90%;'/>",
					"<p>DEFAULT NAME/p>"
				].join(''),
				zindex:0
			}
		],
		style:[
//			'position: fixed;',
//			'top:-100px;',
//			'left:-100px;',
			'margin-top:-50%;',
			'margin-bottom:-20%;',
//			'margin-left:10%;',
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