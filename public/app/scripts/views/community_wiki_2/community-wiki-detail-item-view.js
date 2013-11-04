define(['talent'
	,'templates/community_wiki'
],function(talent
	,jst
) {
	return talent.ItemView.extend({
		template : jst['community_wiki/community-wiki-detail']
		,tagName : 'ul'
		,className : 'panel-body'
		,initialize : function(options) {
			this.options = options || {};
		}
		,getData : function() {
			
		}
	})
})