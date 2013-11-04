<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Menu extends CI_Controller {
	function __construct()
	{
		parent::__construct();
		$this->load->model('check');
	}
	function top()
	{
		$temp['username']=$this->session->userdata('manager');
		$this->load->view('admin/top',$temp);
	}
	function main()
	{
		$this->load->view('admin/main');
	}
	// function left()
	// {
	// 	$this->load->view('admin/menu/menu');
	// }
	function st_manage()
	{
		$this->load->view('admin/menu/st_manage');
	}
	function qy_manage()
	{
		$this->load->view('admin/menu/qy_manage');
	}
	function st_need_manage()
	{
		$this->load->view('admin/menu/st_need_manage');
	}
	function qy_need_manage()
	{
		$this->load->view('admin/menu/qy_need_manage');
	}
	function qita_manage()
	{
		$this->load->view('admin/menu/qita_manage');
	}
	function user_manage()
	{
		$this->load->view('admin/menu/user_manage');
	}
	function sys_manage()
	{
		$this->load->view('admin/menu/sys_manage');
	}
}
?>