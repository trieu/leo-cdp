<?php
/**
 * Created by PhpStorm.
 * User: hung_
 * Date: 21/04/2016
 * Time: 9:31 SA
 */
class MCampaigns extends My_Model
{
    private $table = 'campaigns';
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
            return $this->_getjoin(array(
                'table' => $this->table,
                'select'=>'campaigns.id,campaigns.date_created,unit_title,campaign_name,brand_name,product_name,sector_name',
                'join'=>array(
                    array('brands','brands.id=campaigns.brand_id','inner'),
                    array('products','products.id=campaigns.product_id','inner'),
                    array('sectors','sectors.id=campaigns.sector_id','inner')
                ),
                'list' => TRUE,
                'type' => 'object'
            ));
        }
    }
    public function getAllBrand(){

        return $this->_general(array(
            'table' => 'brands',
            'list' => TRUE,
            'type' => 'object'
        ));

    }
    public function getAllProduct($id=NULL){
        if(isset($id))
        {
            return $this->_general(array(
                'table' => 'products',
                'param_where' => array(
                    'id' => $id
                ),
                'list' => TRUE,
                'type' => 'object'

            ));
        }


    }
    public function getAllSector($id=NULL){
        if(isset($id))
        {
            return $this->_general(array(
                'table' => 'sectors',
                'param_where' => array(
                    'id' => $id
                ),
                'list' => TRUE,
                'type' => 'object'

            ));
        }


    }
    public function getById($id=NULL){
        if(isset($id))
        {
            return $this->_getjoin(array(
                'table' => $this->table,
                'select'=>'campaigns.id,campaigns.date_created,unit_title,campaign_name,brand_name,product_name,sector_name,products.id AS ProID,brands.id AS BraID,sectors.id AS SecID',
                'join'=>array(
                    array('brands','brands.id=campaigns.brand_id','inner'),
                    array('products','products.id=campaigns.product_id','inner'),
                    array('sectors','sectors.id=campaigns.sector_id','inner')
                ),
                'param_where' => array(
                    'campaigns.id' => $id
                ),
                'list' => TRUE,
                'type' => 'object'

            ));
        }


    }
    public function getCount($param = NULL){
        return $this->_getjoin(array(
            'table' => $this->table,
            'select'=>'campaigns.id,campaigns.date_created,unit_title,campaign_name,brand_name,product_name,sector_name',
            'join'=>array(
                array('brands','brands.id=campaigns.brand_id','inner'),
                array('products','products.id=campaigns.product_id','inner'),
                array('sectors','sectors.id=campaigns.sector_id','inner')
            ),
            'count'=>true
        ));
    }

}