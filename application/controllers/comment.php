<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Comment extends CI_Controller
{
	function __construct()
	{
		parent::__construct();

		$this->load->helper('url');

		$this->load->model('Mcomment');
	}

	function add_stneed_comment()
	{
		$result = $this->Mcomment->add_stneed_comment();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function update_stneed_comment()
	{
		$result = $this->Mcomment->update_stneed_comment();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function delete_stneed_comment()
	{
		$result = $this->Mcomment->delete_stneed_comment();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}


	function list_comments_by_stneed_id()
	{
		$result = $this->Mcomment->list_comments_by_stneed_id();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function add_qyneed_comment()
	{
		$result = $this->Mcomment->add_qyneed_comment();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function update_qyneed_comment()
	{
		$result = $this->Mcomment->update_qyneed_comment();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function delete_qyneed_comment()
	{
		$result = $this->Mcomment->delete_qyneed_comment();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_comments_by_qyneed_id()
	{
		$result = $this->Mcomment->list_comments_by_qyneed_id();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}


}

?>