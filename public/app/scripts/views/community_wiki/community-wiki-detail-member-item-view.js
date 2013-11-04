define(['talent'
	,'templates/community_wiki'
],function(talent
	,jst
) {
	return talent.ItemView.extend({
		template : jst['community_wiki/community-wiki-detail-member-item']
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
		,onDeleteHandler : function(ev) {
			var self = this;
			var id = talent.$(ev.currentTarget).parents('tr').attr('data-id');
			this.makeRequest('shetuan/delete_user_from_st', {
				ids_str : [id]
			}).done(function(resp){
				self.trigger('update', resp);
			})
		}
		,onRejectHandler : function(ev) {
			var self = this;
			var id = talent.$(ev.currentTarget).parents('tr').attr('data-id');
			this.makeRequest('shetuan/delete_user_req_to_st', {
				ids_str : [id]
			}).done(function(resp){
				self.trigger('update', resp);
			})
		}
		,onAllowHandler : function(ev) {
			var self = this;
			var id = talent.$(ev.currentTarget).parents('tr').attr('data-id');
			this.makeRequest('shetuan/add_user_to_st', {
				ids_str : [id]
			}).done(function(resp){
				self.trigger('update', resp);
			})
		}
		,makeRequest : function(url, data) {
			var deferred = new $.Deferred();
			data.st_id = this.routerData.st_id;
			data.user_id = this.routerData.user_id;
			$.ajax({
				url : url,
				data : data,
				type : 'POST'
			}).done(function(resp){
				deferred.resolve(resp);
			})
			return deferred.promise();
		}
	})
})