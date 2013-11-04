require(['vendor/talent/app'], function(app) {
	
	app.reqres.setHandler('*', function( options, operation ){
		alert('Default Collection is unavailable now!');		
		// var collection = new AllCollection();			
		// return collection[operation]( options );
	});
})