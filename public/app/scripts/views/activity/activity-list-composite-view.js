define(['talent'
	,'templates/activity'
],function(talent
	,jst
) {
	var CommunityItemView = talent.ItemView.extend({
		tagName : 'li'
		,template : jst['activity/activity-list-item-community-item']
		,className : 'activity_item_community_item'
		,onRender : function() {
			this.$el.attr('data-id', this.model.get('qy_id'));
		}
	})

	var ItemViewEmptyView = talent.ItemView.extend({
		template : _.template('<a class="btn btn-info">申请为社团</a>')
	})

	var ItemView = talent.CompositeView.extend({
		template : jst['activity/activity-list-item']
		,itemView : CommunityItemView
		,itemViewContainer : '.activity_community_info_view'
		,tagName : 'li'
		,className : 'activity_list_item'
		
		,initialize : function(options) {
			this.collection = new talent.Collection(this.model.get('qy_info') || []);
		}
		,onRender : function() {
			if(this.options.renderMine) {
				this.$el.find('.activity_community_info_view,.activity_community_info_title').hide();
			} 
			this.$el.attr('data-id', this.model.get('id'));
		}
	})

	var EmptyView = talent.ItemView.extend({
		tagName : 'li'
		,className : 'activity_list_item'
		,template : jst['activity/activity-list-empty']
	})

	return talent.CompositeView.extend({
		template : jst['activity/activity-list-composite']
		,itemView : ItemView
		,emptyView : EmptyView
		,itemViewContainer : '#activity_list_container'
		,events : {
			'click .detail_btn' : 'changeId',
			'click .join_btn' : 'join'
			,'click .dropdown-menu a' : 'dealHandler'
		}
		,initialize : function() {
			var self = this;
			this.$el.off('click.hideDropdwon2');
			this.$el.on('click.hideDropdwon2', '.activity_item_img_short', function(ev){
				var target = $(ev.target);
				self.$el.find('.dropdown-menu').hide();
				target.parent().siblings('.dropdown-menu').show();
				return false;
			})
			$('body').off('click.hideDropdwon1');
			$('body').on('click.hideDropdwon1', function(ev){
				var target = $(ev.target);
				if(target.hasClass('activity_item_img_short')) {
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
		,join : function(ev) {
			var id = talent.$(ev.target).parents('li').attr('data-id');
			this.trigger('joinCommunity', id);
		}
		,dealHandler : function(ev) {
			var dataHandler = $(ev.target).attr('data-handler');
			if(dataHandler) {
				this['on' + dataHandler + 'Handler'] && this['on' + dataHandler + 'Handler'](ev);
			}
		}
		,onapplyHandler: function(ev) {
			var self = this;
			var qy_id = $(ev.target).parents('.activity_item_community_item').attr('data-id');
			var activity_id = $(ev.target).parents('.activity_list_item').attr('data-id');
			console.log(qy_id);
			$.ajax({
				'url' : 'stneed/apply_stneed'
				,type : 'POST'
				,data : {
					stneed_id : activity_id,
					qy_id : qy_id,
					user_id : talent.Context.getUserInfo().id
				}
			}).done(function(resp) {
				talent.Context.setAlertTemplate(resp, $('#all_alert')).done(function(){					
					if(resp.code == 200) {
						self.trigger('applyActivity');
					}
				});
			})
		}
	})
})