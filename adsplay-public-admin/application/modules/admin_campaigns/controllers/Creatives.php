<?php
/**
 * Created by PhpStorm.
 * User: mith
 * Date: 5/18/2016
 * Time: 11:39 AM
 */
class Creatives extends MY_Controller
{
    function __construct()
    {
        parent::__construct();
        $this->load->helper(array('form', 'url'));
        $this->load->model('MCreatives');
        $this->load->library('form_validation');
        if (!$this->ion_auth->logged_in()) {
            redirect('admin_auth/auth', 'refresh');
        }
        $this->userId = $this->ion_auth->get_user_id();
        $this->is_admin = $this->ion_auth->is_admin();
//        $this->params = NULL;
//        if (!$this->is_admin) {
//
//            $this->params = array(
//                'table' => 'campaigns',
//                'list' => TRUE,
//                'type' => 'object',
//                'param_where' => array('user_id' => (int)$this->userId));
//        }
    }

    public function index(){

    }
    // data Test Creative
    public function getCreativeDataTest(){

        $this->data['data'] = $this->MCreatives->getDetailCreative();
        $this->data['the_view_content'] = 'admin_campaigns/detail_creative_test';

        $this->_render_page('template/master_view', $this->data);
    }
    public function getCreativeByCampId(){
        $campId = (int)$this->input->get('campId');

        $this->data['the_view_content'] = 'admin_campaigns/list_creatives';
        $this->data['campId'] = $campId;

        $this->_render_page('template/master_view', $this->data);
    }
    public  function  getAjax(){
        $campId = (int)$this->input->get('campId');
        $this->params = array(
                'table' => 'creatives',
                'list' => TRUE,
                'type' => 'object',
                'param_where' => array('campaign_id' => $campId));
        $query = $this->MCreatives->getCreative($this->params);

        $count= $this->MCreatives->getCount( $this->params);
        $num_row=1;
        $data = array();

        foreach ($query as $creative) {
            //  $no++;
            $row = array();
            $row[] = $creative->id;
            $row[] ='<a href="getCreativeById?creativeId='.$creative->id.'">'.$creative->name.'</a>';
            $row[] = $creative->description;
            $row[] = $creative->status;

            $row[] = '<a class="btn btn-sm btn-primary" href="javascript:void(0);" title="Edit" onclick="getByIDCamp('."'".$creative->id."'".')"><i class="glyphicon glyphicon-pencil"></i> Edit</a>';
            $data[] = $row;
        }

        $output = array(

            "recordsTotal" => $count,
            "recordsFiltered" => $num_row,
            "data" => $data,
        );
        //output to json format
        echo json_encode($output);

    }
    public function getCreativeById(){

        $creativeId = (int)$this->input->get('creativeId');
        $this->params = array(
            'table' => 'creatives',
            'list' => TRUE,
            'type' => 'object',
            'param_where' => array('id' => $creativeId));

        $this->data['data'] = $this->MCreatives->getCreative($this->params);
        $this->data['the_view_content'] = 'admin_campaigns/detail_creative';
        $this->_render_page('template/master_view', $this->data);
    }
}