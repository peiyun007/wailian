<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Muser extends CI_Model
{
	function __construct()
	{
		parent::__construct();
	}

	function login()
	{
		$login_name = $this->input->post('name');
		$user_pwd = $this->input->post('pwd');
		$user_pwd = sha1($user_pwd);
		$size = PHP_INT_MAX;

		$queryStr =  <<<STR
		SELECT id AS user_id, true_name AS user_name
		FROM tb_user
		WHERE login_name =  '$login_name'
		AND PASSWORD =  '$user_pwd'
		LIMIT 0 , $size
		UNION 
		SELECT id AS user_id, true_name AS user_name
		FROM tb_user
		WHERE true_name =  '$login_name'
		AND PASSWORD =  '$user_pwd'
		LIMIT 0 , $size
STR;
		$query = $this->db->query($queryStr);
		return $query->result();
	}

	// function check_user_if_exist()
	// {
	// 	$name = $this->input->post('name');

	// }

	function register()
	{
		$name = $this->input->post('name');
		$pwd = $this->input->post('pwd');
		$pwd = sha1($pwd);
		$email = $this->input->post('email');
		$sex = $this->input->post('sex');
		$phone = $this->input->post('phone');

		$data['name'] = $name;
		$data['pwd'] = $pwd;
		$data['email'] = $email;
		$data['sex'] = $sex;
		$data['phone'] = $phone;

		$queryStr =  <<<STR
		insert into tb_user(login_name,password,true_name,sex,phone,register_date) values('$email','$pwd','$name','$sex','$phone',NOW());
STR;
		$query = $this->db->query($queryStr);
		if ($query) {
			$data['id'] = $this->db->insert_id();
		}
		return $data;
	}

}

?>