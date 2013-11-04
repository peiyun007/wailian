<?php 
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Message extends CI_Model { 
   
    function __construct()
     {
         parent::__construct();
     }
	function showmessage($msg, $goto = '',$auto = true)
	{
			if($goto == '')
			{
				$goto = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : site_url();
			}
			else
			{
				$goto = site_url($goto);	
			}
			$this->load->view('admin/body_message',array('msg'=>$msg,'goto'=>$goto,'auto'=>$auto));
			echo $this->output->get_output();
			exit();
	}
}
