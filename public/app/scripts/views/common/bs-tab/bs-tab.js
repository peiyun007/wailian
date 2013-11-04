define( [ 'talent' ], function( talent ) {

	/* 提供自定义
	// 方法 : getActiveNodeByData 支持setDefault方法通过href内容寻找需要加active的元素
	//		  getActiveNodeByNode 支持tabClick方法通过事件节点寻找需要加active的元素
	   el : 父节点 ul/dd
	   eventTriggerName : 当tabClick后事件告知名称
	*/
	/*
		example : 
			var bsTab = new BSTab {
				activeClassName : 'active',
				el : this.el.find('ul'),
				eventTriggerNamr : 'tab:_tita_plan:change',
				getActiveNodeByData : function(data) {
					// data {type : '1122'}
					var node = this.$el.find('a[href$="'+ matchData +'"]');
				    return node.parent();
				},
				getActiveNodeByNode : function(node) {
					//node 为事件el a标签
					return node.parent();
				}
			}
	*/
	return  talent.ItemView.extend ({
		template : _.template(),
		initialize : function( options ) {
			this.$el = options.el;
			//user define for setDefault to find active node to add class, eg:li
			if(options.getActiveNodeByData) {
				this.getActiveNodeByData = options.getActiveNodeByData;
			}
			//user define for tabClick to find active node to add class, eg:li
			if(options.getActiveNodeByNode) {
				this.getActiveNodeByNode = options.getActiveNodeByNode;
			}
			//user define for tabClick to find active node has href attr, eg:a
			if(options.getEventTriggerNode) {
				this.getEventTriggerNode = options.getEventTriggerNode;
			}
			
			var eventNode = options.eventNode || "a";
			// prevent clicking in very short time repeatedly
			var onTabClick = _.debounce(this.onTabClick, 300, true);

			// preventing memory leak when bs-tab has the same node
			var oriCid = this.$el.data('bb-cid');
			if(oriCid){
				this.$el.off('.delegateEvents' + oriCid);
			}
			this.$el.data('bb-cid',this.cid);

			this.events = function() {
				var events = {};
				events[ 'click ' + eventNode] = onTabClick;
				return events;
			}

			this.activeClassName = options.activeClassName ? options.activeClassName : 'active';
		},
		setDefault : function( data ) {
			this.$el.find('.' + this.activeClassName).removeClass(this.activeClassName);
			var node = this.getActiveNodeByData(data);
			this.activeNode = node;
			node.addClass(this.activeClassName);
		},
		onTabClick : function ( e ) {
			var self = this;
			var node  = talent.$(e.currentTarget);	

			if(node.attr("outside")){
				return;
			}
			self.activeNode && self.activeNode.removeClass(self.activeClassName);
					
			self.activeNode = self.getActiveNodeByNode(node);
			self.activeNode.addClass(self.activeClassName);
			if(self.options.eventTriggerName) {
				talent.app.vent.trigger( 'tab:' + self.options.eventTriggerName + ':change',  self.getEventTriggerNode(node)); 
			}
			
		},
		//get has href node, eg: a
		getEventTriggerNode : function(node) {
			return node;
		},
		//get add active class node, eg : li
		getActiveNodeByData : function( data ) {
			var matchData = '';
			if((typeof data) !== 'string') {
				talent._.each(data, function(value, key){
					matchData += key + '=' + value + '&';
				})
				matchData = matchData.slice(0,matchData.length - 1);
			} else {
				matchData = data;
			}
				
			var node = this.getActiveNodeByNode(this.$el.find('a[href$="'+ matchData +'"]'));
			return node;
		},
		//get add active class node, eg : li
		getActiveNodeByNode : function(node) {
			return node.parent();
		},
		getActiveNode : function() {
			return this.activeNode;
		}	
	})
} ) 