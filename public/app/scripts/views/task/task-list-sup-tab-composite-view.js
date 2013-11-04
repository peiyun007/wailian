define(['talent'
	,'templates/task' 
],function(talent
	,jst
) {

	var ItemView = talent.ItemView.extend({
		tagName : 'li'
		,initialize : function(options) {
			this.templateHelpers = options;
			this.template = _.template('<a data-trigger="false" href="#task?province_id=<%= province_id%>&city_id=<%= value %>"> <%= text %></a>');
		}
	})
	return talent.CollectionView.extend({
		tagName : 'ul'
		,className : 'nav nav-pills'
		,itemView : ItemView
		,itemViewOptions : function(){
			return {
				'province_id' : this.model.get('province_id')
			}
		}
	})
})