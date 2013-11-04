define(['talent'
	,'templates/home'
],function(talent
	,jst
) {
	var MainView = talent.Layout.extend({
		template: jst['home/login/index-page']
		,className: 'well span8'
		,initialize: function() {
			talent.Context.setPageTitle('Page Title: home/login');
		}
		,regions: {
			// main: '.page-main-region'
		}
		,ui:{
			// item: '.ui-item'
		}
		,events:function(){
			var events = {};
			// events['click ' + this.ui.item] = 'eventHandler';
			return events;
		}
	});

	return talent.BasePageView.extend({
		mainViewClass : MainView
	});
});