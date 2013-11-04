<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Dy extends CI_Controller {
	function __construct()
	{
		parent::__construct();
		$this->load->model('check');
	}
	function index()
	{
		$table="dy";
		$this->load->model('editor');
		$temp['kind']=$this->editor->kind('content','');
		$temp['check']="wu";
		$temp['title']="";
		$temp['weizhi']="";
		$temp['biaoshi']="";
		$this->db->order_by("weizhi","desc"); 
		$query=$this->db->get($table);
		
		$temp['res']=$query->result();
		$this->load->view('admin/orther/add_dy',$temp);
	}
	function del_dy($id)
	{
		$table="dy";
		$where['id']=$id;
		$res=$this->db->delete($table,$where);
		if($res)
		{
			$this->message->showmessage('删除成功','admin_login/dy/');exit();
		}
		else
		{
			$this->message->showmessage('删除失败，系统繁忙或着填写错误','admin_login/dy/');exit();
		}
	}
	function change_dy()
	{
		$table="dy";
		$where['id']=$this->input->post('id');
		$query=$this->db->get_where($table,$where);
		foreach($query->result() as $key)
		{
			$temp['title']=$key->title;
			$temp['weizhi']=$key->weizhi;
			$temp['biaoshi']=$key->biaoshi;
			$this->load->model('editor');
		    $temp['kind']=$this->editor->kind('content',$key->content);
		}
		$temp['check']=$this->input->post('id');;
		
		$this->db->order_by("weizhi","desc"); 
		$query=$this->db->get($table);
		
		$temp['res']=$query->result();
		$this->load->view('admin/orther/add_dy',$temp);
	}
	function add_dy()
	{
		$table="dy";
		$arr['title']=$this->input->post('title');
		$arr['weizhi']=$this->input->post('weizhi');
		$arr['content']=$this->input->post('content');
		$arr['biaoshi']=$this->input->post('biaoshi');
		$check=$this->input->post('check');
		if($check=="")
		{
			$res=$this->db->insert($table,$arr);
			if($res)
			{
				$this->message->showmessage('添加成功','admin_login/dy/');exit();
			}
			else
			{
				$this->message->showmessage('添加失败，系统繁忙或着填写错误','admin_login/dy/');exit();
			}
		}
		else
		{
			$where['id']=$check;
			$res=$this->db->update($table,$arr,$where);
			if($res)
			{
				$this->message->showmessage('修改成功','admin_login/dy/');exit();
			}
			else
			{
				$this->message->showmessage('修改失败，系统繁忙或着填写错误','admin_login/dy/');exit();
			}
		}
	}
}