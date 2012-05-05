Ext.define('IGLoo.view.DeviceIcon', {
    extend:'Ext.Panel',
    xtype:'deviceicon',
    
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
				zindex:1
			}
		],
		style:[
			'margin-top:-30%;',
//			'margin-left:10%;',
			'font-size:60%;',
			'text-align:center;',
			'background-color:transparent;'
		].join(''),
		draggable:{
			initialOffset:{
				x:100,
				y:100
			},
			listeners:{
				dragstart:function(){
					console.log('drag started');
					var configpanel = Ext.getCmp('config-panel');
					configpanel.setScrollable(false);
				},
				drag:function(v,e,ox,oy){
					console.log(e.pageX + ' ' + e.pageY);
					//prepare the drop effect
					//get sessionpanel position
					var sessionpanel = $('#sessionpanel');
					var offset = sessionpanel.offset();
					var tlx = offset.left;
					var tly = offset.top;
					var brx = tlx + sessionpanel.width();
					var bry = tly + sessionpanel.height();
					if(e.pageX > tlx && e.pageX < brx && e.pageY > tly && e.pageY < bry)
						sessionpanel.css('border','2px dashed #000');
					else
						sessionpanel.css('border','1px solid #acacac');
					
				},
				dragend:function(v,e,ox,oy){
					var sessionpanel = $('#sessionpanel');
					sessionpanel.css('border','1px solid #acacac');
					var configpanel = Ext.getCmp('config-panel');
					configpanel.setScrollable(true);
					/*
					var sessionpanel = $('#sessionpanel');
					var offset = sessionpanel.offset();
					var tlx = offset.left;
					var tly = offset.top;
					var brx = tlx + sessionpanel.width();
					var bry = tly + sessionpanel.height();
					*/
					/*
					if(e.pageX > tlx && e.pageX < brx && e.pageY > tly && e.pageY < bry){
						//drop succeeded
						var deviceicon = $('#deviceicon');
						deviceicon.offset({left:tlx, top:tly});
					}
					*/
				}
			}
		}
    }
});