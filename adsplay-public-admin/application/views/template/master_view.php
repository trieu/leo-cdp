<!DOCTYPE html>
<!--[if IE 9 ]><html class="ie9"><![endif]-->
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <meta name="format-detection" content="telephone=no">
    <meta charset="UTF-8">

    <meta name="description" content="Nền tảng quảng cáo truyền hình trực tuyến adsplay">
    <meta name="keywords" content="adsplay, itvad, quảng cáo">
    <link rel="shortcut icon" href="<?php echo base_url('assets/images/favicon.ico') ?>"/>

    <title>AdsPlay Admin V3</title>

    <!-- CSS -->
    <link href="<?php echo base_url('template/assets/temp_new/css/bootstrap.min.css'); ?>" rel="stylesheet">
    <link href="<?php echo base_url('template/assets/temp_new/css/animate.min.css'); ?>" rel="stylesheet">
    <link href="<?php echo base_url('template/assets/temp_new/css/font-awesome.min.css'); ?>" rel="stylesheet">
    <link href="<?php echo base_url('template/assets/temp_new/css/form.css'); ?>" rel="stylesheet">
    <link href="<?php echo base_url('template/assets/temp_new/css/calendar.css'); ?>" rel="stylesheet">
    <link href="<?php echo base_url('template/assets/temp_new/css/style.css'); ?>" rel="stylesheet">
    <link href="<?php echo base_url('template/assets/temp_new/css/icons.css'); ?>" rel="stylesheet">
    <link href="<?php echo base_url('template/assets/temp_new/css/generics.css'); ?>" rel="stylesheet">
    <!-- CSS Datatable -->
    <link href="<?php echo base_url('template/assets/temp_new/js/datatables/jquery.dataTables.min.css')?>" rel="stylesheet" type="text/css" />
    <link href="<?php echo base_url('template/assets/temp_new/js/datatables/buttons.bootstrap.min.css')?>" rel="stylesheet" type="text/css" />
    <link href="<?php echo base_url('template/assets/temp_new/js/datatables/fixedHeader.bootstrap.min.css')?>" rel="stylesheet" type="text/css" />
    <link href="<?php echo base_url('template/assets/temp_new/js/datatables/responsive.bootstrap.min.css')?>" rel="stylesheet" type="text/css" />
    <link href="<?php echo base_url('template/assets/temp_new/js/datatables/scroller.bootstrap.min.css')?>" rel="stylesheet" type="text/css" />

    <!-- jQuery -->
    <script src="<?php echo base_url('/template/assets/temp_new/js/jquery.min.js');?>"></script> <!-- jQuery Library -->
    <script src="<?php echo base_url('/template/assets/temp_new/js/jquery-ui.min.js');?>"></script> <!-- jQuery UI -->
    <script src="<?php echo base_url('/template/assets/temp_new/js/jquery.easing.1.3.js');?>"></script> <!-- jQuery Easing - Requirred for Lightbox + Pie Charts-->
    <script src="<?php echo base_url('/template/assets/js/bootbox.min.js');?>"></script>
    <!-- Bootstrap -->
    <script src="<?php echo base_url('/template/assets/temp_new/js/bootstrap.min.js');?>"></script>
    <!-- x-editable (bootstrap version) -->
    <link href="//cdnjs.cloudflare.com/ajax/libs/x-editable/1.5.0/bootstrap3-editable/css/bootstrap-editable.css" rel="stylesheet"/>
    <script src="//cdnjs.cloudflare.com/ajax/libs/x-editable/1.5.0/bootstrap3-editable/js/bootstrap-editable.min.js"></script>
    <script src="<?php echo base_url('template/assets/js/dev.js') ?>"></script>
    <script src="<?php echo base_url('template/assets/js/dev-datatable.js') ?>"></script>
</head>
<body id="skin-blur-blue">

<header id="header" class="media">
    <a href="" id="menu-toggle"></a>
    <a class="logo pull-left" href="<?php echo base_url() ?>">ADSPLAY ADMIN</a>

    <div class="media-body">
        <div class="media" id="top-menu">

            <div id="time" class="pull-right">
                <span id="hours"></span>
                :
                <span id="min"></span>
                :
                <span id="sec"></span>
            </div>
            <div class="media-body">
                <input type="text" class="main-search">
            </div>
        </div>
    </div>
</header>

<div class="clearfix"></div>

<section id="main" class="p-relative" role="main">

    <!-- Sidebar -->
    <aside id="sidebar">

            <!-- Sidbar Widgets -->
            <div class="side-widgets overflow">
                <!-- Profile Menu -->
                <div class="text-center s-widget m-b-25 dropdown" id="profile-menu">
                    <a href="" data-toggle="dropdown">
                        <img class="profile-pic animated" src="<?php echo base_url(); ?>template/assets/temp_new/img/logo_analytics.gif" alt="">
                    </a>
                    <ul class="dropdown-menu profile-menu">
                        <li><a href="<?php echo site_url('admin/user/profile');?>">My Profile</a> <i class="icon left">&#61903;</i><i class="icon right">&#61815;</i></li>
                        <li><a href="<?php echo site_url('admin_auth/auth/logout'); ?>">Sign Out</a> <i class="icon left">&#61903;</i><i class="icon right">&#61815;</i></li>
                    </ul>
