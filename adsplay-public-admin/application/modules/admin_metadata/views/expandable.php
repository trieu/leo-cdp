<?php
/**
 * Created by PhpStorm.
 * User: mith
 * Date: 5/10/2016
 * Time: 3:41 PM
 */
?>
<div class="block-area">
    <div class="row m-container">
        <div class="row">
            <!--Management Campaign-->
            <?php echo $view_campaign;?>
            <div class="col-lg-6">
                <div class="tile">
                    <h2 class="tile-title"> ELEMENTS INFORMATION</h2>
                    <div class="p-10">
                        <iframe src="<?php echo site_url("/admin_metadata/upload/upload_iframe"); ?>"
                                style="overflow: hidden; border: hidden" width="100%" height="320"></iframe>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <!--    Delivery Setting-->
            <?php echo $view_delivery; ?>
        </div>
    </div>
</div>
<input id="userid" name="userid" type="hidden">
<script>
    $(document).ready(function(){
        $("#choose-brand").change(function(){
            var brandId = $(this).val();
            $.ajax({
                type: "POST",
                dataType:"json",
                url: "<?php echo base_url() ?>index.php/admin_metadata/product/getProductByBrandId",
                data: {brandId :brandId },
                success: function(result){
                    var items = [];

                    $.each(result, function(i, item) {
                        items.push("<option value='"+result[i].id+"'>"+result[i].product_name+"</option>");
                    });
                    $('.product-name').html(items);
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: "<?php echo base_url() ?>index.php/admin_metadata/sector/getSectorByProductId",
                        data: {productId: result[0].id},
                        success: function (data) {
                            var sectors = [];
                            $.each(data, function(i, item) {
                                sectors.push("<option value='"+data[i].id+"'>"+data[i].sector_name+"</option>");

                            });
                            $('.sector-name').html(sectors);
                        }
                    });
                }
            });
        });
        $("#choose-product").change(function(){
            var productId = $(this).val();
            $.ajax({
                type: "POST",
                dataType:"json",
                url: "<?php echo base_url() ?>index.php/admin_metadata/sector/getSectorByProductId",
                data: {productId :productId },
                success: function(result){
                    var items = [];
                    $.each(result, function(i, item) {
                        items.push("<option value='"+result[i].id+"'>"+result[i].sector_name+"</option>");
                    });
                    $('.sector-name').html(items);


                }
            });
        });
    });
</script>
<script type="application/javascript">
    $(document).ready(function(){
//        $('#optionsRadios1').click(function() {
//            alert('1');
//            $('.disabled-campaign').prop("disabled", false);
//            $('.disable-text-campaign').prop("disabled", true);
//        });
//        $('#optionsRadios2').click(function() {
//            alert('2');
//            $('.disabled-campaign').prop("disabled", true);
//            $('.disable-text-campaign').prop("disabled", false);
//        });

    });
</script>
