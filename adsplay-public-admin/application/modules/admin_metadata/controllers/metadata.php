<?php
/**
 * Created by PhpStorm.
 * User: hung_
 * Date: 25/04/2016
 * Time: 6:26 CH
 */

class MetaData extends MY_Controller
{
    function __construct(){
        parent::__construct();
        $this->load->helper(array('form', 'url'));
        $this->load->model('MMetaData');
        $this->load->library('form_validation');
    }
    public function index(){

        $this->data['the_view_content'] = 'admin_metadata/IndexMetaData';
        $this->data['javascript']=(array('admin_metadata/brand/Create_Brand','admin_metadata/product/Create_Product','admin_metadata/sector/Create_Sector'));
        $this->_render_page('template/master_view', $this->data);
    }


}