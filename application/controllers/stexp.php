<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Stexp extends CI_Controller
{
	function __construct()
	{
		parent::__construct();

		$this->load->helper('url');

		$this->load->model('Mstexp');
	}

	function add_stexp()
	{
		$result = $this->Mstexp->add_stexp();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function update_stexp()
	{
		$result = $this->Mstexp->update_stexp();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function delete_stexp()
	{
		$result = $this->Mstexp->delete_stexp();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	
	function list_all_stexp_by_stid()
	{
		$st_id = $this->input->post('st_id');
		$result = $this->Mstexp->list_all_stexp_by_stid($st_id);
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

}

?>