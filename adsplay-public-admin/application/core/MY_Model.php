<?php
/******************************
- C?u tr�c m?c �?nh kh?i t?o s?n c?a Model
 ********************************/
class MY_Model extends CI_Model{

    function __construct(){
        parent::__construct();
    }

    /******************************
    L?y d? li?u theo t�y ch?n
    - select: Nh?ng c?t c?n l?y ra
    - orderby: D? li?u ��?c s?p x?p theo
    - table: D? li?u ��?c l?y ra t? b?ng
    - type: Ki?u d? li?u tr? v? object hay array
    - limit: V? tr� d? li?u l?y ra
    - list: ��a ra nhi?u d?ng d? li?u
     ********************************/
    public function _general($param = NULL){
        if(isset($param['select']) && !empty($param['select'])){
            $this->db->select($param['select']);
        }
        if(isset($param['table']) && !empty($param['table'])){
            $this->db->from($param['table']);
        }
        if(isset($param['param']) && !empty($param['param'])){
            $this->db->where($param['param']);
        }
        if(isset($param['param_where']) && is_array($param['param_where'])){
            $this->db->where($param['param_where']);
        }
        if(isset($param['field_where_in']) && !empty($param['field_where_in']) && isset($param['param_where_in']) && is_array($param['param_where_in'])){
            $this->db->where_in($param['field_where_in'], $param['param_where_in']);
        }
        if(isset($param['limit']) && (int)$param['limit'] > 0){
            $this->db->limit((int)$param['limit'], (int)$param['start']);
        }
        if(isset($param['count']) && $param['count'] == TRUE){
            $data = $this->db->count_all_results();
            $this->db->flush_cache();
            return $data;
        }
        else{
            if(isset($param['list']) && $param['list'] == TRUE){
                if(isset($param['type']) && $param['type'] == 'object'){
                    $data = $this->db->get()->result_object();
                    $this->db->flush_cache();
                    return $data;
                }
                $data = $this->db->get()->result_array();
                $this->db->flush_cache();
                return $data;
            }
            else{
                if(isset($param['type']) && $param['type'] == 'object'){
                    $data = $this->db->get()->row_object();
                    $this->db->flush_cache();
                    return $data;
                }
                $data = $this->db->get()->row_array();
                $this->db->flush_cache();
                return $data;
            }
        }
    }

    /******************************
    L?y d? li?u ��n gi?n
    - select: Nh?ng c?t c?n l?y ra
    - orderby: D? li?u ��?c s?p x?p theo
    - table: D? li?u ��?c l?y ra t? b?ng
    - limit: V? tr� d? li?u l?y ra
    - type: Ki?u d? li?u tr? v? object hay array
    - list: ��a ra nhi?u d?ng d? li?u
     ********************************/
    public function _get($param = NULL){
        if(isset($param['select']) && !empty($param['select'])){
            $this->db->select($param['select']);
        }
        if(isset($param['table']) && !empty($param['table'])){
            $this->db->from($param['table']);
        }
        if(isset($param['limit']) && (int)$param['limit'] > 0){
            $this->db->limit((int)$param['limit'], (int)$param['start']);
        }
        if(isset($param['count']) && $param['count'] == TRUE){
            $data = $this->db->count_all_results();
            $this->db->flush_cache();
            return $data;
        }
        else{
            if(isset($param['list']) && $param['list'] == TRUE){
                if(isset($param['type']) && $param['type'] == 'object'){
                    $data = $this->db->get()->result_object();
                    $this->db->flush_cache();
                    return $data;
                }
                $data = $this->db->get()->result_array();
                $this->db->flush_cache();
                return $data;
            }
            else{
                if(isset($param['type']) && $param['type'] == 'object'){
                    $data = $this->db->get()->row_object();
                    $this->db->flush_cache();
                    return $data;
                }
                $data = $this->db->get()->row_array();
                $this->db->flush_cache();
                return $data;
            }
        }
    }

    /******************************
    L?y d? li?u ��n gi?n v?i �i?u ki?n where
    - param_where:M?ng �i?u ki?n
     ********************************/
    public function _getwhere($param = NULL){
        if(isset($param['param_where']) && is_array($param['param_where'])){
            $this->db->where($param['param_where']);
        }
        return $this->_get($param);
    }

