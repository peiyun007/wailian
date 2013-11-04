<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mregion extends CI_Model
{
	function __construct()
	{
		parent::__construct();
	}

	function list_all_province()
	{
		$size = PHP_INT_MAX;
		$queryStr =  <<<STR
		SELECT region_id as value, region_name as text
		FROM tb_region
		WHERE region_type =1
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	function list_all_city()
	{
		$size = PHP_INT_MAX;
		$province_id = $this->input->post('province_id');
		$queryStr =  <<<STR
		SELECT region_id as value, region_name as text
		FROM tb_region
		WHERE parent_id = $province_id and region_type = 2
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

}

/* End of file mhome.php */
/* Location: ./application/models/mhome.php */
?>
