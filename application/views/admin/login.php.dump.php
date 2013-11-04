<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML><HEAD><TITLE><?php echo site_url()?></TITLE>
<META http-equiv=Content-Type content="text/html; charset=gb2312"><LINK 
href="<?php echo base_url()?>images/southidc.css" rel=stylesheet>
<SCRIPT language=javascript>
<!--
function SetFocus()
{
if (document.Login.UserName.value=="")
	document.Login.UserName.focus();
else
	document.Login.UserName.select();
}
function CheckForm()
{
	if(document.Login.UserName.value=="")
	{
		alert("请输入用户名！");
		document.Login.UserName.focus();
		return false;
	}
	if(document.Login.Password.value == "")
	{
		alert("请输入密码！");
		document.Login.Password.focus();
		return false;
	}
	if (document.Login.CheckCode.value==""){
       alert ("请输入您的验证码！");
       document.Login.CheckCode.focus();
       return(false);
    }
}


//-->

</SCRIPT>
<script type="text/javascript">
function reloadCode() {
 var Pnk = document.getElementById("checkCodeImg");
 Pnk.src = "<?php echo site_url('admin_login/welcome/yzm')?>?tempstr=" + Math.random();
}
</script>
<STYLE type=text/css>.STYLE2 {
	COLOR: #cccccc
}
.STYLE3 {
	FONT-WEIGHT: bold; FONT-SIZE: 14px
}
</STYLE>

<META content="MSHTML 6.00.2900.6058" name=GENERATOR></HEAD>
<BODY class=bgcolor bgColor=#fffff6>
<P>&nbsp;</P>
<?php echo form_open('admin_login/welcome/check_login',array('onSubmit'=>'return CheckForm();','target'=>'_parent','name'=>'Login'));?>

<TABLE cellSpacing=0 cellPadding=0 align=center border=0>
  <TBODY>
  <TR>
    <TD><IMG height=46 alt=网站管理系统 src="<?php echo base_url()?>images/login_r.gif" width=515 
      border=0></TD></TR>
  <TR>
    <TD vAlign=top background=<?php echo base_url()?>images/login_l.gif height=211>
      <TABLE cellSpacing=5 cellPadding=0 width="60%" align=right border=0>
        <TBODY>
        <TR align=middle>
          <TD colSpan=2 height=38><SPAN class=STYLE3><FONT color=#000000>管 理 员 
            登 录</FONT></SPAN> </TD></TR>
        <TR>
          <TD align=right><B>用户名称：</B></TD>
          <TD><INPUT id=UserName4 
            onmouseover="this.style.background='#E1F4EE';" 
            style="BORDER-RIGHT: 1px solid; PADDING-RIGHT: 4px; BORDER-TOP: 1px solid; PADDING-LEFT: 4px; PADDING-BOTTOM: 1px; BORDER-LEFT: 1px solid; WIDTH: 160px; PADDING-TOP: 1px; BORDER-BOTTOM: 1px solid" 
            onfocus="this.select(); " 
            onmouseout="this.style.background='#FFFFFF'" maxLength=20 
            name=UserName></TD></TR>
        <TR>
          <TD align=right><B>用户密码：</B></TD>
          <TD><INPUT onMouseOver="this.style.background='#E1F4EE';" 
            style="BORDER-RIGHT: 1px solid; PADDING-RIGHT: 4px; BORDER-TOP: 1px solid; PADDING-LEFT: 4px; PADDING-BOTTOM: 1px; BORDER-LEFT: 1px solid; WIDTH: 160px; PADDING-TOP: 1px; BORDER-BOTTOM: 1px solid" 
            onfocus="this.select(); " 
            onmouseout="this.style.background='#FFFFFF'" type=password 
            maxLength=20 name=Password></TD></TR>
        <TR>
          <TD align=right><B>验 证 码：</B></TD>
          <TD><INPUT onMouseOver="this.style.background='#E1F4EE';" 
            style="BORDER-RIGHT: 1px solid; PADDING-RIGHT: 4px; BORDER-TOP: 1px solid; PADDING-LEFT: 4px; PADDING-BOTTOM: 1px; BORDER-LEFT: 1px solid; PADDING-TOP: 1px; BORDER-BOTTOM: 1px solid" 
            onfocus="this.select(); " 
            onmouseout="this.style.background='#FFFFFF'" maxLength=4 size=6 
            name=CheckCode id="CheckCode">            <a href="javascript:reloadCode();"><img src="<?php echo site_url('admin_login/welcome/yzm');?>" name="checkCodeImg" id="checkCodeImg" border="0" /></a></TD>
        </TR>
        <TR>
          <TD colSpan=2><span style="color:#FF0000"><?php echo $xinxi;?></span></TD>
        </TR>
        <TR>
          <TD colSpan=2>
            <DIV align=center><INPUT onMouseOver="this.style.backgroundColor='#ffffff'" style="BORDER-RIGHT: #e1f4ee 1px solid; BORDER-TOP: #e1f4ee 1px solid; FONT-SIZE: 9pt; BORDER-LEFT: #e1f4ee 1px solid; WIDTH: 60px; COLOR: #000000; BORDER-BOTTOM: #e1f4ee 1px solid; HEIGHT: 19px; BACKGROUND-COLOR: #e1f4ee" onMouseOut="this.style.backgroundColor='#E1F4EE'" type=submit value=" 确&nbsp;认 " name=Submit> 
            &nbsp; <INPUT id=reset onMouseOver="this.style.backgroundColor='#ffffff'" style="BORDER-RIGHT: #e1f4ee 1px solid; BORDER-TOP: #e1f4ee 1px solid; FONT-SIZE: 9pt; BORDER-LEFT: #e1f4ee 1px solid; WIDTH: 60px; COLOR: #000000; BORDER-BOTTOM: #e1f4ee 1px solid; HEIGHT: 19px; BACKGROUND-COLOR: #e1f4ee" onMouseOut="this.style.backgroundColor='#E1F4EE'" type=reset value=" 清&nbsp;除 " name=reset> 
            <BR></DIV></TD></TR>
        <TR>
        <TD colSpan=2>&nbsp;</TD></TR></TBODY></TABLE></TD></TR></TBODY></TABLE><BR>
<TABLE cellSpacing=0 cellPadding=0 width="75%" align=center border=0>
  <TBODY>
  <TR>
    <TD>&nbsp;</TD></TR>
  <TR>
    <TD>&nbsp;</TD></TR>
  <TR>
    <TD></TD></TR></TBODY></TABLE>
<P align=center><BR></P></FORM>
<SCRIPT language=JavaScript type=text/JavaScript>
CheckBrowser();
SetFocus(); 
</SCRIPT>
</BODY></HTML>
