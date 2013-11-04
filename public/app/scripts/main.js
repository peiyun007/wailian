/**
 * Project entry function <br />
 * @name module:main~init
 */
 require(['config'], function(mainConfigFile){
	require(['talent','collections/index', 'routers/index', 'helpers/index', 'network/index'],
		function(talent, IndexCollection, IndexRouter, IndexHelper, IndexNetwork){
			talent.app.start(
				talent._.extend({},window.BSGlobal || {})
			);
	});
});