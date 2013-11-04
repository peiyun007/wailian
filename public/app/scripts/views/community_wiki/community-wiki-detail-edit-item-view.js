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
			var options = options || {};
			var self = this;
			this.routerData = options.routerData;
			this.status = this.routerData.community_id ? 'edit' : 'empty';
			this.dealData();
		}
		,dealData : function() {
			var self = this;
			var detail = this.model.get('st_detail') &&  this.model.get('st_detail')[0] || {};
			this.formBuilderData = {
				title : '',
				status : self.status,
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
			if(this.status == 'edit') {
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
			this.renderEdit();
		}
		,renderEdit : function() {
			this.$el.find('#community_form_container').empty().formBuilder(this.formBuilderData);
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
			var getData = this.$el.find('#community_form_container').formBuilder('getData');
			var url = (!this.routerData.community_id) ? 'shetuan/add_st' : 'shetuan/update_st';
			getData.done(function(resp) {
				if(resp.region) {
					resp.province_id = resp.region[0];
					resp.city_id = resp.region[1] || '';
				}
				resp['user_id'] = talent.Context.getUserInfo().id;
				resp['isZD'] = self.routerData.organize_type == 'community' ? 0 : 1;
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