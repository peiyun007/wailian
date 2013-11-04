define(['talent'
	,'templates/activity'
	,'views/common/bs-tab/bs-tab'
	,'views/activity/activity-list-composite-view'
	,'views/activity/activity-detail-item-view'
	,'views/activity/activity-detail-edit-item-view'
	,'views/activity/activity-list-sub-tab-composite-view'
	,'views/activity/activity-list-sup-tab-composite-view'
	,'views/activity/activity-list-type-tab-composite-view'
	,'$.paginate'
	,'$.scrollable'
],function(talent
	,jst
	,BSTab
	,ActivityListCompositeView
	,ActivityDetailItemView
	,ActivityDetailEditItemView
	,ActivityListSubTabCompositeView
	,ActivityListSupTabCompositeView
	,ActivityListTypeCompositeView
) {
	/**
	 * Inner main view class
	 * @class HomeView~MainView
	 * @extends {Backbone.View}
	 */	
	var MainView = talent.Layout.extend(
		/** @lends HomeView~MainView.prototype */
	{
		template: jst['activity/index-page']
		,className: 'activity_page_container'
		,events : {
			'click  .panel-heading a' : 'dealHandler'
		}
		,initialize: function() {
			var self = this;
			talent.Context.setPageTitle('Activity');
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
			main: '#activity_list'
			,typeTab : '#activity_list_type_tab'
			,subTab : '#activity_list_sub_tab'
			,supTab : '#activity_list_sup_tab'
			,detail : '#activity_detail_container'
		}
		,ui : {
			detail : '#activity_detail'
			,detail_btn : '#activity_detail_edit_btn_group'
		}
		,onShow: function() {
			var self = this;
			talent.app.vent.off("tab:activity_type:change");
			talent.app.vent.on("tab:activity_type:change", this.onTabClick, this);
			this.renderByRouter();
			talent.Context.setMainRegionsHeight();
			this.bindScroll();
		}
		,renderByRouter : function(){
			var self = this;
			var queryObject = talent.app.request( 'history:getQueryObject' );
			queryObject.done(function(routerData){
				self.routerData = $.extend({}, self.routerData, routerData);
				self.renderActivityTypeTabView();
				self.renderActivitySubTabView();
				self.renderActivityListView();
				if(routerData.create == "true") {
					self.renderActivityDetailAdd();
				}
				if(routerData.activity_id) {
					self.renderActivityDetailView();
				}
			})
		}
		,onTabClick : function(node) {
			var routerData = talent.Context.parseUrl(node.attr('href'));
			this.pageData.start = 0;
			if(this.showActivityDetail) {
				this.closeWikiDetail();
			}
			if(!routerData.type_id) {
				this.routerData = {
					'province_id' : routerData.province_id,
					'city_id' : routerData.city_id,
					'type_id' : this.routerData.type_id
				};
				if(!routerData.city_id) {
					this.renderActivitySupTabView();
				}
			} else {
				this.routerData = $.extend(this.routerData, routerData);
			}		
			this.renderActivityListView();
		}	
		,activeDetailIdChange : function(id) {
			this.routerData.activity_id = id;
			var collection = this.activityListCompositeView.collection;
			var model = collection.get(id);
			this.renderActivityDetailView(model);
		}
		,pageStartChange : function() {
			if(this.showActivityDetail) {
				this.closeWikiDetail();
			}
			this.renderActivityListView();
		}
		,applyActivity : function(id){
			this.renderActivityListView();
		}
		,renderActivityTypeTabView : function() {
			var self = this;
			var routerData = this.routerData;
			if(routerData.user_id) {
				return;
			} else {
				$.ajax({
					url : 'stneed/list_all_stneed_type'
					,type : 'GET'
				}).done(function(resp) {
					var resp = [{value : '-1', text : '全部'}].concat(resp);
					var activityListTypeCompositeView = new ActivityListTypeCompositeView({
						collection : new talent.Collection(resp)
					})
					self.typeTab.show(activityListTypeCompositeView);
					var tab = new BSTab({
						el : activityListTypeCompositeView.$el
						,eventTriggerName : 'activity_type'
					})
					tab.setDefault({
						type_id : self.routerData['type_id'] || -1
					})
					self.renderActivitySupTabView();
				})
			}
		}
		,renderActivitySubTabView : function() {
			var self = this;
			var routerData = this.routerData;
			if(routerData.user_id) {
				var activityListSubTabCompositeView = new ActivityListSubTabCompositeView({
					collection : new talent.Collection([])
				})
				self.subTab.show(activityListSubTabCompositeView);
			} else {
				$.ajax({
					url : 'region/list_all_province'
					,type : 'GET'
				}).done(function(resp) {
					var resp = [{value : '-1', text : '全部'}].concat(resp);
					var activityListSubTabCompositeView = new ActivityListSubTabCompositeView({
						collection : new talent.Collection(resp)
					})
					self.subTab.show(activityListSubTabCompositeView);
					var tab = new BSTab({
						el : activityListSubTabCompositeView.$el
						,eventTriggerName : 'activity_type'
					})
					tab.setDefault({
						province_id : self.routerData['province_id'] || -1
					})
					self.renderActivitySupTabView();
				})
			}			
		}
		,renderActivitySupTabView : function() {
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
					var activityListSupTabCompositeView = new ActivityListSupTabCompositeView({
						collection : new talent.Collection(resp),
						model : new talent.Model({
							province_id : routerData.province_id
						})
					})
					self.$el.find('#activity_list_sup_tab').hide('slow', function(){
						self.supTab.show(activityListSupTabCompositeView);
						self.$el.find('#activity_list_sup_tab').show('slow');
						var tab = new BSTab({
							el : activityListSupTabCompositeView.$el
							,eventTriggerName : 'activity_type'
						})
						tab.setDefault({
							city_id : self.routerData['city_id'] || -1
						})
					});				
				})
			} else {
				self.$el.find('#activity_list_sup_tab').hide('slow');
			}
		}
		,renderActivityListView : function() {
			var self = this;
			this.getListData().done(function(resp) {
				if(self.activityListCompositeView) {
					var total = resp && resp.total || 0;
					if(self.activityListCompositeView.model.get('total') != total){
						self.activityListCompositeView.model.set({'total': total});
						self.renderPagination();
					}
					self.activityListCompositeView.collection.reset(resp && resp.res || []);
					return;
				}
				self.activityListCompositeView = new ActivityListCompositeView({
					collection : new talent.Collection( resp && resp.res || [])
					,model : new talent.Model({
						renderMine : self.routerData.user_id ? true : false
						,total : resp && resp.total
					})
				})
				self.main.show(self.activityListCompositeView);
				self.renderPagination(resp && resp.total || 0);
				self.showActivityList = true;
				self.activityListCompositeView.off('changeId');
				self.activityListCompositeView.on('changeId', self.activeDetailIdChange, self);

				self.activityListCompositeView.off('applyActivity');
				self.activityListCompositeView.on('applyActivity', self.applyActivity, self);
			})
		}
		,renderPagination : function(total) {
			var self = this;
			if(total == 0 || total == '0') {
				this.activityListCompositeView.$el.find('#activity_list_paginate').hide();
				return;
			}
			this.activityListCompositeView.$el.find('#activity_list_paginate').show().pagination(total,{
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
			var self = this;
			var deferred = new $.Deferred();
			var routerData = this.routerData;
			var url, type;
			var data = {};
			if(routerData.user_id) {
				url = 'stneed/list_my_stneed';
				data = {
					user_id : routerData.user_id
				}
			} else {
				url = 'stneed/list_st_need_by_type_and_region_with_status';
				data = { type_id: routerData.type_id || -1 ,province_id : routerData.province_id || -1, city_id : routerData.city_id || -1};
			}
			data['user_id'] = talent.Context.getUserInfo().id;
			data['size'] = this.pageData.size;
			data['start'] = this.pageData.start;
			$.ajax({
				url : url
				,type : 'POST'
				, data : data 
			}).done(function(resp){
				if(!routerData.user_id) {
					self.getCommunityData(resp).done(function(result){
						deferred.resolve(result);
					});
				}else {
					deferred.resolve(resp);
				}
			})
			return deferred.promise();
		}
		,getCommunityData : function(resp){
			var resp = resp;
			var deferred = new $.Deferred();
			var user_id = talent.Context.getUserInfo().id;
			$.ajax({
				url : 'stneed/get_addtional_info_of_stneed_list',
				type: 'POST',
				data : {
					user_id : user_id
				}
			}).done(function(res){
				var result = res && res.my_qy_stneeds || [];
				if(resp.res && result) {
					_.map(resp.res, function(value){
						var qy_info = [];
						var data = value;
						for(var i in result) {
							qy_info.push(_.clone(result[i]));
							var index = _.indexOf(result[i].stneed_list.split(","), value.id);
							//2已申请 1申请 0通知其他人申请
							var status = index != -1 ? 2 : 1;
							qy_info[i].status = status;
						}
						data.qy_info = qy_info;
						return data;
					}) 
					console.log(resp)
					deferred.resolve(resp);
				} else {
					deferred.resolve(resp);
				}

			})
			return deferred.promise();
		}
		,renderActivityDetailView : function(model) {
			var self = this;
			var id = this.routerData.activity_id;
			var next = function(){
				self.$el.find('#activity_detail').dequeue('slideList')
			}
			var animateList = [
				function(){self.ui.detail.find('.panel-heading').hide();self.detail.close(); self.$el.find('#activity_detail').animate({width : 0}, 500, next);},
				function(){self.ui.detail.find('.panel-heading').show();self.$el.find('#activity_detail').delay(300).animate({width : 600}, 500, next);},
				function(){getData()}
			]

			if(!self.showActivityDetail) {
				animateList = animateList.slice(1, animateList.length);
			}
			self.$el.find('#activity_detail').queue('slideList', animateList);
			next();
			function getData() {
				$.ajax({
					url : 'stneed/get_stneed_allInfo_byId'
					,type : 'POST'
					,data : {
						id : id
					}
				}).done(function(resp) {
					if(resp && resp.stneed_detail && resp.stneed_detail[0].publisher_id == talent.Context.getUserInfo().id){
						self.ui.detail_btn.show();
					}else {
						self.ui.detail_btn.hide();
					}
					
					self.activityDetailView = new ActivityDetailItemView({
						model : new talent.Model(resp),
						id : id
					});
					self.detail.show(self.activityDetailView);
					self.bindScroll();
					self.showActivityDetail = true;
				})			
			}
		}
		,renderActivityDetailAdd : function() {
			var self = this;
			this.ui.detail.find('.panel-heading').show();
			this.$el.find('#activity_detail').delay(300).animate({width : 600}, 500, function(){
				self.editWikiDetail(true);
			})
		}
		,dealHandler : function(ev) {
			var handler = talent.$(ev.target).attr('data-handler');
			this[handler + 'WikiDetail'] && this[handler + 'WikiDetail']();
		}
		,deleteWikiDetail : function() {
			var self = this;
			var id = this.routerData.activity_id;
			$.ajax({
				url : ' stneed/delete_stneed'
				,type : 'POST'
				,data : {
					id : id,
					st_id : this.activityDetailView.model.get('stneed_detail')[0].st_id,
					user_id : talent.Context.getUserInfo().id
				}
			}).done(function(resp){
				talent.Context.setAlertTemplate(resp, $('#all_alert')).done(function(){
					if(resp.code == 200) {
						self.closeWikiDetail();
						self.renderActivityListView();
					}
				});
			})
		}
		,editWikiDetail : function(flag) {
			var self = this;
			var id = this.routerData.activity_id;
			var model = flag ? new talent.Model() : this.activityDetailView.model;
			console.log(this.activityDetailView.model.toJSON())
			var activityDtailEditView = new ActivityDetailEditItemView({
				model : model,
				status : flag ? 'empty' : 'edit'
			})
			this.detail.show(activityDtailEditView);
			this.bindScroll();
			activityDtailEditView.on('submit', this.onAfterEdit, this);
		}
		,onAfterEdit : function() {
			this.closeWikiDetail();
			this.renderActivityListView();
		}
		,closeWikiDetail : function() {
			this.detail.close();
			this.ui.detail.find('.panel-heading').hide();
			this.ui.detail.animate({width : 0}, 500, function() {
				self.showActivityDetail = false;
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


	return talent.BasePageView.extend({
		mainViewClass : MainView
	});
});
