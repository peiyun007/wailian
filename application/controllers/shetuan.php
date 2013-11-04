<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Shetuan extends CI_Controller
{
	function __construct()
	{
		parent::__construct();

		$this->load->helper('url');

		$this->load->model('Mshetuan');
	}

	function add_st()
	{
		$result = $this->Mshetuan->add_st();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function delete_st()
	{
		$result = $this->Mshetuan->delete_st();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function update_st()
	{
		$result = $this->Mshetuan->update_st();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	//列举出我的所有的社团(包含已加入的和申请中的社团)
	function list_my_st()
	{
		$start = $this->input->post('start');
		$size = $this->input->post('size');
		$user_id = $this->input->post('user_id');

		$result = $this->Mshetuan->list_my_st($start,$size,$user_id);
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_all_my_st()
	{
		$result = $this->Mshetuan->list_all_my_st();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	//列举出所有想加入社团的用户
	function list_user_request_st()
	{
		$result = $this->Mshetuan->list_user_request_st();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	//用户申请加入社团
	function user_entry_st()
	{
		$result = $this->Mshetuan->user_entry_st();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	//批准用户进入社团
	function add_user_to_st()
	{
		$result = $this->Mshetuan->add_user_to_st();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function delete_user_from_st()
	{
		$result = $this->Mshetuan->delete_user_from_st();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_all_st_type()
	{
		$result = $this->Mshetuan->list_all_st_type();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_hotest_st()
	{
		$result = $this->Mshetuan->get_hotest_st();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_all_st()
	{
		$result = $this->Mshetuan->get_all_st();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_all_st_with_status()
	{
		$start = $this->input->post('start');
		$size = $this->input->post('size');
		$user_id = $this->input->post('user_id');

		// $start = 0;
		// $size = 30;
		// $user_id = 1;

		$result1 = $this->Mshetuan->get_all_st();
		$result2 = $this->Mshetuan->list_my_st(0,PHP_INT_MAX,$user_id);    //这里要查找所有的，不能用分页   
		$res_all = $result1['res'];
		$res_my = $result2['res'];
		foreach ($res_all as $key => $value) {
			$value->status = -1;
			for ($i=0; $i < count($res_my); $i++) { 
				$st = $res_my[$i];
				if ($st->id == $value->id) {
					$value->status = $st->status;
					break;
				}
			}
		}
		
		$result = $result1;
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_st_by_type_and_region()
	{
		$result = $this->Mshetuan->list_st_by_type_and_region();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_st_by_type_and_region_with_status()
	{
		$start = $this->input->post('start');
		$size = $this->input->post('size');
		$user_id = $this->input->post('user_id');

		// $start = 0;
		// $size = 30;
		// $user_id = 1;

		$result1 = $this->Mshetuan->list_st_by_type_and_region();
		$result2 = $this->Mshetuan->list_my_st(0,PHP_INT_MAX,$user_id);
		$res_all = $result1['res'];
		$res_my = $result2['res'];
		foreach ($res_all as $key => $value) {
			$value->status = -1;
			for ($i=0; $i < count($res_my); $i++) { 
				$st = $res_my[$i];
				if ($st->id == $value->id) {
					$value->status = $st->status;
					break;
				}
			}
		}
		
		$result = $result1;
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function get_st_allInfo_byId()
	{
		$result = $this->Mshetuan->get_st_allInfo_byId();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}


	
}

?>
