<?php
/**
 * Created by PhpStorm.
 * User: mith
 * Date: 1/21/2016
 * Time: 3:45 PM
 */
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

    function configPagination($totalRec,$divId, $baseUrl,$perPage){
        $ci =& get_instance();
        $ci->load->library('Ajax_pagination');

        $config['first_link'] = 'First';
        $config['div'] = $divId; //parent div tag id
        $config['base_url'] = $baseUrl;
        $config['total_rows'] = $totalRec;
//        $config['per_page'] = $this->perPage;
        $config['per_page'] = $perPage;
        $ci->ajax_pagination->initialize($config);
    }
