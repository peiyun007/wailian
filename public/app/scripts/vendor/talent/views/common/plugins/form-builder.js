(function($, undefined){

	var DATA_ID = 100;
	var FormTableBuilder = function(el, options) {
		this.template = [
		'<div id="data_table_container">',
		'	<a class="form_table_add" data-handler="add">添加</a>',
		'	<table class="table">',
		'		<thead></thead>',
		'		<tbody></tbody>',
		'	</table>',
		'	<div class="table_pagination pagination"></div>',
		'</div>'].join("");

		this.formDialogTemplate = [
		'<div class="modal"  style=" position: absolute; top : 50%; left : 50%; z-index: 1000; width: 700px;">',
		'	<div class="modal-header form-header">',
		'		<a type="button" class="close" data-dismiss="modal" aria-hidden="true" href="javascript:void(0)" data-handler="close">&times;</a>',
		'		<h3>{{title}}</h3>',
		'	</div>',
		'	<div class="modal-body form-body"></div>',
		'	<div class="modal-footer form-footer">',
		'	</div>',
		'</div>'
		].join("");

		this.formTemplate = [
		'<div style=" position: relative; width: 700px;">',
		'	<div class="modal-body form-body"></div>',
		'	<div class="form-footer" style="text-align: right">',
		'	</div>',
		'</div>'
		].join("");
		this.init(el, options);
		this.render();
	}

	FormTableBuilder.prototype = {
		init : function(el, options) {
			this.$el = $(el);
			var defaults = {
				data : [],
				schema : [],
				formContainer : 'body',
				dataSource : {},
				title : '',
				formDialog : true,
				alwaysShowForm : false,
				batch : null,
				dataAllLength : 0,
				btnGroup : [{name : 'show', html : '查看', target : '_blank'  }, {name: 'edit', html : '编辑', target : '_blank'}, {name : 'delete', html: '删除', target :'_blank'}],
				formBtnGroup : [{name : 'submit', html : '提交'}, {name: 'close', html : '取消'}]
			}
			this.options = $.extend({}, defaults, options);
			this.$viewEl = $(this.template);
		},

		getDataSource : function() {
			var deferred = new $.Deferred();
			if(this.options.dataSource){
				var url =  this.options.dataSource.url;
				var data = {};
				var request = makeRequest(url, data, 'GET');
				request.done(function(resp) {
					deferred.resolve(resp);
				})
			} else {
				deferred.resolve([]);
			}
			return deferred.promise();
		},

		normalizeData : function(resp) {
			this.options.data = resp || this.options.data;
		},

		normalizeItemData : function(itemData) {
			var id = itemData.id || itemData.Id || itemData._id || DATA_ID ++;
			itemData._id = id ;
			return itemData;
		},

		render : function() {
			var self = this, status = this.options.status;
			this.renderCaption();
			var getData = this.getDataSource();
			getData.done(function(resp) {
				self.onAfterGetData(resp);
			})
		},

		onAfterGetData : function(resp) {
			this.normalizeData(resp);
			this.$viewEl.find('tbody').empty();
			for(var i in this.options.data){
				this.renderItem(this.options.data[i]);
			}

			if(this.options.alwaysShowForm) {
				this.$viewEl.find('.form_table_add').hide();
			}

			if(this.options.batch) {
				this.renderPagination();
			}
			
			this.$el.empty().append(this.$viewEl);
			this.renderForm();
			this.bindEvents();
		},

		renderCaption : function() {
			this.caption = [];
			var container = $('<tr></tr>');
			var itemTemplate = '<th>{{text}}</th>';
			for(var i in this.options.schema) {
				if(this.options.schema[i].showInList) {
					this.caption.push({name : this.options.schema[i].name, text : this.options.schema[i].tableCaption || this.options.schema[i].formCaption})
					container.append(replaceTemplate(itemTemplate, {text : this.options.schema[i].tableCaption || this.options.schema[i].formCaption}));
				}
			}
			container.append('<th></th>')
			this.$viewEl.find('thead').empty().append(container);
		},

		renderItem : function(data, flag) {
			var data = this.normalizeItemData(data);
			//flag is true when add, need to push into dataList
			if(flag){
				this.options.data.push(data);
			}
			var caption = this.caption;
			var itemContainer = $(replaceTemplate('<tr data-id={{_id}}></tr>', data));
			var itemTemplate = '<td data-name={{key}}>{{value}}</td>';
			// render table tr
			for(var i in caption) {
				itemContainer.append(replaceTemplate(itemTemplate, {
					key : caption[i].name,
					value : data[caption[i].name] || ''
				}))
			}
			//render btn
			this.renderTableListBtn(data, itemContainer);
			//itemContainer.append(operateTemplate);
			this.$viewEl.find('tbody').append(itemContainer);
		},

		renderTableListBtn : function(data, itemContainer) {
			var options = this.options;
			var btnGroup = options.btnGroup;
			var operateTemplate = $('<td></td>');

			var btnTemplate = '<a class="form_table_btn form_table_{{name}}" target={{target}} data-handler={{name}} href={{url}}></a>';

			for(var i in btnGroup) {
				var btnItemView = $(replaceTemplate(btnTemplate, {
					name : btnGroup[i].name,
					url : data[btnGroup[i].name + 'Url'] || "javascript:void(0);",
					target : btnGroup[i].target || ''
				}));
				btnItemView.html(btnGroup[i].html);
				operateTemplate.append(btnItemView);
			}
			itemContainer.append(operateTemplate);
		},

		renderPagination : function() {
			var self = this;
			this.$viewEl.find('.table_pagination').pagination(this.options.dataAllLength, {
				items_per_page : this.options.batch,
				prev_text : '前一页',
				next_text : '后一页',
				callback : function(page) {

				}
			})
		},

		bindEvents : function() {
			var self = this;
			this.$viewEl.off('click.operate');
			this.$viewEl.on('click.operate', 'a', function(ev) {
				var handler = $(ev.currentTarget).attr('data-handler');
				if(handler && handler != "") {
					self['operate_' + handler] && self['operate_' + handler](ev);
				}
			})

			this.$formEl.off('click.operate');
			this.$formEl.on('click.operate', 'a', function(ev) {
				var handler = $(ev.currentTarget).attr('data-handler');
				if(handler && handler != "") {
					var getData = self.formView.getData();
					if(self.options['operate_' + handler]) {
						self.options['operate_' + handler](ev, getData);
					}
					self['operate_' + handler] && self['operate_' + handler](ev);
				}
			})
		},

		renderForm : function() {
			if(this.formView) {
				return;
			} else {
				this.$formEl = this.options.formDialog ? $(replaceTemplate(this.formDialogTemplate, this.options)) : $(replaceTemplate(this.formTemplate, this.options));
				if(this.options.title == '') {
					this.$formEl.find('.modal-header').css('border', 'none').find('h3').hide();
				}

				var data = findInArrByContent(this.options.schema, {name : '_id'});
					
				if(data.length == 0) {
					this.options.schema.push({
						caption : '',
						type : 'Hidden',
						name : '_id'
					})
				}
				if(!this.options.alwaysShowForm) {
					this.$formEl.hide();
				}
				this.renderFormBtn();
				this.$formEl.appendTo(this.options.formContainer);
				this.formView = new FormBuilder(this.$formEl.find('.modal-body'), this.options);
			}
		},

		renderFormBtn : function() {
			var btnTemplate = '<a class="btn form_{{name}}" data-handler={{name}} href="javascript:void(0)"></a>';

			var btnGroup = this.options.formBtnGroup;
			for(var i in btnGroup) {
				var btnItemView = $(replaceTemplate(btnTemplate, btnGroup[i]));
				btnItemView.html(btnGroup[i].html);
				this.$formEl.find('.form-footer').append(btnItemView)
			}
		},

		showForm : function() {
			if(this.options.formDialog) {
				var top = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;
				var left = document.body.scrollLeft || document.documentElement.scrollLeft || window.pageXOffset || 0;
				if(navigator.appName != 'Microsoft Internet Explorer') {
					var marginTop = -(this.$formEl.outerHeight()/2 -  top);
					var marginLeft = -(this.$formEl.outerWidth()/2 -  left);
					this.$formEl.css({
						marginTop : marginTop + 'px',
						marginLeft : marginLeft + 'px'
					})
				} else {
					var ieTop = $(window).height()/2 + top - this.$formEl.outerHeight()/2;
					var ieLeft = $(window).width()/2 + left - this.$formEl.outerWidth()/2;
					this.$formEl.css({'top' :  ieTop, 'left' : ieLeft});
				}
				if(this.formView.options.status == 'show') {
					this.$formEl.find('.modal-footer').hide();
				} else {
					this.$formEl.find('.modal-footer').show();
				}
			}		
			this.$formEl.show();
		},

		hideForm : function() {
			this.$formEl.hide();
		},

		operate_close : function(ev) {
			this.hideForm();
		},

		operate_show : function(ev) {
			var id = $(ev.target).parents('tr').attr('data-id');
			var data = findInArrById(this.options.data, id);
			this.formView.changeStatus('show', data);
			this.showForm();
		},

		operate_add : function(ev) {
			this.formView.changeStatus('empty');
			this.showForm();
		},

		operate_submit : function(ev) {
			var getData = this.formView.getData();
			var self = this;
			getData.done(function(resp) {
				var data;
				if(self.options.onBeforeSubmit) {
					data = self.options.onBeforeSubmit(resp);
				}
				if(!resp._id || resp._id == '') {
					self.addData(resp);
				} else {
					self.updateData(resp);
				}
				if(!self.options.alwaysShowForm) {
					self.$formEl.hide();
				}
			})
		},

		operate_delete : function(ev) {
			var id = $(ev.target).parents('tr').attr('data-id');
			var url = this.options.dataSource.url + '/' + id;
			var request = makeRequest(url, {}, 'DELETE');
			request.done(function(resp) {
				self.options.data = deleteInArr(self.options.data, id);
				self.$viewEl.find('[data-id="'+ id +'"]').remove();
				if(!self.options.alwaysShowForm) {
					self.$formEl.hide();
				}
			})
			
		},

		operate_edit : function(ev) {
			var id = $(ev.target).parents('tr').attr('data-id');
			var data = findInArrById(this.options.data, id);
			this.formView.changeStatus('edit', data);
			this.showForm();
		},
	 
		addData : function(data) {
			var self = this;
			var request = makeRequest(this.options.dataSource.url, data, 'POST');
			request.done(function(resp){
				self.renderItem(JSON.parse(resp.result), true);
			})			
		},

		updateData : function(data) {
			var self = this;
			data.id = data._id;
			var url = this.options.dataSource.url + '/' + data.id;
			var request = makeRequest(url, data, 'PUT');
			request.done(function(resp){
				self.options.data = updateInArr(self.options.data, data);
				self.onAfterGetData();
			})		
		},

		deleteAllData : function() {
			this.onRender([]);
		},

		getData : function() {
			return this.options.data;
		},

		setData : function(dataList) {
			this.onRender(dataList);
		}

	};

	

	/*****************
	form builder begin
	@param {
		title : 'formBuilder',
		status : 'show',
		captionLength : 18,
		schema : [{
				'name' : 'name',
				'caption' : '姓名：',
				'type' : 'Text', // Text (Password || Hidden) || Select || Textarea ||  Radio || Checkbox 
				'defaultValue' : '1122',
				'tips' : '(必填)', //Show after UI
				'validate' : { //rules base jQuery Validate
					'rules' : {required: true, minlength: 2},
					'messages' : { 
						'required' : 'Please provide a name',
						'minlength' : 'your name must consist of at least 2 characters'
					}
				},
				'placeholder' : '姓名' //placeholder for input,
				
			},{
				'name' : 'age'
				'caption' : '年龄：',
				'type' : 'Select',
				'defaultValue' : '1122',
				'tips' : '(必填)',
				'dataSource' : [{'value' : 2, 'text' : '2222'},{'value' : 3, text : '1222' }]						
			},
			...
		]
	}

	****************/
	var FormBuilder = function(el, options) {
		this.init(el, options);
		this.render();
	}

	FormBuilder.prototype = {

		init : function(el, options) {
			var defaults = {
				title : '',
				status : 'empty',
				schema : [],
				block :  true,
				captionLength : null
			}
			this.$el = $(el);
			this.template = [
			'<form method="post" class="form-horizontal build_form">',
			'</form>'].join("");
			this.component = [];
			this.validateData = {
				rules : {},
				messages : {}
			}
			this.options = $.extend({}, defaults, options);	
		},
		normalizeData : function(flag) {
			var options = this.options;
			for(var i in options.schema) {
				var data = options.schema[i];

				if(data.validate && typeof data.validate == 'object') {
					this.validateData.rules[data.name] = data.validate.rules;
					this.validateData.messages[data.name] = data.validate.messages; 
				}

				if(!data.status || flag) {
					data.status = options.status;
				}
				data.formCaptionSub = options.captionLength ? subString(data.formCaption, options.captionLength, true) : data.formCaption;
			}
		},
		render : function(flag) {
			var options = this.options;
			this.normalizeData(flag);

			this.$viewEl = $(replaceTemplate(this.template, options));
			for(var key in options.schema) {
				this.renderItemView(options.schema[key]);
			}
			this.$el.empty().append(this.$viewEl);
			this.initValidate();
		},

		renderItemView : function(data) {
			var data = data;
			var view = this.EditorView[data.type + 'View'] ? this.EditorView[data.type + 'View'] : this.EditorView['TextView'];
			this.component[data.name] = new view(data);
			this.component[data.name].render();
			if(!this.options.block) {
				this.component[data.name].$viewEl.addClass('inline');
			}
			this.component[data.name].$viewEl.appendTo(this.$viewEl);
		},

		reset : function() {
			this.$el.find('form')[0].reset();
		},

		submit : function() {
			var self = this;
			this.$el.find('form').submit();
		},

		initValidate : function() {
			if(this.options.status != 'show') {
			 	this.validator = this.$el.find('.build_form').validate(this.validateData);
			 	for(var key in this.component) {
			 		this.component[key].validator =this.validator;
			 	}
			}
		},

		addValidateMethod : function(name, method, message) {
			jQuery.validator.addMethod(name, method, message);
		},

		validateForm : function() {
			return this.validator.form();
		},

		clearError : function() {
			this.validator.resetForm();
		},

		validateItem : function(name) {
			return this.component[name] && this.component[name].validate();
		},

		changeStatus : function(status, data) {
			for(var key in this.component) {
				if(data) {
					this.changeItemStatus(key, status, data[key]);
				} else {
					this.changeItemStatus(key, status);
				}
			}
		},

		changeItemStatus : function(name, status, data) {
			if(this.component[name]) {
				if(data) {
					this.component[name].data.defaultValue = data;
				}
				this.component[name].data.status = status;
			}
			this.component[name] && this.component[name].changeStatus();
		},

		getData : function() {
			var data = {};
			var self = this;
			var deferred = new $.Deferred();
			var index = 0;
			for(var key in this.component) {
				var getData = this.getItemData(key);
				getData.done(function(resp) { 
					data[key] = resp;
					if(index == self.component.length) {
						deferred.resolve(data);
					} else {
						index++;
					}
				})
			}
			return deferred.promise();
		},

		getItemData : function(name) {

			return this.component[name].getData();
		},

		setData : function(data) {
			for(var key in data) {
				this.setItemData(key, data[key]);
			}
		},

		setItemData : function(name, data) {
			if(!this.component[name]) {
				return;
			}
			this.component[name].data.defaultValue = data;
			this.component[name].setData();
		},

		hide : function() {
			this.$viewEl.hide();
		},

		show : function() {
			this.$viewEl.show();
		},

		destory : function() {
			$.removeData(this.$el, 'formBuilder');
			this.$viewEl.remove();
		}
	}

	var fn = FormBuilder.prototype;
	

	/*****************/
	// form  single ui builder begin
	/****************/
	var EditorView = fn.EditorView = {};

	EditorView.BaseView = function(options) {
		this.template = [
		'<div class="control-group">',
		'	<label class="form_caption" title={{formCaption}}> {{formCaptionSub}}：</label>',
		'	<span class="form_ui_container"></span>',
		'	<label class="form_tips">{{tips}}</label>',
		'</div>'].join("");

		this.defaults = {
			'formCaption' : '',
			'tips' : '',
			'placeholder' : '',
			'name' : '',
			'defaultValue' : '',
			'dataSource' : [],
			'validate' : null
		}

		this.options = $.extend({}, this.defaults, options);

		this.template_show = '<label name={{name}} >{{defaultValue}}</label>';

		this.buildTemplateData = function() {
			return this.options;
		}

		this.render = function() {
			this.data = this.buildTemplateData();
			this.$viewEl = $(replaceTemplate(this.template, this.data));
			this['render_' + this.data.status]();
			this.onRender();
			this.bindEvents();
			return this.$viewEl;
		}

		this.render_empty = function() {
			var deferred = new $.Deferred();
			var self = this;
			this.uiItemView = $(replaceTemplate(this.template_ui, this.data));
			var getData;
			if(this.itemTemplate) {
				getData = this.getUiDataSource();
				getData.done(function(data) {
					self.onAfterGetUiDataSource(data);
					deferred.resolve();
				})
			} else {
				self.$viewEl.find('.form_ui_container').empty().append(self.uiItemView);
				self.$viewEl.find('.form_tips').css({'display' : 'inline-block'});
				deferred.resolve();
			}
			return deferred.promise();
		}

		this.render_show = function() {
			this.$viewEl.find('.form_ui_container').empty().append(replaceTemplate(this.template_show, this.data));
			this.$viewEl.find('.form_tips').hide();
			if(this.data.show == false) {
				this.$viewEl.hide();
			}
		}

		this.render_edit = function() {
			var emptyRender = this.render_empty();
			var self = this;
			emptyRender.done(function() {
				self.setData();
				if(self.data.defaultValue) {
					self.$viewEl.find('.input_placeholder').hide();
				}
			})		
		}

		this.getUiDataSource = function() {
			var self = this;
			var deferred = new $.Deferred();
			
			if(this.data.dataSource instanceof Array) {
				deferred.resolve(this.data.dataSource);
			} else if(this.data._dataSource){
				deferred.resolve(this.data._dataSource);
			}else {
				var data = this.data.dataSource.beforeRequest && this.data.dataSource.beforeRequest();
				var request = makeRequest(this.data.dataSource.url, data, 'GET');
				request.done(function(resp){
					deferred.resolve(self.data.dataSource.afterRequest(resp));
				})
			}
			return deferred.promise();
		}

		this.searializeData = function(data) {
			for(var i in data) {
				if(!data[i].text) {
					data[i].text = data[i].value;
				}
			}
		}

		this.onAfterGetUiDataSource = function(data) {
			var self = this;
			this.searializeData(data);
			self.data._dataSource = data;
			self.renderUiItem();
			self.$viewEl.find('.form_ui_container').empty().append(self.uiItemView);
			self.$viewEl.find('.form_tips').css({'display' : 'inline-block'});
		}

		this.renderUiItem = function() {
			var html = '';
			for(var i in this.data._dataSource) {
				html += (replaceTemplate(this.itemTemplate, this.data._dataSource[i]));
			}
			this.uiItemView.empty().append(html);
		}

		this.onRender = function() {}

		this.bindEvents = function() {}

		this.changeStatus = function() {
			this['render_' + this.data.status]();
			this.onRender();
		}

		this.beforeSetData = function() {
			if(this.data.status == 'show') {
				this.render_show();
				return;
			}
		}

		this.setData = function() {
			this.beforeSetData();
			this.$viewEl.find(this.selector).val(this.data.defaultValue);
			if(this.data.defaultValue != '') {
				this.$viewEl.find('.input_placeholder').hide();
			}
		}

		this.getData = function() {
			var deferred = new $.Deferred();
			deferred.resolve(this.$viewEl.find(this.selector).val());
			return deferred.promise();
		}

		this.validate = function() {
			this.validator.element(this.$viewEl.find(this.selector));
		}

	}

	EditorView.TextView = function (options) {

		EditorView.BaseView.call(this, options);

		this.template_ui = '<label class="input_placeholder">{{placeholder}}</label><input class="all_input" id={{name}} name={{name}} type={{type}}></input>';

		this.selector = 'input';

		this.bindEvents = function() {
			var self = this;
			this.$viewEl.on('click.placeholder', '.input_placeholder', function() {
				self.$viewEl.find(self.selector).focus();
			})

			this.$viewEl.on('keydown.placeholder', this.selector, function() {
				self.$viewEl.find('.input_placeholder').hide();
			})

			this.$viewEl.on('focusout.placeholder', this.selector, function() {
				if(self.$viewEl.find(self.selector).val() == '') {
					self.$viewEl.find('.input_placeholder').show();
				}
				self.validator.element(self.$viewEl.find(self.selector));
			})
		}

		this.onRender = function() {
			if(this.data.type == 'Hidden') {
				this.$viewEl.hide();
			}
		}

	}

	EditorView.SelectView = function(options) {

	 	EditorView.BaseView.call(this, options);

 		this.template_ui = [
		'<select name={{name}} id={{name}} class="all_select">',
		'</select>'
		].join("");
		this.selector = 'select';
		this.itemTemplate = '<option value={{value}}>{{text}}</option>';

		this.setData = function() {
			var defaultValue = this.data.defaultValue;
			this.beforeSetData();
			this.$viewEl.find(this.selector).find('[value=' +defaultValue+ ']').attr('selected', true);
		}

		this.getData = function() {
			var deferred = new $.Deferred();
			var value = this.$viewEl.find(':selected').val();
			deferred.resolve(value);
			return deferred.promise();
		}

	}

	EditorView.CheckboxView = function(options){

		EditorView.BaseView.call(this, options);

		this.template_ui = [
		'<ul id={{name}}>',
		'</ul>'].join("");
		this.selector = 'checkbox';
		this.itemTemplate = '<li class="all_checkbox inline"><input type="checkbox" name={{name}} value={{value}}>{{text}}</input></li>';

		this.setData = function() {
			this.beforeSetData();
			var defaultValue = this.data.defaultValue.split(",") || [];
			for( var i in defaultValue) {
				this.$viewEl.find('[value=' + defaultValue[i] + ']').attr('checked', true);
			}
		}

		this.getData = function() {
			var deferred = new $.Deferred();
			var checked = this.$viewEl.find(':checked');
			var data = [];
			for(var i=0,j=checked.legend; i<j; i++){
				data.push($(checked[i]).val());
			}
			deferred.resolve(data.join(","));
			return deferred.promise();
		}
		
	}

	EditorView.RadioView = function(options){

		EditorView.BaseView.call(this, options);

		this.template_ui = [
		'<ul id={{name}}>',
		'</ul>'].join("");
		this.selector = 'radio';
		this.itemTemplate = '<li class="all_radio inline"><input type="radio" name={{name}} value={{value}}>{{text}}</input></li>';

		this.setData = function() {
			this.beforeSetData();
			var defaultValue = this.data.defaultValue;
			this.$viewEl.find('[value=' +defaultValue+ ']').attr('checked', true);
		}

		this.getData = function() {
			var deferred = new $.Deferred();
			deferred.resolve(this.$viewEl.find(':checked').val());
			return deferred.promise();
		}

	}

	EditorView.TextareaView = function(options){

		EditorView.TextView.call(this, options);

		this.selector = 'textarea';
		this.template_ui = '<label class="input_placeholder">{{placeholder}}</label><textarea class="all_textarea" name={{name}}></textarea>';

	}

	EditorView.RangeTextView = function(options) {

		EditorView.BaseView.call(this, options);
		this.template_ui = '<span class="range_input"><input id={{name}} name={{startName}} type={{type}}></input>-<input id={{name}} name={{endName}} type={{type}}></input></span>';
		this.selector = 'input';

		this.buildTemplateData = function() {
			return $.extend({}, this.options, {
				startName : 'start_' + this.options.name,
				endName : 'end_' + this.options.name
			})
		}

		this.getData = function() {
			var deferred = new $.Deferred();

			var data = [];
			data.push(this.$viewEl.find('[name="' + this.data['startName'] + '"]').val());
			data.push(this.$viewEl.find('[name="' + this.data['endName'] + '"]').val());
			deferred.resolve(data);

			return deferred.promise();
		}

		this.setData = function() {
			var defaultValue = this.data.defaultValue;
			this.$viewEl.find('[name="' + this.data['startName'] + '"]').val(defaultValue[0]);
			this.$viewEl.find('[name="' + this.data['endName'] + '"]').val(defaultValue[1]);
		}

	}

	EditorView.RangeSelectView = function(options) {

		EditorView.BaseView.call(this, options);

		this.template_ui = '<span class="range_select"><select data-handler="start" name={{startName}} type={{type}}></select>-<select data-handler="end" name={{endName}} type={{type}}></select></span>';
		this.selector = 'select';
		this.itemTemplate = '<option value={{value}}>{{text}}</option>';

		this.buildTemplateData = function() {
			return $.extend({}, this.options, {
				startName : 'start_' + this.options.name,
				endName : 'end_' + this.options.name
			})
		}

		this.renderUiItem = function() {
			this.data['_startSource'] = $.extend({}, this.data._dataSource);
			this.data['_endSource'] =  $.extend({}, this.data._dataSource);
			this.renderUiItemByName('start');
			this.renderUiItemByName('end');
		}

		this.bindEvents = function() {
			var self = this;
			this.$viewEl.on('change', 'select', function(ev){
				var handler = $(ev.target).attr('data-handler');
				self.changeSelect(handler);
			})
		}

		this.renderUiItemByName = function(item) {
			var data = this.data['_' + item + 'Source'] ? this.data['_' + item + 'Source'] : this.data._dataSource;
			var uiContainer = this.uiItemView.find('[name="' + this.data[ item + 'Name'] + '"]');
			uiContainer.empty();
			var html = '';
			for(var i in data) {
				html += replaceTemplate(this.itemTemplate, data[i]);
			}
			uiContainer.append(html);
		}

		this.changeSelect = function(item) {
			var obj = {
				startUi : this.$viewEl.find('[name="' + this.data['startName'] + '"]'),
				endUi : this.$viewEl.find('[name="' + this.data['endName'] + '"]'),
				get_arr_start : function (arr, index) {
					return arr.slice(0, index+1);
				},
				get_arr_end : function(arr, index) {
					var arr1 = [];
					arr1.push(arr[0]);
					var arr2 = index == 0 ? arr.slice(index +1, arr.length) : arr.slice(index, arr.length);
					return arr1.concat(arr2);
				}
			}

			var self = this;
			var opsiteItem = (item == 'start' ? 'end' : 'start');
			var valueIndex = (item == 'start' ? 0 : 1);
			var getData = this.getData();
			getData.done(function(resp) {
				var index = findIndexInArrByContent(self.data._dataSource, {value : resp[valueIndex]})
				self.data['_' + opsiteItem + 'Source'] = obj['get_arr_' + opsiteItem](self.data._dataSource, index);

				self.renderUiItemByName(opsiteItem);
				
				self.data.defaultValue = resp;
				self.setData(true);
			})

		}

		this.getData = function() {
			var deferred = new $.Deferred();

			var data = [];
			data.push(this.$viewEl.find('[name="' + this.data['startName'] + '"]').find(':selected').val());
			data.push(this.$viewEl.find('[name="' + this.data['endName'] + '"]').find(':selected').val());
			deferred.resolve(data);

			return deferred.promise();
		}

		this.setData = function(flag) {
			var defaultValue = this.data.defaultValue;
			if(!flag) {
				this.renderUiItem();
			}
			this.$viewEl.find('[name="' + this.data['startName'] + '"]').find('[value=' +defaultValue[0]+ ']').attr('selected', true);
			this.$viewEl.find('[name="' + this.data['endName'] + '"]').find('[value=' +defaultValue[1]+ ']').attr('selected', true);
		}

	}

	EditorView.NestedSelectView = function(options) {
		EditorView.BaseView.call(this, options);

		this.template_ui = '<span class="nested_select"></span>';
		this.template_ui_item = '<label class="inline">{{formCaption}}</label><select name={{name}}></select>';
		this.selector = 'select';
		this.itemTemplate = '<option value={{value}}>{{text}}</option>';

		this.buildTemplateData = function() {
			return $.extend({}, this.options)
		}

		this.renderUiItem = function() {
			var html = '';
			for(var i in this.data.selectOrder) {
				var name = this.data.selectOrder[i].name;
				var viewEl = replaceTemplate(this.template_ui_item, this.selectCompnent[name].data);
				html += viewEl;		
			}

			this.uiItemView.append(html);
			for(var key in this.selectCompnent) {
				this.renderUiItemByName(key);
			}
		}

		this.onAfterGetUiDataSource = function(data) {
			var self = this;
			this.createComponentSelect(data);
			self.renderUiItem();
			self.$viewEl.find('.form_ui_container').empty().append(self.uiItemView);
			if(self.options.status == 'edit') {
				self.setData();
			}	
			self.$viewEl.find('.form_tips').css({'display' : 'inline-block'});
		}

		this.createComponentSelect = function(data) {
			var selectOrder = this.data.selectOrder;
			if(this.selectCompnent) {
				return;
			} else {
				this.selectCompnent = {};
				for(var i in selectOrder) {
					this.selectCompnent[selectOrder[i].name] = {};
					var options = $.extend({}, this.options , {
						formCaption : selectOrder[i].caption,
						name : selectOrder[i].name,
						dataSource : []
					})
					if(i == 0) {
						options.dataSource = data;
					}
					this.selectCompnent[selectOrder[i].name].data = options;
				}
			}
		}

		this.bindEvents = function() {
			var self = this;
			this.$viewEl.off('change.form');
			this.$viewEl.on('change.form', 'select', function(ev){
				var handler = $(ev.target).attr('name');
				var value = $(ev.target).find(':selected').val();
				if(value == self.data.firstValue) {
					self.clearAfter(handler);
					return;
				}
				self.changeSelect(handler);
			})
		}

		this.clearAfter = function(item) {
			var selectOrder = this.data.selectOrder;
			var index = findIndexInArrByContent(this.data.selectOrder, {name : item}) + 1;
			for(var i = index, j=selectOrder.length; i<j; i++) {
				this.selectCompnent[selectOrder[i].name].data.dataSource = [];
				this.renderUiItemByName(selectOrder[i].name);
			}
		}

		this.renderUiItemByName = function(item) {
			var data = this.selectCompnent[item].data;
			var dataSource = data.dataSource;
			this.searializeData(dataSource);
			var uiContainer = this.uiItemView.find('[name="' + item + '"]');
			uiContainer.empty();
			var html = replaceTemplate(this.itemTemplate, {value : data.firstValue, text : data.firstValue});
			for(var i in dataSource) {
				html += replaceTemplate(this.itemTemplate, dataSource[i]);
			}
			uiContainer.append(html);
		}

		this.changeSelect = function(item, value) {
			var selectOrder = this.data.selectOrder,
				self = this,
				index = findIndexInArrByContent(this.data.selectOrder, {name : item}) + 1,
				name = selectOrder[index].name,
				obj = {};
			//
			if(index != selectOrder.length) {
				this.clearAfter(name);
			}
			for(var i=0; i<index; i++) {
				obj[selectOrder[i].name] = this.uiItemView.find('[name="' + selectOrder[i].name +'"]').find(':selected').val();
			}
			var request = makeRequest(this.data.dataSource.url,  obj, 'GET');
			request.done(function(resp) {
				var data = self.data.dataSource.afterRequest && self.data.dataSource.afterRequest(resp);
				self.selectCompnent[name].data.dataSource = data;
				self.renderUiItemByName(name);
				if(value) {
					self.uiItemView.find('[name="' + name + '"]').find('[value="'+ value + '"]').attr('selected', true);
				}
			})

		}

		this.getData = function() {
			var deferred = new $.Deferred();
			var data = [];

			for(var i in this.data.selectOrder) {
				var name = this.data.selectOrder[i].name;
				var value = this.uiItemView.find('[name="' +name+ '"]').find(':selected').val();
				var itemValue = (value == this.data.firstValue ? '' : value);
				data.push(itemValue);
			}

			deferred.resolve(data);
			return deferred.promise();
		}

		this.setData = function(flag) {
			var defaultValue = this.data.defaultValue;
			var self = this;
			for(var i in this.data.selectOrder) {
				if(i == 0) {
					self.uiItemView.find('[name="' + self.data.selectOrder[0].name + '"]').find('[value="'+ defaultValue[0] + '"]').attr('selected', true);
				} else {
					var name = this.data.selectOrder[i - 1].name
					if(defaultValue[i] != '') {
						this.changeSelect(name, defaultValue[i]);
					}
				}
				
			}

		}
	}

	/*****************/
	// private function begin
	/****************/
	function replaceTemplate(template, data) {
		template = template.replace(/\{\{[\s\S]+?\}\}/g, function(match) {
			var match = match.replace('{{','').replace('}}','');
			return data[match];
		});
		return  template;
	}


	function addValidate() {
		jQuery.validator.addMethod("password", function( value, element ) {
			var result = this.optional(element) || value.length >= 6 && /\d/.test(value) && /[a-z]/i.test(value);
			if (!result) {
				var validator = this;
				setTimeout(function() {
					validator.blockFocusCleanup = true;
					element.focus();
					validator.blockFocusCleanup = false;
				}, 1);
			}
			return result;
		}, "Your password must be at least 6 characters long and contain at least one number and one character.");

	}

	function makeRequest(url, data, method) {
		var deferred = new $.Deferred();
		$.ajax({
			url : url,
			data : data,
			headers : method,
			type : method
		}).done(function(resp){
			deferred.resolve(resp);
		})
		return deferred.promise();
	}

	function findInArrById(arr, id) {
		var data;
		for(var i=0,j=arr.length; i<j; i++) {
			if(arr[i]._id == id || arr[i].id == id || arr[i].Id == id) {
				data = arr[i];
				break;
			}	
		}
		return data;
	}

	function deleteInArr(arr, id) {
		var newArr, i=0;
		for(i=0,j=arr.length; i<j; i++) {
			if(arr[i]._id == id || arr[i].id == id || arr[i].Id == id) {
				break;
			}
		}
		if(i <= arr.length) {
			var arr1 = arr.slice(0, i);
			var arr2 = arr.slice(i+1, arr.length);
			newArr = arr1.concat(arr2);
			return newArr;
		} else {
			return arr;
		}
	}

	function updateInArr(arr, data) {
		var newArr, i=0;
		var id = data.id || data.Id || data._id;
		for(i=0,j=arr.length; i<j; i++) {
			if(arr[i]._id == id || arr[i].id == id || arr[i].Id == id) {
				break;
			}
		}
		if(i <= arr.length) {
			arr[i] = data;
		}
		return arr;
	}

	function findInArrByContent(arr, obj) {
		var data = [];
		var len = 0;
		for(var key in obj) {
			len ++ ;
		}
		for(var i=0,j=arr.length; i<j; i++) {
			var lenTemp = 0;
			for(var key in obj) {
				if(obj[key] != arr[i][key]) {
					break;
				} else {
					lenTemp ++ ;
				}
			}
			if(lenTemp == len) {
				data.push(arr[i]);
			}
		}
		return data;
	}

	function subString (str, len, hasDot) {
		var newLength = 0;
        var newStr = "";
        var chineseRegex = /[^\x00-\xff]/g;
        var singleChar = "";
        var strLength = str.replace(chineseRegex,"**").length;
        for(var i = 0;i < strLength;i++){
            singleChar = str.charAt(i).toString();
            if(singleChar.match(chineseRegex) != null){
                newLength += 2;
            }
            else{
                newLength++;
            }
            if(newLength > len){
                break;
            }
            newStr += singleChar;
        }

        if(hasDot && strLength > len){
            newStr += "...";
        }
        return newStr;
	}

	function findIndexInArrByContent(arr, obj) {
		var len = 0;
		var index = 0;
		for(var key in obj) {
			len ++ ;
		}
		for(var i=0,j=arr.length; i<j; i++) {
			var lenTemp = 0;
			for(var key in obj) {
				if(obj[key] != arr[i][key]) {
					break;
				} else {
					lenTemp ++ ;
				}
			}
			if(lenTemp == len) {
				index = i;
			}
		}
		return index;
	}




	/*****************/
	//jQuery adapter
	/****************/
	
    $.fn.formBuilder = function(options) {
    	if (typeof options == 'string') {
			var args = Array.prototype.slice.call(arguments, 1);
			var res;
			this.each(function() {
				var formBuilder = $.data(this, 'formBuilder');
				if (formBuilder && $.isFunction(formBuilder[options])) {
					var r = formBuilder[options].apply(formBuilder, args);
					if (res === undefined) {
						res = r;
					}
				}
			});
			if (res !== undefined) {
				return res;
			}
			return this;
		}
		
		
		this.each(function(i, _element) {
			var element = $(_element);
			var formBuilder = new FormBuilder(element, options);
			element.data('formBuilder', formBuilder); 
		});
		
		
		return this;
    };

    $.fn.formUIBuilder = function(options) {

    	if (typeof options == 'string') {
			var args = Array.prototype.slice.call(arguments, 1);
			var res;
			this.each(function() {
				var formUIBuilder = $.data(this, 'formUIBuilder');
				if (formUIBuilder && $.isFunction(formUIBuilder[options])) {
					var r = formUIBuilder[options].apply(formUIBuilder, args);
					if (res === undefined) {
						res = r;
					}
				}
			});
			if (res !== undefined) {
				return res;
			}
			return this;
		}	
		this.each(function(i, _element) {
			var element = $(_element);
			var formUIBuilder = new EditorView[options.type + 'View'](options);
			element.append(formUIBuilder.render());
			element.data('formUIBuilder', formUIBuilder); 
		});
		
		
		return this;
    };

    $.fn.formTableBuilder = function(options) {
    	if (typeof options == 'string') {
			var args = Array.prototype.slice.call(arguments, 1);
			var res;
			this.each(function() {
				var formTable = $.data(this, 'formTable');
				if (formTable && $.isFunction(formTable[options])) {
					var r = formTable[options].apply(formTable, args);
					if (res === undefined) {
						res = r;
					}
				}
			});
			if (res !== undefined) {
				return res;
			}
			return this;
		}	
    	this.each(function(i, _element) {
			var element = $(_element);
			var formTable = new FormTableBuilder(element, options);
			element.data('formTable', formTable); 
		});		
		return this;
    }

})(jQuery);