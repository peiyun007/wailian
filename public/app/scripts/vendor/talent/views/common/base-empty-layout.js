define(['underscore', 'jquery', 'marionette'],
	function(_, $, Marionette) {

	return Marionette.Layout.extend({
		template: _.template('<div id="main-region"></div>'),
		regions:{
			main: '#main-region'
		},
		onShow: function() {
			this.main.show(new this.mainViewClass);
		}
	});
});