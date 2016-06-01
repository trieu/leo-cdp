<?php
/**
 * Created by PhpStorm.
 * User: mith
 * Date: 9/3/2015
 * Time: 10:46 AM
 */
class media_file extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function addMediaFile($data)
    {
        $this->db->insert('"media_files"', $data);

        return ($this->db->affected_rows() > 0) ? true : false;
    }
}
