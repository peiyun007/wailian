<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Madmin extends CI_Model
{
	function __construct()
	{
		parent::__construct();
	}

	/* 添加文章  */
	function insert_article()
	{
		$title = $this->input->post('article_title');
		$source = $this->input->post('article_source');
		$author = $this->input->post('article_author');

		if ($this->input->post('article_recommend'))
		{
			$recommend = 1;
		}
		else
		{
			$recommend = 0;
		}

		$content = addslashes($this->input->post('article_content'));
		$category_id = $this->input->post('category_id');

		$this->db->query("INSERT INTO article(id,category_id,recommend,title,content,source,author,last_date)VALUES('','$category_id','$recommend','$title','$content','$source','$author',now())");

		return $this->db->affected_rows();
	}

	/* 修改文章  */
	function edit_article()
	{
		$title = $this->input->post('article_title');
		$source = $this->input->post('article_source');
		$author = $this->input->post('article_author');
		$category_id = $this->input->post('category_id');
		$id = $this->input->post('id');

		if ($this->input->post('article_recommend'))
		{
			$recommend = 1;
		}
		else
		{
			$recommend = 0;
		}

		$content = addslashes($this->input->post('article_content'));
		$last_date = $this->input->post('article_last_date');

		$arr['title'] = $title;
		$arr['source'] = $source;
		$arr['category_id'] = $category_id;
		$arr['author'] = $author;
		$arr['recommend'] = $recommend;
		$arr['content'] = $content;
		$arr['last_date'] = $last_date;
		$where['id'] = $id;
		$res=$this->db->update('article', $arr, $where);

		return $res;
	}

	/* 登陆验证  */
	function login_ok()
	{
		$name = $this->input->post('user');
		$password = md5($this->input->post('password'));

		$query = $this->db->query("SELECT * FROM admin WHERE name='$name' and password='$password' ");

		return $query->num_rows();
	}

	/* 统计评论总数  */
	function select_comments_num_rows()
	{
		$query = $this->db->query("SELECT * FROM comments inner join article on comments.article_id = article.id");

		return $query->num_rows();
	}

	/* 评论分页列表  */
	function get_comments_page($offset,$num)
	{
		$query = $this->db->query("SELECT comments.id, comments.author, comments.content, comments.last_date, article.title FROM comments inner join article on comments.article_id = article.id order by id desc limit $offset,$num");

		return $query->result();
	}

	/* 统计文章总数  */
	function select_article_num_rows()
	{
		$query = $this->db->query("SELECT * FROM article inner join category on article.category_id = category.id");

		return $query->num_rows();
	}

	/* 文章列表  */
	function get_article_page($offset,$num)
	{
		$query = $this->db->query("SELECT article.id, article.title, article.author, article.last_date, article.source, article.recommend, category.category_name FROM article inner join category on article.category_id = category.id order by article.id desc limit $offset,$num");

		return $query->result();
	}

	/* 用户列表  */
	function get_user()
	{
		$query = $this->db->query('SELECT * FROM admin');

		return $query->result();
	}

	/* 按ID用户列表  */
	function get_user_name($id)
	{
		$query = $this->db->query("SELECT * FROM admin WHERE id=$id");

		return $query->result();
	}

	/* 按用户名 用户列表  */
	function get_user_username($username)
	{
		$query = $this->db->query("SELECT * FROM admin WHERE name='$username'");

		return $query->num_rows();
	}
}

/* End of file madmin.php */
/* Location: ./application/models/madmin.php */
?>
