define(['talent'
	,'templates/community_wiki'
	,'views/community_wiki/community-wiki-list-component-view'
	,'views/community_wiki/community-wiki-detail-component-view'
],function(talent
	,jst
	,CommunityWikiListComponentView
	,communityWikiDetailComponentView
) {
	/**
	 * Inner main view class
	 * @class HomeView~MainView
	 * @extends {Backbone.View}
	 */	
	var MainView = talent.Layout.extend(
		/** @lends HomeView~MainView.prototype */
	{
		template: jst['community_wiki/index-page']
		,className: 'community_wiki_page_container'
		,regions : {
			'main' : '#communtiy_wiki_main_region'
		}
		,initialize: function() {
			var self = this;
			var user_id = talent.Context.getUserInfo().id;
			talent.Context.setPageTitle('CommunityWiki');
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
				if(routerData.create == "true" || routerData.community_id) {
					self.renderCommunityWikiDetailComponentView();
				} else {
					self.renderCommunityWikiListComponentView();
				}
			})
		}
		,renderCommunityWikiListComponentView : function() {
			this.main.show(new CommunityWikiListComponentView({
				routerData : this.routerData
			}))
		}
		,renderCommunityWikiDetailComponentView : function() {
			this.main.show(new communityWikiDetailComponentView({
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
