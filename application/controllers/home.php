<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends CI_Controller
{
	function __construct()
	{
		parent::__construct();

		$this->load->helper('url');
		$this->load->library('session');

		$this->load->library('pagination');

		$this->load->model('Mhome');
	}

	/* 首页  */

	function index()
	{
		$data['title'] = 'Talent Index';
		$data['pageId'] = 'home';
		$user_id = $this->session->userdata('user_id');
		if (!$user_id) {
			$user_id = -1;
		}
		$data['user_id'] = $user_id;
		$data['user_name'] = $this->session->userdata('user_name');
		$this->load->view('master',$data);
	}
	
}

/* End of file home.php */
/* Location: ./application/controllers/home.php */
?>
