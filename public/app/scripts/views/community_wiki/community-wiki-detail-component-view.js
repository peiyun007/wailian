define(['talent'
	,'templates/community_wiki'	
	,'views/community_wiki/community-wiki-detail-item-view'
	,'views/community_wiki/community-wiki-detail-edit-item-view'
	,'views/community_wiki/community-wiki-detail-activity-item-view'
	,'views/community_wiki/community-wiki-detail-task-item-view'
	,'views/community_wiki/community-wiki-detail-experience-item-view'
	,'views/community_wiki/community-wiki-detail-member-item-view'	
	,'views/common/bs-tab/bs-tab'
],function(talent
	,jst
	,CommunityWikiDetailItemView
	,CommunityWikiDetailEditItemView
	,CommunityWikiDetailActivityItemView
	,CommunityWikiDetailTaskItemView
	,CommunityWikiDetailExperienceItemView
	,CommunityWikiDetailMembertIemView
	,BSTab
) {

	return talent.Layout.extend({
		template : jst['community_wiki/community-wiki-detail-component']
		,regions : {
			main: '#community_wiki_detail_container'
		}
		,initialize : function(options) {
			this.routerData = {
				detail_type : 'Info'
			};
			this.routerData = $.extend({}, this.routerData, options.routerData);
		}
		,templateHelpers : function(){
 			return {
 				routerData : this.routerData
 			}
		}
		,onRender : function() {
			this.renderByRoute();
		}
		,onShow : function(){
			talent.app.vent.off("tab:community_type:change");
			talent.app.vent.on("tab:community_type:change", this.onTabClick, this);
		}
		,renderByRoute : function() {
			var routerData = this.routerData;
			var id = routerData.community_id;
			var self = this;
			if(id) {
				this.makeRequest('shetuan/get_st_allInfo_byId', {
					id : id
				}).done(function(resp){
					routerData.st_id = resp.st_detail[0].id;
					routerData.user_id = talent.Context.getUserInfo().id;
					if(talent.Context.getUserInfo().id == parseInt(resp.st_detail[0].leader_id)) {
						routerData.edit = true;
					}
					self['renderDetail' + routerData.detail_type + 'ItemView'](resp);
				});
				var tab = new BSTab({
					el : this.$el.find('#community_wiki_detail_tab')
					,eventTriggerName : 'community_type'
				})
				tab.setDefault({
					detail_type : self.routerData['detail_type']
				})
			} else {
				var communityWikiDetailEditItemView = new CommunityWikiDetailEditItemView({
					model : new talent.Model(),
					routerData : this.routerData
				});
				self.main.show(communityWikiDetailEditItemView);
				communityWikiDetailEditItemView.on('cancel',function() {
					window.location.hash = '#community_wiki'
				})
				communityWikiDetailEditItemView.on('update',function(resp) {
					talent.Context.setAlertTemplate(resp, $('#all_alert')).done(function(){	
						if(resp.code == 200) {
							window.location.hash = '#community_wiki?organize_type=' +self.routerData.organize_type + '&user_id=' + talent.Context.getUserInfo().id;			
						}else {
							return;
						}		
					});
				})
			}
		}
		,onTabClick : function(node){
			var routerData = talent.Context.parseUrl(node.attr('href'));
			this.routerData = $.extend({}, this.routerData, routerData);
			this['renderDetail' + routerData.detail_type + 'ItemView']();
		}
		,renderDetailInfoItemView : function() {
			var self = this;
			var id = this.routerData.community_id;		
			this.makeRequest('shetuan/get_st_allInfo_byId', {
				id : id
			}).done(function(resp) {
				self.communityWikiDetailView = new CommunityWikiDetailItemView({
					model : new talent.Model(resp),
					routerData : self.routerData
				});
				self.main.show(self.communityWikiDetailView);
				self.bindEvents(self.communityWikiDetailView);
			})
		}
		,renderDetailExperienceItemView : function() {
			var self = this;
			var id = this.routerData.community_id;
			this.makeRequest('stexp/list_all_stexp_by_stid', {
				st_id : id,
			}).done(function(resp) {
				self.communityWikiDetailExperienceItemView = new CommunityWikiDetailExperienceItemView({
					model : new talent.Model({
						data : resp
					}),
					routerData : self.routerData
				});
				self.main.show(self.communityWikiDetailExperienceItemView);
				self.bindEvents(self.communityWikiDetailExperienceItemView);
			})
		}
		,renderDetailMemberItemView : function() {
			var self = this;
			var id = this.routerData.community_id;	
			this.makeRequest('shetuan/get_st_allInfo_byId', {
				id : id
			}).done(function(resp) {
				self.communityWikiDetailMembertIemView = new CommunityWikiDetailMembertIemView({
					model : new talent.Model(resp),
					routerData : self.routerData
				});
				self.main.show(self.communityWikiDetailMembertIemView);
				self.bindEvents(self.communityWikiDetailMembertIemView);
			})
		}
		,renderDetailActivityItemView : function() {
			var self = this;
			var id = this.routerData.community_id;			
			this.makeRequest('shetuan/get_st_allInfo_byId', {
				id : id
			}).done(function(resp) {
				self.communityWikiDetailActivityItemView = new CommunityWikiDetailActivityItemView({
					model : new talent.Model(resp),
					routerData : self.routerData
				});
				self.main.show(self.communityWikiDetailActivityItemView);
			})
		}
		,renderDetailTaskItemView : function() {
			var self = this;
			var id = this.routerData.community_id;
			this.makeRequest('shetuan/get_st_allInfo_byId', {
				id : id
			}).done(function(resp) {
				self.communityWikiDetailTaskItemView = new CommunityWikiDetailTaskItemView({
					model : new talent.Model(resp),
					routerData : self.routerData
				});
				self.main.show(self.communityWikiDetailTaskItemView);
			})
		}
		,makeRequest : function(url, data) {
			var deferred = new $.Deferred();
			$.ajax({
				url : url,
				data : data,
				type : 'POST'
			}).done(function(resp){
				deferred.resolve(resp);
			})
			return deferred.promise();
		}
		,bindEvents : function(view) {
			var self = this;
			view.on('update', function(msg){
				talent.Context.setAlertTemplate(msg, $('#all_alert')).done(function(){					
					self.renderByRoute();
				});
			})
		}

	})

})