<!--                    --><?php //var_dump($this->ion_auth->user()->row()); ?>
                    <h4 class="m-0"> <?php echo $this->ion_auth->user()->row()->username;?></h4>
                </div>

                <!-- Calendar -->
                <div class="s-widget m-b-25">
                    <div id="sidebar-calendar"></div>
                </div>
            </div>

        <!-- Side Menu -->
        <ul class="list-unstyled side-menu">
            <li class="active">
                <a class="sa-side-home" href="<?php echo base_url() ?>">
                    <span class="menu-item">Dashboard</span>
                </a>
            </li>
            <li>
                <a class="sa-side-form" href="<?php echo site_url('admin_metadata/metadata/instream'); ?>">
                    <span class="menu-item"> In-stream form</span>
                </a>
<!--                <ul class="list-unstyled menu-item">-->
<!--                    <li><a href="--><?php //echo site_url('admin_metadata/metadata/instream'); ?><!--">Create In-stream</a></li>-->
<!--                    <!--<li><a href="form-components.html">All Creative</a></li>-->
<!---->
<!--                </ul>-->
            </li>
            <li>
                <a class="sa-side-widget" href="<?php echo site_url('admin_metadata/metadata/expandable'); ?>">
                    <span class="menu-item"> Expandable logo</span>
                </a>
            </li>
            <!--<li>
                <a class="sa-side-table" href="tables.html">
                    <span class="menu-item">Tables</span>
                </a>
            </li>-->
            <li>
                <a class="sa-side-form" href="<?php echo site_url('admin_advertisers/advertisers'); ?>">
                    <span class="menu-item"> Advertisers</span>
                </a>
<!--                <ul class="list-unstyled menu-item">-->
<!--                   <!-- <li><a onclick="add_data_modal('Advertiser')" href="javascript:void(0);">Create Advertiser</a></li>-->
<!--                    <li><a href="--><?php //echo site_url('admin_advertisers/advertisers'); ?><!--">All Advertisers</a></li>-->
<!--                </ul>-->
            </li>
            <li>
                <a class="sa-side-ui" href="<?php echo site_url('admin_publishers/publishers'); ?>">
                    <span class="menu-item"> Publishers </span>
                </a>
<!--                <ul class="list-unstyled menu-item">-->
<!--                    <!--<li><a onclick="add_data_modal('Publisher')" href="javascript:void(0);">Create Publisher</a></li>-->
<!--                    <li><a href="--><?php //echo site_url('admin_publishers/publishers'); ?><!--">All Publishers</a></li>-->
<!--                </ul>-->
            </li>

            <li>
                <a class="sa-side-folder" href="<?php echo site_url('admin_campaigns/campaigns'); ?>">
                    <span class="menu-item">Campaigns</span>
                </a>
            </li>
            <li>
                <a class="sa-side-chart" href="<?php echo site_url('admin_advertisers/advertisers/chart'); ?>">
                    <span class="menu-item">Summary Report</span>
                </a>
            </li>
            <?php if($this->ion_auth->in_group('superAdmin')):?>
                <li>
                    <a class="sa-side-folder" href="<?php echo site_url('admin_metadata/metadata'); ?>">
                        <span class="menu-item"> Meta Data</span>
                    </a>
                </li>
                <li>
                    <a class="sa-side-calendar" href="<?php echo site_url('admin_auth/auth/List_User'); ?>">
                        <span class="menu-item"> Users</span>
                    </a>
                </li>
            <?php endif; ?>

        </ul>

    </aside>
    <!-- Content -->
    <section id="content" class="container">

        <?php $this->load->view(isset($the_view_content)?$the_view_content:NULL);?>
    </section>

    <!-- Older IE Message -->
    <!--[if lt IE 9]>
    <div class="ie-block">
        <h1 class="Ops">Ooops!</h1>
        <p>You are using an outdated version of Internet Explorer, upgrade to any of the following web browser in order to access the maximum functionality of this website. </p>
        <ul class="browsers">
            <li>
                <a href="https://www.google.com/intl/en/chrome/browser/">
                    <img src="img/browsers/chrome.png" alt="">
                    <div>Google Chrome</div>
                </a>
            </li>
            <li>
                <a href="http://www.mozilla.org/en-US/firefox/new/">
                    <img src="img/browsers/firefox.png" alt="">
                    <div>Mozilla Firefox</div>
                </a>
            </li>
            <li>
                <a href="http://www.opera.com/computer/windows">
                    <img src="img/browsers/opera.png" alt="">
                    <div>Opera</div>
                </a>
            </li>
            <li>
                <a href="http://safari.en.softonic.com/">
                    <img src="img/browsers/safari.png" alt="">
                    <div>Safari</div>
                </a>
            </li>
            <li>
                <a href="http://windows.microsoft.com/en-us/internet-explorer/downloads/ie-10/worldwide-languages">
                    <img src="img/browsers/ie.png" alt="">
                    <div>Internet Explorer(New)</div>
                </a>
            </li>
        </ul>
        <p>Upgrade your browser for a Safer and Faster web experience. <br/>Thank you for your patience...</p>
    </div>
    <![endif]-->
