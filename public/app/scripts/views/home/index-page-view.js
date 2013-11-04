define(['talent'
	,'templates/home'
	,'views/home/home-right-sidebar-layout'
	,'views/home/home-main-composite-view'
	,'$.corner'
	,'$.roundabout-shap'
],function(talent
	,jst
	,HomeRightSidebarLayout
	,HomeMainCompositeView
) {
	/**
	 * Inner main view class
	 * @class HomeView~MainView
	 * @extends {Backbone.View}
	 */	
	var MainView = talent.Layout.extend(
		/** @lends HomeView~MainView.prototype */
	{
		template: jst['home/index-page']
		,className: 'home-page-container'
		,initialize: function() {
			talent.Context.setPageTitle('Home');		
		}
		,regions: {
			main: '#home_main'
			,right : '#home_right'
		}
		,onRender: function() {
			var self = this;
			var queryObject = talent.app.request( 'history:getQueryObject' );

			queryObject.done( function( routerData ) {
				var homeMainCompositeView = new HomeMainCompositeView({
					collection : new talent.Collection()
					,model : new talent.Model({
						type : 'community_hot'
					})
				});
				self.main.show(homeMainCompositeView);
			})
			var homeRightSidebarLayout = new HomeRightSidebarLayout();
			this.right.show(homeRightSidebarLayout);
			
		}
		,onShow : function(){
		   
			$('.gla_inbox').corner('8px');
			
			$('#gla_box>ul').roundabout({
				minOpacity:1,
				btnNext: ".next",
				duration: 1000,
				reflect: true,
				btnPrev: '.prev',
				autoplay:true,
				autoplayDuration:5000,
				tilt:0,
				shape: 'figure8'
			});
		}
		,onClose : function() {
			$('.gla_inbox').uncorner();
			$('#gla_box>ul').roundabout();
		}
	});


	return talent.BasePageView.extend({
		mainViewClass : MainView
	});
});
