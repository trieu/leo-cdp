<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


/**
 * Created by PhpStorm.
 * User: hung_
 * Date: 21/04/2016
 * Time: 9:54 SA
 */
class Publishers extends MY_Controller
{
    function __construct(){
        parent::__construct();
        $this->load->helper(array('form', 'url'));
        $this->load->model('MPublishers');
        $this->load->library('form_validation');
    }
    public function index(){

        $this->data['the_view_content'] = 'admin_publishers/list_publisher';
        $this->data['javascript']='admin_publishers/create_publisher';
        $this->_render_page('template/master_view', $this->data);
    }
    // Load du lieu thei kieu ajax
    public  function  getAjax(){

        $query = $this->MPublishers->get();
        $count= $this->MPublishers->getCount();
        $num_row=1;
        $data = array();
        // $no = $_POST['start'];
        foreach ($query as $adver) {
            //  $no++;
            $row = array();
            $row[] = $adver->id;
            $row[] ='<a href="javascript:void()" onclick="getByID('."'".$adver->id."'".",'Publisher'".')">'.$adver->name.'</a>';
            $row[] = $adver->contact_info;
           // $row[] = $adver->user_id;
            //
            $row[] = '<a class="btn btn-sm btn-primary" href="javascript:void()" title="Edit" onclick="getByID('."'".$adver->id."'".",'Publisher'".')"><i class="glyphicon glyphicon-pencil"></i> Edit</a>';
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

        $data = $this->MPublishers->getById($id);
        echo json_encode($data);
    }
    public function  getAllUser()
    {
        $query = $this->MPublishers->getAllUsers();
        echo json_encode($query);
    }
    public function Insert()
    {
        // username => name input, Username => ten hien thi trong tb loi
        $this->form_validation->set_rules('name', 'Name', 'required');
        if($this->form_validation->run())
        {
            $query=array(
                'table' =>'publishers',
                'data' => array(
                    'name' => $this->input->post('name'),
                    'user_id' => $this->input->post('user_id'),
                    'contact_info' => $this->input->post('contact_info')
                )
            );

            $this->MPublishers->InsertOrUpdate($query);
            echo json_encode(array("status" => TRUE));
        }else
        {
            echo json_encode(array("status" => false));
            exit();
        }

    }
    public function Update()
    {
        $id=$this->input->post('id');
        $query=array(
            'table' =>'publishers',
            'data' => array(
                'name' => $this->input->post('name'),
                'user_id' => $this->input->post('user_id'),
                'contact_info' => $this->input->post('contact_info')
            ),
            'param_where' =>array(
                'id' => $id,
            )
        );

        $this->MPublishers->InsertOrUpdate($query);
        echo json_encode(array("status" => TRUE));
    }
}