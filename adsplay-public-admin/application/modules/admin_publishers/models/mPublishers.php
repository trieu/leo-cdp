<?php
/**
 * Created by PhpStorm.
 * User: hung_
 * Date: 21/04/2016
 * Time: 9:31 SA
 */
class MPublishers extends My_Model
{
    private $table = 'publishers';
    public function InsertOrUpdate($param = NULL){
        if(isset($param) && is_array($param))
        {
            $this->_save($param);
        }
    }
    public function get($param = NULL){
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
    public function getAllUsers(){

            return $this->_general(array(
                'table' => 'users',
                'list' => TRUE,
                'type' => 'object'
            ));

    }
    public function getById($id=NULL){
        if(isset($id))
        {
            return $this->_general(array(
                'table' => $this->table,
                'param_where' => array(
                    'id' => $id
                ),
                'list' => TRUE,
                'type' => 'object'

            ));
        }


    }
    public function getwherein($param = NULL){
        return $this->_getwherein(array(
            'table' => $this->table,
            'field_where_in' => 'username',
            'param_where_in'=>array('hungnt','quyenlh','acd'),
            'list' => false,
            'type' => 'object'
        ));
    }
    public function getjoin($param = NULL){
        return $this->_getjoin(array(
            'table' => $this->table,
            'join'=>array(
                array('groups','groups.groupid=users.groupid','left'),
                array('comments','comments.userid=users.userid','inner')
            ),
            'param_where' => array('comments.userid'=> '2','users.username' => 'quyenlh'),
            'list' => TRUE
        ));
    }
    public function getCount($param = NULL){
        return $this->_general(array(
            'table' => $this->table,
            'count' => true
        ));
    }

}