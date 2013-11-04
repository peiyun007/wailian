<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mqyneed extends CI_Model
{
	function __construct()
	{
		parent::__construct();

		$this->load->model('Mcheck');
	}

	function add_qyneed()
	{
		$qy_id = $this->input->post('qy_id');
		$title = $this->input->post('title');
		$type_id = $this->input->post('type_id');
		$user_id = $this->input->post('user_id');
		$province_id = $this->input->post('province_id');
		$city_id = $this->input->post('city_id');
		$description = $this->input->post('description');
		$money = $this->input->post('money');

		if (!$this->Mcheck->validate_qy_with_userId($qy_id,$user_id)) {
			return  array('code' => CODE_FAIL, 'msg' => '无权限');
		}

		$queryStr =  <<<STR
		INSERT INTO tb_qyneed( qy_id,type_id, title, publisher_id,province_id,city_id, publish_date,description, money ) 
		 VALUES ( $qy_id,$type_id,  '$title', $user_id,$province_id,$city_id, NOW( ) ,'$description', $money)
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功提交您的企业需求";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "提交企业需求失败";
		}
		return $result;
	}

	function delete_qyneed()
	{
		$id = $this->input->post('id');
		$qy_id = $this->input->post('qy_id');
		$user_id = $this->input->post('user_id');

		if (!$this->Mcheck->validate_qy_with_userId($qy_id,$user_id)) {
			return  array('code' => CODE_FAIL, 'msg' => '无权限');
		}

		$queryStr =  <<<STR
		delete from tb_qyneed where id = $id
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功删除您的企业需求";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "删除企业需求失败";
		}
		return $result;
	}

	function update_qyneed()
	{
		$id = $this->input->post('id');
		$qy_id = $this->input->post('qy_id');
		$title = $this->input->post('title');
		$type_id = $this->input->post('type_id');
		$user_id = $this->input->post('user_id');
		$province_id = $this->input->post('province_id');
		$city_id = $this->input->post('city_id');
		$description = $this->input->post('description');
		$money = $this->input->post('money');

		if (!$this->Mcheck->validate_qy_with_userId($qy_id,$user_id)) {
			return  array('code' => CODE_FAIL, 'msg' => '无权限');
		}

		$queryStr =  <<<STR
		update tb_qyneed set type_id=$type_id, title='$title',publisher_id=$user_id,province_id=$province_id,city_id=$city_id,description='$description', money=$money where id = $id
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功更新您的企业需求";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "更新企业需求失败";
		}
		return $result;
	}

	//下面是当前user与qyneed相关的
	function list_user_act_qyneed()
	{
		$user_id = $this->input->post('user_id');

		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT qyact_id,status 
		FROM tb_user_act_qy
		WHERE user_id = $user_id
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	function user_apply_qyneed()
	{
		$qyneed_id = $this->input->post('qyneed_id');
		$user_id = $this->input->post('user_id');

		$result = array();
		$queryStr =  <<<STR
		SELECT * from tb_user_act_qy where user_id = $user_id and qyact_id = $qyneed_id;
STR;
		$query = $this->db->query($queryStr);
		if ($query->num_rows() > 0) {
			$result['code'] = CODE_FAIL;
			$result['msg'] = "已经提交过对该企业需求的申请";
			return $result;
		}
		$queryStr =  <<<STR
		INSERT INTO tb_user_act_qy(user_id,qyact_id,status) VALUES($user_id,$qyneed_id,0);
STR;
		$query = $this->db->query($queryStr);
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功提交您对该企业需求的申请";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "提交申请失败";
		}
		return $result;
	}

	//批准用户获取该企业需求
	function approve_user_to_qyneed()
	{
		$user_id = $this->input->post('user_id');
		$qy_id = $this->input->post('qy_id');
		$qyneed_id = $this->input->post('qyneed_id');
		$ids_str = $this->input->post('ids_str');
		$user_ids = explode(",", $ids_str);

		if (!$this->Mcheck->validate_qy_with_userId($qy_id,$user_id)) {
			return array('code' => CODE_FAIL,'msg' => '无权限',);
		}
		$flag = TRUE;
		foreach ($user_ids as $key => $value) {
			$queryStr =  <<<STR
			UPDATE tb_user_act_qy SET STATUS =1 WHERE qyact_id =$qyneed_id AND user_id =$value
STR;
			$query = $this->db->query($queryStr);
			if (!$query) {
				$flag = FALSE;
				break;
			}
		}
		if ($flag) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已批准该用户的申请";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "批准用户的申请失败，请重试或联系管理员";
		}
		return $result;
	}

	function refuse_user_from_qyneed()
	{
		$user_id = $this->input->post('user_id');
		$qy_id = $this->input->post('qy_id');
		$qyneed_id = $this->input->post('qyneed_id');
		$ids_str = $this->input->post('ids_str');
		$user_ids = explode(",", $ids_str);

		if (!$this->Mcheck->validate_qy_with_userId($qy_id,$user_id)) {
			return array('code' => CODE_FAIL,'msg' => '无权限',);
		}
		$flag = TRUE;
		foreach ($user_ids as $key => $value) {
			$queryStr =  <<<STR
			DELETE FROM tb_user_act_qy WHERE qyact_id =$qyneed_id AND user_id = $value
STR;
			$query = $this->db->query($queryStr);
			if (!$query) {
				$flag = FALSE;
				break;
			}
		}
		if ($flag) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已拒绝该用户的申请";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "拒绝用户的申请失败，请重试或联系管理员";
		}
		return $result;
	}

		function list_user_request_qyneed($qyneed_id)
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT tb_user_act_qy.user_id, tb_user.true_name, tb_user_act_qy.status
		FROM tb_user_act_qy, tb_user
		WHERE tb_user_act_qy.qyact_id = $qyneed_id
		AND tb_user_act_qy.user_id = tb_user.id
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	//下面是社团与企业需求相关的
	function apply_qyneed()
	{
		$qyact_id = $this->input->post('qyact_id');
		$st_id = $this->input->post('st_id');
		$user_id = $this->input->post('user_id');

		// $qyact_id = 1;
		// $st_id = 3;
		// $user_id = 1;

		if (!$this->Mcheck->validate_st_with_userId($st_id,$user_id)) {
			return array('code' => CODE_FAIL,'msg' => '无权限',);
		}

		$result = array();
		$queryStr =  <<<STR
		SELECT * from tb_st_act_qy where qyact_id = $qyact_id and st_id = $st_id;
STR;
		$query = $this->db->query($queryStr);
		if ($query->num_rows() > 0) {
			$result['code'] = CODE_FAIL;
			$result['msg'] = "已经提交过对该企业需求的申请";
			return $result;
		}

		$queryStr =  <<<STR
		INSERT INTO tb_st_act_qy(qyact_id,st_id,status) VALUES($qyact_id,$st_id,0);
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

	function list_all_qyneed_type()
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT id as value, name as text
		FROM tb_qyneed_type
		LIMIT 0,$size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	//列举出所有想申请该企业需求的社团
	function list_st_request_qyneed($qyneed_id)
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT tb_st_act_qy.st_id, tb_st.name, tb_st_act_qy.status
		FROM tb_st_act_qy, tb_st
		WHERE tb_st_act_qy.qyact_id = $qyneed_id
		AND tb_st_act_qy.st_id = tb_st.id
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	//批准社团获取该企业需求
	function approve_st_to_qyneed()
	{
		$user_id = $this->input->post('user_id');
		$qy_id = $this->input->post('qy_id');
		$qyneed_id = $this->input->post('qyneed_id');
		$ids_str = $this->input->post('ids_str');
		$st_ids = explode(",", $ids_str);

		if (!$this->Mcheck->validate_qy_with_userId($qy_id,$user_id)) {
			return array('code' => CODE_FAIL,'msg' => '无权限',);
		}
		$flag = TRUE;
		foreach ($st_ids as $key => $value) {
			$queryStr =  <<<STR
			UPDATE tb_st_act_qy SET STATUS =1 WHERE qyact_id =$qyneed_id AND st_id =$value
STR;
			$query = $this->db->query($queryStr);
			if (!$query) {
				$flag = FALSE;
				break;
			}
		}
		if ($flag) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已批准该社团的申请";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "批准社团的申请失败，请重试或联系管理员";
		}
		return $result;
	}

	function refuse_st_from_qyneed()
	{
		$user_id = $this->input->post('user_id');
		$qy_id = $this->input->post('qy_id');
		$qyneed_id = $this->input->post('qyneed_id');
		$ids_str = $this->input->post('ids_str');
		$st_ids = explode(",", $ids_str);

		if (!$this->Mcheck->validate_qy_with_userId($qy_id,$user_id)) {
			return array('code' => CODE_FAIL,'msg' => '无权限',);
		}
		$flag = TRUE;
		foreach ($st_ids as $key => $value) {
			$queryStr =  <<<STR
			DELETE FROM tb_st_act_qy WHERE qyact_id =$qyneed_id AND st_id = $value
STR;
			$query = $this->db->query($queryStr);
			if (!$query) {
				$flag = FALSE;
				break;
			}
		}
		if ($flag) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已拒绝该社团的申请";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "拒绝社团的申请失败，请重试或联系管理员";
		}
		return $result;
	}

	private function query_qy_need($start,$size,$user_id=-1)
	{
		$where_userid = " ";
		if ($user_id > 0) {
			$where_userid = " and tb_qy.createUser_id = $user_id ";
		}
		$queryStr =  <<<STR
		SELECT tb_qyneed.id, tb_qyneed_type.name as type_name, tb_qy.name as qy_name, tb_qy.createUser_id ,
		tb_qyneed.title, tb_region_a.region_name as province_name,tb_region_b.region_name as city_name, 
		tb_user.true_name as publish_user, date_format(tb_qyneed.publish_date,'%Y-%m-%d') as publish_date, 
		tb_qyneed.money
		FROM tb_qy, tb_qyneed,tb_qyneed_type, tb_user, tb_region as tb_region_a, tb_region as tb_region_b
		WHERE tb_qy.status = 1
		$where_userid
		AND tb_qyneed.publisher_id = tb_user.id
		AND tb_qyneed.type_id = tb_qyneed_type.id 
		AND tb_qyneed.qy_id = tb_qy.id
		AND tb_qyneed.province_id = tb_region_a.region_id
		AND tb_qyneed.city_id = tb_region_b.region_id
		ORDER BY tb_qyneed.click_nums DESC
		LIMIT $start , $size
STR;
		return $queryStr;
	}

	private function query_qy_need_count($user_id=-1)
	{
		$where_userid = " ";
		if ($user_id > 0) {
			$where_userid = " and tb_qy.createUser_id = $user_id ";
		}

		$queryStr =  <<<STR
		SELECT count(*) as total
		FROM tb_qy, tb_qyneed, tb_user, tb_region as tb_region_a, tb_region as tb_region_b
		WHERE tb_qy.status = 1 
		$where_userid
		and tb_qyneed.publisher_id = tb_user.id
		AND tb_qyneed.qy_id = tb_qy.id
		AND tb_qyneed.province_id = tb_region_a.region_id
		AND tb_qyneed.city_id = tb_region_b.region_id
STR;
		return $queryStr;
	}

	function list_my_qyneed()
	{
		$start = $this->input->post('start');
		$size = $this->input->post('size');
		$user_id = $this->input->post('user_id');

		// $start = 0;
		// $size = 30;
		// $user_id = 1;

		$queryStr =  $this->query_qy_need($start,$size,$user_id);
		$query = $this->db->query($queryStr);
		$queryCountStr = $this->query_qy_need_count($user_id);
		$queryCount = $this->db->query($queryCountStr);

		$temp['res'] = $query->result();
		$resu = $queryCount->result();
		$first = $resu[0];
		$total = $first->total;
		$temp['total'] = $total;
		return $temp;
	}

	/* 列出热门的10大企业需求 */
	function get_hotest_qy_need()
	{
		$queryStr =  $this->query_qy_need(0,10);
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	/* 列出所有的企业需求 */
	function get_all_qy_need($start,$size)
	{
		$queryStr = $this->query_qy_need($start,$size);
		$query = $this->db->query($queryStr);
		$queryCountStr = $this->query_qy_need_count();
		$queryCount = $this->db->query($queryCountStr);
		$temp['res'] = $query->result();

		$resu = $queryCount->result();
		$first = $resu[0];
		$total = $first->total;
		$temp['total'] = $total;
		return $temp;
	}

	/* 根据企业需求的类型、地区信息来得到企业列表 */
	function list_qyneed_by_type_and_region()
	{
		$start = $this->input->post('start');
		$size = $this->input->post('size');
		$type_id = $this->input->post('type_id');
		$province_id = $this->input->post('province_id');
		$city_id = $this->input->post('city_id');

		// $start = 0;
		// $size = 30;
		// $type_id = 1;
		// $province_id = 2;
		// $city_id = 52;

		$what_type;
		if ($type_id < 0) {
			$what_type = " ";
		}else{
			$what_type = " and tb_qyneed.type_id = $type_id ";
		}
		$where_region;
		if ($province_id < 0) {
			$where_region = " ";
		}elseif ($city_id < 0) {
			$where_region = " and tb_qyneed.province_id = $province_id ";
		}else{
			$where_region = " and tb_qyneed.city_id = $city_id ";
		}
		$queryStr =  <<<STR
		SELECT tb_qyneed.id, tb_qy.name as qy_name, tb_qy.createUser_id ,tb_qyneed.title, 
		tb_region_a.region_name as province_name,tb_region_b.region_name as city_name, tb_user.true_name as publish_user,
		date_format(tb_qyneed.publish_date,'%Y-%m-%d') as publish_date, tb_qyneed.money
		FROM tb_qy, tb_qyneed, tb_user, tb_region as tb_region_a, tb_region as tb_region_b
		WHERE tb_qy.status = 1 
		$what_type $where_region
		AND tb_qyneed.publisher_id = tb_user.id
		AND tb_qyneed.qy_id = tb_qy.id
		AND tb_qyneed.province_id = tb_region_a.region_id
		AND tb_qyneed.city_id = tb_region_b.region_id
		ORDER BY tb_qyneed.click_nums DESC
		LIMIT $start , $size
STR;
		$query = $this->db->query($queryStr);

		$queryCountStr = <<<STR
		SELECT count(*) as total
		FROM tb_qy, tb_qyneed, tb_user, tb_region as tb_region_a, tb_region as tb_region_b
		WHERE tb_qy.status = 1 
		$what_type $where_region
		AND tb_qyneed.publisher_id = tb_user.id
		AND tb_qyneed.qy_id = tb_qy.id
		AND tb_qyneed.province_id = tb_region_a.region_id
		AND tb_qyneed.city_id = tb_region_b.region_id
STR;
		$queryCount = $this->db->query($queryCountStr);

		$temp['res'] = $query->result();
		$resu = $queryCount->result();
		$first = $resu[0];
		$total = $first->total;
		$temp['total'] = $total;
		return $temp;
	}

	function get_qyneed_byId($id)
	{
		$queryStr =  <<<STR
		SELECT tb_qyneed.id, tb_qy.id as qy_id, tb_qy.name as qy_name, tb_qyneed_type.name AS qyneed_type, tb_qyneed.title, 
		tb_region_a.region_id as province_id, tb_region_b.region_id as city_id, tb_region_a.region_name as province_name,
		tb_region_b.region_name as city_name,tb_qyneed.publisher_id, tb_user.true_name as publisher_name, 
		tb_qyneed.description,tb_qyneed.click_nums,tb_qyneed.money
		FROM tb_qyneed, tb_qyneed_type,tb_qy, tb_user ,tb_region as tb_region_a,tb_region as tb_region_b
		WHERE tb_qyneed.id = $id
		AND tb_qyneed.type_id = tb_qyneed_type.id
		AND tb_qyneed.qy_id = tb_qy.id
		AND tb_user.id = tb_qyneed.publisher_id
		AND tb_qyneed.province_id = tb_region_a.region_id
		AND tb_qyneed.city_id = tb_region_b.region_id
		LIMIT 0 , 1
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	function get_qyneed_allInfo_byId()
	{
		$id = $this->input->post('id');
		$array = array(
			'qyneed_detail' => $this->get_qyneed_byId($id),
			'st_list' => $this->list_st_request_qyneed($id),
			'user_list' => $this->list_user_request_qyneed($id));
		return $array;
	}

	//下面是qyneed需要的与shetuan相关的
	function list_my_entry_st()
	{
		$user_id = $this->input->post('user_id');

		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT tb_st.id as st_id, tb_st.name as st_name, tb_st.leader_id
		FROM tb_st,tb_st_user
		WHERE tb_st.status = 1
		AND tb_st_user.st_id = tb_st.id
		AND tb_st_user.user_id = $user_id
		ORDER BY tb_st.click_nums DESC 
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	function list_qyneed_st_act($st_id)
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT qyact_id 
		FROM tb_st_act_qy
		WHERE st_id = $st_id
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

}

?>