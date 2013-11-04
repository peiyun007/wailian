<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mstexp extends CI_Model
{
	function __construct()
	{
		parent::__construct();

		$this->load->model('Mcheck');
	}

	function add_stexp()
	{
		$user_id = $this->input->post('user_id');
		$st_id = $this->input->post('st_id');
		$start_time = $this->input->post('start_time');
		$end_time = $this->input->post('end_time');
		$description = $this->input->post('description');

		if (!$this->Mcheck->validate_st_with_userId($st_id,$user_id)) {
			return  array('code' => CODE_FAIL, 'msg' => '无权限');
		}

		$queryStr =  <<<STR
		insert into tb_st_experience(st_id,start_time,end_time,description) values($st_id,'$start_time','$end_time','$description');
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功添加您的社团经历";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "添加社团经历失败，请重试或联系管理员";
		}
		return $result;
	}

	function update_stexp()
	{
		$user_id = $this->input->post('user_id');
		$st_id = $this->input->post('st_id');
		$id = $this->input->post('id');
		$start_time = $this->input->post('start_time');
		$end_time = $this->input->post('end_time');
		$description = $this->input->post('description');

		if (!$this->Mcheck->validate_st_with_userId($st_id,$user_id)) {
			return  array('code' => CODE_FAIL, 'msg' => '无权限');
		}

		$queryStr =  <<<STR
		update tb_st_experience set start_time='$start_time', end_time='$end_time', description='$description' where id=$id;
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功更新您的社团经历";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "更新社团经历失败，请重试或联系管理员";
		}
		return $result;
	}

	function delete_stexp()
	{
		$user_id = $this->input->post('user_id');
		$st_id = $this->input->post('st_id');
		$id = $this->input->post('id');

		if (!$this->Mcheck->validate_st_with_userId($st_id,$user_id)) {
			return  array('code' => CODE_FAIL, 'msg' => '无权限');
		}

		$queryStr =  <<<STR
		delete from tb_st_experience where id=$id;
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功删除您的社团经历";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "删除社团经历失败，请重试或联系管理员";
		}
		return $result;
	}

	function list_all_stexp_by_stid($st_id)
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT id,start_time,end_time,description
		FROM tb_st_experience
		WHERE st_id = $st_id
		LIMIT 0,$size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

}

/* End of file mhome.php */
/* Location: ./application/models/mhome.php */
?>