define(['talent'], function(talent) {
	return talent.Collection.extend({
		url:'/form_list',
		parse : function(response) {
			for(var i in response) {
				var dataSource = response[i].dataSource;
				var validate = response[i].validate;
				if(dataSource != '') {
					response[i].dataSource = JSON.parse(dataSource);
				}
				if(validate != '') {
					response[i].validate = JSON.parse(validate);
				}
			}
			return response;
		}
	})
})