/**
 * @author kongchangzhu
 * @module main
 */
define(['jquery','underscore','backbone','marionette'
	,'vendor/talent/app'
	,'vendor/talent/routers/index-router'
	,'vendor/talent/helpers/context'
	,'vendor/talent/views/common/base-page-view'
	,'vendor/talent/views/common/base-empty-layout'
	,'vendor/talent/views/common/base-master-layout'
	,'vendor/talent/collections/index'
], function($,_,Backbone,Marionette
	,app
	,RootRouter
	,Context
	,BasePageView
	,BaseEmptyLayout
	,BaseMasterLayout
	,IndexCollection
){

	var talent = {};

	talent._ = _;
	talent.$ = $;

	/**
	 * bugfix: IE7- cross domain;
	 * support forceTrigger;
	 */
	Backbone.History.prototype.navigate = function(fragment, options) {
		if(this.iframe && !this.setIframe) {
			this.iframe = window;
			this.setIframe = true;
		}
		if (!Backbone.History.started) return false;
		if (!options || options === true) options = {trigger: options};
		fragment = this.getFragment(fragment || ''); 
		if ((this.fragment === fragment) && !options.forceTrigger) return;
		this.fragment = fragment;
		var url = this.root + fragment;

		// If pushState is available, we use it to set the fragment as a real URL.
		if (this._hasPushState) {
			this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

			// If hash changes haven't been explicitly disabled, update the hash
			// fragment to store history.
			} else if (this._wantsHashChange) { 
				this._updateHash(this.location, fragment, options.replace);
				if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
				// Opening and closing the iframe tricks IE7 and earlier to push a
				// history entry on hash-tag change.  When replace is true, we don't
				// want this.
				if(!options.replace) this.iframe.document.open().close();
				this._updateHash(this.iframe.location, fragment, options.replace);
			}

		// If you've told us that you explicitly don't want fallback hashchange-
		// based history, then `navigate` becomes a page refresh.
		} else {
			return this.location.assign(url);
		}
		if (options.trigger) this.loadUrl(fragment);
	};
	// bugfix: find missing events by re-delegating

	Marionette.Region.prototype.show = function(view, options){
		this.ensureEl();
		options = options || {};
		if (view !== this.currentView) {
			if(this.currentView) {
				var lastViewEl = $(this.currentView.el).clone();
			}
			this.close();
			
			if(view.isClosed){
				view._initialEvents && view._initialEvents();
			}
			view.render();
			view.undelegateEvents();
			this.open(view, options);
			view.unbindUIElements();
			view.delegateEvents();
			view.bindUIElements();			
		} else {
			view.render();
		}
		Marionette.triggerMethod.call(view, "show");
		Marionette.triggerMethod.call(this, "show", view);

		this.currentView = view;
		if(options.noAnimate) {
			return ;
		}
		// showAnimation.call(this, view, lastViewEl);
		
		function showAnimation( view, lastViewEl) {
			var self = this;
			
			// add animation
			if(lastViewEl && (navigator.userAgent && navigator.userAgent.indexOf('Chrome') != -1)) {		
				this.$el.bind('webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend', function(){
					self.$el.find(lastViewEl).remove();
					self.$el.removeClass('_animate_container _animate_flip_rotate');				
					self.$el.find(view.el).attr('_animate_end', true).removeClass('_animate_rotate_back');
					//.animate({height : self.$el.find(view.el).height()}, 600);	
				});
				$(lastViewEl).removeClass('_animate_rotate_back').addClass('_animate_rotate_front');
				$(view.el).addClass('_animate_rotate_back');
				this.$el.append(lastViewEl).addClass('_animate_container _animate_flip_rotate');
			} else {
				self.$el.find(view.el).attr('_animate_end', true);
			}
		}
	}

	talent.Layout = Marionette.Layout;
	talent.CompositeView = Marionette.CompositeView;
	talent.CollectionView = Marionette.CollectionView;
	talent.ItemView = Marionette.ItemView;
	talent.View = Marionette.View;
	talent.Region = Marionette.Region;

	talent.Model = Backbone.Model;
	talent.Router = Backbone.Router;
	talent.Collection = Backbone.Collection;
	
	talent.BasePageView = BasePageView;
	talent.BaseEmptyLayout = BaseEmptyLayout;
	talent.BaseMasterLayout = BaseMasterLayout;
	talent.Context = Context;


	app.on("initialize:before", function(options){
		var rootRouter = new RootRouter(options);

		rootRouter.on('route', function(router, route, params){
			app.vent.trigger('route', rootRouter.getFragments(), params);
		});

		app.reqres.setHandler('history:getQueryObject', function( options ){
			var def = new $.Deferred;
			def.resolve(rootRouter.getQueryObject());
			return def;
		});

		app.reqres.setHandler('history:getFragments', function( options ){
			var def = new $.Deferred;
			def.resolve(rootRouter.getFragments());
			return def;
		});

		app.addRegions({
			container: options.container
		})
	});

	app.on("initialize:after", function(options){
		if (Backbone.history){
			Backbone.history.start(options);
			delegateLinkClick();
		}
	});

	app.commands.setHandler('history:navigate', function( href, triggerFlag ){
		Backbone.history.navigate(href, triggerFlag);
	});


	talent.app = app;

	return talent;

	/**
	 * All navigation that is relative should be passed through the navigate
	 * method, to be processed by the router. If the link has a `data-bypass`
	 * attribute, bypass the delegation completely.
	 * @name module:main~delegateLinkClick
	 */
	function delegateLinkClick(){
		// prevent clicking in very short time repeatedly
		var delayClick = _.debounce(function(href, options){
			/**
			 * `Backbone.history.navigate` is sufficient for all Routers and will
			 * trigger the correct events. The Router's internal `navigate` method
			 * calls this anyways.  The fragment is sliced from the root.
			 */
			Backbone.history.navigate(href, options);
		}, 300, true);
		$(document).on('click', 'a:not([data-bypass])', function(e){
				/**
			 * Get the absolute anchor href.
			 */
			var href = $(e.currentTarget).attr('href');
			/**
			 * If the href exists and is a hash route, run it through Backbone.
			 */
			if (href && href.indexOf('#') === 0) {
				/**
				 * Stop the default event to ensure the link will not cause a page refresh.
				 */
				e.preventDefault();
				var isForceChange = true;
				var triggerFlag = true;
				if($(e.currentTarget).attr('data-trigger') === "false"){
					triggerFlag = false;
				}
				delayClick(href, {
					trigger: triggerFlag,
					forceTrigger:true
				});
			}
		});
	}
});