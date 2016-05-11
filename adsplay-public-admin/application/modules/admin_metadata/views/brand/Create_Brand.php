<script>
    var save_method_brand; //for save method string
    var table_brand;
    $(document).ready(function() {

        table_brand = $('#datatable-Brand').DataTable({
            // Load data for the table's content from an Ajax source
            "ajax": {
                "url": "<?php echo site_url('/admin_metadata/brand/getajax')?>",
                "type": "POST"
            }

        });
    });
    function add_Brand()
    {
        //debugger;
        save_method_brand = 'add';
        $('#formBrand')[0].reset(); // reset form on modals
        $('#modal_form_Brand').modal('show'); // show bootstrap modal
        $('.modal-title').text('Add Brand'); // Set Title to Bootstrap modal title
    }
    function getBrandByID(id)
    {
        save_method_brand = 'update';
        $('#formBrand')[0].reset(); // reset form on modals
        //Ajax Load data from ajax
        $.ajax({
            url : "<?php echo site_url('/admin_metadata/brand/getByID')?>" ,
            data:{id:id},
            type: "POST",
            dataType: "JSON",
            success: function(data)
            {

                $('[name="id"]').val(data[0].id);
                $('[name="name"]').val(data[0].brand_name);
                $('#modal_form_Brand').modal('show'); // show bootstrap modal when complete loaded
                $('.modal-title').text('Edit Brand'); // Set title to Bootstrap modal title

            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert('Error get data from ajax');
            }
        });
    }
    function reload_table()
    {
        table_brand.ajax.reload(null,false); //reload datatable ajax
    }

    function saveBrand()
    {

        if (!validator.checkAll($('form'))) {
            return false;
        }
        var url;
        //  var data={name:$('[name="name"]').val(),user_id:$('[name="user_id"]').val(),contact_info:$('.note-editable').html()}
        if(save_method_brand == 'add')
        {
            url = "<?php echo site_url('/admin_metadata/brand/Insert')?>";
        }
        else
        {
            url = "<?php echo site_url('/admin_metadata/brand/Update')?>";
            //      data={name:$('[name="name"]').val(),user_id:$('[name="user_id"]').val(),contact_info:$('.note-editable').html(),id:$('[name="id"]').val()}
        }

        // return false;
        // ajax adding data to database
        $.ajax({
            url : url,
            type: "POST",
            data: $('#formBrand').serialize(),
            dataType: "JSON",
            success: function(data) {
                //if success close modal and reload ajax table
                if (data.status == true) {
                    $('#modal_form_Brand').modal('hide');
                    reload_table();

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
<div class="modal fade" id="modal_form_Brand" role="dialog" aria-labelledby="myLargeModalLabel">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h3 class="modal-title">Brand Form</h3>
            </div>
            <div class="modal-body form">
                <form action="#" id="formBrand" class="form-horizontal" novalidate>
                    <input type="hidden" value="" name="id"/>
                    <div class="form-body">
                        <div class="form-group item">
                            <label class="control-label col-md-2 col-sm-3 col-xs-12" for="first-name">Name <span class="required">*</span>
                            </label>
                            <div class="col-md-5 col-sm-6 col-xs-12">
                                <input type="text" name="name" required="required" class="form-control col-md-7 col-xs-12">
                            </div>

                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="submit" id="btnSave" onclick="saveBrand()" class="btn btn-primary">Save</button>
                <button type="submit" class="btn btn-danger" data-dismiss="modal">Cancel</button>
            </div>
        </div><!-- /.modal-content onclick="save()" -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<!-- End Bootstrap modal -->
