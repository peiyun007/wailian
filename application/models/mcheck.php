<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mcheck extends CI_Model
{
	function __construct()
	{
		parent::__construct();
	}

	function validate_st_with_userId($st_id,$user_id)
	{
		$queryStr = "SELECT COUNT( * ) as total  FROM tb_st WHERE id = $st_id	AND leader_id = $user_id";
		$query = $this->db->query($queryStr);
		$result = $query->result();
		if ($query->num_rows() > 0) {
			return TRUE;
		}
		return FALSE;
	}

	function validate_qy_with_userId($qy_id,$user_id)
	{
		$queryStr = "SELECT COUNT( * ) as total  FROM tb_qy WHERE id = $qy_id	AND createUser_id = $user_id";
		$query = $this->db->query($queryStr);
		$result = $query->result();
		if ($query->num_rows() > 0) {
			return TRUE;
		}
		return FALSE;
	}

}

/* End of file mhome.php */
/* Location: ./application/models/mhome.php */
?>
