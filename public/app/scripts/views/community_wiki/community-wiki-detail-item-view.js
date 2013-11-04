define(['talent'
	,'templates/community_wiki'
	,'views/community_wiki/community-wiki-detail-edit-item-view'
],function(talent
	,jst
	,CommunityWikiDetailEditItemView
) {
	return talent.ItemView.extend({
		template : jst['community_wiki/community-wiki-detail']
		,initialize : function(options) {
			var options = options || {};
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
			this.$el.find('#community_wiki_detail_info').slideUp('slow', function(){
				if(!self.communityWikiDtailEditView) {
					self.communityWikiDtailEditView = new CommunityWikiDetailEditItemView({
						model : self.model,
						routerData : self.routerDatas
					})
					self.bindEvents();
					self.$el.find('#form_builder_container').hide().append(self.communityWikiDtailEditView.render().$el).slideDown('slow');
				} else {
					self.$el.find('#form_builder_container').slideDown('slow');
				}
			});	
		}
		,bindEvents : function() {
			var self = this;
			this.communityWikiDtailEditView.on('cancel',function() {
				self.$el.find('#form_builder_container').slideUp('slow');		
				self.$el.find('#community_wiki_detail_info').slideDown('slow');
			})
			this.communityWikiDtailEditView.on('update',function(resp) {
				self.$el.find('#form_builder_container').slideUp('slow', function(){
					self.trigger('update', resp)
				})
			})
		}
	})
})