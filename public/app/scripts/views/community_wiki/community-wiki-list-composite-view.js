define(['talent'
	,'templates/community_wiki'
],function(talent
	,jst
) {

	var ItemView = talent.ItemView.extend({
		template : jst['community_wiki/community-wiki-list-item']
		,tagName : 'li'
		,className : 'community_wiki_list_item'
		,onRender : function() {
			this.$el.attr('data-id', this.model.get('id'));
		}
	})

	var EmptyView = talent.ItemView.extend({
		tagName : 'li'
		,className : 'community_wiki_list_item'
		,template : jst['community_wiki/community-wiki-list-empty']
	})

	return talent.CompositeView.extend({
		template : jst['community_wiki/community-wiki-list-composite']
		,itemView : ItemView
		,emptyView : EmptyView
		,itemViewContainer : '#community_wiki_list_container'
		,events : {
			'click .detail_btn' : 'changeId',
			'click .join_btn' : 'join'
		}

		,changeId : function(ev) {
			var id = talent.$(ev.target).parents('li').attr('data-id');
			this.trigger('changeId', id);
		}
		,join : function(ev) {
			var id = talent.$(ev.target).parents('li').attr('data-id');
			this.trigger('joinCommunity', id);
		}
	})
})