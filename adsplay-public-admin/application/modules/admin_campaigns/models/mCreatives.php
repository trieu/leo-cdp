<?php
/**
 * Created by PhpStorm.
 * User: mith
 * Date: 5/18/2016
 * Time: 2:48 PM
 */
class MCreatives extends My_Model
{
    private $table = '"creatives"';

    public function InsertOrUpdate($param = NULL)
    {
        if (isset($param) && is_array($param)) {
            $this->_save($param);
        }
    }
    public function getCreative($param = NULL){
        if(isset($param) && is_array($param))
        {
            return $this->_general($param);
        }else {
            return $this->_general(array(
                'table' => $this->table,
                'list' => TRUE,
                'type' => 'object'
            ));
        }
    }
    public function getCount($param = NULL){
        return $this->_general(array(
            'table' => $this->table,
            'count' => TRUE

        ));
    }
    // Add data example for creatives
    public function getDetailCreative(){
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
//        $data ='{
//                    "created_date" :"May 12, 2016",
//                    "expired_date" :"May 15, 2016",
//                    "status": "Finished",
//                    "click_through":"https://goo.gl/88ucaC",
//                    "total_booking":0,
//                    "daily_booking":0,
//                    "hourly_booking":0,
//                    "discount":0,
//                    "click_through_rate":"3.73 %",
//                    "completed_view_rate":"76.59 %",
//                    "total_impression":184,540,
//                    "total_click":6,876,
//                    "audience_reach": 763,
//                    "total_revenue":"-"
//
//                }';
        return $object;
    }

}