<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends CI_Controller
{
	function __construct()
	{
		parent::__construct();

		$this->load->helper('url');
		$this->load->library('session');
		$this->load->model('Muser');
		$this->load->model('Mmsg');
	}

	/* 首页  */
	function index()
	{
		$temp["tip_msg"] = " ";
		$this->load->view("login",$temp);

		// $this->load->view("register",$temp);
	}

	function register()
	{
		$temp["tip_msg"] = " ";
		$this->load->view("register",$temp);
	}

	function doLogin()
	{
		$temp['tip_msg'] = "";
		$result = $this->Muser->login();
		if (count($result) > 0) {
			$data = $result[0];
			$userdata = array('user_id' => $data->user_id, 'user_name' => $data->user_name);
			$this->session->set_userdata($userdata);
			// redirect("home");
			$this->Mmsg->showmessage('登陆成功','home');
		}else{
			$temp['tip_msg'] = "用户名或密码错误";
			$this->load->view("login",$temp);
		}
	}

	function doLogout()
	{
		$userdata = array('user_id' => '', 'user_name' => '');
		$this->session->unset_userdata($userdata);
		redirect("home");
	}

	function doRegister()
	{
		$result = $this->Muser->register();
		if ($result['id']) {
			$userdata = array('user_id' => $result['id'], 'user_name' => $result['name']);
			$this->session->set_userdata($userdata);
			$this->Mmsg->showmessage('注册成功','home');
		}else{
			$temp['tip_msg'] = "注册失败，请检查所填的信息";
			$this->load->view("register",$temp);
		}
	}
}

?>