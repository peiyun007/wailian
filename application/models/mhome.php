<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mhome extends CI_Model
{
	function __construct()
	{
		parent::__construct();
	}

	/* 分类列表  */
	function get_category()
	{
		$query = $this->db->query('SELECT * FROM category where upid=0');

		return $query->result();
	}

	/* 不为中间分类的分类列表  */
	function get_category_show()
	{
		$query = $this->db->query('SELECT * FROM category where lastflag<4');

		return $query->result();
	}

	/* 按分类ID文章列表  */
	function get_article($category_id)
	{
		$query = $this->db->query("SELECT * FROM article WHERE category_id=$category_id");

		return $query->result();
	}

	/* 按分类ID分类表  */
	function get_category_name($category_id)
	{
		$query = $this->db->query("SELECT * FROM category WHERE id = $category_id");

		return $query->result();
	}

	/* 按分类ID分类表  */
	function get_category_upid($upid)
	{
		$query = $this->db->query("SELECT * FROM category WHERE upid = $upid");

		return $query->result();
	}

	/* 按分类ID文章列表1  */
	function get_article_list()
	{
		$this->db->where('category_id',$this->uri->segment(3));

		$query = $this->db->get('article');

		return $query->result();
	}

	/* 最新推荐文章top6  */
	function get_article_recommend()
	{
		$query = $this->db->query("SELECT * FROM article WHERE recommend=1 order by id desc limit 0,6");

		return $query->result();
	}

	/* 最新文章top6  */
	function get_article_new()
	{
		$query = $this->db->query("SELECT * FROM article order by id desc limit 0,6");

		return $query->result();
	}

	/* 读ID文章信息  */
	function get_article_content($id)
	{
		$query = $this->db->query("SELECT * FROM article WHERE id = $id");

		return $query->result();
	}

	/* 添加评论  */
	function insert_comment()
	{
		$content = $this->input->post('comment_content');
		$article_id = $this->input->post('article_id');
		$author = $this->input->post('comment_author');
		$this->db->query("INSERT INTO comments(id,article_id,content,author,last_date)VALUES('','$article_id','$content','$author',now())");

		return $this->db->affected_rows();
	}

	/* 显示文章ID 的评论 */
	function get_comment($article_id)
	{
		$query = $this->db->query("SELECT * FROM comments WHERE article_id=$article_id");

		return $query->result();
	}

	/* 统计该目录下的文章总数  */
	function select_num_rows($category)
	{
		$query = $this->db->query("SELECT * FROM article WHERE category_id=$category");

		return $query->num_rows();
	}

	/* 文章列表  */
	function get_page($category,$offset,$num)
	{
		$query = $this->db->query("SELECT * FROM article WHERE category_id=$category order by id desc limit $offset,$num");

		return $query->result();
	}
}

/* End of file mhome.php */
/* Location: ./application/models/mhome.php */
?>
