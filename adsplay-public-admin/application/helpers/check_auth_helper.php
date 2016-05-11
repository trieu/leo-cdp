<?php
/**
 * Created by PhpStorm.
 * User: mith
 * Date: 12/4/2015
 * Time: 9:20 AM
 */
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

    function checkGroup($group = array()){

    }

    function checkLogin(){
        $ci =& get_instance();
        $ci->load->library('ion_auth');
        if (!$ci->ion_auth->logged_in())
        {
            //redirect them to the login page
            redirect('admin/user/login', 'refresh');
        }
    }

