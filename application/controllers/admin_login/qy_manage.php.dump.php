<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Qy_manage extends CI_Controller {
	function __construct()
	{
		parent::__construct();
		$this->load->model('Mqiyi');
	}

	function list_all_qy()
	{
		$res = $this->Mqiyi->get_all_st();
		$temp['res']=$res;
		$this->load->view('admin/st/st_list',$temp);
	}

	function list_all_st_type()
	{
		$res = $this->Mqiyi->get_all_st_type();
		$temp['res']=$res;
		$this->load->view('admin/st/st_list',$temp);
	}
}

