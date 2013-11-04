define(['talent'
	,'templates/community_wiki'
],function(talent
	,jst
) {
	return talent.ItemView.extend({
		template : jst['community_wiki/community-wiki-detail-activity-item']
		,initialize : function(options) {
			var options = options || {};
			this.templateHelpers = {
				routerData : options.routerData
			}
		}
		,getData : function() {
			
		}
	})
})