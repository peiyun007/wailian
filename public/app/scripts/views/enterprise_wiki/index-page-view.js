define(['talent'
	,'templates/enterprise_wiki'
	,'views/common/bs-tab/bs-tab'
	,'views/enterprise_wiki/enterprise-wiki-list-composite-view'
	,'views/enterprise_wiki/enterprise-wiki-detail-item-view'
	,'views/enterprise_wiki/enterprise-wiki-detail-edit-item-view'
	,'views/enterprise_wiki/enterprise-wiki-list-sub-tab-composite-view'
	,'views/enterprise_wiki/enterprise-wiki-list-sup-tab-composite-view'
	,'$.paginate'
	,'$.scrollable'
],function(talent
	,jst
	,BSTab
	,EnterpriseWikiListCompositeView
	,EnterpriseWikiDetailItemView
	,EnterpriseWikiDetailEditItemView
	,EnterpriseWikiListSubTabCompositeView
	,EnterpriseWikiListSupTabCompositeView
) {
	/**
	 * Inner main view class
	 * @class HomeView~MainView
	 * @extends {Backbone.View}
	 */	
	var MainView = talent.Layout.extend(
		/** @lends HomeView~MainView.prototype */
	{
		template: jst['enterprise_wiki/index-page']
		,className: 'enterprise_wiki_page_container'
		,events : {
			'click  .panel-heading a' : 'dealHandler'
		}
		,initialize: function() {
			var self = this;
			talent.Context.setPageTitle('EnterpriseWiki');
			this.pageData = {
				size : 5,
				start : 0
			}
			this.routerData = {
				province_id : -1
				,city_id : -1
			};
		}
		,regions: {
			main: '#enterprise_wiki_list'
			,subTab : '#enterprise_wiki_list_sub_tab'
			,supTab : '#enterprise_wiki_list_sup_tab'
			,detail : '#enterprise_wiki_detail_container'
		}
		,ui : {
			detail : '#enterprise_wiki_detail'
			,detail_btn : '#enterprise_wiki_detail_edit_btn_group'
		}
		,onShow: function() {
			var self = this;
			talent.app.vent.off("tab:enterprise_type:change");
			talent.app.vent.on("tab:enterprise_type:change", this.onTabClick, this);
			this.renderByRouter();
			talent.Context.setMainRegionsHeight();
			this.bindScroll();
		}
		,renderByRouter : function(){
			var self = this;
			var queryObject = talent.app.request( 'history:getQueryObject' );
			queryObject.done(function(routerData){
				self.routerData = $.extend({}, self.routerData, routerData);
				self.renderEnterpriseListSubTabView();
				self.renderEnterpriseWikiListView();
				if(routerData.create == "true") {
					self.renderEnterpriseWikiDetailAdd();
				}
				if(routerData.enterprise_id) {
					self.renderEnterpriseWikiDetailView();
				}
			})
		}
		,onTabClick : function(node) {
			var routerData = talent.Context.parseUrl(node.attr('href'));
			this.pageData.start = 0;
			if(this.showEnterpriseWikiDetail) {
				this.closeWikiDetail();
			}
			this.routerData = {
				'province_id' : routerData.province_id,
				'city_id' : routerData.city_id
			};
			if(!routerData.city_id) {
				this.renderEnterpriseListSupTabView();
			}
			this.renderEnterpriseWikiListView();
		}	
		,activeDetailIdChange : function(id) {
			this.routerData.enterprise_id = id;
			var collection = this.enterpriseWikiListCompositeView.collection;
			var model = collection.get(id);
			this.renderEnterpriseWikiDetailView(model);
		}
		,pageStartChange : function() {
			if(this.showEnterpriseWikiDetail) {
				this.closeWikiDetail();
			}
			this.renderEnterpriseWikiListView();
		}
		,renderEnterpriseListSubTabView : function() {
			var self = this;
			var routerData = this.routerData;
			if(routerData.user_id) {
				var enterpriseWikiListSubTabCompositeView = new EnterpriseWikiListSubTabCompositeView({
					collection : new talent.Collection([{value : '-1', text : '我的所有企业>>'}]),
					oneItem : true
				})
				self.subTab.show(enterpriseWikiListSubTabCompositeView);
			} else {
				$.ajax({
					url : 'region/list_all_province'
					,type : 'GET'
				}).done(function(resp) {
					var resp = [{value : '-1', text : '全部'}].concat(resp);
					var enterpriseWikiListSubTabCompositeView = new EnterpriseWikiListSubTabCompositeView({
						collection : new talent.Collection(resp)
					})
					self.subTab.show(enterpriseWikiListSubTabCompositeView);
					var tab = new BSTab({
						el : enterpriseWikiListSubTabCompositeView.$el
						,eventTriggerName : 'enterprise_type'
					})
					tab.setDefault({
						province_id : self.routerData['province_id'] || -1
					})
					self.renderEnterpriseListSupTabView();
				})
			}			
		}
		,renderEnterpriseListSupTabView : function() {
			var routerData = this.routerData;
			var self = this;
			if(routerData.province_id != -1) {
				$.ajax({
					url : 'region/list_all_city'
					,type : 'POST'
					,data : {
						province_id : routerData.province_id
					}
				}).done(function(resp){
					var resp = [{value : '-1', text : '全部'}].concat(resp);
					var enterpriseWikiListSupTabCompositeView = new EnterpriseWikiListSupTabCompositeView({
						collection : new talent.Collection(resp),
						model : new talent.Model({
							province_id : routerData.province_id
						})
					})
					self.$el.find('#enterprise_wiki_list_sup_tab').hide('slow', function(){
						self.supTab.show(enterpriseWikiListSupTabCompositeView);
						self.$el.find('#enterprise_wiki_list_sup_tab').show('slow');
						var tab = new BSTab({
							el : enterpriseWikiListSupTabCompositeView.$el
							,eventTriggerName : 'enterprise_type'
						})
						tab.setDefault({
							city_id : self.routerData['city_id'] || -1
						})
					});				
				})
			} else {
				self.$el.find('#enterprise_wiki_list_sup_tab').hide('slow');
			}
		}
		,renderEnterpriseWikiListView : function() {
			var self = this;
			this.getListData().done(function(resp) {
				if(self.enterpriseWikiListCompositeView) {
					var total = resp && resp.total || 0;
					if(self.enterpriseWikiListCompositeView.model.get('total') != total){
						self.enterpriseWikiListCompositeView.model.set('total', total);
						self.renderPagination();
					}
					self.enterpriseWikiListCompositeView.collection.reset(resp && resp.res || []);
					return;
				}
				self.enterpriseWikiListCompositeView = new EnterpriseWikiListCompositeView({
					collection : new talent.Collection( resp && resp.res || [])
					,model : new talent.Model({
						renderMine : self.routerData.user_id ? true : false
						,total : resp && resp.total
					})
				})
				self.main.show(self.enterpriseWikiListCompositeView);
				self.renderPagination(resp && resp.total || 0);
				self.showEnterpriseWikiList = true;
				self.enterpriseWikiListCompositeView.off('changeId');
				self.enterpriseWikiListCompositeView.on('changeId', self.activeDetailIdChange, self);	
			})
		}
		,renderPagination : function(total) {
			var self = this;
			if(total == 0 || total == '0') {
				this.enterpriseWikiListCompositeView.$el.find('#enterprise_wiki_list_paginate').hide();
				return;
			}
			this.enterpriseWikiListCompositeView.$el.find('#enterprise_wiki_list_paginate').show().pagination(total,{
				items_per_page: this.pageData.size,
				num_display_entries: 10,
				current_page: this.pageData.start/this.pageData.size,
				num_edge_entries:1,
				link_to:"javascript:void(0)",
				prev_text:"前一页",
				next_text:"后一页",
				callback : function(pageId){
					var start = self.pageData.start;
					self.pageData.start = (pageId * self.pageData.size);
					self.pageStartChange(); 
				}
			})
		}
		,getListData : function() {
			var deferred = new $.Deferred();
			var routerData = this.routerData;
			var url, type;
			var data = {};
			if(routerData.user_id) {
				url = 'qiye/list_my_qy';
				data = {
					user_id : routerData.user_id
				}
			} else {
				var showAllData = !this.routerData.province_id || this.routerData.province_id == -1 ? true : false;
				url = showAllData ?  'qiye/list_all_qy' : 'qiye/list_qy_by_region';
				data = showAllData ? {} : {province_id : routerData.province_id, city_id : routerData.city_id || -1};
			}
			data['size'] = this.pageData.size;
			data['start'] = this.pageData.start;
			$.ajax({
				url : url
				,type : 'POST'
				, data : data 
			}).done(function(resp){
				deferred.resolve(resp);
			})
			return deferred.promise();
		}
		,renderEnterpriseWikiDetailView : function(model) {
			var self = this;
			var id = this.routerData.enterprise_id;
			var next = function(){
				self.$el.find('#enterprise_wiki_detail').dequeue('slideList')
			}
			var animateList = [
				function(){self.ui.detail.find('.panel-heading').hide();self.detail.close(); self.$el.find('#enterprise_wiki_detail').animate({width : 0}, 500, next);},
				function(){self.ui.detail.find('.panel-heading').show();self.$el.find('#enterprise_wiki_detail').delay(300).animate({width : 600}, 500, next);},
				function(){getData()}
			]

			if(!self.showEnterpriseWikiDetail) {
				animateList = animateList.slice(1, animateList.length);
			}
			self.$el.find('#enterprise_wiki_detail').queue('slideList', animateList);
			next();
			function getData() {
				$.ajax({
					url : 'index.php/qiye/get_qy_allInfo_byId'
					,type : 'POST'
					,data : {
						id : id
					}
				}).done(function(resp) {
					if(resp && resp.qy_detail && resp.qy_detail[0].createUser_id == talent.Context.getUserInfo().id){
						self.ui.detail_btn.show();
					}else {
						self.ui.detail_btn.hide();

					}
					self.enterpriseWikiDetailView = new EnterpriseWikiDetailItemView({
						model : new talent.Model(resp),
						id : id
					});
					self.detail.show(self.enterpriseWikiDetailView);
					self.bindScroll();
					self.showEnterpriseWikiDetail = true;
				})			
			}
		}
		,renderEnterpriseWikiDetailAdd : function() {
			var self = this;
			this.ui.detail.find('.panel-heading').show();
			this.$el.find('#enterprise_wiki_detail').delay(300).animate({width : 600}, 500, function(){
				self.editWikiDetail(true);
			})
		}
		,dealHandler : function(ev) {
			var handler = talent.$(ev.target).attr('data-handler');
			this[handler + 'WikiDetail'] && this[handler + 'WikiDetail']();
		}
		,deleteWikiDetail : function() {
			var self = this;
			var id = this.routerData.enterprise_id;
			$.ajax({
				url : 'qiye/delete_qiye'
				,type : 'POST'
				,data : {
					id : id,
					user_id : talent.Context.getUserInfo().id
				}
			}).done(function(resp){
				talent.Context.setAlertTemplate(resp, $('#all_alert')).done(function(){				
					if(resp.code == 200) {
						self.closeWikiDetail();
						self.renderEnterpriseWikiListView();
					}
				});
			})
		}
		,editWikiDetail : function(flag) {
			var id = this.routerData.enterprise_id;
			var model = flag ? new talent.Model() : new talent.Model(this.enterpriseWikiDetailView.model.get('qy_detail')[0]);
			var enterpriseWikiDtailEditView = new EnterpriseWikiDetailEditItemView({
				model : model,
				status : flag ? 'empty' : 'edit'
			})
			this.detail.show(enterpriseWikiDtailEditView);
			this.bindScroll();
			enterpriseWikiDtailEditView.on('submit', this.onAfterEdit, this);
		}
		,onAfterEdit : function() {
			this.closeWikiDetail();
			this.renderEnterpriseWikiListView();
		}
		,closeWikiDetail : function() {
			this.detail.close();
			this.ui.detail.find('.panel-heading').hide();
			this.ui.detail.animate({width : 0}, 500, function() {
				self.showEnterpriseWikiDetail = false;
			})
		}
		,bindScroll : function() {
			setHeight();
			var resizeDelay = talent._.debounce(function(){
				setHeight();
			}, 300);

			$(window).off('resize.scrollHeight');
			$(window).on('resize.scrollHeight', resizeDelay);

			function setHeight() {
				var headH = talent.$("#header-region").outerHeight();
				var footH = talent.$("#footer-region").outerHeight();
				var mainH = talent.$("#main-region").outerHeight();

				var height = $(window).height() - headH;
				var container = talent.$('.detail-container');
				container.height(height);
				var scrollHeight = height - container.find('.panel-heading').outerHeight();
				container.find('.detail-body').height(scrollHeight);
				container.find('.detail-body').scrollable({
					"setStyle": true
				});
			}
		}
	});


	return talent.BasePageView.extend({
		mainViewClass : MainView
	});
});
