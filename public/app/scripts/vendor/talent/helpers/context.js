/**
 * Context Object, pass global variable to all classes
 */
define(['jquery'], function($) {

	return {
		start: BSGlobal.start,
		/**
		 * 在全局存储中，通过key获取value
		 */
		getGlobal: function(key) {
			return BSGlobal[key];
		},
		/**
		 * 删除全局存储中的某个属性
		 */
		deleteGlobalProp: function(key) {
			delete BSGlobal[key];
		},
		/**
		 * 在全局存储中，设置key对应的value
		 */
		setGlobal: function(key, value) {
			BSGlobal[key] = value;
		},
		/**
		 * 修改页面的document.title
		 */
		setPageTitle: function(title) {
			document.title = title;
		},

		parseUrl :  function ( fragmentStr ) {
            var queryObject = {};
            if(!fragmentStr) return queryObject;
            var markIndex = fragmentStr.indexOf("?");

            // contain query string in fragments
            if(markIndex > -1){
                // build query object
                var queryString = fragmentStr.slice(markIndex+1);
                var queryArray = queryString.split('&');
                for (var i = 0; i < queryArray.length; i++) {
                    var queryPair = queryArray[i].split('=');
                    queryObject[queryPair[0]] = decodeURIComponent(queryPair[1]);
                }
            }
            return queryObject; 
        }
	};
});