define(['talent'
	,'templates/task'
	,'$.validate'
	,'formBuilder'
],function(talent
	,jst
) {
	return talent.ItemView.extend({
		template : jst['task/task-detail-edit']
		,tagName : 'ul'
		,className : 'panel-body'
		,events : {
			'click a' : 'onHandler'
		}
		,initialize : function(options) {
			var self = this;
			var options = options || {};
			this.options = options || {};

			this.routerData = options.routerData;
			this.status = this.routerData.task_id ? 'edit' : 'empty';
			this.dealData();

			this.templateHelpers = options;
		}
		,dealData : function() {
			var self = this;
			var deferred = new $.Deferred();
			var detail = this.model.get('qyneed_detail') &&  this.model.get('qyneed_detail')[0] || {};
			
			this.detail = detail;
			$.ajax({
				url : 'qiye/list_all_my_qy',
				type : 'POST',
				data : {
					user_id : talent.Context.getUserInfo().id
				}
			}).done(function(resp){
				console.log(detail)
				self.formBuilderData = {
					title : '',
					status : self.status || 'empty',
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
							'formCaption' : '需求种类',
							'type' : 'Select', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
							'defaultValue' : detail['qyneed_type'],
							'dataSource' : {url : 'qyneed/list_all_qyneed_type'},
							'tips' : '', //Show after UI
							'placeholder' : '' //placeholder for input,
						},{
							'name' : 'qy_id',
							'formCaption' : '我的企业',
							'type' : 'Select', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
							'defaultValue' : detail['qy_id'],
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
				if(self.status == 'edit') {
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
		,onRender : function() {
			this.renderEdit();
		}
		,renderEdit : function() {
			var self = this;
			this.dealData().done(function() {
				self.$el.find('#task_form_container').empty().formBuilder(self.formBuilderData);
			})
		}
		
		,onHandler : function(ev) {
			var handler = talent.$(ev.target).attr('data-handler');
			this[handler + 'Operate'] && this[handler + 'Operate'](ev);
		}
		,cancelOperate : function() {
			self.trigger('cancel');
		}
		,submitOperate : function() {
			var self = this;
			this.sendUpdateData();	
		}
		,sendUpdateData : function() {
			var self = this;
			var getData = this.$el.find('#task_form_container').formBuilder('getData');
			var url = (this.status == 'empty') ? 'qyneed/add_qyneed' : 'qyneed/update_qyneed';
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
					self.trigger('update', result);
				})
			})
		}
	
	})
})