    /******************************
    L?y d? li?u ��n gi?n v?i �i?u ki?n wherein
    - field_where_in:Tr�?ng d? li?u
    - param_where_in: T?p h?p gi� tr? th?a m?n
     ********************************/
    public function _getwherein($param = NULL){
        if(isset($param['field_where_in']) && !empty($param['field_where_in']) && isset($param['param_where_in']) && is_array($param['param_where_in'])){
            $this->db->where_in($param['field_where_in'], $param['param_where_in']);
        }
        return $this->_get($param);
    }

    /******************************
    L?y d? li?u ��n gi?n v?i �i?u ki?n like
    - type == 'array':/ WHERE title LIKE '%match%' AND page1 LIKE '%match%' AND page2 LIKE '%match%'
     ********************************/
    public function _getlike($param = NULL, $type = 'single'){
        if($type == 'array'){
            if(isset($param['like']) && is_array($param['like'])){
                $this->db->like($param['param_like']);
            }
        }
        else if($type == 'single'){
            if(isset($param['like']) && is_array($param['like'])){
                foreach($param['like'] as $key => $val){
                    $this->db->like($val[0], $val[1], isset($val[2])?$val[2]:'');
                }
            }
        }
        return $this->_get($param);

    }

    /******************************
    H�m insert ho?c update
    N?u c� �i?u ki?n truy?n v�o s? l� update.
    Ng�?c l?i l� insert
     ********************************/
    public function _save($param = NULL){
        $flag = 0;
        $time = gmdate('Y-m-d H:i:s', time() + 7*3600);
        $data = $param['data'];
        //$data['created'] = $time;
        //$data['updated'] = $time;
        if(isset($param['param']) && !empty($param['param'])){
            $this->db->where($param['param']);
            $flag = $flag = + 1;
        }
        if(isset($param['param_where']) && is_array($param['param_where'])){
            $this->db->where($param['param_where']);
            $flag = $flag = + 1;
        }
        if(isset($param['field_where_in']) && !empty($param['field_where_in']) && isset($param['param_where_in']) && is_array($param['param_where_in'])){
            $this->db->where_in($param['field_where_in'], $param['param_where_in']);
            $flag = $flag = + 1;
        }
        if($flag == 0){

            $this->db->set($data);
            $this->db->insert($param['table']);
            // $this->db->insert($param['table'], $data);
            $insert_id = $this->db->insert_id();
            $this->db->flush_cache();
            return $insert_id;
        }
        else{

            $this->db->set($data);
            $this->db->update($param['table']);
            $affected_rows = $this->db->affected_rows();
            $this->db->flush_cache();
            return $affected_rows;
        }
    }

    public function _del($param = NULL){
        $flag = 0;
        if(isset($param['param']) && !empty($param['param'])){
            $this->db->where($param['param']);
            $flag = $flag = + 1;
        }
        if(isset($param['param_where']) && is_array($param['param_where'])){
            $this->db->where($param['param_where']);
            $flag = $flag = + 1;
        }
        if(isset($param['field_where_in']) && !empty($param['field_where_in']) && isset($param['param_where_in']) && is_array($param['param_where_in'])){
            $this->db->where_in($param['field_where_in'], $param['param_where_in']);
            $flag = $flag = + 1;
        }
        if($flag > 0){
            $this->db->delete($param['table']);
            $affected_rows = $this->db->affected_rows();
            $this->db->flush_cache();
            return $affected_rows;
        }
        return 0;
    }
    /******************************************
     *H�m Join
     * @param['join'] l� 1 array ch?a nhi?u b?ng join v?i nhau
     * vd: 'join'=>array(
                            array('groups','groups.groupid=users.groupid','left'),
                            array('comments','comments.userid=users.userid','inner')
    )
    ******************************************/
    public function _getjoin($param = NULL)
    {
        if(isset($param['join']) && !empty($param['join']) &&is_array($param['join'])) {
            foreach($param['join'] as $key=>$value){
                $this->db->join($value[0],$value[1],$value[2]);
            }
        }
        return $this->_general($param);
    }
}