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
        if(!$this->ion_auth->logged_in()){
            redirect('admin_auth/auth', 'refresh');
        }

    }
    public function index(){

        $this->data['the_view_content'] = 'admin_metadata/IndexMetaData';
        $this->data['javascript']=(array('admin_metadata/brand/Create_Brand','admin_metadata/product/Create_Product','admin_metadata/sector/Create_Sector'));
        $this->_render_page('template/master_view', $this->data);
    }

    /**
     * Ads instream
     * @author Mith
     */
    public function instream() {
        $data = array();

        $data['listBrand'] = $this->MMetaData->getAllBrand();
//        $data['listProduct'] = $this->product_model->listProducts();
//        $data['listSector'] = $this->sector_model->listSectors();
        $data['listCampaigns'] = $this->MMetaData->getAllCampaign();

        $this->data['view_delivery'] = $this->load->view('delivery_setting', '', true);
        $this->data['view_campaign'] = $this->load->view('campaign_management', $data, true);

        $this->data['the_view_content'] = 'admin_metadata/instream';
        $this->_render_page('template/master_view', $this->data);
    }
    /**
     * Ads expandable
     * @author Mith
     */
    public function expandable() {
        $data = array();

        $data['listBrand'] = $this->MMetaData->getAllBrand();
        $data['listCampaigns'] = $this->MMetaData->getAllCampaign();

        $this->data['view_delivery'] = $this->load->view('delivery_setting', '', true);
        $this->data['view_campaign'] = $this->load->view('campaign_management', $data, true);

        $this->data['the_view_content'] = 'admin_metadata/expandable';
        $this->_render_page('template/master_view', $this->data);
    }

}