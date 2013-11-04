<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mcomment extends CI_Model
{
	function __construct()
	{
		parent::__construct();

	}

	private function validate_stneedComment_with_userId($id,$user_id)
	{
		$queryStr = "SELECT COUNT( * ) as total  FROM tb_stneed_comment WHERE id = $id	AND user_id = $user_id";
		$query = $this->db->query($queryStr);
		$result = $query->result();
		if ($query->num_rows() > 0) {
			return TRUE;
		}
		return FALSE;
	}

	private function validate_qyneedComment_with_userId($id,$user_id)
	{
		$queryStr = "SELECT COUNT( * ) as total  FROM tb_qyneed_comment WHERE id = $id	AND user_id = $user_id";
		$query = $this->db->query($queryStr);
		$result = $query->result();
		if ($query->num_rows() > 0) {
			return TRUE;
		}
		return FALSE;
	}

	function add_stneed_comment()
	{
		$user_id = $this->input->post('user_id');
		$stneed_id = $this->input->post('stneed_id');
		$description = $this->input->post('description');

		$queryStr =  <<<STR
		insert into tb_stneed_comment(user_id,stneed_id,comment_time,description) values($user_id,$stneed_id,NOW(),'$description');
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功添加您的评论";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "添加评论失败，请重试或联系管理员";
		}
		return $result;
	}

	function update_stneed_comment()
	{
		$id = $this->input->post('id');
		$user_id = $this->input->post('user_id');
		$stneed_id = $this->input->post('stneed_id');
		$description = $this->input->post('description');

		if (!$this->validate_stneedComment_with_userId($id,$user_id)) {
			return  array('code' => CODE_FAIL, 'msg' => '无权限');
		}

		$queryStr =  <<<STR
		update tb_stneed_comment set stneed_id=$stneed_id,comment_time=NOW(),description='$description' where id=$id;
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功添加您的评论";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "添加评论失败，请重试或联系管理员";
		}
		return $result;
	}

	function delete_stneed_comment()
	{
		$id = $this->input->post('id');
		$user_id = $this->input->post('user_id');

		if (!$this->validate_stneedComment_with_userId($id,$user_id)) {
			return  array('code' => CODE_FAIL, 'msg' => '无权限');
		}

		$queryStr =  <<<STR
		delete from tb_stneed_comment where id=$id;
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功添加您的评论";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "添加评论失败，请重试或联系管理员";
		}
		return $result;
	}

	function list_comments_by_stneed_id()
	{
		$stneed_id = $this->input->post('stneed_id');

		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT tb_stneed_comment.id,tb_stneed_comment.user_id,tb_user.true_name as user_name,tb_stneed_comment.comment_time,tb_stneed_comment.description
		FROM tb_stneed_comment,tb_user
		WHERE stneed_id = $stneed_id AND tb_stneed_comment.user_id = tb_user.id 
		ORDER BY tb_stneed_comment.comment_time DESC
		LIMIT 0,$size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	function add_qyneed_comment()
	{
		$user_id = $this->input->post('user_id');
		$qyneed_id = $this->input->post('qyneed_id');
		$description = $this->input->post('description');

		$queryStr =  <<<STR
		insert into tb_qyneed_comment(user_id,qyneed_id,comment_time,description) values($user_id,$qyneed_id,NOW(),'$description');
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功添加您的评论";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "添加评论失败，请重试或联系管理员";
		}
		return $result;
	}

	function update_qyneed_comment()
	{
		$id = $this->input->post('id');
		$user_id = $this->input->post('user_id');
		$qyneed_id = $this->input->post('qyneed_id');
		$description = $this->input->post('description');

		if (!$this->validate_qyneedComment_with_userId($id,$user_id)) {
			return  array('code' => CODE_FAIL, 'msg' => '无权限');
		}

		$queryStr =  <<<STR
		update tb_qyneed_comment set qyneed_id=$qyneed_id,comment_time=NOW(),description='$description' where id=$id;
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功添加您的评论";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "添加评论失败，请重试或联系管理员";
		}
		return $result;
	}

	function delete_qyneed_comment()
	{
		$id = $this->input->post('id');
		$user_id = $this->input->post('user_id');

		if (!$this->validate_qyneedComment_with_userId($id,$user_id)) {
			return  array('code' => CODE_FAIL, 'msg' => '无权限');
		}

		$queryStr =  <<<STR
		delete from tb_qyneed_comment where id=$id;
STR;
		$query = $this->db->query($queryStr);
		$result = array();
		if ($query) {
			$result['code'] = CODE_SUCCESS;
			$result['msg'] = "已成功添加您的评论";
		}else{
			$result['code'] = CODE_FAIL;
			$result['msg'] = "添加评论失败，请重试或联系管理员";
		}
		return $result;
	}

	function list_comments_by_qyneed_id()
	{
		$qyneed_id = $this->input->post('qyneed_id');

		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT tb_qyneed_comment.id,tb_qyneed_comment.user_id, tb_user.true_name as user_name,tb_qyneed_comment.comment_time,tb_qyneed_comment.description
		FROM tb_qyneed_comment,tb_user
		WHERE qyneed_id = $qyneed_id AND user_id = tb_user.id 
		ORDER BY tb_qyneed_comment.comment_time DESC
		LIMIT 0,$size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

}
/* End of file mhome.php */
/* Location: ./application/models/mhome.php */
?>