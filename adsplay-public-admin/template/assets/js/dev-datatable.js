/**
 * Created by mith on 5/9/2016.
 */
var save_method; //for save method string
var table;
var url;
var chos;
$(document).ready(function() {

    if($('#list-datatable').hasClass('data-advertiser')){
        url = "advertisers/getajax";
        chos = 'advertiser';
    }
    if($('#list-datatable').hasClass('data-publisher')){
        url = "publishers/getajax";
        chos = 'publisher';
    }
    if($('#list-datatable').hasClass('data-campaign')){
        url = "campaigns/getajax";
        chos = 'campaign';
        getAllBrand();
        changeSelect("brand_id");
        changeSelect("product_id");

    }
    if($('#list-datatable').hasClass('data-user')){
        url = "getajax";
        chos = '';
    }
    table = $('#list-datatable').DataTable({
        // Load data for the table's content from an Ajax source
        "ajax": {
            "url": url,
            "type": "POST"
        }
    });
    getAllUser(chos);

});
/*L?y t?t c? danh sách user*/
    function getAllUser(param){
        if(param == 'advertiser')
            url = "advertisers/getAllUser";
        else if(param == 'publisher')
            url = "publishers/getAllUser";
        else
            return;
        //Ajax Load data from ajax
        $.ajax({
            url : url,
            type: "GET",
            dataType: "JSON",
            success: function(data)
            {
                $.each(data, function(key, value) {
                    $('[name="user_id"]')
                        .append($("<option></option>")
                            .attr("value",value.id)
                            .text(value.username));
                });
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert('Error get data from ajax');
            }
        });
    }

/*Advertiser*/
/*l?y user b?i id*/
    function getByID(id,param)
    {
        save_method = 'update';
        $('#form'+param)[0].reset(); // reset form on modals
        if(param == 'Advertiser'){
            url = "advertisers/getByID";
        }else if(param == 'Publisher')
            url = "publishers/getByID";

        //Ajax Load data from ajax
        $.ajax({
            url : url ,
            data:{id:id},
            type: "POST",
            dataType: "JSON",
            success: function(data)
            {

                $('[name="id"]').val(data[0].id);
                $('[name="name"]').val(data[0].name);
                $('[name="user_id"]').val(data[0].user_id);
                $('.note-editable').html(data[0].contact_info);
                // $('[name="groupid"]').val(data.groupid);
                $('#modal_form_'+param).modal('show'); // show bootstrap modal when complete loaded
                $('.modal-title').text('Edit Person'); // Set title to Bootstrap modal title

            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert('Error get data from ajax');
            }
        });
    }
