define(['talent'
	,'templates/task'
	,'views/task/task-detail-edit-item-view'
],function(talent
	,jst
	,TaskDetailEditItemView
) {
	return talent.ItemView.extend({
		template : jst['task/task-detail']
		,tagName : 'ul'
		,className : 'panel-body'
		,initialize : function(options) {
			this.options = options || {};
			this.routerData = options.routerData;
			this.templateHelpers = {
				routerData : options.routerData
			}
		}
		,events : {
			'click a' : 'onHandler'
		}
		,onHandler : function(ev) {
			var handler = $(ev.currentTarget).attr('data-handler');
			this['on' + handler + 'Handler'] && this['on' + handler + 'Handler'](ev);
		}
		,onEditHandler : function() {
			var self = this;
			this.$el.find('#task_detail_info').slideUp('slow', function(){
				if(!self.taskDetailEditView) {
					self.taskDetailEditView = new TaskDetailEditItemView({
						model : self.model,
						routerData : self.routerData
					})
					self.bindEvents();
					self.$el.find('#form_builder_container').hide().append(self.taskDetailEditView.render().$el).slideDown('slow');
				} else {
					self.$el.find('#form_builder_container').slideDown('slow');
				}
			});	
		}
		,bindEvents : function() {
			var self = this;
			this.taskDetailEditView.on('cancel',function() {
				self.$el.find('#form_builder_container').slideUp('slow');		
				self.$el.find('#task_detail_info').slideDown('slow');
			})
			this.taskDetailEditView.on('update',function(resp) {
				self.$el.find('#form_builder_container').slideUp('slow', function(){
					self.trigger('update', resp)
				})
			})
		}
	})
})