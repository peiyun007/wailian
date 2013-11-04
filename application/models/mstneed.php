<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mstneed extends CI_Model
{
	function __construct()
	{
		parent::__construct();

		$this->load->model('Mcheck');
	}
	
	function add_stneed()
	{
		$st_id = $this->input->post('st_id');
		$title = $this->input->post('title');
		$type_id = $this->input->post('type_id');
		$user_id = $this->input->post('user_id');
		$province_id = $this->input->post('province_id');
		$city_id = $this->input->post('city_id');
		$description = $this->input->post('description');
		$money = $this->input->post('money');

		if (!$this->Mcheck->validate_st_with_userId($st_id,$user_id)) {
			return  array('code' => CODE_FAIL, 'msg' => '无权限');
		}

		$queryStr =  <<<STR
		INSERT INTO tb_stneed( st_id,type_id,province_id,city_id, title, publisher_id, publish_date,description, money ) VALUES ( $st_id, $type_id,$province_id,$city_id, '$title', $user_id, NOW( ) ,'$description', $money)
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功提交您的社团需求";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "提交社团需求失败";
		}
		return $result;
	}

		function delete_stneed()
	{
		$id = $this->input->post('id');
		$st_id = $this->input->post('st_id');
		$user_id = $this->input->post('user_id');

		if (!$this->Mcheck->validate_st_with_userId($st_id,$user_id)) {
			return  array('code' => CODE_FAIL, 'msg' => '无权限');
		}

		$queryStr =  <<<STR
		delete from tb_stneed where id = $id
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功删除您的社团需求";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "删除社团需求失败";
		}
		return $result;
	}

	function update_stneed()
	{
		$id = $this->input->post('id');
		$st_id = $this->input->post('st_id');
		$title = $this->input->post('title');
		$type_id = $this->input->post('type_id');
		$user_id = $this->input->post('user_id');
		$province_id = $this->input->post('province_id');
		$city_id = $this->input->post('city_id');
		$description = $this->input->post('description');
		$money = $this->input->post('money');

		if (!$this->Mcheck->validate_st_with_userId($st_id,$user_id)) {
			return  array('code' => CODE_FAIL, 'msg' => '无权限');
		}

		$queryStr =  <<<STR
		update tb_stneed set type_id=$type_id,title='$title',publisher_id=$user_id,province_id=$province_id,city_id=$city_id, description='$description', money=$money where id = $id
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功更新您的社团需求";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "更新社团需求失败";
		}
		return $result;
	}

		function apply_stneed()
	{
		$stneed_id = $this->input->post('stneed_id');
		$qy_id = $this->input->post('qy_id');
		$user_id = $this->input->post('user_id');

		// $stneed_id = 1;
		// $qy_id = 1;
		// $user_id = 1;

		if (!$this->Mcheck->validate_qy_with_userId($qy_id,$user_id)) {
			return array('code' => CODE_FAIL,'msg' => '无权限',);
		}

		$result = array();
		$queryStr =  <<<STR
		SELECT * from tb_qy_act_st where stact_id = $stneed_id and qy_id = $qy_id;
STR;
		$query = $this->db->query($queryStr);
		if ($query->num_rows() > 0) {
			$result['code'] = CODE_FAIL;
			$result['msg'] = "已经提交过对该企业需求的申请";
			return $result;
		}

		$queryStr =  <<<STR
		INSERT INTO tb_qy_act_st(stact_id,qy_id,status) VALUES($stneed_id,$qy_id,0);
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功提交您对该企业需求的申请";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "提交申请失败";
		}
		return $result;
	}

	function list_all_stneed_type()
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT id as value, name as text
		FROM tb_stneed_type
		LIMIT 0,$size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	//列举出所有想申请该社团需求的企业
	function list_qy_request_stneed($stneed_id)
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT tb_qy_act_st.qy_id, tb_qy.name, tb_qy_act_st.status
		FROM tb_qy_act_st, tb_qy
		WHERE tb_qy_act_st.stact_id = $stneed_id
		AND tb_qy_act_st.qy_id = tb_qy.id
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	//批准社团获取该企业需求
	function approve_qy_to_stneed()
	{
		$user_id = $this->input->post('user_id');
		$st_id = $this->input->post('st_id');
		$stneed_id = $this->input->post('stneed_id');
		$ids_str = $this->input->post('ids_str');
		$qy_ids = explode(",", $ids_str);

		if (!$this->Mcheck->validate_st_with_userId($st_id,$user_id)) {
			return array('code' => CODE_FAIL,'msg' => '无权限',);
		}
		$flag = TRUE;
		foreach ($qy_ids as $key => $value) {
			$queryStr =  <<<STR
			UPDATE tb_qy_act_st SET STATUS =1 WHERE stact_id =$stneed_id AND qy_id =$value
STR;
			$query = $this->db->query($queryStr);
			if (!$query) {
				$flag = FALSE;
				break;
			}
		}
		if ($flag) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已批准该用户进入社团";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "批准用户加入社团失败，请重试或联系管理员";
		}
		return $result;
	}

	function refuse_qy_from_stneed()
	{
		$user_id = $this->input->post('user_id');
		$st_id = $this->input->post('st_id');
		$stneed_id = $this->input->post('stneed_id');
		$ids_str = $this->input->post('ids_str');
		$qy_ids = explode(",", $ids_str);

		if (!$this->Mcheck->validate_st_with_userId($st_id,$user_id)) {
			return array('code' => CODE_FAIL,'msg' => '无权限',);
		}
		$flag = TRUE;
		foreach ($qy_ids as $key => $value) {
			$queryStr =  <<<STR
			DELETE FROM tb_qy_act_st WHERE stact_id =$stneed_id AND qy_id = $value
STR;
			$query = $this->db->query($queryStr);
			if (!$query) {
				$flag = FALSE;
				break;
			}
		}
		if ($flag) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功移除该成员";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "移除成员失败，请重试或联系管理员";
		}
		return $result;
	}

	private function query_st_need($start,$size,$user_id=-1)
	{
		$where_userid = " ";
		if ($user_id > 0) {
			$where_userid = " and tb_st.leader_id = $user_id ";
		}
		$queryStr =  <<<STR
		SELECT tb_stneed.id, tb_stneed_type.name as stneed_type, tb_st.name as st_name, tb_st.leader_id, tb_stneed.title,
		tb_region_a.region_name as province_name,tb_region_b.region_name as city_name, tb_user.true_name as publisher_name, 
		date_format(tb_stneed.publish_date,'%Y-%m-%d') as publish_date, tb_stneed.description, tb_stneed.money
		FROM tb_st,tb_stneed_type, tb_stneed, tb_user, tb_region as tb_region_a, tb_region as tb_region_b
		WHERE tb_st.status = 1
		$where_userid
		AND tb_stneed.publisher_id = tb_user.id
		AND tb_stneed.type_id = tb_stneed_type.id
		AND tb_stneed.st_id = tb_st.id
		AND tb_stneed.province_id = tb_region_a.region_id
		AND tb_stneed.city_id = tb_region_b.region_id
		ORDER BY tb_stneed.click_nums DESC
		LIMIT $start , $size
STR;
		return $queryStr;
	}

	private function query_st_need_count($user_id=-1)
	{
		$where_userid = " ";
		if ($user_id > 0) {
			$where_userid = " and tb_st.leader_id = $user_id ";
		}
		$queryStr =  <<<STR
		SELECT count(*) as total 
		FROM tb_st,tb_stneed_type, tb_stneed, tb_user, tb_region as tb_region_a, tb_region as tb_region_b
		WHERE tb_st.status = 1
		$where_userid
		AND tb_stneed.publisher_id = tb_user.id
		AND tb_stneed.type_id = tb_stneed_type.id
		AND tb_stneed.st_id = tb_st.id
		AND tb_stneed.province_id = tb_region_a.region_id
		AND tb_stneed.city_id = tb_region_b.region_id
STR;
		return $queryStr;
	}

	function list_my_stneed()
	{
		$start = $this->input->post('start');
		$size = $this->input->post('size');
		$user_id = $this->input->post('user_id');

		// $start = 0;
		// $size = 30;
		// $user_id = 1;

		$queryStr = $this->query_st_need($start,$size,$user_id);
		$query = $this->db->query($queryStr);
		$queryCountStr = $this->query_st_need_count($user_id);
		$queryCount = $this->db->query($queryCountStr);
		$temp['res'] = $query->result();

		$resu = $queryCount->result();
		$first = $resu[0];
		$total = $first->total;
		$temp['total'] = $total;
		return $temp;
	}

	/* 列出热门的10大社团需求 */
	function list_hotest_st_need()
	{
		$queryStr =  $this->query_st_need(0,10);
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	/* 列出所有的企业需求 */
	function list_all_st_need($start,$size)
	{
		$queryStr = $this->query_st_need($start,$size);
		$query = $this->db->query($queryStr);
		$queryCountStr = $this->query_st_need_count();
		$queryCount = $this->db->query($queryCountStr);
		$temp['res'] = $query->result();

		$resu = $queryCount->result();
		$first = $resu[0];
		$total = $first->total;
		$temp['total'] = $total;
		return $temp;
	}

	/* 根据企业需求的类型、地区信息来得到企业列表 */
	function list_stneed_by_type_and_region()
	{
		$start = $this->input->post('start');
		$size = $this->input->post('size');
		$type_id = $this->input->post('type_id');
		$province_id = $this->input->post('province_id');
		$city_id = $this->input->post('city_id');

		// $start = 0;
		// $size = 10;
		// $type_id = 1;
		// $province_id = 2;
		// $city_id = 52;

		$what_type;
		if ($type_id < 0) {
			$what_type = " ";
		}else{
			$what_type = " and tb_stneed.type_id = $type_id ";
		}
		$where_region;
		if ($province_id < 0) {
			$where_region = " ";
		}elseif ($city_id < 0) {
			$where_region = " and tb_stneed.province_id = $province_id ";
		}else{
			$where_region = " and tb_stneed.city_id = $city_id ";
		}
		$queryStr =  <<<STR
		SELECT tb_stneed.id, tb_stneed_type.name as stneed_type, tb_st.leader_id, tb_st.name as st_name, tb_stneed.title,
		tb_region_a.region_name as province_name,tb_region_b.region_name as city_name, tb_user.true_name as publisher_name, 
		date_format(tb_stneed.publish_date,'%Y-%m-%d') as publish_date, tb_stneed.description, tb_stneed.money
		FROM tb_st,tb_stneed_type, tb_stneed, tb_user, tb_region as tb_region_a, tb_region as tb_region_b
		WHERE tb_st.status = 1
		$what_type $where_region
		AND tb_stneed.publisher_id = tb_user.id
		AND tb_stneed.type_id = tb_stneed_type.id
		AND tb_stneed.st_id = tb_st.id
		AND tb_stneed.province_id = tb_region_a.region_id
		AND tb_stneed.city_id = tb_region_b.region_id
		ORDER BY tb_stneed.click_nums DESC
		LIMIT $start , $size
STR;
		$query = $this->db->query($queryStr);

		$queryCountStr = <<<STR
		SELECT count(*) as total
		FROM tb_st,tb_stneed_type, tb_stneed, tb_user, tb_region as tb_region_a, tb_region as tb_region_b
		WHERE tb_st.status = 1
		$what_type $where_region
		AND tb_stneed.publisher_id = tb_user.id
		AND tb_stneed.type_id = tb_stneed_type.id
		AND tb_stneed.st_id = tb_st.id
		AND tb_stneed.province_id = tb_region_a.region_id
		AND tb_stneed.city_id = tb_region_b.region_id
STR;
		$queryCount = $this->db->query($queryCountStr);

		$temp['res'] = $query->result();
		$resu = $queryCount->result();
		$first = $resu[0];
		$total = $first->total;
		$temp['total'] = $total;
		return $temp;
	}

		function get_stneed_byId($id)
	{
		$queryStr =  <<<STR
		SELECT tb_stneed.id, tb_stneed_type.name as stneed_type,tb_st.id as st_id, tb_st.name as st_name, tb_stneed.title,
		tb_region_a.region_id as province_id, tb_region_b.region_id as city_id, tb_region_a.region_name as province_name,
		tb_region_b.region_name as city_name, tb_stneed.publisher_id, tb_user.true_name as publisher_name, date_format(tb_stneed.publish_date,'%Y-%m-%d') as publish_date, 
		tb_stneed.description, tb_stneed.money
		FROM tb_st,tb_stneed_type, tb_stneed, tb_user, tb_region as tb_region_a, tb_region as tb_region_b
		WHERE tb_stneed.id = $id
		AND tb_stneed.type_id = tb_stneed_type.id
		AND tb_stneed.st_id = tb_st.id
		AND tb_user.id = tb_stneed.publisher_id
		AND tb_stneed.province_id = tb_region_a.region_id
		AND tb_stneed.city_id = tb_region_b.region_id
		LIMIT 0 , 1
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

		function get_stneed_allInfo_byId()
	{
		$id = $this->input->post('id');
		$array = array(
			'stneed_detail' => $this->get_stneed_byId($id),
			'qy_list' => $this->list_qy_request_stneed($id) );
		return $array;
	}

	//下面是stneed需要的与qiye相关的
	function list_my_lead_qy()
	{
		$user_id = $this->input->post('user_id');

		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT tb_qy.id AS qy_id, tb_qy.name AS qy_name
		FROM tb_qy
		WHERE tb_qy.status =1
		AND tb_qy.createUser_id = $user_id
		ORDER BY tb_qy.click_nums DESC 
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	function list_stneed_qy_act($qy_id)
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT stact_id
		FROM tb_qy_act_st
		WHERE qy_id = $qy_id
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

}

?>