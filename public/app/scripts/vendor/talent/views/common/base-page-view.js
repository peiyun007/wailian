define(['underscore', 'jquery', 'marionette'], 
	function(_, $, Marionette) {

	return Marionette.Layout.extend({
		layout: 'master-layout',
		getLayoutView: function(callback) {
			var self = this;
			var layoutPath = 'views/common/layouts/' + this.layout;
			
			require([layoutPath], function(layoutView) {
				layoutView.mainViewClass = self.mainViewClass;
				layoutView.hideSidebar = self.hideSidebar;
				layoutView.refreshSidebar = self.refreshSidebar;
				layoutView.sidebarViewClass = self.sidebarViewClass;

				callback(layoutView);
			})
		}
	});
});