/**
 * Created by mith on 5/9/2016.
 */
var save_method; //for save method string
var table;
var url;
var chos;
var urlHost='';
var arrayHost=$(location).attr('href').split("/");
for(i=0;i<(arrayHost.length-2);i++)
{
    if(i==0)
    {
        urlHost=urlHost+arrayHost[i];
    }else if(i==1)
    {
        urlHost=urlHost+'//'+arrayHost[i];
    }else
    {
        urlHost=urlHost+'/'+arrayHost[i];
    }

}
//console.log(urlHost);
//console.log(arrayHost[0]);
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
        url='';
        getAllBrand();
        changeSelect("brand_id");
        changeSelect("product_id");
        url = "campaigns/getajax";
        chos = 'campaign';


    }
    if($('#list-datatable').hasClass('data-user')){
        url = "getajax";
        chos = '';
    }
    if($('#list-datatable').hasClass('data-creative')){
        var campaignId = $('#list-datatable').attr('data-id');
        url = "getAjax?campaignId="+campaignId;
        chos = '';
    }
    if($('#list-datatable').hasClass('data-brand')){

        url = "brand/getajax";
        chos = '';
    }
    console.log(url);
    table = $('#list-datatable').DataTable({
        // Load data for the table's content from an Ajax source
        "ajax": {
            "url": url,
            "type": "POST"
        }
    });
    getAllUser(chos);

});


    function add_data_modal(data)
    {
        save_method = 'add';

        if(data=='User')
        {
            $( ".checkRole" ).each(function( index ) {

                $(this).prop('checked', false);
                $(this).closest('div.icheckbox_minimal').attr('aria-checked',false).removeClass('checked');

            });
            resetError();
        }
        if(data=='Campaign')
        {
            var selectBran = 1;
            $('select[name=brand_id]').val('1');
            console.log(selectBran);
            $('select[name="product_id"]').empty();
            $('select[name="sector_id"]').empty();
            getAllProductByID(selectBran);
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
                data = $('#formCampaign').serialize();
               // console.log(data);
            }
            else if(param == 'Brand'){
                if (!validator.checkAll($('form'))) {
                    return false;
                }
                url = "brand/Insert";
                data = $('#formBrand').serialize();
            }
            else if(param == 'Product'){
                if (!validator.checkAll($('form'))) {
                    return false;
                }
                url = "product/Insert";
                data = $('#formProduct').serialize();
            }
            else if(param == 'Sector'){
                if (!validator.checkAll($('form'))) {
                    return false;
                }
                url = "sector/Insert";
                data = $('#formSector').serialize();
            }
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

            } else if(param == 'Brand'){
                if (!validator.checkAll($('form'))) {
                    return false;
                }
                url = "brand/Update";
                data = $('#formBrand').serialize();
            } else if(param == 'Product'){
                if (!validator.checkAll($('form'))) {
                    return false;
                }
                url = "product/Update";
                data = $('#formProduct').serialize();
            }
            else if(param == 'Sector'){
                if (!validator.checkAll($('form'))) {
                    return false;
                }
                url = "sector/Update";
                data = $('#formSector').serialize();
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
            else {
                if (save_method == 'add') {
                    $('.first_name').html(result['first_name']);
                    $('.last_name').html(result['last_name']);
                    $('.email').html(result['email']);
                    $('.company').html(result['company']);
                    $('.phone').html(result['phone']);
                    $('.password').html(result['password']);
                    $('.password_confirm').html(result['password_confirm']);
                } else {
                    alert(result['errors']);
                }


            }
        },
        error: function(){
            alert("failure");
        }
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////======================== Get By ID    ========================///////////////////////////

