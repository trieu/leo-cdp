<?php if (isset($iframe)) : ?>
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
<body style="background-color: rgba(0, 0, 0, 0.05);color: #fff;">

    <form role="form" id="upload" action="<?php echo site_url("admin_metadata/upload/do_tvc_video_ads_upload"); ?>" method="POST"
          enctype="multipart/form-data">
        <div class="form-group">
            <label>Files to upload:</label>
           <!-- <input type="email" class="form-control input-sm" id="exampleInputEmail1" placeholder="Enter email">-->
            <input id="fileselect" style="background-color:#000088 !important;" type="file" class="form-control file-loading" name="userfile">
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-sm m-t-10">UPLOAD</button>
        </div>
    </form>
  <script>
      $(document).on('ready', function() {
          $("#fileselect").fileinput({
              showUpload: false,
              mainClass: "input-group-lg"
          });
      });
      </script>
      <script type="application/javascript" src="<?php echo base_url('/template/assets/temp_new/js/bootstrap.min.js'); ?>"></script>
      <script type="application/javascript" src="<?php echo base_url('/template/assets/temp_new/js/metisMenu.min.js'); ?>"></script>
      <script type="application/javascript" src="<?php echo base_url('/template/assets/temp_new/js/sb-admin-2.js'); ?>"></script>
  <script type="application/javascript" src="<?php echo base_url('/template/assets/temp_new/js/fileinput.min.js'); ?>"></script>
    </body>
</html>
<?php else: ?>
    <iframe src="<?php echo site_url("admin_metadata/upload/upload_iframe"); ?>"
           name='iframe1' id="iframe1" style="overflow: hidden; border: hidden" width="500" height="250"/>
<?php endif; ?>

