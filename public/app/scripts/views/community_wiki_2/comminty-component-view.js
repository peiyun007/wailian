define(['talent'
	,'templates/community_wiki'
	,'views/common/bs-tab/bs-tab'
	,'views/community_wiki/community-wiki-list-composite-view'
	,'views/community_wiki/community-wiki-detail-item-view'
	,'views/community_wiki/community-wiki-detail-edit-item-view'
	,'views/community_wiki/community-wiki-list-sub-tab-composite-view'
	,'views/community_wiki/community-wiki-list-sup-tab-composite-view'
	,'views/community_wiki/community-wiki-list-type-tab-composite-view'
	,'$.paginate'
	,'$.scrollable'
],function(talent
	,jst
	,BSTab
	,CommunityWikiListCompositeView
	,CommunityWikiDetailItemView
	,CommunityWikiDetailEditItemView
	,CommunityWikiListSubTabCompositeView
	,CommunityWikiListSupTabCompositeView
	,CommunityWikiListTypeCompositeView
) {
	/**
	 * Inner main view class
	 * @class HomeView~MainView
	 * @extends {Backbone.View}
	 */	
	var MainView = talent.Layout.extend(
		/** @lends HomeView~MainView.prototype */
	{
		template: jst['community_wiki/community-component']
		,className: 'community_wiki_page_container'
		,initialize: function() {
			var self = this;
			talent.Context.setPageTitle('CommunityWiki');
			this.pageData = {
				size : 5,
				start : 0
			}
			this.routerData = {
				province_id : -1
				,city_id : -1
				,type_id : -1
			};
		}
		,regions: {
			main: '#community_wiki_list'
			,typeTab : '#community_wiki_list_type_tab'
			,subTab : '#community_wiki_list_sub_tab'
			,supTab : '#community_wiki_list_sup_tab'
			,detail : '#community_wiki_detail_container'
		}
		,ui : {
			detail : '#community_wiki_detail'
			,detail_btn : '#community_wiki_detail_edit_btn_group'
		}
		,onShow: function() {
			var self = this;
			talent.app.vent.off("tab:community_type:change");
			talent.app.vent.on("tab:community_type:change", this.onTabClick, this);
			this.renderByRouter();
			talent.Context.setMainRegionsHeight();
			this.bindScroll();
		}
		,renderByRouter : function(){
			var self = this;
			var queryObject = talent.app.request( 'history:getQueryObject' );
			queryObject.done(function(routerData){
				self.routerData = $.extend({}, self.routerData, routerData);
				self.renderCommunityListTypeTabView();
				self.renderCommunityListSubTabView();
				self.renderCommunityWikiListView();
				// if(routerData.create == "true") {
				// 	self.renderCommunityWikiDetailAdd();
				// }
				// if(routerData.community_id) {
				// 	self.renderCommunityWikiDetailView();
				// }
			})
		}
		,onTabClick : function(node) {
			var routerData = talent.Context.parseUrl(node.attr('href'));
			this.pageData.start = 0;
			if(this.showCommunityWikiDetail) {
				this.closeWikiDetail();
			}
			if(!routerData.type_id) {
				this.routerData = {
					'province_id' : routerData.province_id,
					'city_id' : routerData.city_id,
					'type_id' : this.routerData.type_id
				};
				if(!routerData.city_id) {
					this.renderCommunityListSupTabView();
				}
			} else {
				this.routerData = $.extend(this.routerData, routerData);
			}		
			this.renderCommunityWikiListView();
		}	
		,activeDetailIdChange : function(id) {
			this.routerData.community_id = id;
			var collection = this.communityWikiListCompositeView.collection;
			var model = collection.get(id);
			this.renderCommunityWikiDetailView(model);
		}
		,pageStartChange : function() {
			if(this.showCommunityWikiDetail) {
				this.closeWikiDetail();
			}
			this.renderCommunityWikiListView();
		}
		,joinCommunity : function(id){
			var user_id = talent.Context.getUserInfo().id;
			$.ajax({
				url : 'shetuan/user_entry_st',
				type : 'POST',
				data : {
					st_id : id,
					user_id : user_id
				}
			}).done(function(resp) {
				talent.Context.setAlertTemplate(resp, $('#all_alert')).done(function(){					
					if(resp.code == 200) {
						window.location = '#community_wiki?user_id=' +  user_id;
					}
				});
			})
		}
		,renderCommunityListTypeTabView : function() {
			var self = this;
			var routerData = this.routerData;
			if(routerData.user_id) {
				return;
			} else {
				$.ajax({
					url : 'shetuan/list_all_st_type'
					,type : 'GET'
				}).done(function(resp) {

					var resp = [{value : '-1', text : '全部'}].concat(resp);
					var communityWikiListTypeCompositeView = new CommunityWikiListTypeCompositeView({
						collection : new talent.Collection(resp)
					})
					self.typeTab.show(communityWikiListTypeCompositeView);
					var tab = new BSTab({
						el : communityWikiListTypeCompositeView.$el
						,eventTriggerName : 'community_type'
					})
					tab.setDefault({
						type_id : self.routerData['type_id'] || -1
					})
					self.renderCommunityListSupTabView();
				})
			}
		}
		,renderCommunityListSubTabView : function() {
			var self = this;
			var routerData = this.routerData;
			if(routerData.user_id) {
				var communityWikiListSubTabCompositeView = new CommunityWikiListSubTabCompositeView({
					collection : new talent.Collection([])
				})
				self.subTab.show(communityWikiListSubTabCompositeView);
			} else {
				$.ajax({
					url : 'region/list_all_province'
					,type : 'GET'
				}).done(function(resp) {
					var resp = [{value : '-1', text : '全部'}].concat(resp);
					var communityWikiListSubTabCompositeView = new CommunityWikiListSubTabCompositeView({
						collection : new talent.Collection(resp)
					})
					self.subTab.show(communityWikiListSubTabCompositeView);
					var tab = new BSTab({
						el : communityWikiListSubTabCompositeView.$el
						,eventTriggerName : 'community_type'
					})
					tab.setDefault({
						province_id : self.routerData['province_id'] || -1
					})
					self.renderCommunityListSupTabView();
				})
			}			
		}
		,renderCommunityListSupTabView : function() {
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
					var communityWikiListSupTabCompositeView = new CommunityWikiListSupTabCompositeView({
						collection : new talent.Collection(resp),
						model : new talent.Model({
							province_id : routerData.province_id
						})
					})
					self.$el.find('#community_wiki_list_sup_tab').hide('slow', function(){
						self.supTab.show(communityWikiListSupTabCompositeView);
						self.$el.find('#community_wiki_list_sup_tab').show('slow');
						var tab = new BSTab({
							el : communityWikiListSupTabCompositeView.$el
							,eventTriggerName : 'community_type'
						})
						tab.setDefault({
							city_id : self.routerData['city_id'] || -1
						})
					});				
				})
			} else {
				self.$el.find('#community_wiki_list_sup_tab').hide('slow');
			}
		}
		,renderCommunityWikiListView : function() {
			var self = this;
			this.getListData().done(function(resp) {
				if(self.communityWikiListCompositeView) {
					var total = resp && resp.total || 0;
					if(self.communityWikiListCompositeView.model.get('total') != total){
						self.communityWikiListCompositeView.model.set('total', total);
						self.renderPagination();
					}
					self.communityWikiListCompositeView.collection.reset(resp && resp.res || []);
					return;
				}
				self.communityWikiListCompositeView = new CommunityWikiListCompositeView({
					collection : new talent.Collection( resp && resp.res || [])
					,model : new talent.Model({
						renderMine : self.routerData.user_id ? true : false
						,total : resp && resp.total
					})
				})
				self.main.show(self.communityWikiListCompositeView);
				self.renderPagination(resp && resp.total || 0);
				self.showCommunityWikiList = true;
				self.communityWikiListCompositeView.off('changeId');
				self.communityWikiListCompositeView.on('changeId', self.activeDetailIdChange, self);

				self.communityWikiListCompositeView.off('joinCommunity');
				self.communityWikiListCompositeView.on('joinCommunity', self.joinCommunity, self);
			})
		}
		,renderPagination : function(total) {
			var self = this;
			if(total == 0 || total == '0') {
				this.communityWikiListCompositeView.$el.find('#community_wiki_list_paginate').hide();
				return;
			}
			this.communityWikiListCompositeView.$el.find('#community_wiki_list_paginate').show().pagination(total,{
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
				url = 'shetuan/list_my_st';
				data = {
					user_id : routerData.user_id
				}
			} else {
				var showAllData = true;
				if(this.routerData.province_id && this.routerData.province_id != -1) {
					showAllData = false;
				}
				if(this.routerData.type_id && this.routerData.type_id != -1){
					showAllData = false;
				}
				url = showAllData ?  'shetuan/list_all_st_with_status' : 'shetuan/list_st_by_type_and_region_with_status';
				data = showAllData ? {} : {type_id : routerData.type_id || -1 ,province_id : routerData.province_id || -1, city_id : routerData.city_id || -1};
			}
			data['user_id'] = talent.Context.getUserInfo().id;
			data['size'] = this.pageData.size;
			data['start'] = this.pageData.start;
			$.ajax({
				url : url
				,type : 'POST'
				, data : data 
			}).done(function(resp){
				console.log(resp)
				deferred.resolve(resp);
			})
			return deferred.promise();
		}
		,renderCommunityWikiDetailView : function(model) {
			var self = this;
			var id = this.routerData.community_id;
			var next = function(){
				self.$el.find('#community_wiki_detail').dequeue('slideList')
			}
			var animateList = [
				function(){self.ui.detail.find('.panel-heading').hide();self.detail.close(); self.$el.find('#community_wiki_detail').animate({width : 0}, 500, next);},
				function(){self.ui.detail.find('.panel-heading').show();self.$el.find('#community_wiki_detail').delay(300).animate({width : 600}, 500, next);},
				function(){getData()}
			]

			if(!self.showCommunityWikiDetail) {
				animateList = animateList.slice(1, animateList.length);
			}
			self.$el.find('#community_wiki_detail').queue('slideList', animateList);
			next();
			function getData() {
				$.ajax({
					url : 'shetuan/get_st_allInfo_byId'
					,type : 'POST'
					,data : {
						id : id
					}
				}).done(function(resp) {
					if(resp && resp.st_detail && resp.st_detail[0].leader_id == talent.Context.getUserInfo().id){
						self.ui.detail_btn.show();
					}else {
						self.ui.detail_btn.hide();
					}
					self.communityWikiDetailView = new CommunityWikiDetailItemView({
						model : new talent.Model(resp),
						id : id
					});
					self.detail.show(self.communityWikiDetailView);
					self.bindScroll();
					self.showCommunityWikiDetail = true;
				})			
			}
		}
		,renderCommunityWikiDetailAdd : function() {
			var self = this;
			this.ui.detail.find('.panel-heading').show();
			this.$el.find('#community_wiki_detail').delay(300).animate({width : 600}, 500, function(){
				self.editWikiDetail(true);
			})
		}
		,dealHandler : function(ev) {
			var handler = talent.$(ev.target).attr('data-handler');
			this[handler + 'WikiDetail'] && this[handler + 'WikiDetail']();
		}
		,deleteWikiDetail : function() {
			var self = this;
			var id = this.routerData.community_id;
			$.ajax({
				url : 'shetuan/delete_st'
				,type : 'POST'
				,data : {
					id : id,
					user_id : talent.Context.getUserInfo().id
				}
			}).done(function(resp){
				talent.Context.setAlertTemplate(resp, $('#all_alert')).done(function(){
					if(resp.code == 200) {
						self.closeWikiDetail();
						self.renderCommunityWikiListView();
					}
				});
			})
		}
		,editWikiDetail : function(flag) {
			var self = this;
			var id = this.routerData.community_id;
			var model = flag ? new talent.Model() : this.communityWikiDetailView.model;
			var communityWikiDtailEditView = new CommunityWikiDetailEditItemView({
				model : model,
				status : flag ? 'empty' : 'edit'
			})
			this.detail.show(communityWikiDtailEditView);
			this.bindScroll();
			communityWikiDtailEditView.on('submit', this.onAfterEdit, this);
		}
		,onAfterEdit : function() {
			this.closeWikiDetail();
			this.renderCommunityWikiListView();
		}
		,closeWikiDetail : function() {
			this.detail.close();
			this.ui.detail.find('.panel-heading').hide();
			this.ui.detail.animate({width : 0}, 500, function() {
				self.showCommunityWikiDetail = false;
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

				var height = $(window).height() - headH - 5;
				var container = talent.$('.detail-container');
				container.height(height);
				var scrollHeight = height - container.find('.panel-heading').outerHeight() ;
				container.find('.detail-body').height(scrollHeight);
				container.find('.detail-body').scrollable({
					"setStyle": true
				});
			}
		}
	});


	return MainView;
});
