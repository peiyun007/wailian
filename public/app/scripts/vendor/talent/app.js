define(['underscore','marionette'], function(_,Marionette) {
	
	var app =  new Marionette.Application();

	app.reqres.request = function() {

		if(arguments[0] === undefined) {
			throw new Error("No request name!")
		}

		var config = this._wreqrHandlers[arguments[0]];
		var name = arguments[0].indexOf(":") !== -1 ? arguments[0].split(":") : arguments[0];
		var args = Array.prototype.slice.call(arguments, 1);

		if( name[1] ) {
			Array.prototype.push.call(args, name[1]);
		}

		if(config === undefined) {
			config = this._wreqrHandlers[name[0] || name];
			if (config === undefined) {
				config = this._wreqrHandlers["*"];
			}
		}		
		return config.callback.apply(config.context, args);
	}

	return app;
})

