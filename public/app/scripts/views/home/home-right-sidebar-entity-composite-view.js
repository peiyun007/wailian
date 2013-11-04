define(['talent'
	,'templates/home'
],function(talent
	,jst
) {
	var HotItemView = talent.ItemView.extend({
		template : jst['home/home-right-sidebar-entity-item']
		,tagName : 'tr'
		,onRender : function(){
			this.$el.attr('data-id', this.model.get('id'));
		}
	})

	return talent.CompositeView.extend({
		template : jst['home/home-right-sidebar-entity-composite']
		,itemView : HotItemView
		,itemViewContainer : '#home_right_sidebar_entity'
		,initialize : function () {

		}
	
	})
})