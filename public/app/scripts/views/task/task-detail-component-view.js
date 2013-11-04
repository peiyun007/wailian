define(['talent'
	,'templates/task'	
	,'views/task/task-detail-item-view'
	,'views/task/task-detail-edit-item-view'
	,'views/task/task-detail-applicator-single-item-view'
	,'views/task/task-detail-applicator-community-item-view'
	,'views/task/task-detail-comment-item-view'
	,'views/common/bs-tab/bs-tab'
],function(talent
	,jst
	,TaskDetailItemView
	,TaskDetailEditItemView
	,TaskDetailApplicatorSingleItemView
	,TaskDetailApplicatorCommunityItemView
	,TaskDetailCommentItemView
	,BSTab
) {

	return talent.Layout.extend({
		template : jst['task/task-detail-component']
		,regions : {
			main: '#task_detail_container'
		}
		,initialize : function(options) {
			this.routerData = {
				detail_type : 'Info'
			};
			this.routerData = $.extend({}, this.routerData, options.routerData);
		}
		,templateHelpers : function(){
 			return {
 				routerData : this.routerData
 			}
		}
		,onRender : function() {
			this.renderByRoute();
		}
		,onShow : function(){
			talent.app.vent.off("tab:task_type:change");
			talent.app.vent.on("tab:task_type:change", this.onTabClick, this);
		}
		,renderByRoute : function() {
			var routerData = this.routerData;
			var id = routerData.task_id;
			var self = this;
			if(id) {
				this.makeRequest('qyneed/get_qyneed_allInfo_byId', {
					id : id
				}).done(function(resp){
					routerData.qy_id = resp.qyneed_detail[0].qy_id;
					routerData.user_id = talent.Context.getUserInfo().id;
					if(talent.Context.getUserInfo().id == parseInt(resp.qyneed_detail[0].publisher_id)) {
						routerData.edit = true;
					}
					self['renderDetail' + routerData.detail_type + 'ItemView'](resp);
				});
				var tab = new BSTab({
					el : this.$el.find('#task_detail_tab')
					,eventTriggerName : 'task_type'
				})
				tab.setDefault({
					detail_type : self.routerData['detail_type']
				})
			} else {
				var taskDetailEditItemView = new TaskDetailEditItemView({
					model : new talent.Model(),
					routerData : this.routerData
				});
				self.main.show(taskDetailEditItemView);
				taskDetailEditItemView.on('cancel',function() {
					window.location.hash = '#task'
				})
				taskDetailEditItemView.on('update',function(resp) {
					talent.Context.setAlertTemplate(resp, $('#all_alert')).done(function(){	
						if(resp.code == 200) {
							window.location.hash = '#task?organize_type=' +self.routerData.organize_type + '&user_id=' + talent.Context.getUserInfo().id;			
						}else {
							return;
						}		
					});
				})
			}
		}
		,onTabClick : function(node){
			var routerData = talent.Context.parseUrl(node.attr('href'));
			this.routerData = $.extend({}, this.routerData, routerData);
			this['renderDetail' + routerData.detail_type + 'ItemView']();
		}
		,renderDetailInfoItemView : function() {
			var self = this;
			var id = this.routerData.task_id;		
			this.makeRequest('qyneed/get_qyneed_allInfo_byId', {
				id : id
			}).done(function(resp) {
				console.log(resp)
				self.taskDetailView = new TaskDetailItemView({
					model : new talent.Model(resp),
					routerData : self.routerData
				});
				self.main.show(self.taskDetailView);
				self.bindEvents(self.taskDetailView);
			})
		}
		,renderDetailCommentItemView : function() {
			var self = this;
			var id = this.routerData.task_id;
			this.makeRequest('comment/list_comments_by_qyneed_id', {
				qyneed_id : id,
			}).done(function(resp) {
				console.log(resp)
				self.taskDetailCommentItemView = new TaskDetailCommentItemView({
					model : new talent.Model({
						data : resp
					}),
					routerData : self.routerData
				});
				self.main.show(self.taskDetailCommentItemView);
				self.bindEvents(self.taskDetailCommentItemView);
			})
		}
		,renderDetailApplicatorSingleItemView : function() {
			var self = this;
			var id = this.routerData.task_id;	
			this.makeRequest('qyneed/get_qyneed_allInfo_byId', {
				id : id
			}).done(function(resp) {
				self.taskDetailApplicatorSingleItemView = new TaskDetailApplicatorSingleItemView({
					model : new talent.Model(resp),
					routerData : self.routerData
				});
				self.main.show(self.taskDetailApplicatorSingleItemView);
				self.bindEvents(self.taskDetailApplicatorSingleItemView);
			})
		}
		,renderDetailApplicatorCommunityItemView : function() {
			var self = this;
			var id = this.routerData.task_id;			
			this.makeRequest('qyneed/get_qyneed_allInfo_byId', {
				id : id
			}).done(function(resp) {
				self.taskDetailApplicatorCommunityItemView = new TaskDetailApplicatorCommunityItemView({
					model : new talent.Model(resp),
					routerData : self.routerData
				});
				self.main.show(self.taskDetailApplicatorCommunityItemView);
				self.bindEvents(self.taskDetailApplicatorCommunityItemView);
			})
		}
		,makeRequest : function(url, data) {
			var deferred = new $.Deferred();
			$.ajax({
				url : url,
				data : data,
				type : 'POST'
			}).done(function(resp){
				deferred.resolve(resp);
			})
			return deferred.promise();
		}
		,bindEvents : function(view) {
			var self = this;
			view.on('update', function(msg){
				talent.Context.setAlertTemplate(msg, $('#all_alert')).done(function(){				
					self.renderByRoute();
				});
			})
		}

	})

})