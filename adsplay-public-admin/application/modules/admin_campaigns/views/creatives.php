<?php
/**
 * Created by PhpStorm.
 * User: mith
 * Date: 5/30/2016
 * Time: 5:22 PM
 */
//var_dump($data);die;
?>
<!---->
<!--foreach($data as $creative){-->
<!---->
<!--    echo $creative['CreativeID'];-->
<!---->
<!--}-->
<?php
/**
 * Created by PhpStorm.
 * User: mith
 * Date: 5/19/2016
 * Time: 2:02 PM
 */
?>
<div class="col-md-12 col-sm-12 col-xs-12">
    <div class="x_panel">
        <div class="x_title">
            <h2>List <small>Creatives</small></h2>
            <div class="clearfix"></div>
        </div>
        <div class="x_content">
<!--            --><?php //if($this->ion_auth->in_group('superAdmin')):?>
<!--                <p class="text-muted font-13 m-b-30">-->
<!--                    <button class="btn btn-success" onclick="add_data_modal('Campaign')"><i class="glyphicon glyphicon-plus"></i> Add Creatives</button>-->
<!--                </p>-->
<!--            --><?php //endif; ?>
            <table id="list-datatable" data-id="<?php echo $campaignId; ?>" class="data-creative table table-striped table-bordered dt-responsive nowrap" cellspacing="0" width="100%">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Total Impression</th>
                    <th>Total Click</th>
                    <th>CTR</th>
                    <th>Booking Time</th>
                    <th>Revenue</th>

                </tr>
                </thead>
                <tbody>


                </tbody>
            </table>

        </div>
    </div>
</div>
<style>
    select[name="list-datatable_length"]
    {
        background: none;
    }
</style>