$(document).ready(function() {
    //toggle `popup` / `inline` mode
    $.fn.editable.defaults.mode = 'popup';

    
    //make username editable
    for (var i = 1; i < $('#brand table tr').length; i++) {
        $('#brand'+i).editable({
        });
    }
    //make product editable
    for (var p = 1; p < $('#product table tr').length; p++) {
        $('#product'+p).editable({
        });
    }
    //make sector editable
    for (var s = 1; s< $('#sector table tr').length; s++) {
        $('#sector'+s).editable({
        });
    }
    //make status editable
    for (var pb = 1; pb < $('#product table tr').length; pb++) {
        $('#brandpro'+pb).editable({
            type: 'select',
            title: 'Select status',
            placement: 'right',
            value: 1,
            'source': '/index.php/advertiser/listBrand',

        });
    }
    //make status editable
    for (var ps = 1; ps < $('#sector table tr').length; ps++) {
        $('#productsec'+ps).editable({
            type: 'select',
            title: 'Select status',
            placement: 'right',
            value: 2,
            'source': '/index.php/advertiser/listProduct',
        });
    }
    $(document).on('click','.editable-submit',function(){
        var brandId = $(this).closest('td').children('a').attr('data-brand-id');
        var productId = $(this).closest('td').children('a').attr('data-product-id');
        var sectorId = $(this).closest('td').children('a').attr('data-sector-id');
        var brandproId = $(this).closest('td').children('a').attr('data-brandpro-id');
        var productsecId = $(this).closest('td').children('a').attr('data-productsec-id');
        var name = $('.input-sm').val();

        var id = null;
        var url = '';
        if(brandId){
            id = brandId;
            url = "/index.php/advertiser/editBrand";
        }else if(productId){
            id = productId;
            if(typeof brandproId == "undefined"){
                url = "/index.php/advertiser/editProductByName";
            }else{
                url = "/index.php/advertiser/editBrandForProduct";
            }
        }else if(sectorId){
            id = sectorId;
            if(typeof productsecId == "undefined") {
                url = "/index.php/advertiser/editSectorByName";
            }else
                url = "/index.php/advertiser/editProductForSector";
        }

        $.ajax({
            type: "POST",
            url: url,
            data: {name: name,id:id},
            success: function (result) {
                if(result == 1){
                    bootbox.alert("Bạn đã thêm thành công!", function() {
                        //Example.show("Hello world callback");
                    });
                }else{
                    bootbox.alert("Có lỗi xảy ra. Vui lòng kiểm tra lại!", function() {
                        //Example.show("Hello world callback");
                    });
                }
            },
            error: function () {
                alert("failure");
            }
        });
    });
});


