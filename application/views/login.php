<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>蜜帅网-社团官网大本营</title>
    <link href="<?php echo site_url('style/bootstrap.min.css') ?>" rel="stylesheet" type="text/css" />
    <script src="<?php echo site_url('js/jquery/jquery.js') ?>" type="text/javascript"></script>
    <script src="<?php echo site_url('js/jquery/jquery.validate.js') ?>" type="text/javascript"></script>

    <style type="text/css">
    	.login {
    		width : 500px;
    		height: 300px;
    		margin: 100px auto;
    		padding: 20px;
    		border : 1px solid #ddd;
    	}
    	.btn_group {
    		text-align: center;
    	}
    </style>

    <SCRIPT language=javascript>
    	function validate() {
			$("login_form").validate({
				invalidHandler: function(e, validator) {
					var errors = validator.numberOfInvalids();
					if (errors) {
						$('.btn_submit').addClass('disabled');
					} 
				},
				submitHandler: function() {
					$("div.error").hide();
					alert("submit! use link below to go to the other step");
				},
				rules: {
					// simple rule, converted to {required:true}
					name: {
						required: true,
						minLength : 6
					},
					// compound rule
					pwd: {
					  required: true
					}
				}
				messages: {
					name: {
						required: "(必填)",
						minLength: "最少6位"
					},
					email: {
						required: "(必填)"
					}
				}
			});
		}
    </SCRIPT>
</head>
<body>
	<div class="login">
		<?php echo form_open('login/doLogin',array('onSubmit'=>'return validate();', 'id' => 'login_form'));?>
				<legend>用户登录</legend>
				<div class="control-group">
				    <label class="control-label" for="inputName">用户名：</label>
				    <div class="controls">
						<input class="form-control" type="text" id="inputName" name="name" placeholder="用户名">
				    </div>
				</div>
				<div class="control-group">
				    <label class="control-label" for="inputName">密码：</label>
				    <div class="controls">
						<input class="form-control" type="password" id="pwd" name="pwd" placeholder="密码">
				    </div>
				</div>
				<div>
					<span style="color:#FF0000"><?php echo $tip_msg;?></span>
				</div>
				<div class="control-group btn_group">
					<button type="submit" class="btn btn-success btn_submit">提交</button>
					<button type="reset" class="btn">取消</button>
				</div>
	</div> 
</body>
</html>
