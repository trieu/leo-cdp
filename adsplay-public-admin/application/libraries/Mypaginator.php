<?php
/**
 * Created by PhpStorm.
 * User: mith
 * Date: 10/28/2015
 * Time: 10:41 AM
 */
 if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mypaginator {
    function __construct() {
        $this->ci =& get_instance();
    }

    public function initPagination($base_url,$total_rows,$urlFirst){
        $config = array();
        $config['base_url']          = base_url().$base_url;
        $config['total_rows']        = $total_rows;
        $config['per_page']          = 20;
        $config['uri_segment']       = 4;
//        $config['num_links']         = $total_rows;
        $config['use_page_numbers']  = TRUE;
        //Set that how many number of pages you want to view.

        $config['full_tag_open'] = '<ul class="pagination" data-total-row="'.$total_rows.'">';

         $config['full_tag_close'] = '</ul>';

         $config['prev_link'] = '&laquo;';

         $config['prev_tag_open'] = '<li class="prev">';

         $config['prev_tag_close'] = '</li>';

         $config['next_tag_open'] = '<li class="next">';

         $config['next_tag_close'] = '</li>';
         $config['last_tag_open'] = '<li>';
         $config['last_tag_close'] = '</li>';
         $config['first_tag_open'] = '<li>';
         $config['first_tag_close'] = '</li>';

         $config['cur_tag_open'] = '<li class="number"><a href="'.$urlFirst.'">';

         $config['cur_tag_close'] = '</a></li>';

         $config['num_tag_open'] = '<li class="number">';

         $config['num_tag_close'] = '</li>';

         $config['next_link'] = 'Next';
         // &raquo;


        $this->ci->pagination->initialize($config);
        return $config;
    }

}

/* End of file Mypaginator.php */




