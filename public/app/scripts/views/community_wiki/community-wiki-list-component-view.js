define(['talent'
	,'templates/community_wiki'
	,'views/common/bs-tab/bs-tab'
	,'views/community_wiki/community-wiki-list-sub-tab-composite-view'
	,'views/community_wiki/community-wiki-list-sup-tab-composite-view'
	,'views/community_wiki/community-wiki-list-type-tab-composite-view'
	,'views/community_wiki/community-wiki-list-composite-view'
	,'$.paginate'
],function(talent
	,jst
	,BSTab
	,CommunityWikiListSubTabCompositeView
	,CommunityWikiListSupTabCompositeView
	,CommunityWikiListTypeCompositeView
	,CommunityWikiListCompositeView
) {

	return talent.Layout.extend({
		template : jst['community_wiki/community-wiki-list-component']
		,regions : {
			main: '#community_wiki_list'
			,typeTab : '#community_wiki_list_type_tab'
			,subTab : '#community_wiki_list_sub_tab'
			,supTab : '#community_wiki_list_sup_tab'
		}
		,initialize : function(options) {
			this.routerData = {
				organize_type : 'community'
				,province_id : -1
				,city_id : -1
				,type_id : -1
			};
			this.routerData = $.extend({}, this.routerData, options.routerData);
			this.pageData = {
				size : 5,
				start : 0
			}
		}
		,onRender : function() {
			this.renderCommunityListTypeTabView();
			this.renderCommunityListSupTabView();
			this.renderCommunityListSubTabView();
			this.renderCommunityWikiListView();
		}
		,onShow : function(){
			talent.app.vent.off("tab:community_type:change");
			talent.app.vent.on("tab:community_type:change", this.onTabClick, this);
			var tab = new BSTab({
				el : this.$el.find('#communtiy_organize')
			})
			tab.setDefault({
				organize_type : this.routerData['organize_type']
			})
		}
		,onTabClick : function(node) {
			var routerData = talent.Context.parseUrl(node.attr('href'));
			this.pageData.start = 0;
			if(this.showCommunityWikiDetail) {
				this.closeWikiDetail();
			}
			if(!routerData.type_id) {
				this.routerData = {
					'organize_type' : this.routerData.organize_type,
					'province_id' : routerData.province_id,
					'city_id' : routerData.city_id,
					'type_id' : this.routerData.type_id
				};
				if(!routerData.city_id) {
					this.renderCommunityListSupTabView();
				}
			} else {
				this.routerData = $.extend(this.routerData, routerData);
			}		
			this.renderCommunityWikiListView();
		}
		,renderCommunityListTypeTabView : function() {
			var self = this;
			var routerData = this.routerData;
			$.ajax({
				url : 'shetuan/list_all_st_type'
				,type : 'GET'
			}).done(function(resp) {

				var resp = [{value : '-1', text : '全部'}].concat(resp);
				var communityWikiListTypeCompositeView = new CommunityWikiListTypeCompositeView({
					collection : new talent.Collection(resp)
				})
				self.typeTab.show(communityWikiListTypeCompositeView);
				var tab = new BSTab({
					el : communityWikiListTypeCompositeView.$el
					,eventTriggerName : 'community_type'
				})
				tab.setDefault({
					type_id : self.routerData['type_id'] || -1
				})
				self.renderCommunityListSupTabView();
			})
		}
		,renderCommunityListSubTabView : function() {
			var self = this;
			var routerData = this.routerData;
			if(routerData.user_id) {
				var communityWikiListSubTabCompositeView = new CommunityWikiListSubTabCompositeView({
					collection : new talent.Collection([])
				})
				self.subTab.show(communityWikiListSubTabCompositeView);
			} else {
				$.ajax({
					url : 'region/list_all_province'
					,type : 'GET'
				}).done(function(resp) {
					var resp = [{value : '-1', text : '全部'}].concat(resp);
					var communityWikiListSubTabCompositeView = new CommunityWikiListSubTabCompositeView({
						collection : new talent.Collection(resp)
					})
					self.subTab.show(communityWikiListSubTabCompositeView);
					var tab = new BSTab({
						el : communityWikiListSubTabCompositeView.$el
						,eventTriggerName : 'community_type'
					})
					tab.setDefault({
						province_id : self.routerData['province_id'] || -1
					})
					self.renderCommunityListSupTabView();
				})
			}			
		}
		,renderCommunityListSupTabView : function() {
			var routerData = this.routerData;
			var self = this;
			if(routerData.province_id != -1) {
				$.ajax({
					url : 'region/list_all_city'
					,type : 'POST'
					,data : {
						province_id : routerData.province_id
					}
				}).done(function(resp){
					var resp = [{value : '-1', text : '全部'}].concat(resp);
					var communityWikiListSupTabCompositeView = new CommunityWikiListSupTabCompositeView({
						collection : new talent.Collection(resp),
						model : new talent.Model({
							province_id : routerData.province_id
						})
					})
					self.$el.find('#community_wiki_list_sup_tab').hide('slow', function(){
						self.supTab.show(communityWikiListSupTabCompositeView);
						self.$el.find('#community_wiki_list_sup_tab').show('slow');
						var tab = new BSTab({
							el : communityWikiListSupTabCompositeView.$el
							,eventTriggerName : 'community_type'
						})
						tab.setDefault({
							city_id : self.routerData['city_id'] || -1
						})
					});				
				})
			} else {
				self.$el.find('#community_wiki_list_sup_tab').hide('slow');
			}
		}
		,renderCommunityWikiListView : function() {
			var self = this;
			this.getListData().done(function(resp) {
				if(self.communityWikiListCompositeView) {
					var total = resp && resp.total || 0;
					if(self.communityWikiListCompositeView.model.get('total') != total){
						self.communityWikiListCompositeView.model.set('total', total);
						self.renderPagination();
					}
					self.communityWikiListCompositeView.collection.reset(resp && resp.res || []);
					return;
				}
				self.communityWikiListCompositeView = new CommunityWikiListCompositeView({
					collection : new talent.Collection( resp && resp.res || [])
					,model : new talent.Model({
						renderMine : self.routerData.user_id ? true : false
						,total : resp && resp.total
					})
				})
				self.main.show(self.communityWikiListCompositeView);
				self.renderPagination(resp && resp.total || 0);
				self.showCommunityWikiList = true;
				self.communityWikiListCompositeView.off('changeId');
				self.communityWikiListCompositeView.on('changeId', self.activeDetailIdChange, self);

				self.communityWikiListCompositeView.off('joinCommunity');
				self.communityWikiListCompositeView.on('joinCommunity', self.joinCommunity, self);
			})
		}
		,getListData : function() {
			var deferred = new $.Deferred();
			var routerData = this.routerData;
			var url, type;
			var data = {};
			if(routerData.user_id) {
				url = 'shetuan/list_my_st';
				data = {
					user_id : routerData.user_id
				}
			} else {
				url = 'shetuan/list_st_by_type_and_region_with_status';
				data = {type_id : routerData.type_id || -1 ,province_id : routerData.province_id || -1, city_id : routerData.city_id || -1};
				data['isZD'] = routerData.organize_type == 'community' ? 0 : 1;
			}
			data['user_id'] = talent.Context.getUserInfo().id;
			data['size'] = this.pageData.size;
			data['start'] = this.pageData.start;
			$.ajax({
				url : url
				,type : 'POST'
				, data : data 
			}).done(function(resp){
				console.log(resp)
				deferred.resolve(resp);
			})
			return deferred.promise();
		}
		,renderPagination : function(total) {
			var self = this;
			if(total == 0 || total == '0') {
				this.communityWikiListCompositeView.$el.find('#community_wiki_list_paginate').hide();
				return;
			}
			this.communityWikiListCompositeView.$el.find('#community_wiki_list_paginate').show().pagination(total,{
				items_per_page: this.pageData.size,
				num_display_entries: 10,
				current_page: this.pageData.start/this.pageData.size,
				num_edge_entries:1,
				link_to:"javascript:void(0)",
				prev_text:"前一页",
				next_text:"后一页",
				callback : function(pageId){
					var start = self.pageData.start;
					self.pageData.start = (pageId * self.pageData.size);
					self.pageStartChange(); 
				}
			})
		}
		,pageStartChange : function() {
			if(this.showCommunityWikiDetail) {
				this.closeWikiDetail();
			}
			this.renderCommunityWikiListView();
		}
	})

})