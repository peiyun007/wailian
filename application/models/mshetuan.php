<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mshetuan extends CI_Model
{
	function __construct()
	{
		parent::__construct();

		$this->load->model('Mcheck');

		$this->load->model('Mstexp');
	}

	function get_ZD()
	{
		$isZD = $this->input->post('isZD');
		if ($isZD && $isZD > 0) {
			$isZD = 1;
		}else{
			$isZD = 0;
		}
		return $isZD;
	}

	/* 添加社团 */
	function add_st()
	{
		$isZD = $this->get_ZD();
		$type_id = $this->input->post('type_id');
		$name = $this->input->post('name');
		$user_id = $this->input->post('user_id');
		$province_id = $this->input->post('province_id');
		$city_id = $this->input->post('city_id');
		$description = $this->input->post('description');

		if ($isZD > 0) {
			$query = $this->db->query("INSERT INTO tb_st(type_id,isZD, name,createUser_id,leader_id,province_id,city_id,create_Time,description,status)VALUES($type_id,1, '$name',$user_id,$user_id,$province_id,$city_id,now(),'$description',1)");
		}else{
			$query = $this->db->query("INSERT INTO tb_st(type_id,isZD, name,createUser_id,leader_id,province_id,city_id,create_Time,description,status)VALUES($type_id,0, '$name',$user_id,$user_id,$province_id,$city_id,now(),'$description',0)");
		}
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			if ($isZD > 0) {
				$result['msg'] = "已成功创建您的扎堆";
			}else{
				$result['msg'] = "已成功提交您的创建社团申请，请耐心等待系统审核";
			}
		}else{
			$result['code'] = CODE_FAIL;
			if ($isZD > 0) {
				$result['msg'] = "创建扎堆失败，请重试或联系管理员";
			}else{
				$result['msg'] = "申请创建社团失败，请重试或联系管理员";
			}
		}
		return $result;
	}

	/* 删社团 */
	function delete_st()
	{
		$isZD = $this->get_ZD();
		$id = $this->input->post('id');
		$user_id = $this->input->post('user_id');

		//注意下面的sql语句是leader_id而不是createUser_id字段，因为只有社团的团长才能删除社团
		$queryStr = "DELETE FROM tb_st where id=$id and leader_id=$user_id";
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			if ($isZD > 0) {
				$result['msg'] = "删除扎堆成功";
			}else{
				$result['msg'] = "删除社团成功";
			}
		}else{
			$result['code'] = CODE_FAIL;
			if ($isZD > 0) {
				$result['msg'] = "删除社团失败，请重试或联系管理员";
			}else{
				$result['msg'] = "删除扎堆失败，请重试或联系管理员";
			}
		}
		return $result;
	}

	function update_st()
	{
		$isZD = $this->get_ZD();
		$user_id = $this->input->post('user_id');
		$id = $this->input->post('id');
		$type_id = $this->input->post('type_id');
		$name = $this->input->post('name');
		$province_id = $this->input->post('province_id');
		$city_id = $this->input->post('city_id');
		$description = $this->input->post('description');

		$query = $this->db->query("UPDATE tb_st set type_id=$type_id, name='$name',province_id=$province_id,city_id=$city_id, description='$description' where id=$id and leader_id='$user_id'");
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			if ($isZD > 0) {
				$result['msg'] = "更新扎堆信息成功";
			}else{
				$result['msg'] = "更新社团信息成功";
			}
		}else{
			$result['code'] = CODE_FAIL;
			if ($isZD > 0) {
				$result['msg'] = "更新扎堆信息失败，请重试或联系管理员";
			}else{
				$result['msg'] = "更新社团信息失败，请重试或联系管理员";
			}
		}
		return $result;
	}

	function list_all_st_type()
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT id as value, name as text
		FROM tb_st_type
		LIMIT 0,$size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	private function query_my_st_req($start,$size,$user_id)
	{
		$queryStr =  <<<STR
		SELECT tb_st.id, tb_st.name, tb_user_a.true_name AS create_user, tb_user_b.true_name AS st_leader, tb_region_a.region_name as province_name,tb_region_b.region_name as city_name, tb_st.create_Time, tb_st.description, tb_st_user.status
		FROM tb_st, tb_user AS tb_user_a, tb_user AS tb_user_b, tb_region as tb_region_a, tb_region as tb_region_b, tb_st_user
		WHERE tb_st.status = 1
		AND tb_st_user.user_id = $user_id
		AND tb_st_user.st_id = tb_st.id
		AND tb_st.createUser_id = tb_user_a.id 
		AND tb_st.leader_id = tb_user_b.id
		AND tb_st.province_id = tb_region_a.region_id
		AND tb_st.city_id = tb_region_b.region_id
		ORDER BY tb_st.click_nums DESC 
		LIMIT $start , $size
STR;
		return $queryStr;
	}

	private function query_my_st_req_count($user_id)
	{
		$queryCountStr = <<<STR
		SELECT count(*) as total
		FROM tb_st, tb_user AS tb_user_a, tb_user AS tb_user_b, tb_region as tb_region_a, tb_region as tb_region_b, tb_st_user
		WHERE tb_st.status = 1
		AND tb_st_user.user_id = $user_id
		AND tb_st_user.st_id = tb_st.id
		AND tb_st.createUser_id = tb_user_a.id 
		AND tb_st.leader_id = tb_user_b.id
		AND tb_st.province_id = tb_region_a.region_id
		AND tb_st.city_id = tb_region_b.region_id
		ORDER BY tb_st.click_nums DESC 
STR;
		return $queryCountStr;
	}

	//列举出我的所有的社团(包含已加入的和申请中的社团)
	function list_my_st($start,$size,$user_id)
	{
		$queryStr =  $this->query_my_st_req($start,$size,$user_id);
		$query = $this->db->query($queryStr);
		$queryCountStr = $this->query_my_st_req_count($user_id);
		$queryCount = $this->db->query($queryCountStr);

		$temp['res'] = $query->result();
		$resu = $queryCount->result();
		$first = $resu[0];
		$total = $first->total;
		$temp['total'] = $total;
		return $temp;
	}

	function list_all_my_st()
	{
		$user_id = $this->input->post('user_id');

		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT id as value, name as text
		FROM tb_st
		WHERE tb_st.status = 1 and tb_st.leader_id = $user_id
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	//列举出所有想加入社团的用户
	function list_user_request_st($st_id)
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT tb_st_user.user_id,tb_user.true_name
		FROM tb_user, tb_st_user
		WHERE tb_st_user.st_id = $st_id
		AND tb_st_user.user_id = tb_user.id
		AND tb_st_user.status =0
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	//用户申请加入社团
	function user_entry_st()
	{
		$isZD = $this->get_ZD();
		$st_id = $this->input->post('st_id');
		$user_id = $this->input->post('user_id');

		$queryStr =  <<<STR
		insert into tb_st_user values($st_id,$user_id,0);
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "申请加入社团成功，请等待社团团长批准通过";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "申请加入社团失败，请重试或联系管理员";
		}
		return $result;
	}

	//批准用户进入社团
	function add_user_to_st()
	{
		$user_id = $this->input->post('user_id');
		$st_id = $this->input->post('st_id');
		$ids_str = $this->input->post('ids_str');
		$member_ids = explode(",", $ids_str);

		if (!$this->Mcheck->validate_st_with_userId($st_id,$user_id)) {
			return array('code' => CODE_FAIL,'msg' => '无权限',);
		}
		$flag = TRUE;
		foreach ($member_ids as $key => $value) {
			$queryStr =  <<<STR
			UPDATE tb_st_user SET STATUS =1 WHERE st_id =$st_id AND user_id =$value
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

	//移除社团成员
	function delete_user_from_st()
	{
		$user_id = $this->input->post('user_id');
		$st_id = $this->input->post('st_id');
		$ids_str = $this->input->post('ids_str');
		$member_ids = explode(",", $ids_str);

		if (!$this->Mcheck->validate_st_with_userId($st_id,$user_id)) {
			return array('code' => CODE_FAIL,'msg' => '无权限',);
		}
		$flag = TRUE;
		foreach ($member_ids as $key => $value) {
			$queryStr =  <<<STR
			DELETE FROM tb_st_user WHERE st_id =10 AND user_id =1
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

	//移除入团请求
	function delete_user_req_to_st()
	{
		$user_id = $this->input->post('user_id');
		$st_id = $this->input->post('st_id');
		$ids_str = $this->input->post('ids_str');
		$member_ids = explode(",", $ids_str);

		if (!$this->Mcheck->validate_st_with_userId($st_id,$user_id)) {
			return array('code' => CODE_FAIL,'msg' => '无权限',);
		}
		$flag = TRUE;
		foreach ($member_ids as $key => $value) {
			$queryStr =  <<<STR
			DELETE FROM tb_st_user WHERE st_id =10 AND user_id =1
STR;
			$query = $this->db->query($queryStr);
			if (!$query) {
				$flag = FALSE;
				break;
			}
		}
		if ($flag) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功移除该入团请求";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "移除该入团请求失败，请重试或联系管理员";
		}
		return $result;
	}

	private function query_st($start,$size)
	{
		$queryStr =  <<<STR
		SELECT tb_st.id, tb_st.name, tb_user_a.true_name AS create_user, tb_user_b.true_name AS st_leader, tb_region_a.region_name as province_name,tb_region_b.region_name as city_name, tb_st.create_Time
		FROM tb_st, tb_user AS tb_user_a, tb_user AS tb_user_b, tb_region as tb_region_a, tb_region as tb_region_b
		WHERE tb_st.status = 1
		AND tb_st.createUser_id = tb_user_a.id 
		AND tb_st.leader_id = tb_user_b.id
		AND tb_st.province_id = tb_region_a.region_id
		AND tb_st.city_id = tb_region_b.region_id
		ORDER BY tb_st.click_nums DESC 
		LIMIT $start , $size
STR;
		return $queryStr;
	}

		private function query_st_count()
	{
		$queryStr =  <<<STR
		SELECT count(*) as total
		FROM tb_st, tb_user AS tb_user_a, tb_user AS tb_user_b, tb_region as tb_region_a, tb_region as tb_region_b
		WHERE tb_st.status = 1
		AND tb_st.createUser_id = tb_user_a.id 
		AND tb_st.leader_id = tb_user_b.id
		AND tb_st.province_id = tb_region_a.region_id
		AND tb_st.city_id = tb_region_b.region_id
		ORDER BY tb_st.click_nums DESC 
STR;
		return $queryStr;
	}

	/* 列出热门的10大社团 */
	function get_hotest_st()
	{
		$queryStr =  $this->query_st(0,10);
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	/* 列出所有的社团 */
	function get_all_st()
	{
		$start = $this->input->post('start');
		$size = $this->input->post('size');

		$queryStr = $this->query_st($start,$size);
		$query = $this->db->query($queryStr);
		$queryCountStr = $this->query_st_count();
		$queryCount = $this->db->query($queryCountStr);
		$temp['res'] = $query->result();

		$resu = $queryCount->result();
		$first = $resu[0];
		$total = $first->total;
		$temp['total'] = $total;
		return $temp;
	}

		/* 根据社团类型、地区信息来得到社团列表 */
		function list_st_by_type_and_region()
	{
		$isZD = $this->get_ZD();

		$start = $this->input->post('start');
		$size = $this->input->post('size');
		$type_id = $this->input->post('type_id');
		$province_id = $this->input->post('province_id');
		$city_id = $this->input->post('city_id');

		// $isZD = 1;
		// $start = 0;
		// $size = 30;
		// $type_id = 2;
		// $province_id = 2;
		// $city_id = 52;

		$what_type = "";
		if ($type_id < 0) {
			$what_type = " ";
		}else{
			$what_type = " and tb_st.type_id = $type_id ";
		}
		$where_region = "";
		if ($province_id < 0) {
			$where_region = " ";
		}elseif ($city_id < 0) {
			$where_region = " and tb_st.province_id = $province_id ";
		}else{
			$where_region = " and tb_st.city_id = $city_id ";
		}

		$where_zd = " and tb_st.isZD = $isZD ";

		$queryStr =  <<<STR
		SELECT tb_st.id, tb_st.isZD, tb_st.name, tb_user_a.true_name AS create_user, tb_user_b.true_name AS st_leader,
		tb_region_a.region_name as province_name,tb_region_b.region_name as city_name, tb_st.create_Time
		FROM tb_st, tb_user AS tb_user_a, tb_user AS tb_user_b, tb_region as tb_region_a, tb_region as tb_region_b
		WHERE tb_st.status = 1 
		$what_type $where_region $where_zd
		AND tb_st.createUser_id = tb_user_a.id 
		AND tb_st.leader_id = tb_user_b.id
		AND tb_st.province_id = tb_region_a.region_id
		AND tb_st.city_id = tb_region_b.region_id
		ORDER BY tb_st.click_nums DESC 
		LIMIT $start,$size
STR;
		$query = $this->db->query($queryStr);

		$queryCountStr = <<<STR
		SELECT count(*) as total
		FROM tb_st, tb_user AS tb_user_a, tb_user AS tb_user_b, tb_region as tb_region_a, tb_region as tb_region_b
		WHERE tb_st.status = 1 
		$what_type $where_region $where_zd
		AND tb_st.createUser_id = tb_user_a.id 
		AND tb_st.leader_id = tb_user_b.id
		AND tb_st.province_id = tb_region_a.region_id
		AND tb_st.city_id = tb_region_b.region_id
		ORDER BY tb_st.click_nums DESC 
STR;
		$queryCount = $this->db->query($queryCountStr);

		$temp['res'] = $query->result();
		$resu = $queryCount->result();
		$first = $resu[0];
		$total = $first->total;
		$temp['total'] = $total;
		return $temp;
	}

	function get_st_byId($id)
	{
		$queryStr =  <<<STR
		SELECT tb_st.id, tb_st.type_id, tb_st_type.name AS st_type, tb_st.name AS st_name, tb_user_a.true_name AS create_user, tb_user_b.true_name AS leader, tb_st.leader_id, tb_region_a.region_id as province_id, tb_region_b.region_id as city_id, tb_region_a.region_name as province_name,tb_region_b.region_name as city_name, tb_st.create_Time, tb_st.click_nums
		FROM tb_st, tb_st_type, tb_user AS tb_user_a, tb_user AS tb_user_b,tb_region as tb_region_a,tb_region as tb_region_b
		WHERE tb_st.id = $id
		AND tb_st.type_id = tb_st_type.id
		AND tb_user_a.id = tb_st.createUser_id
		AND tb_user_b.id = tb_st.leader_id
		AND tb_st.province_id = tb_region_a.region_id
		AND tb_st.city_id = tb_region_b.region_id
		LIMIT 0 , 1
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	/* 根据id查询这个社团参加过的所有的企业活动 */
	function get_qyNeed_byId($id)
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT tb_st.name AS st_name, tb_qyneed.id AS qy_need_id, tb_qyneed.title AS qy_need_name
		FROM tb_qy, tb_st, tb_qyneed, tb_st_act_qy
		WHERE tb_st.status = 1 
		AND tb_st.id = $id 
		AND tb_st.id = tb_st_act_qy.st_id
		AND tb_st_act_qy.qyact_id = tb_qyneed.id
		AND tb_qyneed.qy_id = tb_qy.id
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	/* 根据id查询这个社团发布的所有需求 */
		function get_stNeed_byId($id)
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT tb_stneed.id, tb_st.name, tb_stneed.title, tb_user.true_name, date_format(tb_stneed.publish_date,'%Y-%m-%d') as publish_date, tb_stneed.money
		FROM tb_st, tb_stneed, tb_user
		WHERE tb_st.status = 1 
		AND tb_st.id = $id 
		AND tb_stneed.publisher_id = tb_user.id
		AND tb_stneed.st_id = tb_st.id
		ORDER BY tb_stneed.click_nums DESC
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	function get_st_members($id)
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT tb_st_user.user_id, tb_user.true_name AS user_name
		FROM tb_st_user, tb_user
		WHERE tb_st_user.st_id = $id
		AND tb_st_user.status =1
		AND tb_st_user.user_id = tb_user.id
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	function get_st_allInfo_byId()
	{
		$id = $this->input->post('id');
		$array = array(
			'st_detail' => $this->get_st_byId($id), 
			'st_act_qyNeed' => $this->get_qyNeed_byId($id), 
			'st_need' => $this->get_stNeed_byId($id), 
			'st_members' => $this->get_st_members($id), 
			'st_req_entry_users' => $this->list_user_request_st($id)
			);
		return $array;
	}

	//下面是CMS对应的

}

/* End of file mhome.php */
/* Location: ./application/models/mhome.php */
?>
