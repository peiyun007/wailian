<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cp extends CI_Controller {
	function __construct()
	{
		parent::__construct();
		$this->load->model('check');
	}
	function index()
	{
		$table="cp_category";
		$this->db->order_by("weizhi","desc"); 
		$query=$this->db->get($table);
		$temp['res']=$query->result();
		$this->load->view('admin/cp/category',$temp);
	}
	function add_category()
	{
		$table="cp_category";
		$arr['name']=$this->input->post('name');
		$arr['biaoshi']=$this->input->post('biaoshi');
		$arr['weizhi']=$this->input->post('weizhi');
		$res=$this->db->insert($table,$arr);
		if($res)
		{
			$this->message->showmessage('添加成功','admin_login/cp');exit();
		}
		else
		{
			$this->message->showmessage('添加失败，系统繁忙或着填写错误','admin_login/cp');exit();
		}
	}
	function change_category()
	{
		$table="cp_category";
		$where['id']=$this->input->post('id');
		$arr['name']=$this->input->post('name');
		$arr['biaoshi']=$this->input->post('biaoshi');
		$arr['weizhi']=$this->input->post('weizhi');
		$res=$this->db->update($table,$arr,$where);
		if($res)
		{
			$this->message->showmessage('修改成功','admin_login/cp');exit();
		}
		else
		{
			$this->message->showmessage('修改失败，系统繁忙或着填写错误','admin_login/cp');exit();
		}
	}
	function del_category($id)
	{
		$table="cp_category";
		$where['id']=$id;
		$res=$this->db->delete($table,$where);
		if($res)
		{
			$this->message->showmessage('删除成功','admin_login/news');exit();
		}
		else
		{
			$this->message->showmessage('删除失败，系统繁忙或着填写错误','admin_login/news');exit();
		}
	}
	function add_cp()
	{
		
		
		$table="cp_category";
		$this->db->order_by('weizhi','desc');
		$query=$this->db->get($table);
		$count=$query->num_rows();
		$check="wu";
		$temp['check']=$check;
		if($count<=0)
		{
			$this->message->showmessage('没有添加分类，请先添加分类','admin_login/news');exit();
		}
		$temp['res']=$query->result();
		$this->load->model('editor');
		$temp['kind']=$this->editor->kind('content','');
		$temp['zz']=$this->session->userdata('manager');
		$temp['title']="";
		$temp['shijian']=$this->editor->shijian();
		$temp['ll']="本站";
		$temp['fl']="";
		$this->load->view('admin/cp/add_cp',$temp);
	}
	function form_cp()
	{
		$check=$this->input->post('check');
		$this->load->model('editor');
		$shijian=$this->editor->shijian();
		$url="./cphoto/".substr($shijian,0,4)."/".substr($shijian,5,2);
		if(!file_exists($url))
		{
			if(!is_writable("./cphoto"))
			{
				$this->message->showmessage('请修改/cphoto 的权限为可写','admin_login/cp/add_cp');exit();
			}
			else
			{
				$mkdir=mkdir($url,0777,true);
				if(!$mkdir)
				{
					$this->message->showmessage('创建目录失败稍后再试','admin_login/cp/add_cp');exit();
				}
			} 
		}
		  if($check=="wu" or ($check!="wu" and $_FILES['userfile']['name']!=""))
		  {
		  $config['upload_path'] = $url;
		  $config['allowed_types'] = 'gif|jpg|png';
		  $config['max_size'] = '300';
		  $config['max_width']  = '200';
		  $config['encrypt_name']=true;
		  $config['max_height']  = '200';
		  $this->load->library('upload', $config);
		 
		  if ( ! $this->upload->do_upload())
		  {
		     $error =  $this->upload->display_errors();
			 if($check=="wu")
			 {
		   	   $this->message->showmessage($error,'admin_login/cp/add_cp');exit();
			  }
			  else
			  {
			  	$this->message->showmessage($error,'admin_login/cp/edit_cp/'.$check);exit();
			  }
		  } 
		  else
		  {
		      $data = $this->upload->data();
		      $photoname=$data['file_name'];
		  }

	
		$arr['photoname']=$url."/".$photoname;}
		$arr['title']=$this->input->post('title');
		$arr['zz']=$this->input->post('zz');
		$arr['ll']=$this->input->post('ll');
		$arr['shijian']=$this->input->post('shijian');
		$arr['content']=$this->input->post('content');
		$arr['fl']=$this->input->post('select');
		$table="cp";
		
		if($check=="wu")
		{
			$res=$this->db->insert($table,$arr);
			$info="添加";
			$url="add_cp";
		}
		else
		{
			$where['id']=$check;
			$info="修改";
			
			$res=$this->db->update($table,$arr,$where);
			$url="edit_cp/".$check;
		}
		if($res)
		{
			$this->message->showmessage($info.'成功','admin_login/cp/'.$url);exit();
		}
		else
		{
			$this->message->showmessage($info.'失败','admin_login/cp/'.$url);exit();
		}
	}
	function cp_list($start_row=0)
	{
		
		$table="cp_category";
		$this->db->order_by('weizhi','desc');
		$query=$this->db->get($table);
		$count=$query->num_rows();
		if($count<=0)
		{
			$this->message->showmessage('没有添加分类，请先添加分类','admin_login/news');exit();
		}
		else
		{
			$temp['res_f']=$query->result();
		  
		}
		
		$table='cp';
		$this->load->model('editor');
		$url=site_url('admin_login/cp/cp_list/');
		$where="";
		$result=$this->editor->show_list($table,$url,4,$start_row,$where,'id');
		$temp['links']=$result['links'];
		$temp['res']=$result['res'];
		$temp['total_rows']=$result['total_rows'];
		$temp['per_page']=$result['per_page'];
		$this->load->view('admin/cp/cp_list',$temp);
	}
	function del_news($id)
	{
		$table="cp";
		$where['id']=$id;
		$res=$this->db->delete($table,$where);
		if($res)
		{
			$this->message->showmessage('删除成功','admin_login/cp/cp_list');exit();
		}
		else
		{
			$this->message->showmessage('删除失败，系统繁忙或着填写错误','admin_login/cp/cp_list');exit();
		}
	}
	function edit_cp($id)
	{
		$table="cp_category";
		$this->db->order_by('weizhi','desc');
		$query=$this->db->get($table);
		$count=$query->num_rows();
		$check="wu";
		$temp['check']=$id;
		if($count<=0)
		{
			$this->message->showmessage('没有添加分类，请先添加分类','admin_login/news');exit();
		}
		$temp['res']=$query->result();
		$where['id']=$id;
		$table_c="cp";
		$query_c=$this->db->get_where($table_c,$where);
		$res_c=$query_c->result();
		foreach($res_c as $key){
			$this->load->model('editor');
			$temp['kind']=$this->editor->kind('content',$key->content);
			$temp['zz']=$key->zz;
			$temp['photoname']=$key->photoname;
			$temp['title']=$key->title;
			$temp['shijian']=$key->shijian;
			$temp['ll']=$key->ll;
			$temp['fl']=$key->fl;
		}
		$this->load->view('admin/cp/add_cp',$temp);
	}
	function del_all()
	{
		$id=$this->input->post('id');
		if($id=="")
		{
			$this->message->showmessage('请选择要删除数据','admin_login/cp/cp_list');exit();
		}
		
		$table="cp";
		$this->db->where_in('id',$id);
		$res=$this->db->delete($table);
 		if($res)
		{
			$this->message->showmessage('删除成功','admin_login/cp/cp_list');exit();
		}
		else
		{
			$this->message->showmessage('删除失败','admin_login/news/news_list');exit();
		}
	
	}
}


