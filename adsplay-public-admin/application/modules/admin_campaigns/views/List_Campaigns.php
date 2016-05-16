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
                    <th>Unit</th>
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