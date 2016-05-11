<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title><?php // echo $page_title;?></title>

        <!-- CSS -->
        <link href="<?php echo base_url('template/assets/temp_new/css/bootstrap.min.css');?>" rel="stylesheet">
        <link href="<?php echo base_url('template/assets/temp_new/css/form.css');?>" rel="stylesheet">
        <link href="<?php echo base_url('template/assets/temp_new/css/style.css');?>" rel="stylesheet">
        <link href="<?php echo base_url('template/assets/temp_new/css/animate.css');?>" rel="stylesheet">
        <link href="<?php echo base_url('template/assets/temp_new/css/generics.css');?>" rel="stylesheet">

        <?php // echo $before_head;?>

    </head>
<body id="skin-blur-blue">
<?php
//var_dump($this->ion_auth->logged_in());die;

if($this->router->fetch_method() != 'login') {
    ?>
    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div id="navbar" class="collapse navbar-collapse">
                <ul class="nav navbar-nav navbar-right">

                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
                           aria-expanded="false"><?php echo $this->ion_auth->user()->row()->username; ?> <span
                                class="caret"></span></a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="<?php echo site_url('admin/user/profile'); ?>">Profile page</a></li>
                            <?php // echo $current_user_menu;?>
                            <li class="divider"></li>
                            <li><a href="<?php echo site_url('admin/user/logout'); ?>">Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
    </nav>

    <?php if ($this->session->flashdata('message')) {
        ?>
        <div class="container" style="padding-top:40px;">
            <div class="alert alert-info alert-dismissible" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span
                        aria-hidden="true">&times;</span></button>
                <?php echo $this->session->flashdata('message'); ?>
            </div>
        </div>
        <?php
    }
}  ?>
