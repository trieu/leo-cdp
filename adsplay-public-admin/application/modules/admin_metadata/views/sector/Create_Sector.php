<script>
    var save_method_sector; //for save method string
    var table_sector;
    $(document).ready(function() {

        table_sector = $('#datatable-Sector').DataTable({
            // Load data for the table's content from an Ajax source
            "ajax": {
                "url": "<?php echo site_url('/admin_metadata/sector/getajax')?>",
                "type": "POST"
            }

        });
        getAllProduct();
    });
    function add_Sector()
    {
        //debugger;
        save_method_sector = 'add';
        $('#formSector')[0].reset(); // reset form on modals
        $('#modal_form_Sector').modal('show'); // show bootstrap modal
        $('.modal-title').text('Add Product'); // Set Title to Bootstrap modal title
    }
    function getAllProduct(){
        //Ajax Load data from ajax
        $.ajax({
            url : "<?php echo site_url('/admin_metadata/sector/getAllProduct')?>",
            type: "POST",
            dataType: "JSON",
            success: function(data)
            {

                $.each(data, function(key, value) {
                    $('[name="product_id"]')
                        .append($("<option></option>")
                            .attr("value",value.id)
                            .text(value.product_name));
                });

            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert('Error get data from ajax');
            }
        });
    }
    function getSectorByID(id)
    {
        save_method_sector = 'update';
        $('#formSector')[0].reset(); // reset form on modals
        //Ajax Load data from ajax
        $.ajax({
            url : "<?php echo site_url('/admin_metadata/sector/getByID')?>" ,
            data:{id:id},
            type: "POST",
            dataType: "JSON",
            success: function(data)
            {

                $('[name="id"]').val(data[0].id);
                $('[name="name"]').val(data[0].sector_name);
                $('[name="product_id"]').val(data[0].product_id);
                $('#modal_form_Sector').modal('show'); // show bootstrap modal when complete loaded
                $('.modal-title').text('Edit Product'); // Set title to Bootstrap modal title

            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert('Error get data from ajax');
            }
        });
    }
    function reload_table_Sector()
    {
        table_sector.ajax.reload(null,false); //reload datatable ajax
    }

    function saveSector()
    {

        if (!validator.checkAll($('form'))) {
            return false;
        }
        var url;
        //  var data={name:$('[name="name"]').val(),user_id:$('[name="user_id"]').val(),contact_info:$('.note-editable').html()}
        if(save_method_sector == 'add')
        {
            url = "<?php echo site_url('/admin_metadata/sector/Insert')?>";
        }
        else
        {
            url = "<?php echo site_url('/admin_metadata/sector/Update')?>";
            //      data={name:$('[name="name"]').val(),user_id:$('[name="user_id"]').val(),contact_info:$('.note-editable').html(),id:$('[name="id"]').val()}
        }

        // return false;
        // ajax adding data to database
        $.ajax({
            url : url,
            type: "POST",
            data: $('#formSector').serialize(),
            dataType: "JSON",
            success: function(data) {
                //if success close modal and reload ajax table
                if (data.status == true) {
                    $('#modal_form_Sector').modal('hide');
                    reload_table_Sector();

                }else{
                    console.log(data);
                }
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert('Error adding / update data');
            }
        });
    }
</script>
<!-- Bootstrap modal -->
<div class="modal fade" id="modal_form_Sector" role="dialog" aria-labelledby="myLargeModalLabel">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h3 class="modal-title">Sector Form</h3>
            </div>
            <div class="modal-body form">
                <form action="#" id="formSector" class="form-horizontal" novalidate>
                    <input type="hidden" value="" name="id"/>
                    <div class="form-body">
                        <div class="form-group item">
                            <label class="control-label col-md-2 col-sm-3 col-xs-12" for="first-name">Name <span class="required">*</span>
                            </label>
                            <div class="col-md-5 col-sm-6 col-xs-12">
                                <input type="text" name="name" required="required" class="form-control col-md-7 col-xs-12">
                            </div>

                        </div>
                        <div class="form-group item">
                            <label for="middle-name" class="control-label col-md-2 col-sm-3 col-xs-12">Product</label>
                            <div class="col-md-5 col-sm-6 col-xs-12">
                                <select name="product_id" class="form-control">
                                </select>
                            </div>
                            <div class="test"></div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="submit" id="btnSave" onclick="saveSector()" class="btn btn-primary">Save</button>
                <button type="submit" class="btn btn-danger" data-dismiss="modal">Cancel</button>
            </div>
        </div><!-- /.modal-content onclick="save()" -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<!-- End Bootstrap modal -->
