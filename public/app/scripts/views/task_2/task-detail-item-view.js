define(['talent'
	,'templates/task'
],function(talent
	,jst
) {
	return talent.ItemView.extend({
		template : jst['task/task-detail']
		,tagName : 'ul'
		,className : 'panel-body'
		,initialize : function(options) {
			this.options = options || {};
		}
		,getData : function() {
			
		}
	})
})