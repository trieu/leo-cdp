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

        $this->db->select('*')
            ->from($this->table)
            ->where('campaignid',$campaignID);
        $query = $this->db->get();
        return $query->result_array();

    }
    public function detailCreative($creativeID){

        $this->db->select('*')
            ->from($this->table)
            ->where('creativeid',$creativeID);
        $query = $this->db->get();
        return $query->row();
    }

}