<?php
/**
 * Created by PhpStorm.
 * User: mith
 * Date: 9/28/2015
 * Time: 9:47 AM
 */
class Users_model extends CI_Model{

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function addPublisher($data){

//        var_dump($data);die;
        $this->db->insert('publishers', $data);

        return ($this->db->affected_rows() > 0) ? true : false;
    }

    public function listUsers(){
        $this->db->select('*')
            ->from('users');
        $query = $this->db->get();

        return $query->result_object();
    }
    public function listGroups(){
        $this->db->select('*')
            ->from('groups');
        $query = $this->db->get();

        return $query->result_object();
    }
    public function updateUser($data){
        if($this->checkUser($data)){
            $this->db->where('id', $data['id']);
            $this->db->update('users', $data);
            return true;
        }
        return false;
    }
    public function checkUser($data){
        $this->db->select("*")
            ->from("users");
        if(isset($data['first_name'])){
            $this->db->where('first_name',$data['first_name']);
        }
        if(isset($data['last_name'])){
            $this->db->where('last_name',$data['last_name']);
        }
        if(isset($data['email'])){
            $this->db->where('email',$data['email']);
        }
        $query = $this->db->get();
        if($query->num_rows()!==1){
            return true;
        }else{
            return false;
        }
    }
    //pagination
    public function record_count() {
        return $this->db->count_all("users");
    }
    function get_by_range($page,$perPage){

        $query = $this->db->get('users', $perPage, (($page-1) * $perPage));

        return $query->result_array();
    }
}