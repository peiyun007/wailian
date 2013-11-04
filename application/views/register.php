<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>蜜帅网-社团官网大本营</title>
    <link href="<?php echo site_url('style/bootstrap.min.css') ?>" rel="stylesheet" type="text/css" />
    <script src="<?php echo site_url('js/jquery/jquery.js') ?>" type="text/javascript"></script>
    <script src="<?php echo site_url('js/jquery/jquery.validate.js') ?>" type="text/javascript"></script>

    <style type="text/css">
    	.registe {
    		width : 500px;
    		height: 600px;
    		margin: 50px auto;
    		padding: 20px;
    		border : 1px solid #ddd;
    	}
    	.btn_group {
    		text-align: center;
    	}
    	.radio span {
    		margin-right: 30px;
    		display: inline-block;
    	}
    </style>
</head>
<body>
	<div class="registe">
		<?php echo form_open('login/doRegister',array('onSubmit'=>'return validate();', 'id' => 'login_form'));?>
			<legend>用户注册</legend>
			<div class="control-group">
			    <label class="control-label" for="inputName">用户名：</label>
			    <div class="controls">
					<input class="form-control" type="text"  name="name" placeholder="用户名">
			    </div>
			</div>
			<div class="control-group">
			    <label class="control-label" for="inputName">密码：</label>
			    <div class="controls">
					<input class="form-control" id="pwd" type="password" name="pwd" placeholder="密码">
			    </div>
			</div>
			<div class="control-group">
			    <label class="control-label" for="inputName">请再次输入密码：</label>
			    <div class="controls">
					<input class="form-control" type="password" name="re_pwd" placeholder="密码">
			    </div>
			</div>
			<div class="control-group">
			    <label class="control-label" for="inputName">邮箱：</label>
			    <div class="controls">
					<input class="form-control" type="text"  name="email" placeholder="邮箱">
			    </div>
			</div>
			<div class="control-group">
			    <label class="control-label" for="inputName">性别：</label>
			    <div class="controls">
			    	<label class="radio">
			    		<span>
							<input  value="男" type="radio"  name="sex" checked="true">男</input>
						</span>
						<span>
							<input 	value-"女" type="radio"  name="sex">女</input>
						</span>
					</label>
			    </div>
			</div>
			<div class="control-group">
			    <label class="control-label" for="inputName">手机号：</label>
			    <div class="controls">
					<input class="form-control" type="text"  name="phone" placeholder="手机号码">
			    </div>
			</div>
			<div>
					<span style="color:#FF0000"><?php echo $tip_msg;?></span>
			</div>
			<div class="control-group btn_group">
				<button type="submit" class="btn btn-success btn_submit">提交</button>
				<button type="cancel" class="btn">取消</button>
			</div>
	</div> 
	<script type="text/javascript">
		function validate() {
			$("#login_form").validate({
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
					name: {
						required: true,
						minLength : 6
					},
					pwd: {
					  required: true
					},
					repwd: {
						equalTo: '#pwd'
					},
					email : {
						required :true,
						email : true
					}
				}
				messages: {
					name: {
						required: "(必填)",
						minLength: "最少6位"
					},
					pwd: {
					    required: "(必填)"
					},
					repwd: {
						equalTo: "两次密码必须输入一致"
					},
					email : {
						required: "(必填)",
						email : "您的邮箱格式不正确"
					}
				}
			});
		}
		window.onload = function(){
			validate();
		};
	</script>
</body>
</html>
