<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mqiye extends CI_Model
{
	function __construct()
	{
		parent::__construct();
	}

	/* 添加企业 */
	function add_qiye()
	{
		$name = $this->input->post('name');
		$province_id = $this->input->post('province_id');
		$city_id = $this->input->post('city_id');
		$user_id = $this->input->post('user_id');
		$description = $this->input->post('description');

		$queryStr = "INSERT INTO tb_qy(name,province_id,city_id,createUser_id,description)VALUES('$name',$province_id,$city_id,'$user_id','$description')";
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功提交您的创建企业申请，请耐心等待系统审核";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "申请失败，请联系管理员";
		}
		return $result;
	}

	/* 删企业 */
	function delete_qiye()
	{
		$id = $this->input->post('id');
		$user_id = $this->input->post('user_id');

		$queryStr = "DELETE FROM tb_qy where id=$id and createUser_id='$user_id'";
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "删除企业成功";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "删除企业失败，请重试或联系管理员";
		}
		return $result;
	}

	function update_qiye()
	{
		$user_id = $this->input->post('user_id');
		$id = $this->input->post('id');
		$name = $this->input->post('name');
		$province_id = $this->input->post('province_id');
		$city_id = $this->input->post('city_id');
		$description = $this->input->post('description');

		$queryStr = "UPDATE tb_qy set name='$name',province_id=$province_id,city_id=$city_id,description='$description' where id=$id and createUser_id = '$user_id'";
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "更新企业信息成功";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "更新企业信息失败，请重试或联系管理员";
		}
		return $result;
	}

	//列举出我的所有已经审核通过的企业
	function list_my_qy()
	{
		$start = $this->input->post('start');
		$size = $this->input->post('size');
		$user_id = $this->input->post('user_id');

		$queryStr =  <<<STR
		SELECT tb_qy.id, tb_qy.name, tb_user.true_name as create_user, tb_region_a.region_name as province_name,tb_region_b.region_name as city_name, tb_qy.description
		FROM tb_qy, tb_user,tb_region as tb_region_a,tb_region as tb_region_b
		WHERE tb_qy.status = 1 and tb_qy.createUser_id = $user_id and tb_qy.createUser_id = tb_user.id and tb_qy.province_id = tb_region_a.region_id and tb_qy.city_id = tb_region_b.region_id
		ORDER BY tb_qy.click_nums DESC 
		LIMIT $start,$size
STR;
		$query = $this->db->query($queryStr);
		$queryCountStr = <<<STR
		SELECT count(*) as total
		FROM tb_qy, tb_user,tb_region as tb_region_a,tb_region as tb_region_b
		WHERE tb_qy.status = 1 and tb_qy.createUser_id = $user_id and tb_qy.createUser_id = tb_user.id and tb_qy.province_id = tb_region_a.region_id and tb_qy.city_id = tb_region_b.region_id
		ORDER BY tb_qy.click_nums DESC 
STR;
		$queryCount = $this->db->query($queryCountStr);

		$temp['res'] = $query->result();
		$resu = $queryCount->result();
		$first = $resu[0];
		$total = $first->total;
		$temp['total'] = $total;
		return $temp;
	}

	function list_all_my_qy()
	{
		$user_id = $this->input->post('user_id');

		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT id as value, name as text
		FROM tb_qy
		WHERE tb_qy.status = 1 and tb_qy.createUser_id = $user_id
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	private function query_qy($start,$size)
	{
		$queryStr =  <<<STR
		SELECT tb_qy.id, tb_qy.name, tb_user.true_name as create_user, tb_region_a.region_name as province_name,tb_region_b.region_name as city_name, tb_qy.description, tb_qy.click_nums
		FROM tb_qy, tb_user,tb_region as tb_region_a,tb_region as tb_region_b
		WHERE tb_qy.status = 1 and tb_qy.createUser_id = tb_user.id and tb_qy.province_id = tb_region_a.region_id and tb_qy.city_id = tb_region_b.region_id 
		ORDER BY tb_qy.click_nums DESC 
		LIMIT $start , $size;
STR;
		return $queryStr;
	}

	private function query_qy_count()
	{
		$queryStr =  <<<STR
		SELECT count(*) as total
		FROM tb_qy, tb_user,tb_region as tb_region_a,tb_region as tb_region_b
		WHERE tb_qy.status = 1 and tb_qy.createUser_id = tb_user.id and tb_qy.province_id = tb_region_a.region_id and tb_qy.city_id = tb_region_b.region_id 
		ORDER BY tb_qy.click_nums DESC;
STR;
		return $queryStr;
	}

		/* 列出热门的10大企业 */
	function get_hotest_qy()
	{
		$queryStr = $this->query_qy(0,10);
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	/* 列出所有的企业 */
	function get_all_qy($start,$size)
	{
		$queryStr = $this->query_qy($start,$size);
		$query = $this->db->query($queryStr);
		$queryCountStr = $this->query_qy_count();
		$queryCount = $this->db->query($queryCountStr);
		$temp['res'] = $query->result();

		$resu = $queryCount->result();
		$first = $resu[0];
		$total = $first->total;
		$temp['total'] = $total;
		return $temp;
	}
	/* 根据地区信息来得到企业列表 */
		function list_qy_by_region()
	{
		$start = $this->input->post('start');
		$size = $this->input->post('size');
		$province_id = $this->input->post('province_id');
		$city_id = $this->input->post('city_id');

		$where_region;
		if ($province_id < 0) {
			$where_region = " ";
		}elseif ($city_id < 0) {
			$where_region = " and tb_qy.province_id = $province_id ";
		}else{
			$where_region = " and tb_qy.city_id = $city_id ";
		}
		$queryStr =  <<<STR
		SELECT tb_qy.id, tb_qy.name, tb_user.true_name as create_user, tb_region_a.region_name as province_name,tb_region_b.region_name as city_name, tb_qy.description
		FROM tb_qy, tb_user,tb_region as tb_region_a,tb_region as tb_region_b
		WHERE tb_qy.status = 1 and tb_qy.createUser_id = tb_user.id and tb_qy.province_id = tb_region_a.region_id and tb_qy.city_id = tb_region_b.region_id
		$where_region
		ORDER BY tb_qy.click_nums DESC 
		LIMIT $start,$size
STR;
		$query = $this->db->query($queryStr);

		$queryCountStr = <<<STR
		SELECT count(*) as total
		FROM tb_qy, tb_user,tb_region as tb_region_a,tb_region as tb_region_b
		WHERE tb_qy.status = 1 and tb_qy.createUser_id = tb_user.id and tb_qy.province_id = tb_region_a.region_id and tb_qy.city_id = tb_region_b.region_id
		$where_region
		ORDER BY tb_qy.click_nums DESC 
STR;
		$queryCount = $this->db->query($queryCountStr);

		$temp['res'] = $query->result();
		$resu = $queryCount->result();
		$first = $resu[0];
		$total = $first->total;
		$temp['total'] = $total;
		return $temp;
	}

	private	function get_qy_byId($id)
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT tb_qy.id, tb_qy.name,tb_qy.province_id,tb_qy.city_id,tb_region_a.region_name as province_name,tb_region_b.region_name as city_name, tb_qy.createUser_id, tb_user.true_name AS create_user, tb_qy.description, tb_qy.click_nums
		FROM tb_qy, tb_user,tb_region as tb_region_a,tb_region as tb_region_b
		WHERE tb_qy.id = $id and tb_qy.createUser_id = tb_user.id and tb_qy.province_id = tb_region_a.region_id and tb_qy.city_id = tb_region_b.region_id
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	/* 根据id查询这个企业参加过的所有的社团活动 */
	private function get_stNeed_byId($id)
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT tb_qy.name as qy_name, tb_stneed.id AS st_need_id, tb_stneed.title AS st_need_name
		FROM tb_st, tb_qy, tb_stneed, tb_qy_act_st
		WHERE tb_qy.status = 1  
		AND tb_qy.id = $id 
		AND tb_qy.id = tb_qy_act_st.qy_id
		AND tb_qy_act_st.stact_id = tb_stneed.id
		AND tb_stneed.st_id = tb_st.id
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	/* 根据id查询这个企业发布的所有需求 */
	private	function get_qyNeed_byId($id)
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT tb_qyneed.id, tb_qy.name, tb_qyneed.title, tb_user.true_name as publish_user, 
		date_format(tb_qyneed.publish_date,'%Y-%m-%d') as publish_date, tb_qyneed.money
		FROM tb_qy, tb_qyneed, tb_user
		WHERE tb_qy.status = 1  
		AND tb_qy.id = $id
		AND tb_qyneed.publisher_id = tb_user.id
		AND tb_qyneed.qy_id = tb_qy.id
		ORDER BY tb_qyneed.click_nums DESC
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	function get_qy_allInfo_byId()
	{
		$id = $this->input->post('id');
		$array = array(
			'qy_detail' => $this->get_qy_byId($id), 
			'qy_act_stNeed' => $this->get_stNeed_byId($id), 
			'qy_need' => $this->get_qyNeed_byId($id), );
		return $array;
	}

}

/* End of file mhome.php */
/* Location: ./application/models/mhome.php */
?>
