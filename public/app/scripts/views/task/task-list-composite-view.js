define(['talent'
	,'templates/task'
],function(talent
	,jst
) {
	var CommunityItemView = talent.ItemView.extend({
		tagName : 'li'
		,template : jst['task/task-list-item-community-item']
		,className : 'task_item_community_item'
		,onRender : function() {
			this.$el.attr('data-id', this.model.get('st_id'));
		}
	})

	var ItemViewEmptyView = talent.ItemView.extend({
		template : _.template('<a class="btn btn-info">申请为社团</a>')
	})

	var ItemView = talent.CompositeView.extend({
		template : jst['task/task-list-item']
		,itemView : CommunityItemView
		,itemViewContainer : '.task_community_info_view'
		,tagName : 'li'
		,className : 'task_list_item'
		
		,initialize : function(options) {
			this.collection = new talent.Collection(this.model.get('st_info') || []);
		}
		,onRender : function() {
			if(this.options.renderMine) {
				this.$el.find('.task_community_info_view,.task_community_info_title').hide();
			} 
			this.$el.attr('data-id', this.model.get('id'));
		}
	})

	var EmptyView = talent.ItemView.extend({
		tagName : 'li'
		,className : 'task_list_item'
		,template : jst['task/task-list-empty']
	})

	return talent.CompositeView.extend({
		template : jst['task/task-list-composite']
		,itemView : ItemView
		,emptyView : EmptyView
		,itemViewContainer : '#task_list_container'
		,events : {
			'click .detail_btn' : 'changeId',
			'click .apply_task_btn' : 'applyTask'
			,'click .dropdown-menu a' : 'dealHandler'
		}
		,initialize : function() {
			var self = this;
			this.$el.off('click.hideDropdwon2');
			this.$el.on('click.hideDropdwon2', '.task_item_img_short', function(ev){
				var target = $(ev.target);
				self.$el.find('.dropdown-menu').hide();
				target.parent().siblings('.dropdown-menu').show();
				return false;
			})
			$('body').off('click.hideDropdwon1');
			$('body').on('click.hideDropdwon1', function(ev){
				var target = $(ev.target);
				if(target.hasClass('task_item_img_short')) {
					return false;
				} else {
					self.$el.find('.dropdown-menu').hide();
				}
			})
		}
		,itemViewOptions : function() {
			return {
				'renderMine' : this.model.get('renderMine')
			}
		}
		,onRender : function() {

		}
		,changeId : function(ev) {
			var id = talent.$(ev.target).parents('li').attr('data-id');
			this.trigger('changeId', id);
		}
		,applyTask : function(ev) {
			var id = talent.$(ev.target).parents('li').attr('data-id');
			this.trigger('applyTask', id);
		}
		,dealHandler : function(ev) {
			var dataHandler = $(ev.target).attr('data-handler');
			if(dataHandler) {
				this['on' + dataHandler + 'Handler'] && this['on' + dataHandler + 'Handler'](ev);
			}
		}
		,onapplyHandler: function(ev) {
			var self = this;
			var st_id = $(ev.target).parents('.task_item_community_item').attr('data-id');
			var task_id = $(ev.target).parents('.task_list_item').attr('data-id');
			$.ajax({
				'url' : 'qyneed/apply_qyneed'
				,type : 'POST'
				,data : {
					qyact_id : task_id,
					st_id : st_id,
					user_id : talent.Context.getUserInfo().id
				}
			}).done(function(resp) {
				talent.Context.setAlertTemplate(resp, $('#all_alert')).done(function(){					
					if(resp.code == 200) {
						self.trigger('applyTask');
					}
				});
			})
		}
		,onNotiveHandler : function(ev) {
			talent.Context.setAlertTemplate({code : 200, msg : '已通知'}, $('#all_alert')).done(function(){					
				
			});
		}
	})
})