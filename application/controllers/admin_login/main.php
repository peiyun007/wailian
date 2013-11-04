<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Main extends CI_Controller {
	function __construct()
	{
		parent::__construct();
		$this->load->model('check');
	}
	function index()
	{
		$this->load->view('admin/index');
	}
	function password()
	{
		$temp['info']="";
		$this->load->view('admin/orther/pass',$temp);
	}
	function changpass()
	{
		$where['username']=$this->session->userdata('manager');
		$oldpass=$this->input->post('oldpass');
		$newpass=$this->input->post('newpass');
		$qrpass=$this->input->post('qrpass');
		if($qrpass != $newpass)
		{
			$temp['info']="新密码必须和确认密码一致";
			$this->load->view('admin/orther/pass',$temp);
		}
		else
		{
			$table="admin";
			$where['userpass']=sha1($oldpass);
			$query=$this->db->get_where($table,$where);
			$count=$query->num_rows();
			if($count>0)
			{
				$where_name['username']=$this->session->userdata('manager');
				$arr['userpass']=sha1($newpass);
				$res=$this->db->update($table,$arr,$where_name);
				if($res)
				{
					$this->message->showmessage('修改成功','admin_login/main/password');exit();
				}
				else
				{
					$this->message->showmessage('系统繁忙，修改失败','admin_login/main/password');exit();
				}
			}
			else
			{
				$temp['info']="旧密码输入错误";
				$this->load->view('admin/orther/pass',$temp);
			}
		}
	}

}

?>