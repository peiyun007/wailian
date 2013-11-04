<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Qy_manage extends CI_Controller {
	function __construct()
	{
		parent::__construct();
		$this->load->model('check');
		$this->load->model('Mqiye');
		$this->load->library('pagination');
	}

	function list_all_qy()
	{
		$config['base_url'] = site_url('admin_login/qy_manage/' . $this->uri->segment(3));
		$config['per_page'] = 3;
		$config['uri_segment'] = 4;
		$config['full_tag_open'] = '<p>';
		$config['full_tag_close'] = '</p>';
		$config['first_link'] = '第一页';
		$config['last_link'] = '尾页';
		$config['next_link'] = '下一页';
		$config['prev_link'] = '上一页';

		$originalRes = $this->Mqiye->get_all_qy($this->uri->segment(4, 0),$config['per_page']);
		$config['total_rows'] = intval($originalRes['total']);

		$this->pagination->initialize($config);
		$links=$this->pagination->create_links();

		$res = $originalRes['res'];
		$temp['res']=$res;
		$temp['links']=$links;
		$temp['total_rows']=$config['total_rows'];
		$temp['per_page'] = $config['per_page'];
		$this->load->view('admin/qy/qy_list',$temp);
	}

	function add_qiye()
	{
		$check = "wu";
		$temp['check']=$check;
		$temp['name'] = '';
		$temp['region'] = '';    //这里的页面需要用2个联动的select控件
		$temp['createUser_id'] = 1;    //这里的页面需要用1个联动的select控件
		$temp['description'] = '';
		$temp['click_nums'] = '';

		$this->load->view('admin/qy/qy_add', $temp);
	}

	function form_qiye()
	{

	}

	function form_news()
	{
		$arr['title']=$this->input->post('title');
		$arr['zz']=$this->input->post('zz');
		$arr['ll']=$this->input->post('ll');
		$arr['shijian']=$this->input->post('shijian');
		$arr['content']=$this->input->post('content');
		$arr['fl']=$this->input->post('select');
		$table="news";
		$check=$this->input->post('check');
		if($check=="wu")
		{
			$res=$this->db->insert($table,$arr);
			$info="添加";
			$url="add_news";
		}
		else
		{
			$where['id']=$check;
			$info="修改";
			$res=$this->db->update($table,$arr,$where);
			$url="edit_news/".$check;
		}
		if($res)
		{
			$this->message->showmessage($info.'成功','admin_login/news/'.$url);exit();
		}
		else
		{
			$this->message->showmessage($info.'失败','admin_login/news/'.$url);exit();
		}
	}
}

