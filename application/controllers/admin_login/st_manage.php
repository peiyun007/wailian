<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class St_manage extends CI_Controller {
	function __construct()
	{
		parent::__construct();
		$this->load->model('Mshetuan');
	}
	// function index()
	// {
	// 	$table="news_category";
	// 	$this->db->order_by("weizhi","desc"); 
	// 	$query=$this->db->get($table);
	// 	$temp['res']=$query->result();
	// 	$this->load->view('admin/news/category',$temp);
	// }

	function list_all_st()
	{
		$res = $this->Mshetuan->get_all_st();
		$temp['res']=$res;
		$this->load->view('admin/st/st_list',$temp);
	}

	function list_all_st_type()
	{
		$res = $this->Mshetuan->get_all_st_type();
		$temp['res']=$res;
		$this->load->view('admin/st/st_list',$temp);
	}

	// function add_category()
	// {
	// 	$table="news_category";
	// 	$arr['name']=$this->input->post('name');
	// 	$arr['biaoshi']=$this->input->post('biaoshi');
	// 	$arr['weizhi']=$this->input->post('weizhi');
	// 	$res=$this->db->insert($table,$arr);
	// 	if($res)
	// 	{
	// 		$this->message->showmessage('添加成功','admin_login/news');exit();
	// 	}
	// 	else
	// 	{
	// 		$this->message->showmessage('添加失败，系统繁忙或着填写错误','admin_login/news');exit();
	// 	}
	// }
	// function change_category()
	// {
	// 	$table="news_category";
	// 	$where['id']=$this->input->post('id');
	// 	$arr['name']=$this->input->post('name');
	// 	$arr['biaoshi']=$this->input->post('biaoshi');
	// 	$arr['weizhi']=$this->input->post('weizhi');
	// 	$res=$this->db->update($table,$arr,$where);
	// 	if($res)
	// 	{
	// 		$this->message->showmessage('修改成功','admin_login/news');exit();
	// 	}
	// 	else
	// 	{
	// 		$this->message->showmessage('修改失败，系统繁忙或着填写错误','admin_login/news');exit();
	// 	}
	// }
	// function del_category($id)
	// {
	// 	$table="news_category";
	// 	$where['id']=$id;
	// 	$res=$this->db->delete($table,$where);
	// 	if($res)
	// 	{
	// 		$this->message->showmessage('删除成功','admin_login/news');exit();
	// 	}
	// 	else
	// 	{
	// 		$this->message->showmessage('删除失败，系统繁忙或着填写错误','admin_login/news');exit();
	// 	}
	// }
	// function add_news()
	// {
	// 	$table="news_category";
	// 	$this->db->order_by('weizhi','desc');
	// 	$query=$this->db->get($table);
	// 	$count=$query->num_rows();
	// 	$check="wu";
	// 	$temp['check']=$check;
	// 	if($count<=0)
	// 	{
	// 		$this->message->showmessage('没有添加分类，请先添加分类','admin_login/news');exit();
	// 	}
	// 	$temp['res']=$query->result();
	// 	$this->load->model('editor');
	// 	$temp['kind']=$this->editor->kind('content','');
	// 	$temp['zz']=$this->session->userdata('manager');
	// 	$temp['title']="";
	// 	$temp['shijian']=$this->editor->shijian();
	// 	$temp['ll']="本站";
	// 	$temp['fl']="";
	// 	$this->load->view('admin/news/add_news',$temp);
	// }
	// function form_news()
	// {
	// 	$arr['title']=$this->input->post('title');
	// 	$arr['zz']=$this->input->post('zz');
	// 	$arr['ll']=$this->input->post('ll');
	// 	$arr['shijian']=$this->input->post('shijian');
	// 	$arr['content']=$this->input->post('content');
	// 	$arr['fl']=$this->input->post('select');
	// 	$table="news";
	// 	$check=$this->input->post('check');
	// 	if($check=="wu")
	// 	{
	// 		$res=$this->db->insert($table,$arr);
	// 		$info="添加";
	// 		$url="add_news";
	// 	}
	// 	else
	// 	{
	// 		$where['id']=$check;
	// 		$info="修改";
	// 		$res=$this->db->update($table,$arr,$where);
	// 		$url="edit_news/".$check;
	// 	}
	// 	if($res)
	// 	{
	// 		$this->message->showmessage($info.'成功','admin_login/news/'.$url);exit();
	// 	}
	// 	else
	// 	{
	// 		$this->message->showmessage($info.'失败','admin_login/news/'.$url);exit();
	// 	}
	// }
	// function news_list($start_row=0)
	// {
		
	// 	$table="news_category";
	// 	$this->db->order_by('weizhi','desc');
	// 	$query=$this->db->get($table);
	// 	$count=$query->num_rows();
	// 	if($count<=0)
	// 	{
	// 		$this->message->showmessage('没有添加分类，请先添加分类','admin_login/news');exit();
	// 	}
	// 	else
	// 	{
	// 		$temp['res_f']=$query->result();
		  
	// 	}
		
	// 	$table='news';
	// 	$this->load->model('editor');
	// 	$url=site_url('admin_login/news/news_list/');
	// 	$where="";
	// 	$result=$this->editor->show_list($table,$url,4,$start_row,$where,'id');
	// 	$temp['links']=$result['links'];
	// 	$temp['res']=$result['res'];
	// 	$temp['total_rows']=$result['total_rows'];
	// 	$temp['per_page']=$result['per_page'];
	// 	$this->load->view('admin/news/news_list',$temp);
	// }
	// function del_news($id)
	// {
	// 	$table="news";
	// 	$where['id']=$id;
	// 	$res=$this->db->delete($table,$where);
	// 	if($res)
	// 	{
	// 		$this->message->showmessage('删除成功','admin_login/news/news_list');exit();
	// 	}
	// 	else
	// 	{
	// 		$this->message->showmessage('删除失败，系统繁忙或着填写错误','admin_login/news/news_list');exit();
	// 	}
	// }
	// function edit_news($id)
	// {
	// 	$table="news_category";
	// 	$this->db->order_by('weizhi','desc');
	// 	$query=$this->db->get($table);
	// 	$count=$query->num_rows();
	// 	$check="wu";
	// 	$temp['check']=$id;
	// 	if($count<=0)
	// 	{
	// 		$this->message->showmessage('没有添加分类，请先添加分类','admin_login/news');exit();
	// 	}
	// 	$temp['res']=$query->result();
	// 	$where['id']=$id;
	// 	$table_c="news";
	// 	$query_c=$this->db->get_where($table_c,$where);
	// 	$res_c=$query_c->result();
	// 	foreach($res_c as $key){
	// 		$this->load->model('editor');
	// 		$temp['kind']=$this->editor->kind('content',$key->content);
	// 		$temp['zz']=$key->zz;
	// 		$temp['title']=$key->title;
	// 		$temp['shijian']=$key->shijian;
	// 		$temp['ll']=$key->ll;
	// 		$temp['fl']=$key->fl;
	// 	}
	// 	$this->load->view('admin/news/add_news',$temp);
	// }
	// function del_all()
	// {
	// 	$id=$this->input->post('id');
	// 	if($id=="")
	// 	{
	// 		$this->message->showmessage('请选择要删除数据','admin_login/news/news_list');exit();
	// 	}
		
	// 	$table="news";
	// 	$this->db->where_in('id',$id);
	// 	$res=$this->db->delete('news');
 // 		if($res)
	// 	{
	// 		$this->message->showmessage('删除成功','admin_login/news/news_list');exit();
	// 	}
	// 	else
	// 	{
	// 		$this->message->showmessage('删除失败','admin_login/news/news_list');exit();
	// 	}
	
	// }
}

