<?php
class Check extends CI_Model { 
   
    function __construct()
     {
         parent::__construct();
		 $this->load->database();
		 $this->load->library('session');
		 $this->load->model('message');
		 if($this->session->userdata('manager')=="")
		 {
		 	redirect('admin_login/');exit();
		 }
     }
}