define(['talent', 'templates/common'],
	function(talent, jst) {

	var Layout = talent.BaseEmptyLayout.extend({
		template: jst['common/layouts/empty-layout']
	});
	/**
	 * Layout的单例是为了页面切换时，实现局部刷新
	 * 
	 */
	return new Layout;
});