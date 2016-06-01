<?php
/**
 * Created by PhpStorm.
 * User: hung_
 * Date: 21/04/2016
 * Time: 9:31 SA
 */
class MMetaData extends My_Model
{
    // private $tableBrand = 'brands';
    public function InsertOrUpdate($param = NULL){
        if(isset($param) && is_array($param))
        {
            $this->_save($param);
        }
    }
    public function Delete($param = NULL){
        if(isset($param) && is_array($param))
        {
            $this->_del($param);
        }
    }
    public function get($param = NULL){
        if(isset($param))
        {
            $join=array();
            $table='"brands"';
            $select='*';
            if($param=="product")
            {
                $table='"products"';
                $select='products.id as id,product_name,brand_id,products.date_created,brand_name ';
                $join=array(
                    array('"brands"','brands.id=products.brand_id','inner')
                );
            }else if($param=="sector")
            {
                $table='"sectors"';
                $select='sectors.id as id,sector_name,product_id,sectors.date_created,product_name';
                $join=array(
                    array('"products"','products.id=sectors.product_id','inner')
                );
            }
            return $this->_getjoin(array(
                'table' => $table,
                'select'=>$select,
                'join'=>$join,
                'list' => TRUE,
                'type' => 'object'
            ));
        }
    }
    public function getAllBrand(){

        return $this->_general(array(
            'table' => '"brands"',
            'list' => TRUE,
            'type' => 'object'
        ));

    }
    public function getAllProduct(){
        return $this->_general(array(
            'table' => '"products"',
            'list' => TRUE,
            'type' => 'object'

        ));

    }

    public function getAllCampaign(){
        return $this->_general(array(
            'table' => '"campaigns"',
            'list' => TRUE,
            'type' => 'object'

        ));

    }
    public function getProductByBrandId($brandId)
    {

        return $this->_getwhere(array(
            'table' => '"products"',
            'list' => TRUE,
            'type' => 'object',
            'param_where' => array(
                'brand_id' => $brandId
            ),

        ));
    }
    public function getSectorByProductId($productId)
    {
        return $this->_getwhere(array(
            'table' => '"sectors"',
            'list' => TRUE,
            'type' => 'object',
            'param_where' => array(
                'product_id' => $productId
            ),

        ));
    }
    public function getById($id=NULL,$param=NULL){
        if(isset($param)&&isset($id))
        {
            $join=array();
            $table='"brands"';
            $select='*';
            $idWhere='id';
            if($param=="product")
            {
                $table='"products"';
                $select='products.id as id,product_name,brand_id,products.date_created,brand_name ';
                $idWhere='products.id';
                $join=array(
                    array('"brands"','brands.id=products.brand_id','inner')
                );
            }else if($param=="sector")
            {
                $table='"sectors"';
                $select='sectors.id as id,sector_name,product_id,sectors.date_created,product_name';
                $idWhere='sectors.id';
                $join=array(
                    array('products','products.id=sectors.product_id','inner')
                );
            }
            return $this->_getjoin(array(
                'table' => $table,
                'select'=>$select,
                'join'=>$join,
                'param_where' => array(
                    $idWhere => $id
                ),
                'list' => TRUE,
                'type' => 'object'
            ));
        }


    }
    public function getCount($param = NULL){
        if(isset($param))
        {
            $join=array();
            $table='"brands"';
            $select='*';
            if($param=="product")
            {
                $table='"products"';
                $select='products.id as id,product_name,brand_id,products.date_created,brand_name ';
                $join=array(
                    array('"brands"','brands.id=products.brand_id','inner')
                );
            }else if($param=="sector")
            {
                $table='"sectors"';
                $select='sectors.id as id,sector_name,product_id,sectors.date_created,product_name';
                $join=array(
                    array('"products"','products.id=sectors.product_id','inner')
                );
            }
            return $this->_getjoin(array(
                'table' => $table,
                'select'=>$select,
                'join'=>$join,
                'count' =>true
            ));
        }
    }

}