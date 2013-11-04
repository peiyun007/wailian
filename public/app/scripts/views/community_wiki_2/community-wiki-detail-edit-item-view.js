define(['talent'
	,'templates/community_wiki'
	,'$.validate'
	,'formBuilder'
],function(talent
	,jst
) {
	return talent.ItemView.extend({
		template : jst['community_wiki/community-wiki-detail-edit']
		,tagName : 'ul'
		,className : 'panel-body'
		,events : {
			'click a' : 'onHandler'
		}
		,initialize : function(options) {
			var self = this;
			this.options = options || {};
			this.templateHelpers = options;
			this.dealData();
			this.deleteUserList = [];
			this.addUserList = [];
			this.rejectUserList = [];
		}
		,dealData : function() {
			var self = this;
			var detail = this.model.get('st_detail') &&  this.model.get('st_detail')[0] || {};
			this.formBuilderData = {
				title : '',
				status : self.options.status || 'empty',
				captionLength : null,
				schema : [
					{
						'name' : 'name',
						'formCaption' : '社团名称',
						'type' : 'Text', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
						'defaultValue' : detail['st_name'] || '',
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
						'name' : 'type_id',
						'formCaption' : '社团种类',
						'type' : 'Select', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
						'defaultValue' : detail['type_id'],
						'dataSource' : {url : 'shetuan/list_all_st_type'},
						'tips' : '', //Show after UI
						'placeholder' : '' //placeholder for input,
					},{
						'name' : 'region',
						'formCaption' : '社团所在地',
						'type' : 'NestedSelect', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
						'defaultValue' : [detail['province_id'] || '', detail['city_id'] || ''],
						'dataSource' : {url : 'region/list_all_province'},
						'selectOrder' : [{caption : '', name : 'province_id', firstValue: '--省--'},{caption : '', name : 'city_id', dataSource : {url : 'region/list_all_city'}, firstValue: '--市--'}],
						'tips' : '', //Show after UI
						'placeholder' : '' //placeholder for input,
					},{
						'name' : 'description',
						'formCaption' : '社团描述',
						'type' : 'Textarea', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
						'defaultValue' : detail['description'] || '',
						'tips' : '', //Show after UI
						'validate' : { //rules base jQuery Validate
							'rules' : {maxlength: 200},
							'messages' : {
								'maxlength' : '至多两百字'
							}
						},
						'placeholder' : '企业名称' //placeholder for input,
					}
				]
			}
			if(this.options.status == 'edit') {
				this.formBuilderData.schema.push({
						'name' : 'id',
						'formCaption' : '',
						'type' : 'Hidden', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
						'defaultValue' : detail['id'],
						'tips' : '', //Show after UI
						'placeholder' : '' //placeholder for input,
				})
			}
		}
		,onRender : function() {

		}
		,onShow : function() {
			this.renderEdit();
			this.trigger('showAll');
		}
		,renderEdit : function() {
			this.$el.find('#community_form_container').empty().formBuilder(this.formBuilderData);
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
					talent.Context.setAlertTemplate({code : 200, msg : msg}, $('#all_alert')).done(function(){					
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
			var getData = this.$el.find('#community_form_container').formBuilder('getData');
			var url = (this.options.status == 'empty') ? 'shetuan/add_st' : 'shetuan/update_st';
			getData.done(function(resp) {
				if(resp.region) {
					resp.province_id = resp.region[0];
					resp.city_id = resp.region[1] || '';
				}
				resp['user_id'] = talent.Context.getUserInfo().id;
				$.ajax({
					url : url,
					type : 'POST',
					data : resp
				}).done(function(result){
					
				})
			})
		}
		,sendDeleteData : function() {
			var deferred = new $.Deferred();
			if(this.deleteUserList.length > 0) {
				$.ajax({
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
			return deferred.promise;
		}
		,sendRejectData : function() {
			var deferred = new $.Deferred();
			if(this.rejectUserList.length > 0) {
				$.ajax({
					url : 'shetuan/delete_user_req_to_st',
					data : {
						user_id : talent.Context.getUserInfo().id,
						st_id : this.modle.get('st_detail') && this.modle.get('st_detail')[0].st_id,
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
			return deferred.promise;
		}
		,sendAddData : function() {
			var deferred = new $.Deferred();
			if(this.addUserList.length > 0) {
				$.ajax({
					url : 'shetuan/add_user_to_st',
					data : {
						user_id : talent.Context.getUserInfo().id,
						st_id : this.modle.get('st_detail') && this.modle.get('st_detail')[0].st_id,
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
			return deferred.promise;
		}
	})
})