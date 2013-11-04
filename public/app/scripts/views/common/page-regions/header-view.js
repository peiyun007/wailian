define(['talent','templates/common', 'views/common/bs-tab/bs-tab'], function(talent, jst, BSTab) {
	/**
	* Header view class
	* @author nobody
	* @extends {talent.View}
	* @class HeaderView
	*/
	return talent.CompositeView.extend(
		/** @lends HeaderView.prototype */
	{
		template: jst['common/page-regions/header'],
		className : 'header'
		,initialize : function(){
			var info = talent.Context.getUserInfo();
			this.model = new talent.Model({
				user_id : info.id,
				user_name : info.name
			})
		}
		,onShow : function() {
		
			var bsTab = new BSTab({
				el : this.$el.find('.navbar-nav')
			})
			talent.app.request('history:getFragments').done(function(fragments){
				var topChannel = fragments[0];
				bsTab.setDefault(fragments[0]);
			});

		}
	});

});