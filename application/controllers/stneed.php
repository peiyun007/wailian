<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Stneed extends CI_Controller
{
	function __construct()
	{
		parent::__construct();

		$this->load->helper('url');

		$this->load->model('Mstneed');
	}

	function add_stneed()
	{
		$result = $this->Mstneed->add_stneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function delete_stneed()
	{
		$result = $this->Mstneed->delete_stneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function update_stneed()
	{
		$result = $this->Mstneed->update_stneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function apply_stneed()
	{
		$result = $this->Mstneed->apply_stneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function approve_qy_to_stneed()
	{
		$result = $this->Mstneed->approve_qy_to_stneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function refuse_qy_from_stneed()
	{
		$result = $this->Mstneed->refuse_qy_from_stneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_my_stneed()
	{
		$result = $this->Mstneed->list_my_stneed();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_hotest_st_need()
	{
		$result = $this->Mstneed->list_hotest_st_need();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_all_st_need()
	{
		$result = $this->Mstneed->list_all_st_need();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_all_stneed_type()
	{
		$result = $this->Mstneed->list_all_stneed_type();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	/* 根据企业需求的类型、地区信息来得到企业列表 */
	private function list_stneed_by_type_and_region()
	{
		$result = $this->Mstneed->list_stneed_by_type_and_region();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	/* 根据企业需求的类型、地区信息来得到企业列表 */
	function list_st_need_by_type_and_region_with_status()
	{
		$result1 = $this->Mstneed->list_stneed_by_type_and_region();
		$result2 = $this->Mstneed->list_my_stneed();
		$res_all = $result1['res'];
		$res_my = $result2['res'];
		foreach ($res_all as $key => $value) {
			$value->status = 0;
			for ($i=0; $i < count($res_my); $i++) { 
				$stneed = $res_my[$i];
				if ($stneed->id == $value->id) {
					$value->status = 1;
					break;
				}
			}
		}
		
		$result = $result1;
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function get_stneed_allInfo_byId()
	{
		$result = $this->Mstneed->get_stneed_allInfo_byId();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function get_addtional_info_of_stneed_list()
	{
		$my_qy = $this->Mstneed->list_my_lead_qy();
		foreach ($my_qy as $key => $value) {
			$qy_id = $value->qy_id;
			$stneed_list = $this->Mstneed->list_stneed_qy_act($qy_id);
			$stneed_array = array();
			for ($i=0; $i < count($stneed_list); $i++) { 
				$stneed = $stneed_list[$i];
				$stneed_array[$i] = $stneed->stact_id;
			}
			$list_str = implode(",", $stneed_array);
			$value->stneed_list = $list_str;
		}
		$result = array('my_qy_stneeds' => $my_qy);
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

}

?>