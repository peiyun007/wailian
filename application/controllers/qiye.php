<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Qiye extends CI_Controller
{
	function __construct()
	{
		parent::__construct();

		$this->load->helper('url');

		$this->load->model('Mqiye');
	}

	function add_qiye()
	{
		$result = $this->Mqiye->add_qiye();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function delete_qiye()
	{
		$result = $this->Mqiye->delete_qiye();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function update_qiye()
	{
		$result = $this->Mqiye->update_qiye();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	/* 根据user_Id列举出我所有的企业 */
	function list_my_qy()
	{
		$result = $this->Mqiye->list_my_qy();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_all_my_qy()
	{
		$result = $this->Mqiye->list_all_my_qy();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	/* 列举出最热的十大企业  */
	function list_hotest_qy()
	{
		$result = $this->Mqiye->get_hotest_qy();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_all_qy()
	{
		$start = $this->input->post('start');
		$size = $this->input->post('size');
		$result = $this->Mqiye->get_all_qy($start,$size);
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_qy_by_region()
	{
		$result = $this->Mqiye->list_qy_by_region();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

		function get_qy_allInfo_byId()
	{
		$result = $this->Mqiye->get_qy_allInfo_byId();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}
	
}

/* End of file home.php */
/* Location: ./application/controllers/home.php */
?>
