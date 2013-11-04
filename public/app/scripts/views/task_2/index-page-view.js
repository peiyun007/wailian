define(['talent'
	,'templates/task'
	,'views/common/bs-tab/bs-tab'
	,'views/task/task-list-composite-view'
	,'views/task/task-detail-item-view'
	,'views/task/task-detail-edit-item-view'
	,'views/task/task-list-sub-tab-composite-view'
	,'views/task/task-list-sup-tab-composite-view'
	,'views/task/task-list-type-tab-composite-view'
	,'$.paginate'
	,'$.scrollable'
],function(talent
	,jst
	,BSTab
	,TaskListCompositeView
	,TaskDetailItemView
	,TaskDetailEditItemView
	,TaskListSubTabCompositeView
	,TaskListSupTabCompositeView
	,TaskListTypeCompositeView
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
		,events : {
			'click  .panel-heading a' : 'dealHandler'
		}
		,initialize: function() {
			var self = this;
			talent.Context.setPageTitle('Task');
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
			main: '#task_list'
			,typeTab : '#task_list_type_tab'
			,subTab : '#task_list_sub_tab'
			,supTab : '#task_list_sup_tab'
			,detail : '#task_detail_container'
		}
		,ui : {
			detail : '#task_detail'
			,detail_btn : '#task_detail_edit_btn_group'
		}
		,onShow: function() {
			var self = this;
			talent.app.vent.off("tab:task_type:change");
			talent.app.vent.on("tab:task_type:change", this.onTabClick, this);
			this.renderByRouter();
			talent.Context.setMainRegionsHeight();
			this.bindScroll();
			this.ui.detail_btn.hide();
		}
		,renderByRouter : function(){
			var self = this;
			var queryObject = talent.app.request( 'history:getQueryObject' );
			queryObject.done(function(routerData){
				self.routerData = $.extend({}, self.routerData, routerData);
				self.renderTaskTypeTabView();
				self.renderTaskSubTabView();
				self.renderTaskListView();
				if(routerData.create == "true") {
					self.renderTaskDetailAdd();
				}
				if(routerData.task_id) {
					self.renderTaskDetailView();
				}
			})
		}
		,onTabClick : function(node) {
			var routerData = talent.Context.parseUrl(node.attr('href'));
			this.pageData.start = 0;
			if(this.showTaskDetail) {
				this.closeWikiDetail();
			}
			if(!routerData.type_id) {
				this.routerData = {
					'province_id' : routerData.province_id,
					'city_id' : routerData.city_id,
					'type_id' : this.routerData.type_id
				};
				if(!routerData.city_id) {
					this.renderTaskSupTabView();
				}
			} else {
				this.routerData = $.extend(this.routerData, routerData);
			}		
			this.renderTaskListView();
		}	
		,activeDetailIdChange : function(id) {
			this.routerData.task_id = id;
			var collection = this.taskListCompositeView.collection;
			var model = collection.get(id);
			this.renderTaskDetailView(model);
		}
		,pageStartChange : function() {
			if(this.showTaskDetail) {
				this.closeWikiDetail();
			}
			this.renderTaskListView();
		}
		,applyTask : function(id){
			var self = this;
			$.ajax({
				url : 'qyneed/user_apply_qyneed',
				type : 'POST',
				data : {
					qyneed_id : id,
					user_id : talent.Context.getUserInfo().id
				}
			}).done(function(resp){
				self.renderTaskListView();
			})
		}
		,renderTaskTypeTabView : function() {
			var self = this;
			var routerData = this.routerData;
			if(routerData.user_id) {
				return;
			} else {
				$.ajax({
					url : 'qyneed/list_all_qyneed_type'
					,type : 'GET'
				}).done(function(resp) {
					var resp = [{value : '-1', text : '全部'}].concat(resp);
					var taskListTypeCompositeView = new TaskListTypeCompositeView({
						collection : new talent.Collection(resp)
					})
					self.typeTab.show(taskListTypeCompositeView);
					var tab = new BSTab({
						el : taskListTypeCompositeView.$el
						,eventTriggerName : 'task_type'
					})
					tab.setDefault({
						type_id : self.routerData['type_id'] || -1
					})
					self.renderTaskSupTabView();
				})
			}
		}
		,renderTaskSubTabView : function() {
			var self = this;
			var routerData = this.routerData;
			if(routerData.user_id) {
				var taskListSubTabCompositeView = new TaskListSubTabCompositeView({
					collection : new talent.Collection([])
				})
				self.subTab.show(taskListSubTabCompositeView);
			} else {
				$.ajax({
					url : 'region/list_all_province'
					,type : 'GET'
				}).done(function(resp) {
					var resp = [{value : '-1', text : '全部'}].concat(resp);
					var taskListSubTabCompositeView = new TaskListSubTabCompositeView({
						collection : new talent.Collection(resp)
					})
					self.subTab.show(taskListSubTabCompositeView);
					var tab = new BSTab({
						el : taskListSubTabCompositeView.$el
						,eventTriggerName : 'task_type'
					})
					tab.setDefault({
						province_id : self.routerData['province_id'] || -1
					})
					self.renderTaskSupTabView();
				})
			}			
		}
		,renderTaskSupTabView : function() {
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
					var taskListSupTabCompositeView = new TaskListSupTabCompositeView({
						collection : new talent.Collection(resp),
						model : new talent.Model({
							province_id : routerData.province_id
						})
					})
					self.$el.find('#task_list_sup_tab').hide('slow', function(){
						self.supTab.show(taskListSupTabCompositeView);
						self.$el.find('#task_list_sup_tab').show('slow');
						var tab = new BSTab({
							el : taskListSupTabCompositeView.$el
							,eventTriggerName : 'task_type'
						})
						tab.setDefault({
							city_id : self.routerData['city_id'] || -1
						})
					});				
				})
			} else {
				self.$el.find('#task_list_sup_tab').hide('slow');
			}
		}
		,renderTaskListView : function() {
			var self = this;
			this.getListData().done(function(resp) {
				if(self.taskListCompositeView) {
					var total = resp && resp.total || 0;
					if(self.taskListCompositeView.model.get('total') != total){
						self.taskListCompositeView.model.set({'total': total});
						self.renderPagination();
					}
					self.taskListCompositeView.collection.reset(resp && resp.res || []);
					return;
				}
				self.taskListCompositeView = new TaskListCompositeView({
					collection : new talent.Collection( resp && resp.res || [])
					,model : new talent.Model({
						renderMine : self.routerData.user_id ? true : false
						,total : resp && resp.total
					})
				})
				self.main.show(self.taskListCompositeView);
				self.renderPagination(resp && resp.total || 0);
				self.showTaskList = true;
				self.taskListCompositeView.off('changeId');
				self.taskListCompositeView.on('changeId', self.activeDetailIdChange, self);

				self.taskListCompositeView.off('applyTask');
				self.taskListCompositeView.on('applyTask', self.applyTask, self);
			})
		}
		,renderPagination : function(total) {
			var self = this;
			if(total == 0 || total == '0') {
				this.taskListCompositeView.$el.find('#task_list_paginate').hide();
				return;
			}
			this.taskListCompositeView.$el.find('#task_list_paginate').show().pagination(total,{
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
				url = 'qyneed/list_my_qyneed';
				data = {
					user_id : routerData.user_id
				}
			} else {
				url = 'qyneed/list_qyneed_by_type_and_region_with_status';
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
				url : 'qyneed/get_addtional_info_of_qyneed_list',
				type: 'POST',
				data : {
					user_id : user_id
				}
			}).done(function(result){
				var community_application = result && result.my_st_qyneeds || [];
				var own_application = result && result.my_own_qyneeds || [];
				if(resp.res && community_application) {
					_.map(resp.res, function(value){
						var st_info = [];
						var own_info = [];
						var data = value;
						for(var i in community_application) {
							st_info.push(_.clone(community_application[i]));
							var index = _.indexOf(community_application[i].qyneed_list.split(","), value.id);
							//2已申请 1申请 0通知其他人申请
							var status = index != -1 ? 2 : (user_id == community_application[i].leader_id ? 1 : 0);
							st_info[i].status = status;
						}
						var own_info = _.where(own_application, {'qyact_id' : value.id})[0];
						data.own_info = own_info && own_info.status || '-1';
						data.st_info = st_info;
						return data;
					}) 

					deferred.resolve(resp);
				} else {
					deferred.resolve(resp);
				}

			})
			return deferred.promise();
		}
		,renderTaskDetailView : function(model) {
			var self = this;
			var id = this.routerData.task_id;
			var next = function(){
				self.$el.find('#task_detail').dequeue('slideList')
			}
			var animateList = [
				function(){self.ui.detail.find('.panel-heading').hide();self.detail.close(); self.$el.find('#task_detail').animate({width : 0}, 500, next);},
				function(){self.ui.detail.find('.panel-heading').show();self.$el.find('#task_detail').delay(300).animate({width : 600}, 500, next);},
				function(){getData()}
			]

			if(!self.showTaskDetail) {
				animateList = animateList.slice(1, animateList.length);
			}
			self.$el.find('#task_detail').queue('slideList', animateList);
			next();
			function getData() {
				$.ajax({
					url : 'qyneed/get_qyneed_allInfo_byId'
					,type : 'POST'
					,data : {
						id : id
					}
				}).done(function(resp) {
					if(resp && resp.qyneed_detail && resp.qyneed_detail[0].publisher_id == talent.Context.getUserInfo().id){
						self.ui.detail_btn.show();
					}else {
						self.ui.detail_btn.hide();
					}
					self.taskDetailView = new TaskDetailItemView({
						model : new talent.Model(resp),
						id : id
					});
					self.detail.show(self.taskDetailView);
					self.bindScroll();
					self.showTaskDetail = true;
				})			
			}
		}
		,renderTaskDetailAdd : function() {
			var self = this;
			this.ui.detail.find('.panel-heading').show();
			this.$el.find('#task_detail').delay(300).animate({width : 600}, 500, function(){
				self.editWikiDetail(true);
			})
		}
		,dealHandler : function(ev) {
			var handler = talent.$(ev.target).attr('data-handler');
			this[handler + 'WikiDetail'] && this[handler + 'WikiDetail']();
		}
		,deleteWikiDetail : function() {
			var self = this;
			var id = this.routerData.task_id;
			$.ajax({
				url : ' qyneed/delete_qyneed'
				,type : 'POST'
				,data : {
					id : id,
					user_id : talent.Context.getUserInfo().id
				}
			}).done(function(resp){
				talent.Context.setAlertTemplate(resp, $('#all_alert')).done(function(){
					if(resp.code == 200) {
						self.closeWikiDetail();
						self.renderTaskListView();
					}
				});
			})
		}
		,editWikiDetail : function(flag) {
			var self = this;
			var id = this.routerData.task_id;
			var model = flag ? new talent.Model() : this.taskDetailView.model;
			var taskDtailEditView = new TaskDetailEditItemView({
				model : model,
				status : flag ? 'empty' : 'edit'
			})
			this.detail.show(taskDtailEditView);
			this.bindScroll();
			taskDtailEditView.on('submit', this.onAfterEdit, this);
		}
		,onAfterEdit : function() {
			this.closeWikiDetail();
			this.renderTaskListView();
		}
		,closeWikiDetail : function() {
			this.detail.close();
			this.ui.detail.find('.panel-heading').hide();
			this.ui.detail.animate({width : 0}, 500, function() {
				self.showTaskDetail = false;
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
