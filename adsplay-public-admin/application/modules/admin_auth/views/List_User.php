<div class="col-md-12 col-sm-12 col-xs-12">
    <div class="x_panel">
        <div class="x_title">
            <h2>List <small>Users</small></h2>
            <div class="clearfix"></div>
        </div>
        <div class="x_content">
            <?php if($this->ion_auth->in_group('superAdmin')):?>
            <p class="text-muted font-13 m-b-30">
                <button class="btn btn-success" onclick="add_User()"><i class="glyphicon glyphicon-plus"></i> Add User</button>
            </p>
            <?php endif; ?>
            <table id="datatable-Campaign" class="table table-striped table-bordered dt-responsive nowrap" cellspacing="0" width="100%">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>GroupName</th>
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
    select[name="datatable-Campaign_length"]
    {
        background: none;
    }
    .btn-grid{
        margin: 0px 5px;
    }
</style>