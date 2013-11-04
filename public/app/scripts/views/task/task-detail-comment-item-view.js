define(['talent'
	,'templates/task'
],function(talent
	,jst
) {
	return talent.ItemView.extend({
		template : jst['task/task-detail-comment']
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
		,onSubmitHandler : function() {
			var self = this;
			var description =  this.$el.find('textarea').val();
			if(description == '') return;
			var data = {};
			data['description'] = description;
			var url = this.updateId ? 'comment/update_qyneed_comment' : 'comment/add_qyneed_comment';
			console.log(this.updateId)
			if(this.updateId) {
				data['id'] = this.updateId;
			}
			this.makeRequest(url, data).done(function(resp) {
				self.updateId = null;
				self.trigger('update', resp);
			})
		}
		,onDeleteHandler : function(ev) {
			var id = $(ev.target).parents('li').attr('data-id');
			var self = this;
			this.makeRequest('comment/delete_qyneed_comment', {
				id : id
			}).done(function(resp) {
				self.trigger('update', resp);
			})
		}
		,onEditHandler : function(ev) {
			var id = $(ev.target).parents('li').attr('data-id');
			var self = this;
			this.updateId  = id;
			var data = this.model.get('data');
			var itemData = _.where(data, {id : id})[0];
			var description = itemData && itemData.description || '';
			this.$el.find('textarea').val(description);

		}
		,makeRequest : function(url, data) {
			var deferred = new $.Deferred();
			var obj = {
				qyneed_id : this.routerData.task_id,
				user_id : this.routerData.user_id,
			}

			$.ajax({
				url : url,
				data : $.extend({}, obj, data),
				type : 'POST'
			}).done(function(resp){
				deferred.resolve(resp);
			})
			return deferred.promise();
		}
	})
})