</section>

<!-- Javascript Libraries -->
<!-- Charts -->
<script src="<?php echo base_url('template/assets/temp_new/js/charts/jquery.flot.js');?>"></script> <!-- Flot Main -->
<script src="<?php echo base_url('template/assets/temp_new/js/charts/jquery.flot.time.js');?>"></script> <!-- Flot sub -->
<script src="<?php echo base_url('template/assets/temp_new/js/charts/jquery.flot.animator.min.js');?>"></script> <!-- Flot sub -->
<script src="<?php echo base_url('template/assets/temp_new/js/charts/jquery.flot.resize.min.js');?>"></script> <!-- Flot sub - for repaint when resizing the screen -->

<script src="<?php echo base_url('template/assets/temp_new/js/sparkline.min.js');?>"></script> <!-- Sparkline - Tiny charts -->
<script src="<?php echo base_url('template/assets/temp_new/js/easypiechart.js');?>"></script> <!-- EasyPieChart - Animated Pie Charts -->
<script src="<?php echo base_url('template/assets/temp_new/js/charts.js');?>"></script> <!-- All the above chart related functions -->
<script src="<?php echo base_url('template/assets/temp_new/js/select.min.js');?>"></script>
<script src="<?php echo base_url('template/assets/temp_new/js/fileupload.min.js');?>"></script>

<!-- Map -->
<script src="<?php echo base_url('template/assets/temp_new/js/maps/jvectormap.min.js');?>"></script> <!-- jVectorMap main library -->
<script src="<?php echo base_url('template/assets/temp_new/js/maps/usa.js');?>"></script> <!-- USA Map for jVectorMap -->

<!--  Form Related -->
<script src="<?php echo base_url('template/assets/temp_new/js/icheck.js');?>"></script> <!-- Custom Checkbox + Radio -->

<!-- UX -->
<script src="<?php echo base_url('template/assets/temp_new/js/scroll.min.js');?>"></script> <!-- Custom Scrollbar -->
<!-- Text Editor -->
<script src="<?php echo base_url('template/assets/temp_new/js/editor.min.js');?>"></script> <!-- WYSIWYG Editor -->
<!-- Other -->
<script src="<?php echo base_url('template/assets/temp_new/js/calendar.min.js');?>"></script> <!-- Calendar -->
<script src="<?php echo base_url('template/assets/temp_new/js/feeds.min.js');?>"></script> <!-- News Feeds -->
<!-- Datatables-->
<script src="<?php echo base_url('template/assets/temp_new/js/datatables/jquery.dataTables.min.js')?>"></script>
<script src="<?php echo base_url('template/assets/temp_new/js/datatables/dataTables.bootstrap.js')?>"></script>
<script src="<?php echo base_url('template/assets/temp_new/js/datatables/dataTables.buttons.min.js')?>"></script>
<script src="<?php echo base_url('template/assets/temp_new/js/datatables/buttons.bootstrap.min.js')?>"></script>
<script src="<?php echo base_url('template/assets/temp_new/js/datatables/jszip.min.js')?>"></script>
<script src="<?php echo base_url('template/assets/temp_new/js/datatables/pdfmake.min.js')?>"></script>
<script src="<?php echo base_url('template/assets/temp_new/js/datatables/vfs_fonts.js')?>"></script>
<script src="<?php echo base_url('template/assets/temp_new/js/datatables/buttons.html5.min.js')?>"></script>
<script src="<?php echo base_url('template/assets/temp_new/js/datatables/buttons.print.min.js')?>"></script>
<script src="<?php echo base_url('template/assets/temp_new/js/datatables/dataTables.fixedHeader.min.js')?>"></script>
<script src="<?php echo base_url('template/assets/temp_new/js/datatables/dataTables.keyTable.min.js')?>"></script>
<script src="<?php echo base_url('template/assets/temp_new/js/datatables/dataTables.responsive.min.js')?>"></script>
<script src="<?php echo base_url('template/assets/temp_new/js/datatables/responsive.bootstrap.min.js')?>"></script>
<script src="<?php echo base_url('template/assets/temp_new/js/datatables/dataTables.scroller.min.js')?>"></script>

<!-- form validation -->
<script src="<?php echo base_url('template/assets/temp_new/js/validator.js')?>"></script>





<?php
if(isset($javascript))
{
    if(is_array($javascript))
    {
        foreach ($javascript as $value) {
            $this->load->view(isset($value)?$value:NULL);
        }
    }else
    {
        $this->load->view(isset($javascript)?$javascript:NULL);
    }

}

?>
<!-- All JS functions -->
<script >
    $.getScript("<?php echo base_url('template/assets/temp_new/js/functions.js');?>")
</script>
</body>
</html>