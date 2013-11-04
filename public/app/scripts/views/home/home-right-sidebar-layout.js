define(['talent'
	,'templates/home'
	,'views/home/home-right-sidebar-entity-composite-view'
],function(talent
	,jst
	,HomeRightSidebarEntityCompositeView
) {

	return talent.Layout.extend({
		template : jst['home/home-right-sidebar']
		,regions : {
			'enterprise' : '#home_right_hot_enterprise'
			,'community' : '#home_right_hot_community'
		}
		,initialize : function(){

		}
		,renderHotCommunityView : function() {
			var self = this;
			talent.$.ajax({
				'url' : 'index.php/shetuan/list_hotest_st'
				,'type': 'GET'
			}).done(function(resp){
				console.log(resp)
				var hotCommunityView = new HomeRightSidebarEntityCompositeView({
					model : new talent.Model({
						'title' : '活跃社团'
					}),
					collection : new talent.Collection(resp)
				})
				self.community.show(hotCommunityView);
			})
		}
		,renderHotEnterpriseView : function() {
			var self = this;
			talent.$.ajax({
				'url' : 'index.php/qiye/list_hotest_qy'
				,'type': 'GET'
			}).done(function(resp){
				console.log(resp)
				var hotEnterpriseView = new HomeRightSidebarEntityCompositeView({
					model : new talent.Model({
						'title' : '活跃企业'
					}),
					collection : new talent.Collection(resp)
				})
				self.enterprise.show(hotEnterpriseView);
			})
		}
		,onRender : function() {
			this.renderHotCommunityView();
			this.renderHotEnterpriseView();			
		}
	})
})