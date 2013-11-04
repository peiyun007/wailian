define(['talent'
	,'templates/enterprise_wiki'
],function(talent
	,jst
) {

	var ItemView = talent.ItemView.extend({
		template : jst['enterprise_wiki/enterprise-wiki-list-item']
		,tagName : 'li'
		,className : 'enterprise_wiki_list_item'
		,onRender : function() {
			this.$el.attr('data-id', this.model.get('id'));
		}
	})

	var EmptyView = talent.ItemView.extend({
		tagName : 'li'
		,className : 'enterprise_wiki_list_item'
		,template : jst['enterprise_wiki/enterprise-wiki-list-empty']
	})

	return talent.CompositeView.extend({
		template : jst['enterprise_wiki/enterprise-wiki-list-composite']
		,itemView : ItemView
		,emptyView : EmptyView
		,itemViewContainer : '#enterprise_wiki_list_container'
		,events : {
			'click .btn' : 'changeId'
		}
		,changeId : function(ev) {
			var id = talent.$(ev.target).parents('li').attr('data-id');
			this.trigger('changeId', id)
		}
	})
})