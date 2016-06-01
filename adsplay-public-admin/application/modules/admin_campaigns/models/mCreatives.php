<?php
/**
 * Created by PhpStorm.
 * User: mith
 * Date: 5/18/2016
 * Time: 2:48 PM
 */
class MCreatives extends My_Model
{
    private $table = 'tb_creative_dev';
    public function InsertOrUpdate($param = NULL)
    {
        if (isset($param) && is_array($param)) {
            $this->_save($param);
        }
    }
    // get list creative from postgre
    public function getCreativeByCampaignID($campaignID){
        $this->db2 = $this->load->database('postgres', TRUE);
        $this->db2->select('*')
            ->from($this->table)
            ->where('CampaignID',$campaignID);
        $query = $this->db2->get();
        return $query->result_array();
    }
    public function detailCreative($creativeID){
        $this->db2 = $this->load->database('postgres', TRUE);
        $this->db2->select('*')
            ->from($this->table)
            ->where('CreativeID',$creativeID);
        $query = $this->db2->get();
        return $query->row();
    }

}