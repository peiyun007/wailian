define(['talent'
	,'templates/task'
	,'views/common/bs-tab/bs-tab'
	,'views/task/task-list-sub-tab-composite-view'
	,'views/task/task-list-sup-tab-composite-view'
	,'views/task/task-list-type-tab-composite-view'
	,'views/task/task-list-composite-view'
	,'$.paginate'
],function(talent
	,jst
	,BSTab
	,TaskListSubTabCompositeView
	,TaskListSupTabCompositeView
	,TaskListTypeCompositeView
	,TaskListCompositeView
) {

	return talent.Layout.extend({
		template : jst['task/task-list-component']
		,regions : {
			main: '#task_list'
			,typeTab : '#task_list_type_tab'
			,subTab : '#task_list_sub_tab'
			,supTab : '#task_list_sup_tab'
		}
		,initialize : function(options) {
			this.routerData = {
				province_id : -1
				,city_id : -1
				,type_id : -1
			};
			this.routerData = $.extend({}, this.routerData, options.routerData);
			this.pageData = {
				size : 5,
				start : 0
			}
		}
		,onRender : function() {
			this.renderTaskListTypeTabView();
			this.renderTaskListSupTabView();
			this.renderTaskListSubTabView();
			this.renderTaskListView();
		}
		,onShow : function(){
			talent.app.vent.off("tab:task_type:change");
			talent.app.vent.on("tab:task_type:change", this.onTabClick, this);
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
					this.renderTaskListSupTabView();
				}
			} else {
				this.routerData = $.extend(this.routerData, routerData);
			}		
			this.renderTaskListView();
		}
		,renderTaskListTypeTabView : function() {
			var self = this;
			var routerData = this.routerData;
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
					el :taskListTypeCompositeView.$el
					,eventTriggerName : 'community_type'
				})
				tab.setDefault({
					type_id : self.routerData['type_id'] || -1
				})
				self.renderTaskListSupTabView();
			})
		}
		,renderTaskListSubTabView : function() {
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
						el :taskListSubTabCompositeView.$el
						,eventTriggerName : 'task_type'
					})
					tab.setDefault({
						province_id : self.routerData['province_id'] || -1
					})
					self.renderTaskListSupTabView();
				})
			}			
		}
		,renderTaskListSupTabView : function() {
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
							el :taskListSupTabCompositeView.$el
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
						self.taskListCompositeView.model.set('total', total);
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

				self.taskListCompositeView.off('joinTask');
				self.taskListCompositeView.on('joinTask', self.joinTask, self);
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
				self.getCommunityData(resp).done(function(result){
					deferred.resolve(result);
				});
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
		,pageStartChange : function() {
			if(this.showTaskDetail) {
				this.closeWikiDetail();
			}
			this.renderTaskListView();
		}
	})

})