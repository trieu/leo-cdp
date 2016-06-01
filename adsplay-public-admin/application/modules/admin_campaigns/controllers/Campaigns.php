<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


/**
 * Created by PhpStorm.
 * User: hung_
 * Date: 21/04/2016
 * Time: 9:54 SA
 */
class Campaigns extends MY_Controller
{
    function __construct(){
        parent::__construct();
        $this->load->helper(array('form', 'url'));
        $this->load->model('MCampaigns');
        $this->load->library('form_validation');
        if(!$this->ion_auth->logged_in()){
            redirect('admin_auth/auth', 'refresh');
        }
        $this->userId = $this->ion_auth->get_user_id();
        $this->is_admin = $this->ion_auth->is_admin();
        $this->params = NULL;
        if(!$this->is_admin){

            $this->params = array(
             'user_id' => (int)$this->userId);
        }
    }
    public function index(){

        $this->data['the_view_content'] = 'admin_campaigns/list_Campaigns';
        $this->data['javascript']='admin_campaigns/create_campaigns';
        $this->_render_page('template/master_view', $this->data);
    }

    // Load du lieu thei kieu ajax
    public  function  getAjax(){

        $query = $this->MCampaigns->get($this->params);

        $count= $this->MCampaigns->getCount( $this->params);
        $num_row=1;
        $data = array();
        // $no = $_POST['start'];
        foreach ($query as $camp) {
            //  $no++;
            $row = array();
            $row[] = $camp->id;
            $row[] ='<a href="creatives/getCreativeByCampaignID?campaignId='.$camp->id.'">'.$camp->campaign_name.'</a>';
            $row[] = $camp->brand_name;
            $row[] = $camp->product_name;
            $row[] = $camp->sector_name;
//            $row[] = $camp->unit_title;
            $row[] = $camp->date_created;
           // $row[] = $adver->user_id;
            //
            $row[] = '<a class="btn btn-sm btn-primary" href="javascript:void(0);" title="Edit" onclick="getByIDCamp('."'".$camp->id."'".')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>'
            . '<a class="btn btn-sm btn-primary" href="javascript:void(0);" title="Delete" onclick="deleteItemByID('."'".$camp->id."'".",'Campaigns'".')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>';

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
    // Lay thong tin theo ID
    public  function  getByID(){
        $id = $_POST['id'];
        $data = $this->MCampaigns->getById($id);
        echo json_encode($data);
    }
    public function  getAllBrand()
    {
        $query = $this->MCampaigns->getAllBrand();
        echo json_encode($query);
    }
    public  function  getAllProduct(){
        $id = $_POST['id'];
        if($id==0)
        {
            $data = $this->MCampaigns->getAllProduct();
        }else
        {
            $data = $this->MCampaigns->getAllProduct($id);
        }
        echo json_encode($data);
    }
    public  function  getAllSector(){
        $id = $_POST['id'];

        $data = $this->MCampaigns->getAllSector($id);
        echo json_encode($data);
    }

    public function Insert()
    {
        // username => name input, Username => ten hien thi trong tb loi
        $this->form_validation->set_rules('name', 'Name', 'required');
      //  $this->form_validation->set_rules('unit', 'Unit', 'required');
        $date=date('Y-m-d H:i:s');
      //  echo json_encode(array("abc" => $this->form_validation->run())) ; die;
        if($this->form_validation->run())
        {
            $query=array(
                'table' =>'"campaigns"',
                'data' => array(
                    'campaign_name' => $this->input->post('name'),
                    'brand_id' => $this->input->post('brand_id'),
                    'product_id' => $this->input->post('product_id'),
                    'sector_id' => $this->input->post('sector_id'),
                    'unit_title' => $this->input->post('unit'),
                    'date_created'=> $date
                )
            );

            $this->MCampaigns->InsertOrUpdate($query);
            echo json_encode(array("status" => TRUE));
        }else
        {
            echo json_encode(array("status" => false));
            exit();
        }

    }
    public function Update()
    {
        $this->form_validation->set_rules('name', 'Name', 'required');
        $this->form_validation->set_rules('unit', 'Unit', 'required');
        $id=$this->input->post('id');
        $query=array(
            'table' =>'"campaigns"',
            'data' => array(
                'campaign_name' => $this->input->post('name'),
                'brand_id' => $this->input->post('brand_id'),
                'product_id' => $this->input->post('product_id'),
                'sector_id' => $this->input->post('sector_id'),
                'unit_title' => $this->input->post('unit')
            ),
            'param_where' =>array(
                'id' => $id,
            )
        );

        $this->MCampaigns->InsertOrUpdate($query);
        echo json_encode(array("status" => TRUE));
    }
    public function Delete()
    {

        $id=$this->input->post('id');
        $query=array(
            'table' =>'"campaigns"',
            'param_where' =>array(
                'id' => $id
            )
        );

        $this->MCampaigns->Delete($query);
        echo json_encode(array("status" => TRUE));
    }

}