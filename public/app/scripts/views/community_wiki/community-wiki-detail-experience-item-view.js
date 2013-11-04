define(['talent'
	,'templates/community_wiki'

],function(talent
	,jst
) {
	return talent.ItemView.extend({
		template : jst['community_wiki/community-wiki-detail-experience-item']
		,initialize : function(options) {
			var options = options || {};
			this.routerData = options.routerData;
			this.templateHelpers = {
				routerData : options.routerData
			}
		}
		,ui : {
			'edit' : '#edit_container'
		}
		,events : {
			'click a' : 'onHandler'
		}
		,onHandler : function(ev) {
			var handler = $(ev.currentTarget).attr('data-handler');
			this['on' + handler + 'Handler'] && this['on' + handler + 'Handler'](ev);
		}
		,onAddHandler : function(ev) {
			var self = this;
			if(self.showEdit) {
				this.ui.edit.slideUp('slow');
			}
			this.id = -1;
			this.setData({
				'description' : '',
				'start_time' : '',
				'end_time' : ''
			});
			this.ui.edit.slideDown('slow', function(){
				self.showEdit = true;
			});
		}
		,onUpdateHandler : function(ev) {
			if(self.showEdit) {
				this.ui.edit.slideUp('slow');
			}
			this.id = $(ev.currentTarget).parents('li').attr('data-id');
			var data =_.where(this.model.get('data'), {id : this.id})[0];
			this.setData(data);
			this.ui.edit.slideDown('slow');
			this.showEdit = true;
		}
		,onDeleteHandler : function(ev) {
			var self = this;
			this.id = $(ev.currentTarget).parents('li').attr('data-id');
			this.makeRequest('stexp/delete_stexp', {
				id : this.id
			}).done(function(resp){
				self.trigger('update',resp);
			})
		}
		,onSubmitHandler : function(ev) {
			var self = this;
			var url = this.id == -1 ? 'stexp/add_stexp' : 'stexp/update_stexp';
			var data = this.getData();
			if(!(this.id == -1)) data.id = this.id;
			this.makeRequest(url , data).done(function(resp){
				self.trigger('update', resp);
			});
		}
		,onCancelHandler : function(ev) {
			this.$el.find('#edit_container').slideUp('slow');
			this.showEdit = false;
		}
		,getData : function() {
			return {
				'description' : this.ui.edit.find('[name="description"]').val(),
				'start_time' : this.ui.edit.find('[name="start_time"]').val(),
				'end_time' : this.ui.edit.find('[name="end_time"]').val()
			}
		}
		,setData : function(data) {
			var self = this;
			_.each(data, function(value,key) {
				self.ui.edit.find('[name="'+ key +'"]').val(value);
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