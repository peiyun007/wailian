define(['talent'
	,'routers/home/index-router'
],function(talent
	,HomeRouter
){
	talent.app.addInitializer(function(){
		new HomeRouter;
	});
})