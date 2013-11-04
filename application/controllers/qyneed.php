<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Qyneed extends CI_Controller
{
	function __construct()
	{
		parent::__construct();

		$this->load->helper('url');

		$this->load->model('Mqyneed');
	}

	function add_qyneed()
	{
		$result = $this->Mqyneed->add_qyneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function delete_qyneed()
	{
		$result = $this->Mqyneed->delete_qyneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function update_qyneed()
	{
		$result = $this->Mqyneed->update_qyneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	//下面是个人对企业需求的申请
	function user_apply_qyneed()
	{
		$result = $this->Mqyneed->user_apply_qyneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function approve_user_to_qyneed()
	{
		$result = $this->Mqyneed->approve_user_to_qyneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function refuse_user_from_qyneed()
	{
		$result = $this->Mqyneed->refuse_user_from_qyneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	//下面是社团对企业需求的申请
	function apply_qyneed()
	{
		$result = $this->Mqyneed->apply_qyneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_my_qyneed()
	{
		$result = $this->Mqyneed->list_my_qyneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function approve_st_to_qyneed()
	{
		$result = $this->Mqyneed->approve_st_to_qyneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function refuse_st_from_qyneed()
	{
		$result = $this->Mqyneed->refuse_st_from_qyneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	/* 列举出最热的十大企业需求  */
	function list_hotest_qy_need()
	{
		$result = $this->Mqyneed->get_hotest_qy_need();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_all_qyneed_type()
	{
		$result = $this->Mqyneed->list_all_qyneed_type();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	/* 根据企业需求的类型、地区信息来得到企业列表 */
	private function list_qyneed_by_type_and_region()
	{
		$result = $this->Mqyneed->list_qyneed_by_type_and_region();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_qyneed_by_type_and_region_with_status()
	{
		$result1 = $this->Mqyneed->list_qyneed_by_type_and_region();
		$result2 = $this->Mqyneed->list_my_qyneed();
		$res_all = $result1['res'];
		$res_my = $result2['res'];
		foreach ($res_all as $key => $value) {
			$value->status = -1;
			for ($i=0; $i < count($res_my); $i++) { 
				$qyneed = $res_my[$i];
				if ($qyneed->id == $value->id) {
					$value->status = 1;
					break;
				}
			}
		}
		
		$result = $result1;
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function get_qyneed_allInfo_byId()
	{
		$result = $this->Mqyneed->get_qyneed_allInfo_byId();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function get_addtional_info_of_qyneed_list()
	{
		$my_st = $this->Mqyneed->list_my_entry_st();
		foreach ($my_st as $key => $value) {
			$st_id = $value->st_id;
			$qyneed_list = $this->Mqyneed->list_qyneed_st_act($st_id);
			$qyneed_array = array();
			for ($i=0; $i < count($qyneed_list); $i++) { 
				$qyneed = $qyneed_list[$i];
				$qyneed_array[$i] = $qyneed->qyact_id;
			}
			$list_str = implode(",", $qyneed_array);
			$value->qyneed_list = $list_str;
		}
		$my_qyneeds = $this->Mqyneed->list_user_act_qyneed();
		$result = array('my_st_qyneeds' => $my_st, 
						'my_own_qyneeds' => $my_qyneeds);
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

}

?>