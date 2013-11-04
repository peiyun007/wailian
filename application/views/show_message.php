<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>蜜帅网-社团官网大本营</title>
</head>
<body>
	<div class="message">
		<?php echo $msg;?>
	</div> 
	<div>
		<span class="STYLE1">
				<?php if($auto): ?>
				<script>
					function redirect($url)
					{
						location = $url;	
					}
					setTimeout("redirect('<?php echo $goto; ?>');", 3000);
				</script>
				<a href="<?php echo $goto; ?>">如果您的浏览器没有自动跳转，请点这里继续</a>
                <?php endif; ?>
		</span>
	</div>
</body>
</html>
