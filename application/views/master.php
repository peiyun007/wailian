<!DOCTYPE html>
<html>
  <head>
	<meta charset="utf-8" />
	<title><?php echo $title; ?></title>
	<!--RepoVersion:1018-->

	<link rel="stylesheet" type="text/css" href="http://www.myweb.com/styles/css/all.css"/>
	<!--hotfix css start-->
	<!--hotfix css end-->
	<script>
		var BSGlobal = {
			root: "/"
			, start: new Date
			, prefillingData: {}
			, container: "#bs_layout_container"
		};
	</script>
  </head>
  <body>
	<div id="bs_layout_container">

	</div>

	<div>
		<span>Userid:<?php echo $user_id; ?></span>
		<span>Userid:<?php echo $user_name; ?></span>
	</div>


	<script>

		//BSGlobal.staticPath='public/app';
		BSGlobal.staticPath='http://www.myweb.com';
		BSGlobal.entryPageId = '<?php echo $pageId; ?>';
		
		BSGlobal.loginUserInfo = {'id':<?php echo $user_id; ?> , 'name':'<?php echo $user_name; ?>'};

		BSGlobal.env = 'Development';
		BSGlobal.apiPath = 'http://webapi.bs-ux.com';
		BSGlobal.webPath = 'bs-ux.com';
	</script>
	<script src="http://www.myweb.com/scripts/vendor/components/requirejs/index.js" data-main="main"></script>

	<script type="text/javascript">			
		// BSGlobal.staticPath = '';
		requirejs.config({
			baseUrl: BSGlobal.staticPath+'/scripts',
			map: {
				'*': {
				//top channels start
				"views/home/index-page-view":"views/home/index-page-view",
				"views/community_wiki/index-page-view":"views/community_wiki/index-page-view",
				"views/enterprise_wiki/index-page-view":"views/enterprise_wiki/index-page-view",
				"views/task/index-page-view":"views/task/index-page-view",
				"views/activity/index-page-view":"views/activity/index-page-view",
				"views/extend/index-page-view":"views/extend/index-page-view"
				//top channels end
				}
			}
		});
		requirejs.config({
			map: {
				'*': {
				//hotfix js start
				//hotfix js end
				}
			}
		});
	</script>
  </body>
</html>