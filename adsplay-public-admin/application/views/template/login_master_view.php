<?php
/**
 * Created by PhpStorm.
 * User: mith
 * Date: 12/3/2015
 * Time: 11:30 AM
 */
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="<?php echo base_url('assets/images/favicon.ico') ?>"/>
    <title>AdsPlay Admin</title>

    <!--start wysiwyg-->
    <link href="http://www.jqueryscript.net/css/jquerysctipttop.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet"
          href="http://netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="http://netdna.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css">
    <script type="application/javascript" src="<?php echo base_url('template/assets/js/jquery.min.js') ?>"></script>

    <link href="<?php echo base_url('template/assets/css/style.css') ?>" rel="stylesheet"/>
    <script src="<?php echo base_url('template/assets/js/bootstrap-wysiwyg.js') ?>"></script>
    <!-- end-->
    <link href="<?php echo base_url('template/assets/css/metisMenu.min.css') ?>" rel="stylesheet"/>
    <link href="<?php echo base_url('template/assets/css/dataTables.bootstrap.css') ?>" rel="stylesheet"/>
    <link href="<?php echo base_url('template/assets/css/dataTables.responsive.css') ?>" rel="stylesheet"/>
    <link href="<?php echo base_url('template/assets/css/sb-admin-2.css') ?>" rel="stylesheet"/>
    <!-- bootstrap -->

    <script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
    <script
        src="http://netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>

    <!-- bootstrap -->
    <!-- x-editable (bootstrap version) -->
    <link href="//cdnjs.cloudflare.com/ajax/libs/x-editable/1.5.0/bootstrap3-editable/css/bootstrap-editable.css" rel="stylesheet"/>
    <script src="//cdnjs.cloudflare.com/ajax/libs/x-editable/1.5.0/bootstrap3-editable/js/bootstrap-editable.min.js"></script>
    <script src="<?php echo base_url('template/assets/js/dev.js') ?>"></script>


</head>
<body>
<?php echo $the_view_content; ?>
<script type="application/javascript" src="<?php echo base_url('template/assets/js/metisMenu.min.js'); ?>"></script>
<script type="application/javascript" src="<?php echo base_url('template/assets/js/jquery.dataTables.min.js'); ?>"></script>
<script type="application/javascript" src="<?php echo base_url('template/assets/js/dataTables.bootstrap.min.js'); ?>"></script>
<script type="application/javascript" src="<?php echo base_url('template/assets/js/sb-admin-2.js'); ?>"></script>
</body>
</html>