function getBrandByID(id)
{
    save_method= 'update';
    $('#formBrand')[0].reset(); // reset form on modals
    //Ajax Load data from ajax
    $.ajax({
        url : "brand/getByID" ,
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
function getProductByID(id)
{

    save_method = 'update';
    $('#formProduct')[0].reset(); // reset form on modals
    //Ajax Load data from ajax
    $.ajax({
        url : "product/getByID" ,
        data:{id:id},
        type: "POST",
        async: false,
        dataType: "JSON",
        success: function(data)
        {
            //debugger;

            var brandVal=data[0].brand_id;
            $('[name="id"]').val(data[0].id);
            $('[name="name"]').val(data[0].product_name);
            $('[name="brand_id"]').val(data[0].brand_id);
            $('#modal_form_Product').modal('show'); // show bootstrap modal when complete loaded
            $('.modal-title').text('Edit Product'); // Set title to Bootstrap modal title

        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert('Error get data from ajax');
        }
    });
}
function getSectorByID(id)
{
    save_method = 'update';
    $('#formSector')[0].reset(); // reset form on modals
    //Ajax Load data from ajax
    $.ajax({
        url : "sector/getByID" ,
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
            getAllProductByID(data[0].BraID);
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
    resetError();
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////======================== Get All    ========================///////////////////////////
/*Campaign*/
function getAllBrand(){
    //Ajax Load data from ajax
   // console.log(urlHost);
    url=urlHost+"/admin_campaigns/campaigns/getAllBrand";
    $.ajax({
        url :url ,
        type: "GET",
        dataType: "JSON",
        success: function(data)
        {
            $('[name="brand_id"]').html('');
            $.each(data, function(key, value) {
                $('[name="brand_id"]')
                    .append($("<option></option>")
                        .attr("value",value.id)
                        .text(value.brand_name));
            });

            getAllProductByID(data[0].id);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert('Error get data from ajax');
        }
    });
}
//changeSelect('brand_id')
function changeSelect(name)
{
    $('[name="'+name+'"]').on('change',function(){
        value= $(this).val();
        if(name=='brand_id')
        {
            $('[name="product_id"]').empty();
            $('[name="sector_id"]').empty();
            getAllProductByID(value);
        }else
        {
            getAllSector(value);
        }
    });
}
function getAllSector(id){
    //Ajax Load data from ajax
    url=urlHost+"/admin_campaigns/campaigns/getAllSector";
    $.ajax({
        url : url,
        type: "POST",
        data: {id:id},
        dataType: "JSON",
        success: function(data)
        {
            $('[name="sector_id"]').html('');
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
function getAllProduct(){
    //Ajax Load data from ajax
    url=urlHost+"/admin_campaigns/campaigns/getAllProduct";
    $.ajax({
        url : url,
        type: "POST",
        data: {id:0},
        dataType: "JSON",
        success: function(data)
        {
            $('[name="product_id"]').html('');
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

function getAllProductByID(id){
    //Ajax Load data from ajax
    url=urlHost+"/admin_campaigns/campaigns/getAllProduct";
    $.ajax({
        url : url,
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////======================== Different Function    ========================///////////////////////////



function resetError()
{
    $('.first_name').html('');
    $('.last_name').html('');
    $('.email').html('');
    $('.company').html('');
    $('.phone').html('');
    $('.password').html('');
    $('.password_confirm').html('');
}

// delete item theo ID
function deleteItemByID(id,param)
{

    if(param == 'Campaigns'){
        url = "Campaigns/delete";
    }
    else if(param == 'Advertisers')
    {
        url = "Advertisers/delete";
    }
    else if(param == 'Publishers')
    {
        url = "Publishers/delete";
    }else if(param == 'Brand')
    {
        url = "Brand/delete";
    }else if(param == 'Product')
    {
        url = "Product/delete";
    }else if(param == 'Sector')
    {
        url = "Sector/delete";
    }

    $('#modal_form_Delete #btnDelete').attr('_id',id);
    $('#modal_form_Delete #btnDelete').attr('_url',url);
    $('#modal_form_Delete').modal('show');


}
function deleteItem(id,url)
{
    $.ajax({
        url : url ,
        data:{id:id},
        type: "POST",
        dataType: "JSON",
        success: function(data)
        {
            $('#modal_form_Delete').modal('hide');
            if(data.status == true)
            {
                reload_table();
               // alert("item deleted successfully");

            }

        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert('Error get data from ajax');
        }
    });
}
function LockAndUnlockUser(id)
{
    // ajax adding data to database

    $.ajax({
        url : "LockAndUnlockUser",
        type: "POST",
        data: {id:id},
        success: function(data) {
            //if success close modal and reload ajax table
            reload_table();
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert('Error adding / update data');
        }
    });
}
function LoadTable()
{
    if($('#list-datatable').hasClass('data-brand')){

        url = "brand/getajax";
        chos = '';
    }
    if($('#list-datatable').hasClass('data-product')){

        url = "product/getajax";
        chos = '';
    }
    if($('#list-datatable').hasClass('data-sector')){

        url = "sector/getajax";
        chos = '';
    }
    table = $('#list-datatable').DataTable({
        // Load data for the table's content from an Ajax source
        "ajax": {
            "url": url,
            "type": "POST"
        }
    });
}
$(document).on('click', '#MetaDataTab a', function(e) {
    e.preventDefault();
    $(this).tab('show');
    var id = $(this).attr('data-target');
    if(id=='#brand')
    {
        $('.tab-pane').html('');
        $(id).html('');
        $.ajax({
            url : "brand/index",
            type: "POST",
            data: {id:id},
            success: function(data) {
                $(id).html(data);
                LoadTable();
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert('Error adding / update data');
            }
        });



    }else if(id=='#product')
    {
        $('.tab-pane').html('');
        $(id).html('');
        $.ajax({
            url : "product/index",
            type: "POST",
            data: {id:id},
            success: function(data) {
                $(id).html(data);
                LoadTable();
                getAllBrand();
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert('Error adding / update data');
            }
        });



    }else if(id=='#sectors')
    {
        $('.tab-pane').html('');
        $(id).html('');
        $.ajax({
            url : "sector/index",
            type: "POST",
            data: {id:id},
            success: function(data) {
                $(id).html(data);
                LoadTable();
                getAllProduct();
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert('Error adding / update data');
            }
        });

    }

});