function getByIdUser(id)
{
    save_method = 'update';
    $('#formUser')[0].reset(); // reset form on modals
    $( ".checkRole" ).each(function( index ) {

                $(this).prop('checked', false);
                $(this).closest('div.icheckbox_minimal').attr('aria-checked',false).removeClass('checked');

    });
    //console.log(id);
    $.ajax({
        url : 'get_current_group' ,
        data:{id:id},
        type: "POST",
        dataType: "JSON",
        success: function(datagroup)
        {
            console.log(datagroup);
            $( ".checkRole" ).each(function( index ) {
                var val=$( this ).val();
                for(var k in datagroup) {

                    if(val==datagroup[k].id)
                    {
                        $(this).prop('checked', true);
                        $(this).closest('div.icheckbox_minimal').attr('aria-checked',true).addClass('checked');
                    }
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert('Error get data from ajax group');
        }
    });

    $.ajax({
        url : 'edit_user' ,
        data:{id:id},
        type: "POST",
        dataType: "JSON",
        success: function(data)
        {
            console.log(data);
            $('[name="id"]').val(data.id);
            $('[name="first_name"]').val(data.first_name);
            $('[name="last_name"]').val(data.last_name);
            $('[name="company"]').val(data.company);
            $('[name="phone"]').val(data.phone);
            $('[name="username"]').val(data.username);
            $('[name="email"]').val(data.email);
           // $('[name="phone"]').val(data.phone);

            $('#modal_form_User').modal('show'); // show bootstrap modal when complete loaded
            $('.modal-title').text('Edit User'); // Set title to Bootstrap modal title

        }
        ,error: function (jqXHR, textStatus, errorThrown)
        {
            //alert('Error get data from ajax user');
            console.log(textStatus);
        }
    });
}
function getByIDCamp(id)
{
    save_method = 'update';
    $('#formCampaign')[0].reset(); // reset form on modals
    //Ajax Load data from ajax
    $.ajax({
        url : "campaigns/getByID" ,
        data:{id:id},
        type: "POST",
        dataType: "JSON",
        success: function(data)
        {
            getAllProduct(data[0].BraID);
            getAllSector(data[0].ProID);
            $('[name="id"]').val(data[0].id);
            $('[name="name"]').val(data[0].campaign_name);
            $('[name="unit"]').val(data[0].unit_title);
            $('[name="brand_id"]').val(data[0].BraID);
            $('[name="product_id"]').val(data[0].ProID);
            $('[name="sector_id"]').val(data[0].SecID);
            $('#modal_form_Campaign').modal('show'); // show bootstrap modal when complete loaded
            $('.modal-title').text('Edit Person'); // Set title to Bootstrap modal title

        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert('Error get data from ajax');
        }
    });
}
    function add_data_modal(data)
    {
        save_method = 'add';
        if(data=='User')
        {
            $( ".checkRole" ).each(function( index ) {

                $(this).prop('checked', false);
                $(this).closest('div.icheckbox_minimal').attr('aria-checked',false).removeClass('checked');

            });
        }

        $('#form'+data)[0].reset(); // reset form on modals
        $('.note-editable').html('');
        $('#modal_form_'+data).modal('show'); // show bootstrap modal
        $('.modal-title').text('Add Person'); // Set Title to Bootstrap modal title
    }
    function reload_table()
    {
        table.ajax.reload(null,false); //reload datatable ajax
    }
    function save(param)
    {

        if (!validator.checkAll($('form'))) {
            return false;
        }
        //var url;
        var data={name:$('[name="name"]').val(),user_id:$('[name="user_id"]').val(),contact_info:$('.note-editable').html()}
        if(save_method == 'add')
        {
            if(param == "Advertiser"){
                url = "advertisers/Insert";
            }
            else if(param == 'Publisher'){
                url = "publishers/Insert";
            }
            else if(param == 'Campaign'){
                url = "campaigns/Insert";
            }
            //else if(param == 'User'){
            //    url = "create_user";
            //}
        }
        else
        {
            data={name:$('[name="name"]').val(),user_id:$('[name="user_id"]').val(),contact_info:$('.note-editable').html(),id:$('[name="id"]').val()}
            if(param == "Advertiser"){
                url = "advertisers/Update";
            }else if(param == 'Publisher'){
                url = "publishers/Update";
            }else if(param == 'Campaign'){
                url = "campaigns/Update";
                data = $('#formCampaign').serialize();
            }

        }

        // return false;
        // ajax adding data to database
        $.ajax({
            url : url,
            type: "POST",
            data: data,
            dataType: "JSON",
            success: function(data) {
                //if success close modal and reload ajax table
                if (data.status == true) {
                    $('#modal_form_'+param).modal('hide');
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

// save for user
function saveUser()
{
    if(save_method == 'add')
    {
        url="create_user";
    }else
    {
        url="edit_user";
    }
    $.ajax({
        type: "POST",
        url:url ,
        data: $('#formUser').serialize(),
        success: function(result) {
            result = jQuery.parseJSON(result);
            console.log(result);
            if (result['status'] == true)
            {
                $('#modal_form_User').modal('hide');
                reload_table();
            }
            else
            {
                alert(result['errors']);
            }
        },
        error: function(){
            alert("failure");
        }
    });
}


/*Campaign*/
function getAllBrand(){
    //Ajax Load data from ajax
    $.ajax({
        url : "campaigns/getAllBrand",
        type: "GET",
        dataType: "JSON",
        success: function(data)
        {

            $.each(data, function(key, value) {
                $('[name="brand_id"]')
                    .append($("<option></option>")
                        .attr("value",value.id)
                        .text(value.brand_name));
            });

            getAllProduct(data[0].id);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert('Error get data from ajax');
        }
    });
}
function changeSelect(name)
{
    $('[name="'+name+'"]').on('change',function(){
        value= $(this).val();
        if(name=='brand_id')
        {
            $('[name="product_id"]').empty();
            $('[name="sector_id"]').empty();
            getAllProduct(value);
        }else
        {
            getAllSector(value);
        }
    });
}
function getAllSector(id){
    //Ajax Load data from ajax
    $.ajax({
        url : "campaigns/getAllSector",
        type: "POST",
        data: {id:id},
        dataType: "JSON",
        success: function(data)
        {

            $.each(data, function(key, value) {
                $('[name="sector_id"]')
                    .append($("<option></option>")
                        .attr("value",value.id)
                        .text(value.sector_name));
            });

            if(data.length==0)
            {
                $('[name="sector_id"]').empty();
            }
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert('Error get data from ajax');
        }
    });
}

function getAllProduct(id){
    //Ajax Load data from ajax
    $.ajax({
        url : "campaigns/getAllProduct",
        type: "POST",
        data: {id:id},
        dataType: "JSON",
        success: function(data)
        {

            $.each(data, function(key, value) {
                $('[name="product_id"]')
                    .append($("<option></option>")
                        .attr("value",value.id)
                        .text(value.product_name));
            });
            if(data.length>0)
            {
                getAllSector(data[0].id);
            }else
            {
                $('[name="product_id"]').empty();
                $('[name="sector_id"]').empty();
            }

        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert('Error get data from ajax');
        }
    });
}
///////////////////////////
