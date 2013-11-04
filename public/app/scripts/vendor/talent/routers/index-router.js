define(['jquery', 'vendor/talent/app', 'vendor/talent/routers/base-router'],
	/**
	 * Root router
	 * @author kongchangzhu
	 * @extends {BaseRouter}
	 * @class RootRouter
	 */
	function($, app, BaseRouter) {
	return BaseRouter.extend(
		/** @lends RootRouter.prototype */
	{
		/**
		 * Initialize child routers
		 * @param  {Object} options
		 */
		initialize: function(options) {
			this.options = options || {};
			/**
			 * if the request matches many routers, the last overrides privous ones
			 */
			this.route(/^(.*)$/, "loadPageView");
		}
	});
});
