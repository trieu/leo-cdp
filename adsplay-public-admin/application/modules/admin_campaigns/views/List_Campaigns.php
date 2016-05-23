<div class="col-md-12 col-sm-12 col-xs-12">
    <div class="x_panel">
        <div class="x_title">
            <h2>List <small>Campaigns</small></h2>
            <div class="clearfix"></div>
        </div>
        <div class="x_content">
            <?php if($this->ion_auth->in_group('superAdmin')):?>
            <p class="text-muted font-13 m-b-30">
                <button class="btn btn-success" onclick="add_data_modal('Campaign')"><i class="glyphicon glyphicon-plus"></i> Add Campaigns</button>
            </p>
            <?php endif; ?>
            <table id="list-datatable" class="data-campaign table table-striped table-bordered dt-responsive nowrap" cellspacing="0" width="100%">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Brand name</th>
                    <th>Product name</th>
                    <th>Sector name</th>
                    <!--<th>Unit</th>-->
                    <th>Date create</th>
                    <th>Control</th>
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
<div class="modal fade" tabindex="-1" id="modal_form_Delete" role="dialog" aria-labelledby="myLargeModalLabel">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Notification</h4>
            </div>
            <div class="modal-body">
                <p id="message_modal_delete">Are you sure to delete this item?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" _id="" id="btnDelete" class="btn btn-primary" onclick="deleteItem($(this).attr('_id'),$(this).attr('_url'))">Delete</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
