define(['talent'], function(talent) {
	return talent.Collection.extend({
		url:'/membership/details'
		,getData : function(data) {
			var deferred = new $.Deferred();
			var url = this.url;
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