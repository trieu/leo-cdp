<?php
/**
 * Created by PhpStorm.
 * User: mith
 * Date: 5/18/2016
 * Time: 2:48 PM
 */
class MCreatives extends My_Model
{
    private $table = 'creatives';

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
}