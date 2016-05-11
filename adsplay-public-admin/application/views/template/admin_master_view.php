<?php defined('BASEPATH') OR exit('No direct script access allowed');
$this->load->view('template/_parts/admin_master_header_view'); ?>
<?php $this->load->view(isset($the_view_content)?$the_view_content:NULL);?>
<?php $this->load->view('template/_parts/admin_master_footer_view');?>