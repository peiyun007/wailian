define(['talent'
	,'templates/enterprise_wiki'
	,'$.validate'
	,'formBuilder'
],function(talent
	,jst
) {
	return talent.ItemView.extend({
		template : jst['enterprise_wiki/enterprise-wiki-detail-edit']
		,tagName : 'ul'
		,className : 'panel-body'
		,events : {
			'click a' : 'onHandler'
		}
		,initialize : function(options) {
			var self = this;
			this.options = options || {};
			this.formBuilderData = {
				title : '',
				status : self.options.status || 'empty',
				captionLength : null,
				schema : [
					{
						'name' : 'name',
						'formCaption' : '企业名称',
						'type' : 'Text', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
						'defaultValue' : this.model.get('name') || '',
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
						'formCaption' : '企业所在地',
						'type' : 'NestedSelect', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
						'defaultValue' : [this.model.get('province_id') || '', this.model.get('city_id') || ''],
						'dataSource' : {url : 'region/list_all_province'},
						'selectOrder' : [{caption : '', name : 'province_id', firstValue: '--省--'},{caption : '', name : 'city_id', dataSource : {url : 'region/list_all_city'}, firstValue: '--市--'}],
						'tips' : '', //Show after UI
						'placeholder' : '企业所在地' //placeholder for input,
					},{
						'name' : 'description',
						'formCaption' : '企业描述',
						'type' : 'Textarea', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
						'defaultValue' : this.model.get('description') || '',
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
						'defaultValue' : this.model.get('id'),
						'tips' : '', //Show after UI
						'placeholder' : '' //placeholder for input,
				})
			}
		}
		,onShow : function() {
			this.renderEdit();
		}
		,renderEdit : function() {
			this.$el.find('#enterprise_form_container').empty().formBuilder(this.formBuilderData);
		}
		,onHandler : function(ev) {
			var handler = talent.$(ev.target).attr('data-handler');
			this[handler + 'Operate'] && this[handler + 'Operate']();
		}
		,cancelOperate : function() {
			this.renderEdit();
		}
		,submitOperate : function() {
			var self = this;
			var getData = this.$el.find('#enterprise_form_container').formBuilder('getData');
			var url = (this.options.status == 'empty') ? 'index.php/qiye/add_qiye' : 'index.php/qiye/update_qiye';
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
					talent.Context.setAlertTemplate(result, $('#all_alert')).done(function(){				
						if(result && result.code == 200) {
							self.trigger('submit');
						}
					});
				})
			})
		}
	})
})