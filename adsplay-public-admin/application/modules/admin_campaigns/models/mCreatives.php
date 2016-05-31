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

    // Add data example for creatives
    public function getDetailCreativeTest(){
        $object = new stdClass;
        $object->created_date = "May 12, 2016";
        $object->expired_date = "May 15, 2016";
        $object->status ="Finished";
        $object->click_through ="https://goo.gl/88ucaC";
        $object->total_booking =0;
        $object->daily_booking =0;
        $object->hourly_booking =0;
        $object->discount = 0;
        $object->click_through_rate =3.73;
        $object->completed_view_rate =76.59;
        $object->total_impression =184540;
        $object->total_click = 6876;
        $object->audience_reach =763;
        $object->total_revenue = "-";

        return $object;
    }

}