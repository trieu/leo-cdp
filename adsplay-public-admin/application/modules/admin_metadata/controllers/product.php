<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


/**
 * Created by PhpStorm.
 * User: hung_
 * Date: 21/04/2016
 * Time: 9:54 SA
 */
class Product extends MY_Controller
{
    function __construct(){
        parent::__construct();
        $this->load->helper(array('form', 'url'));
        $this->load->model('MMetaData');
        $this->load->library('form_validation');
    }

    public  function  getAjax(){

        $query = $this->MMetaData->get('product');

        $count= $this->MMetaData->getCount('product');
        $num_row=1;
        $data = array();
        // $no = $_POST['start'];
        foreach ($query as $pro) {
            //  $no++;
            $row = array();
            $row[] = $pro->id;
            $row[] ='<a href="javascript:void()" onclick="getProductByID('."'".$pro->id."'".')">'.$pro->product_name.'</a>';
            $row[] = $pro->brand_name;
            $row[] = $pro->date_created;
            // $row[] = $adver->user_id;
            //
            $row[] = '<a class="btn btn-sm btn-primary" href="javascript:void()" title="Edit" onclick="getProductByID('."'".$pro->id."'".')"><i class="glyphicon glyphicon-pencil"></i> Edit</a>';
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

        $data = $this->MMetaData->getById($id,'product');
        echo json_encode($data);
    }
    public function  getAllBrand()
    {
        $query = $this->MMetaData->getAllBrand();
        echo json_encode($query);
    }
    public function Insert()
    {
        // username => name input, Username => ten hien thi trong tb loi
        $this->form_validation->set_rules('name', 'Name', 'required');
        $date=date('Y-m-d H:i:s');
        //echo $date; die;
        if($this->form_validation->run())
        {
            $query=array(
                'table' =>'products',
                'data' => array(
                    'product_name' => $this->input->post('name'),
                    'brand_id' => $this->input->post('brand_id'),
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
            'table' =>'products',
            'data' => array(
                'product_name' => $this->input->post('name'),
                'brand_id' => $this->input->post('brand_id')
            ),
            'param_where' =>array(
                'id' => $id,
            )
        );

        $this->MMetaData->InsertOrUpdate($query);
        echo json_encode(array("status" => TRUE));
    }
}