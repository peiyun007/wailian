define(['talent'
	,'templates/task'
],function(talent
	,jst
) {
	return talent.ItemView.extend({
		template : jst['task/task-detail-applicator-community']
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
		,onRejectHandler : function(ev) {
			var self = this;
			var id = talent.$(ev.currentTarget).parents('tr').attr('data-id');
			this.makeRequest('qyneed/refuse_st_from_qyneed', {
				ids_str : [id]
			}).done(function(resp){
				self.trigger('update', resp);
			})
		}
		,onAllowHandler : function(ev) {
			var self = this;
			var id = talent.$(ev.currentTarget).parents('tr').attr('data-id');
			this.makeRequest('qyneed/approve_st_to_qyneed', {
				ids_str : [id]
			}).done(function(resp){
				self.trigger('update', resp);
			})
		}
		,makeRequest : function(url, data) {
			var deferred = new $.Deferred();
			var obj = {
				qy_id : this.routerData.qy_id,
				qyneed_id : this.routerData.task_id,
				user_id : this.routerData.user_id,
				ids_str : data.ids_str.join(",")
			}		
			$.ajax({
				url : url,
				data : obj,
				type : 'POST'
			}).done(function(resp){
				console.log(resp)
				deferred.resolve(resp);
			})
			return deferred.promise();
		}
	})
})