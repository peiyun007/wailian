define(['talent'
	,'templates/enterprise_wiki'
],function(talent
	,jst
) {
	return talent.ItemView.extend({
		template : jst['enterprise_wiki/enterprise-wiki-detail']
		,tagName : 'ul'
		,className : 'panel-body'
		,initialize : function(options) {
			this.options = options || {};
		}
		,getData : function() {
			
		}
	})
})