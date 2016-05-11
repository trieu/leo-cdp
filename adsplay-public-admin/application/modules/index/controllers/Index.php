<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Index extends MY_Controller
{

    function __construct()
    {
        parent::__construct();
        //$this->load->library('ion_auth');

    }

    public function index()
    {

        if(!$this->ion_auth->logged_in()){
            redirect('admin_advertisers/advertisers/index', 'refresh');
        }
        $this->load->view('welcome_message');
    }
    public function loadMessage(){

        $message['message'] = $this->session->flashdata('message');
        $this->load->view('message',$message);
    }
}