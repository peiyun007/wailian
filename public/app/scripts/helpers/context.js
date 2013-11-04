/**
 * Context Object, pass global variable to all classes
 */
define(['talent'], function(talent) {

	// all ajax apis have same domain except jsonp call
	var apiServer = BSGlobal.apiPath;

	var localContext = {
		/**
		 * 获取租户信息
		 * @return
		 * {"Id":200605,"Name":"wg","Domain":"abc.com","Abbreviation":"wg"}
		 */
		getTenantInfo: function() {
			return BSGlobal.tenantInfo;
		},
		/**
		 * 获取当前登录用户信息
		 * @return
		 * {"Email":"wg1@abc.com","Avatar":"http://st.tita.com/titacn/tita/common/images/default_man_small.jpg","Id":100217545,"Name":"wg","IsRoot":false,"Role":3}
		 */
		getUserInfo: function() {
			return BSGlobal.loginUserInfo;
		},
		/**
		 * 获取图片的完整路径
		 * @return
		 * http://static.beisen.co/recruit/release/app/images/bg.png
		 */
		getStaticUrl: function(url) {
			var staticServer = BSGlobal.staticPath;
			return staticServer + "/" + url;
		},
		/**
		 * 获取后台接口的完整路径
		 * @return
		 * http://recruit.tms.beisen.com/Rercruting/Jobs
		 */
		getApiUrl: function(url){
			var uid = this.getUserInfo().Id;
			var tid = this.getTenantInfo().Id;
			return apiServer + "/api/v1/"+tid+"/"+uid+"/" + url;
		},
		/**
		 * 获取后台接口的域名部分
		 * @return
		 * http://webapi.tita.com
		 */
		getApiHost: function(){
			return apiServer;
		},
		/**
		 * 获取后台JSONP接口的完整路径
		 * @return
		 * http://recruit.tms.beisen.com/Rercruting/Jobs
		 */
		getWebUrl: function(url){
			var http = "http://www.";
			if(BSGlobal.env == 'Testing'){
				http = "http://qa.";
			}
			return http + BSGlobal.webPath+"/" + url;
		},
		/**
		 * 获取登录URL
		 * @return
		 * http://tms.beisen.com/
		 */
		getLoginUrl: function() {
			var url = this.getWebUrl("Account/LogIn");
			return url + "?ReturnUrl=" + encodeURIComponent(location.href);
		}
		,getLoading: function(){
			var url = this.getStaticUrl('images/load_m.gif');
			var html = [
			'<div class="_tt_loading_m">',
			'  加载中...',
			'</div>'].join("");
			return html;
		}
		/**
		*获取 附件 类型
		*@return
		*/
		,getAttachmentType:function (argument) {
			return {
				"image":['jpg','png','gif','jpeg','JPG','PNG','GIF','JPEG'],
				"file":['rar','zip','exe','pdf','txt','doc','docx','ppt','pptx','XLS','XLSX','RAR','ZIP','EXE','PDF','TXT','DOC','DOCX','PPT','PPTX','XLS','XLSX'],
				"music":['mp3','wma','wav','flac','ape','ogg','aac','m4a','MP3','WMA','WAV','FLAC','APE','OGG','AAC','M4A'],
				"video":['mp4','mkv','rm','rmvb','avi','3gp','flv','wmv','asf','mpeg','mpg','mov','ts','m4v']
			}
		}
		/**
		*没有数据时，初始化template
		*@return
		*/
		,getEmptyTemplate:function(html){
			if(!html)return;
			var leng = html.replace(/<[^>].*?>/g,"").replace(/[&nbsp;]/g,'').length;
			var className = 'content_emptyinit'
			if(leng > 24){
				className = 'small_content_emptyinit'
			}
			var HTML = [
				'<div class="_tt_common_emptyinit">',
					'<div class="'+className+'">',
						html,
					'</div>',
				'</div>'
			].join('');
			return HTML;
		}
		,setAlertTemplate : function(res, dom) {
			var deferred = new $.Deferred();
			var $dom = $(dom);
			var res = res || {};
			var className = res.code == 200 ? 'alert alert-block alert-success' : 'alert alert-error';
			var message =  res.code == 200 ? '成功信息' : '失败信息';
			var HTML = [
				'<div class="' + className + '">',
				'	<a class="close" data-dismiss="alert">×</a>',
				'	<h4 class="alert-heading">'+ message +'</h4>' + res.msg,
				'</div>'
			].join("");
			$dom.empty().show().append(HTML);
			var settimeout  = setTimeout(function() {
				$dom.hide();
				deferred.resolve();
			}, 1000);
			$dom.off('click.close');
			$dom.on('click.close', '.close', function(){
				$dom.hide();
				clearTimeout(settimeout);
				deferred.resolve();
			})
			return deferred.promise();
		}
		/**
		*if has '_tt_layout_tabnav'
		*container auto client height
		*/
		,getMainRegionHeight : function() {
			var headH = talent.$("#header-region").outerHeight();
			var footH = talent.$("#footer-region").outerHeight();
			var mainH = talent.$("#main-region").outerHeight();
			var HH = $(window).height() - headH - footH;
			return HH;
		}
		,setMainRegionsHeight:function () {

			var self = this;
			
			var main = talent.$('#main-region');

			setHeight(main);
			var resizeDelay = talent._.debounce(function(){
				setHeight(main);
			}, 300);

			$(window).off('resize.baseMaterLayout');
			$(window).on('resize.baseMaterLayout', resizeDelay);

			function setHeight() {
				var headH = talent.$("#header-region").outerHeight();
				var footH = talent.$("#footer-region").outerHeight();
				var mainH = talent.$("#main-region").outerHeight();
				var HH = $(window).height() - headH - footH;
				main.css({"minHeight":HH});
			}
		}
		/**
		*接ajax url
		*例：&group_id=1&tag_type=1&tag_id=8&plan_table_id=3c788377-b9d2-45b0-a8b0-e4947a030a38&plan_item_id=295
		*/
		,splicingUrl:function(options,array){
			var array = array || [];
			var url = [];
			if(!array.length) return options;
			for(var i=0;i<array.length;i++){
				url.push(array[i] + "=" + options[array[i]]);
			}
			return url.join('&');
		}

	};

	talent.Context = talent._.extend(talent.Context, localContext);

	return talent.Context;
});