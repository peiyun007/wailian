define(['talent'
	,'templates/task'
	,'views/common/bs-tab/bs-tab'
],function(talent
	,jst
	,BSTab
) {

	var ItemView = talent.ItemView.extend({
		tagName : 'li'
		,initialize : function(options) {
			this.template = _.template('<a data-trigger="false" href="#task?province_id=<%= value %>"> <%= text %></a>');
		}
	})

	var oneItemView = talent.ItemView.extend({
		tagName : 'li'
		,initialize : function() {
			this.template = _.template('<a href="javascript:void(0)">我发布的企业任务</a>');
		}
		,onRender : function() {
			this.$el.addClass('active');
		}
	})
	return talent.CollectionView.extend({
		tagName : 'ul'
		,className : 'nav nav-pills'
		,itemView : ItemView
		,emptyView : oneItemView
	})
})