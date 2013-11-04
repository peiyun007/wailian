define(['talent'
	,'templates/home'
	,'views/common/bs-tab/bs-tab'
],function(talent
	,jst
	,BsTab
) {

	var HotItemView = talent.ItemView.extend({
		template : jst['home/home-main-item']
		,tagName : 'tr'
		,onRender : function(){
			this.$el.attr('data-id', this.model.get('id'));
		}
	})

	return talent.CompositeView.extend({
		template : jst['home/home-main-composite']
		,itemView : HotItemView
		,itemViewContainer : '#home_main_container_hot_community'
		,itemTemlate :_.template('<tr><td><%= title %></td><td><%= publish_date%></td></tr>')
		,initialize : function () {
			var self = this;
			this.getData();
			// talent.app.vent.off('tab:hot_type:change');
			// talent.app.vent.on('tab:hot_type:change', function(node){
			// 	self.model.set(talent.Context.parseUrl(node.attr("href")));
			// })
		}
		,modelEvents : {
			'change:type' : 'getData'
		}
		,getData : function () {
			var self = this;
			var type = this.model.get('type');
			var url = type == 'community_hot' ? 'stneed/list_hotest_st_need' : 'qyneed/list_hotest_qy_need';
			var deferred = new talent.$.Deferred();
			talent.$.ajax({
				url : url
				,type : 'GET'
			}).done(function (resp) {
				self.collection.reset(resp);
				deferred.resolve(resp);
			})
			talent.$.ajax({
				url : 'qyneed/list_hotest_qy_need',
				type : 'GET'
			}).done(function(resp) {
				_.each(resp, function(value) {
					self.$el.find('#home_main_container_hot_entertity').append(self.itemTemlate(value));
				})
			})
			return deferred.promise();
		}
		,onRender : function() {
			// this.tab = new BsTab({
			// 	el : this.$el.find('.nav-tabs')
			// 	,eventTriggerName : 'hot_type'
			// })
			// this.tab.setDefault({
			// 	type : this.model.get('type')
			// })
		}
	})
})