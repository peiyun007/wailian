<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Region extends CI_Controller
{
	function __construct()
	{
		parent::__construct();

		$this->load->helper('url');

		$this->load->model('Mregion');
	}

	function list_all_province()
	{
		$result = $this->Mregion->list_all_province();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}

	function list_all_city()
	{
		$result = $this->Mregion->list_all_city();
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}
	
}

/* End of file home.php */
/* Location: ./application/controllers/home.php */
?>
