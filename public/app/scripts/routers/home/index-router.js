define(['talent'],function(talent){
	return talent.Router.extend({
		routes: {
			"home/feeds": "handler"
		},
		handler: function(){
			alert('handler')
		}
	});
})