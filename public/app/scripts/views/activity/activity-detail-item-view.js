define(['talent'
	,'templates/activity'
],function(talent
	,jst
) {
	return talent.ItemView.extend({
		template : jst['activity/activity-detail']
		,tagName : 'ul'
		,className : 'panel-body'
		,initialize : function(options) {
			this.options = options || {};
		}
		,getData : function() {
			
		}
	})
})