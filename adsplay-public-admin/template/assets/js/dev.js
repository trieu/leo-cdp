$(document).on('click','.editable-submit',function(){

    var advertiserId = $(this).closest('td').children('a').attr('data-advertiser-id');
    var advertiserId_info = $(this).closest('td').children('a').attr('data-advertiser-id-info');
    var publisherId = $(this).closest('td').children('a').attr('data-publisher-id');
    var publisherId_info = $(this).closest('td').children('a').attr('data-publisher-id-info');

    // metadata
    var brandId = $(this).closest('td').children('a').attr('data-brand-id');
    var productId = $(this).closest('td').children('a').attr('data-product-id');
    var sectorId = $(this).closest('td').children('a').attr('data-sector-id');
    var brandproId = $(this).closest('td').children('a').attr('data-brandpro-id');
    var productsecId = $(this).closest('td').children('a').attr('data-productsec-id');

    // Users
    var fnameId = $(this).closest('td').children('a').attr('data-fname-id');
    var lnameId = $(this).closest('td').children('a:nth-child(2)').attr('data-lname-id');
    var emailId = $(this).closest('td').children('a').attr('data-email-id');

    var name = $('.input-sm').val();
    var url = '';
    var id  = null;
    var key = '';

    if(advertiserId){
        id = advertiserId;
        url = "/advertiser/advertiser/editAdvertiser";
    }
    if(advertiserId_info){
        id = advertiserId_info;
        url = "/advertiser/advertiser/editAdvertiser_Info";

    }
    if(publisherId){
        id = publisherId;
        url = "/advertiser/publisher/editPublisher";
    }
    if(publisherId_info){
        id = publisherId_info;
        url = "/advertiser/publisher/editPublisher_Info";
    }

    if(brandId){
        id = brandId;
        url = "/advertiser/advertiser/editBrand";
    }
    if(productId) {
        id = productId;
        if (typeof brandproId == "undefined") {
            url = "/advertiser/advertiser/editProductByName";
        } else {
            url = "/advertiser/advertiser/editBrandForProduct";
        }
    }
    if(sectorId){
        id = sectorId;
        if(typeof productsecId == "undefined") {
            url = "/advertiser/advertiser/editSectorByName";
        }else
            url = "/advertiser/advertiser/editProductForSector";
    }
    if(fnameId){
        id  = fnameId;
        key = 'firstname';
        url = "/admin/Users/editUser";
    }
    if(lnameId){
        id  = lnameId;
        key = 'lastname';
        url = "/admin/Users/editUser";
    }
    if(emailId){
        id  = emailId;
        key = 'email';
        url = "/admin/Users/editUser";
    }

    $.ajax({
        type: "POST",
        url: url,
        data: {name: name,contact_info: name,id:id,key: key},
        success: function (result) {
            if(result == 1){
                bootbox.alert("Bạn đã thêm thành công!", function() {
                });
            }else{
                bootbox.alert("Có lỗi xảy ra. Vui lòng kiểm tra lại!", function() {
                });
            }
        },
        error: function () {
            alert("failure");
        }
    });
});
function addMetaData(obj,name,id,url){
    var nameMeta = $('#'+name).val();
    var idMeta = $('#'+id).val();
    var idLoad = $(obj).attr('data-id-reload');
    if(nameMeta == '') {
        bootbox.alert("Có lỗi xảy ra. Tên không được để trống. Vui lòng kiểm tra lại!", function() {
        });
        //alert('Có lỗi xảy ra. Tên không được để trống. Vui lòng kiểm tra lại!');
        return false;
    }
    $.ajax({
        type: "POST",
        url: url,
        data: {name: nameMeta, id: idMeta},
        success: function (result) {
            if(result == 0){
                bootbox.alert("Có lỗi xảy ra. Tên không được để trống. Vui lòng kiểm tra lại!", function() {
                });
            }else{
                //alert('Bạn đã thêm thành công!');
                bootbox.alert("Bạn đã thêm thành công!", function() {
                    //Example.show("Hello world callback");
                    $(".modal").modal("hide");
                    window.location.href = "/advertiser/advertiser/addMetaDataBrand#"+idLoad;
                    document.location.reload();
                });


            }
        },
        error: function () {
            alert("failure");
        }
    });
}
/*
Add Publisher and Advertise*/
function addPubAndAdv(name,content,url){
    //var data = $('form' ).serialize();
    var contentData = $('.'+content).html();
    var nameData = $('#'+name).val();
    var userId = $('#choose_user_ad').val();
    if(contentData == '' || nameData == ''){
        $('#error').html('Có lỗi xảy ra. Tên không được để trống. Vui lòng kiểm tra lại!');
        $('.alert').show();
        return false;
    }
    // /index.php/publisher/ajaxAddPublisher
    $.ajax({
        type: "POST",
        url: url ,
        data: {name: nameData, content:contentData, userId: userId},
        success: function (result) {
            //alert('Bạn đã thêm thành công!');
            bootbox.alert("Bạn đã thêm thành công!", function() {
                //Example.show("Hello world callback");

            });
            $('.'+content).html('');
            //$('.alert-danger').css({display:none});
            $('#'+name).val('');
        },
        error: function () {
            alert("failure");
        }
    });
}
function ajaxTabMeta(object,idContent,url){
    //window.location.hash = idContent;

    var isLoad = $(object).attr('data-is-load');
    if(isLoad == '0'){
        $.ajax({
            type: "POST",
            url: url ,
            data: {},
            success: function (result) {
                //console.log(result);
                $('#'+idContent).html(result);
            },
            error: function () {
                alert("failure");
            }
        });
        $(object).attr('data-is-load','1');
        window.location.hash = idContent;
        return false;
    }
}
