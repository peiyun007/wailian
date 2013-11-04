define(['talent', 'templates/common'],
	function(talent, jst) {
	/**
	* Sidebar view class
	* @author nobody
	* @extends {talent.View}
	* @class SidebarView
	*/
	return talent.Layout.extend(
		/** @lends SidebarView.prototype */
	{
		template: jst['common/page-regions/sidebar']
		,tagName : 'ul'
		,className : 'breadcrumb'
		,initialize : function() {
			this.model = new talent.Model({
				user_id : talent.Context.getUserInfo().id
			})
		}
		,onRender : function () {
			var id = talent.Context.getUserInfo().id;
			if(id == -1) {
				this.$el.hide();
			}
		}
	});

});