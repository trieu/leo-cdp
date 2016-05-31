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
        $this->_render_page('template/master_view', $this->data);
    }

    // ajax get creative

    public  function  getAjax(){
        $campaignId = (int)$this->input->get('campaignId');

        $query = $this->MCreatives->getCreativeByCampaignID($campaignId);;

        $count= count($query);
        $num_row=1;
        $data = array();

        foreach ($query as $creative) {
            //  $no++;
            $row = array();
            $row[] = $creative['CreativeID'];
            $row[] ='<a href="getCreativeById?creativeId='.$creative['CreativeID'].'">'.$creative['Name'].'</a>';
            $row[] = $creative['Status'];
            $row[] = 0;
            $row[] = 0;
            $row[] = $creative['DailyBooking'];
            $row[] = $creative['TotalRevenue'];

            $row[] = '<a class="btn btn-sm btn-primary" href="javascript:void(0);" title="Edit" onclick="getByIDCamp('."'".$creative['CreativeID']."'".')"><i class="glyphicon glyphicon-pencil"></i> Edit</a>';
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

    // get detail creative by id

    public function getCreativeById(){

        $creativeId = (int)$this->input->get('creativeId');

        $this->data['data'] = $this->MCreatives->detailCreative($creativeId);
        $this->data['the_view_content'] = 'admin_campaigns/detail_creative';
        $this->_render_page('template/master_view', $this->data);
    }

    // Get data from Postgres

    public function getCreativeByCampaignID(){

        $campaignId = 6;
        $this->data['campaignId'] = $campaignId;


        $this->data['the_view_content'] = 'admin_campaigns/creatives';
        $this->_render_page('template/master_view', $this->data);
    }
}