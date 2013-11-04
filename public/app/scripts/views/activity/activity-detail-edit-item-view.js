define(['talent'
	,'templates/activity'
	,'$.validate'
	,'formBuilder'
],function(talent
	,jst
) {
	return talent.ItemView.extend({
		template : jst['activity/activity-detail-edit']
		,tagName : 'ul'
		,className : 'panel-body'
		,events : {
			'click a' : 'onHandler'
		}
		,initialize : function(options) {
			var self = this;
			this.options = options || {};
			this.templateHelpers = options;
			this.deleteUserList = [];
			this.addUserList = [];
			this.rejectUserList = [];
		}
		,dealData : function() {
			var self = this;
			var deferred = new $.Deferred();
			var detail = this.model.get('stneed_detail') &&  this.model.get('stneed_detail')[0] || {};
			this.detail = detail;
			$.ajax({
				url : 'shetuan/list_all_my_st',
				type : 'POST',
				data : {
					user_id : talent.Context.getUserInfo().id
				}
			}).done(function(resp){
				self.formBuilderData = {
					title : '',
					status : self.options.status || 'empty',
					captionLength : null,
					schema : [
						{
							'name' : 'title',
							'formCaption' : '需求名称',
							'type' : 'Text', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
							'defaultValue' : detail['title'] || '',
							'tips' : '', //Show after UI
							'validate' : { //rules base jQuery Validate
								'rules' : {required: true, minlength: 2},
								'messages' : { 
									'required' : '必填',
									'minlength' : '至少为两个字'
								}
							},
							'placeholder' : '需求名称' //placeholder for input,
						},{
							'name' : 'type_id',
							'formCaption' : '社团种类',
							'type' : 'Select', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
							'defaultValue' : detail['stneed_type'],
							'dataSource' : {url : 'stneed/list_all_stneed_type'},
							'tips' : '', //Show after UI
							'placeholder' : '' //placeholder for input,
						},{
							'name' : 'st_id',
							'formCaption' : '我的社团',
							'type' : 'Select', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
							'defaultValue' : detail['st_id'],
							'dataSource' : resp || [],
							'tips' : '', //Show after UI
							'placeholder' : '' //placeholder for input,
						},{
							'name' : 'money',
							'formCaption' : '悬赏金额',
							'type' : 'Text', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
							'defaultValue' : detail['money'] || '',
							'tips' : '', //Show after UI
							'validate' : { //rules base jQuery Validate
								'rules' : {required: true, minlength: 2},
								'messages' : { 
									'required' : '必填',
									'minlength' : '至少为两个字'
								}
							},
							'placeholder' : '企业名称' //placeholder for input,
						},{
							'name' : 'region',
							'formCaption' : '活动所在地',
							'type' : 'NestedSelect', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
							'defaultValue' : [detail['province_id'] || '', detail['city_id'] || ''],
							'dataSource' : {url : 'region/list_all_province'},
							'selectOrder' : [{caption : '', name : 'province_id', firstValue: '--省--'},{caption : '', name : 'city_id', dataSource : {url : 'region/list_all_city'}, firstValue: '--市--'}],
							'tips' : '', //Show after UI
							'placeholder' : '' //placeholder for input,
						},{
							'name' : 'description',
							'formCaption' : '活动描述',
							'type' : 'Textarea', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
							'defaultValue' : detail['description'] || '',
							'tips' : '', //Show after UI
							'validate' : { //rules base jQuery Validate
								'rules' : {maxlength: 200},
								'messages' : {
									'maxlength' : '至多两百字'
								}
							},
							'placeholder' : '活动描述' //placeholder for input,
						}
					]
				}
				if(self.options.status == 'edit') {
					self.formBuilderData.schema.push({
							'name' : 'id',
							'formCaption' : '',
							'type' : 'Hidden', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
							'defaultValue' : detail['id'],
							'tips' : '', //Show after UI
							'placeholder' : '' //placeholder for input,
					})
				}
				deferred.resolve();
			})		
			return deferred.promise();	
		}
		,onShow : function() {
			this.renderEdit();
			this.trigger('showAll');
		}
		,renderEdit : function() {
			var self = this;
			this.dealData().done(function() {
				self.$el.find('#activity_form_container').empty().formBuilder(self.formBuilderData);
			})
		}
		,onHandler : function(ev) {
			var handler = talent.$(ev.target).attr('data-handler');
			this[handler + 'Operate'] && this[handler + 'Operate'](ev);
		}
		,cancelOperate : function() {
			this.renderEdit();
		}
		,submitOperate : function() {
			var self = this;
			var index = 0;
			var flag = true;
			var msg = '';
			this.sendAddData().done(function(resp) {
				callback(resp);
			});
			this.sendRejectData().done(function(resp) {
				callback(resp);
			});
			this.sendDeleteData().done(function(resp) {
				callback(resp);
			});
			this.sendUpdateData().done(function(resp) {
				callback(resp);
			});
			function callback(resp) {
				if(resp.code != 200) {
					msg += resp.msg;
					flag = false;
				}
				if(index < 3) {
					index ++;
					return;
				} else {
					if(flag == true) {
						msg = '操作成功';
					}
					talent.Context.setAlertTemplate({code:200, msg : msg}, $('#all_alert')).done(function(){					
						if(flag) {
							self.trigger('submit');
						}
					});
				}
			}

		}
		,deleteOperate : function(ev) {
			var node = talent.$(ev.target).parents('tr');
			var id = node.attr('data-id');
			this.deleteUserList.push(id);
			node.remove();
		}
		,allowOperate : function(ev) {
			var node = talent.$(ev.target).parents('tr');
			var id = node.attr('data-id');
			this.addUserList.push(id);
			node.remove();
		}
		,rejectOperate : function(ev) {
			var node = talent.$(ev.target).parents('tr');
			var id = node.attr('data-id');
			this.rejectUserList.push(id);
			node.remove();
		}
		,sendUpdateData : function() {
			var self = this;
			var deferred = new $.Deferred();
			var getData = this.$el.find('#activity_form_container').formBuilder('getData');
			var url = (this.options.status == 'empty') ? 'stneed/update_stneed' : 'stneed/update_stneed';
			getData.done(function(resp) {
				if(resp.region) {
					resp.province_id = resp.region[0];
					resp.city_id = resp.region[1] || '';
				}
				resp.description = resp.description ? resp.description : '';
				resp['user_id'] = talent.Context.getUserInfo().id;
				$.ajax({
					url : url,
					type : 'POST',
					data : resp
				}).done(function(result){
					deferred.resolve(result);
				})
			})
			return deferred.promise();
		}
		,sendDeleteData : function() {
			var deferred = new $.Deferred();
			if(this.deleteUserList.length > 0) {
				$.ajax({
					type : 'POST',
					url : 'shetuan/delete_user_from_st',
					data : {
						user_id : talent.Context.getUserInfo().id,
						st_id : this.modle.get('st_detail') && this.modle.get('st_detail')[0].st_id,
						ids_str : this.deleteUserList.join(",")
					}
				}).done(function(result){
					deferred.resolve(result);
				})
			}else {
				deferred.resolve({
					code : 200
				});
			}
			return deferred.promise();
		}
		,sendRejectData : function() {
			var deferred = new $.Deferred();
			if(this.rejectUserList.length > 0) {
				$.ajax({
					type : 'POST',
					url : 'stneed/refuse_qy_from_stneed',
					data : {
						user_id : talent.Context.getUserInfo().id,
						st_id : this.detail['st_id'],
						stneed_id : this.detail['id'],
						ids_str : this.rejectUserList.join(",")
					}
				}).done(function(result){
					deferred.resolve(result);
				})
			}else {
				deferred.resolve({
					code : 200
				});
			}
			return deferred.promise();
		}
		,sendAddData : function() {
			var deferred = new $.Deferred();
			console.log(this.addUserList)
			if(this.addUserList.length > 0) {
				$.ajax({
					type : 'POST',
					url : 'stneed/approve_qy_to_stneed',
					data : {
						user_id : talent.Context.getUserInfo().id,
						st_id : this.detail['st_id'],
						stneed_id : this.detail['id'],
						ids_str : this.addUserList.join(",")
					}
				}).done(function(result){
					deferred.resolve(result);
				})
			}else {
				deferred.resolve({
					code : 200
				});
			}
			return deferred.promise();
		}
	})
})