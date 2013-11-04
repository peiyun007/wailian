define(['talent'
	,'templates/task'
	,'views/task/task-list-component-view'
	,'views/task/task-detail-component-view'
],function(talent
	,jst
	,TaskListComponentView
	,TaskDetailComponentView
) {
	/**
	 * Inner main view class
	 * @class HomeView~MainView
	 * @extends {Backbone.View}
	 */	
	var MainView = talent.Layout.extend(
		/** @lends HomeView~MainView.prototype */
	{
		template: jst['task/index-page']
		,className: 'task_page_container'
		,regions : {
			'main' : '#task_main_region'
		}
		,initialize: function() {
			var self = this;
			var user_id = talent.Context.getUserInfo().id;
			talent.Context.setPageTitle('Task')
		}
		,onRender : function() {
			this.renderByRouter();
			this.setHeight();
		}
		,renderByRouter : function(){
			var self = this;
			var queryObject = talent.app.request( 'history:getQueryObject' );
			queryObject.done(function(routerData){
				self.routerData = $.extend({}, routerData);			
				if(routerData.create == "true" || routerData.task_id) {
					self.renderTaskDetailComponentView();
				} else {
					self.renderTaskListComponentView();
				}
			})
		}
		,renderTaskListComponentView : function() {
			this.main.show(new TaskListComponentView({
				routerData : this.routerData
			}))
		}
		,renderTaskDetailComponentView : function() {
			this.main.show(new TaskDetailComponentView({
				routerData : this.routerData
			}))
		}
		,setHeight : function() {
			setHeight();
			var resizeDelay = talent._.debounce(function(){
				setHeight();
			}, 300);

			$(window).off('resize.scrollHeight');
			$(window).on('resize.scrollHeight', resizeDelay);

			function setHeight() {
				var headH = talent.$("#header-region").outerHeight();
				var footH = talent.$("#footer-region").outerHeight();

				var height = $(window).height() - headH - footH;
				talent.$("#main-region").css('min-height',height);
			}
		}
	});


	return talent.BasePageView.extend({
		mainViewClass : MainView
	});
});
