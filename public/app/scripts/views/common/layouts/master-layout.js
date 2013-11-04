define(['talent', 'templates/common', 
	'views/common/page-regions/header-view', 'views/common/page-regions/footer-view', 
	'views/common/page-regions/sidebar-view'],
	function(talent, jst, HeaderView, FooterView, SidebarView) {

	var Layout = talent.BaseMasterLayout.extend({
		template: jst['common/layouts/master-layout']
		,regionsClass: {
			header: HeaderView,
			footer: FooterView,
			sidebar: SidebarView
		}
		
	});
	/**
	 * Layout的单例是为了页面切换时，实现局部刷新
	 * 
	 */
	return new Layout;
});