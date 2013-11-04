define(['talent'
	,'templates/activity'
	,'views/common/bs-tab/bs-tab'
],function(talent
	,jst
	,BSTab
) {

	var ItemView = talent.ItemView.extend({
		tagName : 'li'
		,initialize : function(options) {
			this.template = _.template('<a data-trigger="false" href="#activity?type_id=<%= value  %>"> <%= text %></a>');
		}
	})
	return talent.CollectionView.extend({
		tagName : 'ul'
		,className : 'nav nav-pills'
		,itemView : ItemView
	})
})