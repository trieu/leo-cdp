<?php defined('BASEPATH') OR exit('No direct script access allowed');

class MY_Controller extends CI_Controller
{
	protected $data = array();
	function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->library(array('ion_auth','form_validation'));
		$this->load->helper(array('url','language'));
		$this->form_validation->set_error_delimiters($this->config->item('error_start_delimiter', 'ion_auth'), $this->config->item('error_end_delimiter', 'ion_auth'));
		$this->lang->load('auth');
		$this->data['page_title'] = 'CI App';
		$this->data['before_head'] = '';
		$this->data['before_body'] = '';
	}

	protected function render($the_view = NULL, $template = 'master')
	{

		if($template == 'json' || $this->input->is_ajax_request())
		{
			header('Content-Type: application/json');
			echo json_encode($this->data);
		}
		elseif(is_null($template))
		{
			$this->load->view($the_view,$this->data);
		}
		else
		{
			$this->data['the_view_content'] = (is_null($the_view)) ? '' : $this->load->view($the_view, $this->data, TRUE);
			$this->load->view('templates/' . $template . '_view', $this->data);
		}
	}
	protected function _render_page($view, $data=null, $returnhtml=false)//I think this makes more sense
	{

		$this->viewdata = (empty($data)) ? $this->data: $data;

		$view_html = $this->load->view($view, $this->viewdata, $returnhtml);

		if ($returnhtml) return $view_html;//This will return html on 3rd argument being true
	}
}

class Admin_Controller extends MY_Controller
{

	function __construct()
	{
		parent::__construct();
		$this->load->library('ion_auth');

		if (!$this->ion_auth->logged_in())
		{
			//redirect them to the login page
			redirect('admin/user/login', 'refresh');
		}
		$this->data['current_user'] = $this->ion_auth->user()->row();
		$this->data['current_user_menu'] = '';
		if($this->ion_auth->in_group('superAdmin'))
		{
			$this->data['current_user_menu'] = $this->load->view('templates/_parts/user_menu_admin_view.php', NULL, TRUE);
		}
		$this->data['page_title'] = 'CI App - Dashboard';
	}
//	protected function render($the_view = NULL, $template = 'admin_master')
	protected function render($the_view = NULL, $template = 'master')
	{

		parent::render($the_view, $template);
	}
}

class Public_Controller extends MY_Controller
{

	function __construct()
	{

		parent::__construct();
	}
}

class A_Controller extends MY_Controller{
	function __construct(){
		parent::__construct();
		if(!$this->ion_auth->logged_in()){
			redirect(base_url().'admin/user/login','refresh');
		}
		if(!$this->ion_auth->is_admin()){
			redirect(base_url().'admin/user/login','refresh');
		}
	}
}
class M_Controller extends MY_Controller{
	function __construct(){
		parent::__construct();
		if(!$this->ion_auth->logged_in()){
			redirect(base_url().'admin/user/login','refresh');
		}
	}
}