<div class="col-md-12 col-sm-12 col-xs-12">
    <div class="x_panel">
        <div class="x_title">
            <h2>List <small>Brand</small></h2>
            <div class="clearfix"></div>
        </div>
        <div class="x_content">
            <?php if($this->ion_auth->in_group('superAdmin')):?>
            <p class="text-muted font-13 m-b-30">
                <button class="btn btn-success" onclick="add_data_modal('Brand')"><i class="glyphicon glyphicon-plus"></i> Add Brand</button>
            </p>
            <?php endif; ?>
            <table id="list-datatable" class="data-brand table table-striped table-bordered dt-responsive nowrap" cellspacing="0" width="100%">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
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