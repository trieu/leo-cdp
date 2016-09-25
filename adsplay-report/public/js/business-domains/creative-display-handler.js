(function (global, undefined) {
    'use strict';

    var adtypeArr = [
            {id: 1, adtype: 'fm_tvc_video', name: 'video'},
            {id: 2, adtype: 'fm_display_banner', name: 'display'},
            {id: 3, adtype: 'fm_overlay_banner', name: 'overlay'},
            {id: 4, adtype: 'fm_breaking_news', name: 'news'},
            {id: 6, adtype: 'fm_display_banner', name: 'display'}
        ];
    var adtype,media = null;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function logError(e) {
        if (window.console) {
            window.console.error(e);
        }
    }

    function modal_alert(str){
        $('#modal-alert .alert-body').text(str);
        $('#modal-alert').modal('show');
    }

    function collectCreativeData() {
        var data = {};
        var numFields = {cost:1,tBk:1,dBk:1,hBk:1,score:1,prcModel:1 };

        $('body *[data-creative-field]').each(function(){
            var fieldName = $(this).attr('data-creative-field');
            var type = $(this).attr('type');
            //console.log('fieldName: '+ fieldName + ' type: ' + type + ' val: ' + $(this).val());

            var value = $(this).val() ? $(this).val() : '';
            if(numFields[fieldName] === 1){
                if(value === ''){
                    value = 0;
                } else {
                    value = parseInt(value);
                }
            }

            //console.log(fieldName + " ==> " + value);

            if( type === 'checkbox') {
                var checked = $(this).is(':checked');
                var a = data[fieldName];
                if(typeof a !== 'object'){
                    a = [];
                    data[fieldName] = a;
                }
                if(checked){
                    a.push(value);
                }
            }
            else if(type === 'date'){
                data[fieldName] = $(this)[0].value;
            }
            else if(type === 'datetime-local'){
                data[fieldName] = $(this)[0].value;
            }
            else if(type === 'radio' ){
                var checked = $(this).is(':checked');
                if(checked){
                    data[fieldName] = value;
                }
            }
            else if(type === 'select' ){
                if(typeof value === 'object'){
                    if(fieldName == 'tgcats'){
                        var tgcatsArr = [];
                        for(var i in value){
                            tgcatsArr.push(parseInt(value[i]));
                        }
                        data[fieldName] = tgcatsArr;
                    }
                    else{
                        data[fieldName] = value;
                    }
                }
            }
            else {
                data[fieldName] = value;
            }
        });
        if(data['vastXml3rd'] === '' ){
            data['is3rdAd'] = false;
        } else {
            data['is3rdAd'] = true;
        }
        console.log(data)
        return data;
    }
    window.collectCreativeData = collectCreativeData;

    function change_form_value(url){
        $.ajax({
            dataType: "json",
            url: url,
            success: function(data){
                //set select
                var sizeObj = data.w+"x"+data.h;
                console.log(sizeObj)
                $("#ads-size").multipleSelect("setSelects", [sizeObj]);
                if ($("#ads-size").val() == null) {
                    $("#row_ads_size").hide();
                }
                
                for(var k in data){
                    if($.isArray(data[k])){
                        if(k == 'tgcats'){
                            var arr = data[k];
                            for(var i=0;i<arr.length;i++){
                                var val = arr[i];
                                $('#ad_target_content_cats').find('option[value='+val+']').attr('selected','selected');
                            }
                            $('#ad_target_content_cats').multipleSelect('setSelects', arr);
                        }
                        else if(k == 'tgkws'){
                            var arr = data[k];
                            for(var i=0;i<arr.length;i++){
                                var val = arr[i];
                                $('#ad_target_content_keywords').find('option[value='+val+']').attr('selected','selected');
                            }

                            $('#ad_target_content_keywords').multipleSelect('setSelects', arr);
                        }
                        else if(k == 'tglocs'){
                            var arr = data[k];
                            for(var i=0;i<arr.length;i++){
                                var val = arr[i];
                                $('#ad_target_location').find('option[value='+val+']').attr('selected','selected');
                            }

                            $('#ad_target_location').multipleSelect('setSelects', arr);
                        }
                        else {
                            $('[data-creative-field="'+k+'"]').each(function( index ) {
                                var value = $(this).val();
                                for (var i = 0; i < data[k].length; i++) {
                                    if (data[k][i] == value) {
                                        $(this).attr('checked', true);
                                    }
                                }
                            });
                        }
                    }
                    else{
                        if (k == 'runDateL' || k == 'expDateL') {
                            var nameTime = (k == 'runDateL') ? 'runDate' : 'expiredDate';
                            var time = moment(data[k]).format('YYYY-MM-DDTHH:mm');
                            $('[data-creative-field="'+nameTime+'"]').val(time);
                        }
                        else if(k == 'prcModel'){
                            $('[data-creative-field="'+k+'"]').each(function(i) {
                                if( $(this).val() == data[k] ){
                                    $(this).prop('checked', true);
                                }
                            });
                        }
                        else if(k == 'media'){

                            if(data['adType'] == 2){
                                adtype = "fm_display_banner";
                                media = data[k];
                                $('#iframeHtml').html('<iframe src="'+media+'" width="100%" height="300" frameBorder="0"></iframe>');
                            }

                            else if(data['adType'] == 6 ){
                                adtype = "fm_overlay_banner";
                                media = data[k];
                                $('#iframeImg').html('<img style="width: 100%" src="https://monitor.adsplay.net/'+media+'" width="100%" id="imgChild" class="img-thumbnail">');
                            }
                        }
                        else{
                            $('[data-creative-field="'+k+'"]').val(data[k]);
                        }
                    }
                }

                if(adtype == "fm_display_banner" || adtype == "fm_overlay_banner"){
                    $(".banner-hidden").hide();
                }
                if(adtype == "fm_tvc_video"){
                    $(".video-hidden").hide();
                }
            }
        });
    }

    //check url edit {return id or false}
    function url_edit_id(url_current){
        if(url_current.indexOf('edit') > 0){
            var url_split = url_current.split("/");
            var id = url_split[url_split.length - 2];
            return id;
        }
        else{
            return false;
        }
    }


    jQuery(document).ready(function(){
        $('[title]').tooltip();
        $("#profile-all").click(function () {
            var checkboxes = $(this).closest('#row-profile').find(':checkbox');
            checkboxes.prop('checked', $(this).prop("checked"));
        });

        //event select file image

        $('#file').change(function(){
            $('#ads-size').multipleSelect('uncheckAll');
            if($('#file').val() != ""){
                if ($('#file')[0].files[0].name.match(/\.(jpg|jpeg|png|gif)$/)){
                    $("#row_ads_size").show();
                    var img = new Image();
                    img.src = window.URL.createObjectURL($(this)[0].files[0]);
                    img.onload = function() {
                        var width = img.naturalWidth.toString(),
                            height = img.naturalHeight.toString();
                        var sizeObj = width+"x"+height;

                        $("#ads-size").multipleSelect("setSelects", [sizeObj]);
                        if($("#ads-size").val() == null){
                            $("#file").val("");
                            $("#row_ads_size").hide();
                            modal_alert('File incorrect field Ads-Size !');
                            return false;
                        }
                        
                    }
                }
                else{
                    $("#row_ads_size").hide();
                }
            }
            else{
                $("#row_ads_size").hide();
            }
        });


        /*check url*/
        var url_current = window.location.href;
        for (var i = 0; i < adtypeArr.length; i++) {
            var checkAdType = url_current.indexOf(adtypeArr[i].name);
            if(checkAdType > 0){
                adtype = adtypeArr[i].adtype;
            } 
            if(url_current.indexOf('video') >= 0){
                $(".banner-hidden").show();
                $(".video-hidden").hide();
            }
            if(url_current.indexOf('display') >= 0 || url_current.indexOf('overlay') >= 0){
                $(".banner-hidden").hide();
            }
        }

        //check url edit
        var id_edit = url_edit_id(url_current);
        if(id_edit != false){
            var url = api_domain+'/api/creatives/'+ id_edit;
            change_form_value(url);

            //move iframe video
            if($('.iframeVideo').length > 0){
                $(".iframeVideo").detach().prependTo('#accordion_tvc_upload')
            }

        } else {
            $('#row_ads_status').hide();
        }


        $("#ad_target_location, #ad_target_locs").multipleSelect({
            filter: true,
            multiple: true,
            width: '100%',
            multipleWidth: '100%',
            selectAllText: 'Việt Nam'
        });

        $("#ad_target_content_keywords, #ad_target_content_cats").multipleSelect({
            filter: true,
            multiple: true,
            width: '100%',
            multipleWidth: '100%',
            selectAllText: 'Chọn tất cả'
        });

        $("#ads-size").multipleSelect({
            filter: true,
            single: true,
            width: '100%'
        });
        $('#ads-size').multipleSelect('uncheckAll');

        //end get iframe video
        $("#ads_running_date").val(moment().format('YYYY-MM-DDTHH:mm'));
        $("#ads_expired_date").val(moment().add(1, 'days').format('YYYY-MM-DDTHH:mm'));
        
        var ad_target_device_handler = function(){
            var v = $(this).val() ;
            var checked = $(this).is(':checked');
            var nodes = $('#target_ad_placements').find('input[data-device-id='+v+']');
            if(checked){
                nodes.attr('checked','checked');
            } else {
                nodes.removeAttr('checked');
            }
        };
        $('#ad_target_device input:checked').each(ad_target_device_handler);
        //$('#ad_target_device input').change(ad_target_device_handler);

        $('#ads_action_ok').click(function(){
            var data = collectCreativeData();
            // console.log(data);

            var id_edit = url_edit_id(url_current);
            if(id_edit != false){
                data['id'] = id_edit;
                data['media'] = media;
                var img = document.getElementById("imgChild");
                if (img != null) {
                    data['w'] = img.naturalWidth;
                    data['h'] = img.naturalHeight;
                }
            }

            if(data.name.length < 10){
                modal_alert('Name must be more 10 characters!');
                return false;
            }
            if(data.cost < 0){
                modal_alert('Cost must be larger than zero!');
                return false;
            }
            if(data.tBk < 0){
                modal_alert('Total booking number must be larger than zero!');
                return false;
            }
            if(data.dBk < 0){
                modal_alert('Daily booking number must be larger than zero!');
                return false;
            }
            if(data.hBk < 0){
                modal_alert('Hourly booking number must be larger than zero!');
                return false;
            }
            if(data.tgpfs.length === 0){
                modal_alert('Device Platform must be selected !');
                return false;
            }
            if( ! data.prcModel){
                modal_alert('Pricing Model must be selected !');
                return false;
            }
            if(new Date(data.runDate).getTime() >= new Date(data.expiredDate).getTime()){
                modal_alert('Running date must be before Expire Date!');
                return false;
            }

            if( ! $('#target_ad_placements input[type="checkbox"]').is(':checked') ){
                modal_alert('Some information is invalid, please: \n' + 'Target Placement');
                return false;
            }

            if (media != null) {
                $('#file').removeAttr('required');
                $('#video_url').removeAttr('required');
            }

            if(window.paytvs){
                if( $('#ad_target_content_cats').val() == null ){
                    modal_alert('Targeting category must be selected!');
                    return false;
                }
            }

            //validate all data
            var nodes = $('input:required:invalid');
            if (nodes.length !== 0) {
                var msg = '';
                nodes.each(function(){
                    msg += ($(this).attr('placeholder') + '\n')
                });
                modal_alert('Some information is invalid, please: \n' + msg);
                return false;
            }

            //return;


            if(adtype == "fm_display_banner"){
                if(media == null){
                    if (!$('#file')[0].files[0].name.match(/\.(zip|jpg|jpeg|png|gif)$/)){
                        return alert('Incorrect file upload');
                    }
                }

                var getsize = $("#ads-size").val();
                if(typeof (getsize) != "undefined" && getsize != null && getsize != ""){
                    var ads_size = getsize.split("x");
                    data.w = ads_size.w;
                    data.h = ads_size.h;
                }
                
                var postData = new FormData();
                postData.append('file', $('#file')[0].files[0]);
                postData.append('creative', JSON.stringify(data));
                postData.append('adtype', adtype);
                
                $.ajax({
                    url: 'creative/save/display-banner',
                    type: "POST",
                    data: postData,
                    contentType: false,
                    processData:false,
                    beforeSend: function(){
                        $('#wrapper').append('<div class="loader"></div>');
                    },
                    success: function(data){
                        window.location = location.protocol+'//'+location.host+'/creative/'+data;
                    }
                });
            }
        })
    });

})(typeof window === 'undefined' ? this : window);

