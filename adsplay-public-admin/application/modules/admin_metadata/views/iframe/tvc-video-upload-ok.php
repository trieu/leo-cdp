<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title></title>
    <?php echo link_tag('template/assets/temp_new/css/bootstrap.min.css') . "\n" ?>
    <?php echo link_tag('template/assets/temp_new/css/metisMenu.min.css') . "\n" ?>
    <?php echo link_tag('template/assets/temp_new/css/sb-admin-2.css') . "\n"; ?>
    <?php echo link_tag('template/assets/temp_new/css/font-awesome.min.css') . "\n"; ?>
    <?php echo link_tag('template/assets/temp_new/css/fileinput.min.css') . "\n"; ?>
    <script type="application/javascript" src="<?php echo base_url('/template/assets/temp_new/js/jquery.min.js') ?>"></script>
</head>
<body>
<?php if (isset($error_message)) : ?>
<div class="alert alert-danger"> <strong> <?php echo $error_message;?> </strong></div>
<?php endif; ?>

<?php /*if (isset($tvc_mp4_url)) : */?><!--
    <?php /*echo $tvc_mp4_url;*/?>
    <video width="290" height="240" controls>
        <source src="<?php /*echo $tvc_mp4_url;*/?>" type="video/mp4">
        Your browser does not support the video tag.
    </video>
--><?php /*endif; */?>
<?php if (isset($status)) : ?>
    <div class="alert alert-info">
        <?php echo $status; ?>
    </div>
<?php endif; ?>
<script type="application/javascript" src="<?php echo base_url('/template/assets/temp_new/js/bootstrap.min.js'); ?>"></script>
<script type="application/javascript" src="<?php echo base_url('/template/assets/temp_new/js/metisMenu.min.js'); ?>"></script>
<script type="application/javascript" src="<?php echo base_url('/template/assets/temp_new/js/sb-admin-2.js'); ?>"></script>
<script type="application/javascript" src="<?php echo base_url('/template/assets/temp_new/fileinput.min.js'); ?>"></script>
</body>
</html>