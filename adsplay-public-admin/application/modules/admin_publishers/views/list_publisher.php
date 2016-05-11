

<div class="col-md-12 col-sm-12 col-xs-12">
    <div class="x_panel">
        <div class="x_title">
            <h2>List <small>Publishers</small></h2>
            <div class="clearfix"></div>
        </div>
        <div class="x_content">
            <p class="text-muted font-13 m-b-30">
                <button class="btn btn-success" onclick="add_data_modal('Publisher')"><i class="glyphicon glyphicon-plus"></i> Add Publishers</button>
            </p>
            <table id="list-datatable" class="data-publisher table table-striped table-bordered dt-responsive nowrap" cellspacing="0" width="100%">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Info</th>
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