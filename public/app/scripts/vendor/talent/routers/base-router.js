define(['underscore', 'jquery', 'backbone', 'vendor/talent/app'],
	/**
	 * Base router
	 * @author kongchangzhu
	 * @extends {Backbone.Router}
	 * @class BaseRouter
	 * @version 0.2 abstract methods:
	 */
	function(_, $, Backbone, app) {
	return Backbone.Router.extend(
		/** @lends BaseRouter.prototype */
	{
		/**
		 * Load page view class ,initialize and render
		 * @param  {String} pageViewPath page view class file path
		 */
		loadPageView: function() {
			// redirect to page of entryPageId if history fragment is empty
			if(!Backbone.history.getFragment()){
				return Backbone.history.navigate(this.options.entryPageId, true);
			}
			var self = this;
			var fullPageViewPath = this.getPageViewPath();
			var rootPageViewPath = this.getPageViewPath(true);

			require([rootPageViewPath], function(RootPageView) {

				require([fullPageViewPath], function(PageView) {
					var pageView = new PageView;

					/**
					 * 如果PageView有相同的Layout，则局部刷新
					 */

					pageView.getLayoutView(function(layoutView) {
						if((app.container.currentView === layoutView) 
							&& layoutView.refresh) {
							
							layoutView.refresh();
						}else{
							app.container.show(layoutView);
						}
					});

				});
			});
		},
		/**
		 * Build page view class file path
		 * @param  {Boolean} isAllInOneFilePath get root page view class path only
		 * @return {String} page view class file path
		 */
		getPageViewPath: function(isAllInOneFilePath) {
			var fragments = this.getFragments();
			var pageViewPath = ['views'];
			// if(isAllInOneFilePath){
			// 	pageViewPath = pageViewPath.concat(fragments[0]);
			// 	pageViewPath.push('all-in-one');
			// }else{
				pageViewPath = pageViewPath.concat(fragments);
				pageViewPath.push('index-page-view');
			// }
			return pageViewPath.join('/');
		},
		/**
		 * Get fragments
		 * This method should be called after history started
		 * @return {Array} fragment array
		 */
		getFragments: function() {
			var fragmentStr = Backbone.history.getFragment();
			var fragments = [];
			var markIndex = fragmentStr.indexOf("?");

			// contain query string in fragments
			if(markIndex > -1){
				// remove query string from fragments
				fragmentStr = fragmentStr.slice(0, markIndex);
			}

			if(fragmentStr !== ""){
				fragments = fragmentStr.split('/');
			}

			return fragments;
		},
		/**
		 * Build query object from fragment
		 * This method should be called after history started
		 * @return {Object} query object
		 */
		getQueryObject: function() {
			// get page location from variable if history fragment is empty
			var fragmentStr = Backbone.history.getFragment();
			var queryObject = {};
			var markIndex = fragmentStr.indexOf("?");

			// contain query string in fragments
			if(markIndex > -1){
				// build query object
				var queryString = fragmentStr.slice(markIndex+1);
				var queryArray = queryString.split('&');
				for (var i = 0; i < queryArray.length; i++) {
					if(!queryArray[i]) continue;
					var queryPair = queryArray[i].split('=');
					queryObject[queryPair[0]] = decodeURIComponent(queryPair[1]);
				}
			}

			return queryObject;
		}
	});
});
