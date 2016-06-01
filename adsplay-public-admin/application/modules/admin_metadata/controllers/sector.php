<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


/**
 * Created by PhpStorm.
 * User: hung_
 * Date: 21/04/2016
 * Time: 9:54 SA
 */
class Sector extends MY_Controller
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
    public  function index()
    {
        $this->load->view('admin_metadata/sector/List_Sector');
    }
    public  function  getAjax(){

        $query = $this->MMetaData->get('sector');

        $count= $this->MMetaData->getCount('sector');
        $num_row=1;
        $data = array();
        // $no = $_POST['start'];
        foreach ($query as $sector) {
            //  $no++;
            $row = array();
            $row[] = $sector->id;
            $row[] ='<a href="javascript:void(0);" onclick="getSectorByID('."'".$sector->id."'".')">'.$sector->sector_name.'</a>';
            $row[] = $sector->product_name;
            $row[] = $sector->date_created;
            // $row[] = $adver->user_id;
            //
            $row[] = '<a class="btn btn-sm btn-primary" href="javascript:void(0);" title="Edit" onclick="getSectorByID('."'".$sector->id."'".')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>';
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
    public  function  getByID(){
        $id = $_POST['id'];

        $data = $this->MMetaData->getById($id,'sector');
        echo json_encode($data);
    }
//    public function  getAllProduct()
//    {
//        $query = $this->MMetaData->getAllProduct();
//        echo json_encode($query);
//    }
    /**
     * lấy danh sách products bởi brand id
     * @author Mith
     */
//    public function getProductByBrandId()
//    {
//        $brandId = (int)$this->input->post('brandId');
//
//        $query = $this->MMetaData->getProductByBrandId($brandId);
//        echo json_encode($query);
//
//    }
    /**
     * lấy danh sách sector bởi product id
     * @author Mith
     */
//    public function getSectorByProductId()
//    {
//        $productId = (int)$this->input->post('productId');
//
//        $query = $this->MMetaData->getSectorByProductId($productId);
//        echo json_encode($query);
//
//    }
    public function Insert()
    {
        // username => name input, Username => ten hien thi trong tb loi
        $this->form_validation->set_rules('name', 'Name', 'required');
        $date=date('Y-m-d H:i:s');
        //echo $date; die;
        if($this->form_validation->run())
        {
            $query=array(
                'table' =>'"sectors"',
                'data' => array(
                    'sector_name' => $this->input->post('name'),
                    'product_id' => $this->input->post('product_id'),
                    'date_created'=> $date
                )
            );

            $this->MMetaData->InsertOrUpdate($query);
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
        $id=$this->input->post('id');
        $query=array(
            'table' =>'"sectors"',
            'data' => array(
                'sector_name' => $this->input->post('name'),
                'product_id' => $this->input->post('product_id')
            ),
            'param_where' =>array(
                'id' => $id,
            )
        );

        $this->MMetaData->InsertOrUpdate($query);
        echo json_encode(array("status" => TRUE));
    }
}