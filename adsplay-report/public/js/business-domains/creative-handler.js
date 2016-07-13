(function (global, undefined) {
    'use strict';

    var adtypeArr = [
            {id: 1, adtype: 'fm_tvc_video', name: 'video'},
            {id: 2, adtype: 'fm_display_banner', name: 'display'},
            {id: 3, adtype: 'fm_overlay_banner', name: 'overlay'},
            {id: 4, adtype: 'fm_breaking_news', name: 'news'},
        ];
    var adtype,media = null;

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
            console.log('fieldName: '+ fieldName + ' type: ' + type + ' val: ' + $(this).val());

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
            else if(type === 'date' ){
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
        return data;
    }
    window.collectCreativeData = collectCreativeData;

    function change_form_value(url){
        $.ajax({
            dataType: "json",
            url: url,
            success: function(data){

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
                            var time = moment(data[k]).format('YYYY-MM-DD');
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

                            if (data['adType'] == 1) {
                                //set adtype, media
                                adtype = "fm_tvc_video";
                                media = data[k];

                                var link = "https://ads-cdn.fptplay.net/static/ads/instream/"+data[k];
                                $('#video_url').val(link);

                                var iframe = '<video id="video_ads" muted autoplay controls class="video-js vjs-default-skin vjs-big-play-centered"><source src="'+link+'" type="video/mp4"></video>';
                                $('.iframeVideo').html(iframe);
                                videojs("video_ads", {
                                    "poster": "//adsplay.net/img/logo.png",
                                    "width": '100%', "height": 300,
                                    "controls": true, "autoplay": true,
                                });
                            }
                            else if(data['adType'] == 2){
                                adtype = "fm_display_banner";
                                media = data[k];
                                $('#iframeHtml').html('<iframe src="'+media+'" width="100%" height="300" frameBorder="0"></iframe>');
                            }
                            else if(data['adType'] == 3){
                                adtype = "fm_overlay_banner";
                                media = data[k];

                                $('#iframeImg').html('<img style="width: 100%" src="'+media+'" width="100%" class="img-thumbnail">');
                            }
                            else if(data['adType'] == 4){
                                adtype = "fm_breaking_news";
                                media = data[k];
                                $('.break-news').show();
                                $('#news-marquee').html(media);
                                $('#BreakingNews_Text').val(media);
                            }

                        }
                        else{
                            $('[data-creative-field="'+k+'"]').val(data[k]);
                        }
                    }
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

    function isPayTv(){
        var temp = false;
        if(window.location.href.indexOf('paytv') >= 0){
            temp = true;
        }

        if ($('#isPayTv').length > 0) {
            temp = true;
        }
        
        if(temp){
            $("#ad_target_location .optLocation").remove();
        }
        else{
            $("#ad_target_location .optArea").remove();
        }
    }

    jQuery(document).ready(function(){
    
        $("#profile-all").click(function () {
            var checkboxes = $(this).closest('#row-profile').find(':checkbox');
            checkboxes.prop('checked', $(this).prop("checked"));
        });

        /*check url*/
        var url_current = window.location.href;
        for (var i = 0; i < adtypeArr.length; i++) {
            var checkAdType = url_current.indexOf(adtypeArr[i].name);
            if(checkAdType > 0){
                adtype = adtypeArr[i].adtype;
            } 
            // if(url_current.indexOf('video') < 0){
            //     $('[data-ad-type="1"]').hide();
            // }
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

        isPayTv();

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

        //disable video data fields on other ad type
        var tvc_div_nodes = $('#row_ads_thirdparty_url,#row_ads_skip,#row_ads_duration,#row_ads_startime,#div_fptplay_tvc_ad_placements,#div_paytv_ad_placements,#div_fshare_ad_placements,#div_nhacso_ad_placements');
        if( $('#accordion_tvc_upload').length > 0 ){
            tvc_div_nodes.show();
        } else {
            tvc_div_nodes.hide();
        }

        //get iframe video
        $("#video_url").keyup(function() {
            var value = $(this).val();
            if(typeof(value) !== 'undefined'&& value.indexOf("youtu") != -1){
                var code = youtube(value);
                var iframe = '<iframe id="video1" src="https://www.youtube.com/embed/'+code+'?autoplay=true" frameborder="0" allowtransparency="true" allowfullscreen></iframe>';
                $('.iframeVideo').html(iframe);
            }

        });
        var youtube = function(url) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);

            if (match && match[2].length == 11) {
                return match[2];
            } else {
                return 'error';
            }
        };
        //end get iframe video

        document.getElementById("ads_running_date").valueAsDate = new Date();
        document.getElementById("ads_expired_date").valueAsDate = moment().add(1, 'days').toDate();

        $('#ads_running_date,#ads_expired_date').keydown(function(e) {
            e.preventDefault();
        });

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
            console.log(data);

            var id_edit = url_edit_id(url_current);
            if(id_edit != false){
                data['id'] = id_edit;
                data['media'] = media;
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

            if(document.getElementById("ads_running_date").valueAsDate.getTime() >= document.getElementById("ads_expired_date").valueAsDate.getTime()){
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

            if (adtype == "fm_tvc_video") {
                var ytb_url = $('#video_url').val();
                var video_file = $('#video_file')[0];

                if(ytb_url.length == 0 && video_file.files.length == 0){
                    return alert("Please check input file ");
                }
                else{
                    var postData = new FormData();
                    postData.append('creative', JSON.stringify(data));
                    postData.append('adtype', adtype);

                    if (video_file.files.length != 0) {
                        var fSize = video_file.files[0].size;
                        if(fSize > 20971520){
                            return alert("Please check file size ");
                        }
                        else{
                            postData.append('file', video_file.files[0]);
                        }
                    }
                    else{
                        postData.append('video_url', ytb_url);
                    }
                }
                
                //console.log(postData)

                $.ajax({
                    url: 'creative/save/tvc-ad',
                    type: "POST",
                    data: postData,
                    contentType: false,
                    processData:false,
                    timeout: 60000, //60s
                    beforeSend: function(){
                        $('#wrapper').append('<div class="loader"></div>');
                    },
                    success: function(data){
                        var adId = parseInt(data);
                        if(adId>0){
                            window.location = 'https://monitor.adsplay.net/creative/'+adId;
                        }
                        else if(adId == -100){
                            alert('No Authorization');
                        }
                        else {
                            alert(data);
                        }
                    }
                });
            }
            else if(adtype == "fm_display_banner"){
                if(media == null){
                    if (!$('#file')[0].files[0].name.match(/\.(zip)$/)){
                        return alert('Incorrect file .zip');
                    }
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
                    timeout: 60000, //60s
                    beforeSend: function(){
                        $('#wrapper').append('<div class="loader"></div>');
                    },
                    success: function(data){
                        window.location = 'https://monitor.adsplay.net/creative/'+data;
                    }
                });
            }
            else if(adtype == "fm_overlay_banner"){
                if(media == null){
                    if (!$('#file')[0].files[0].name.match(/\.(jpg|jpeg|png|gif)$/)){
                        return alert('Incorrect file .jpg , .jpeg, .png, .gif');
                    }
                }
                var postData = new FormData();
                postData.append('file', $('#file')[0].files[0]);
                postData.append('creative', JSON.stringify(data));
                postData.append('adtype', adtype);

                $.ajax({
                    url: 'creative/save/overlay-banner',
                    type: "POST",
                    data: postData,
                    contentType: false,
                    processData:false,
                    beforeSend: function(){
                        $('#wrapper').append('<div class="loader"></div>');
                    },
                    success: function(data){
                        window.location = 'https://monitor.adsplay.net/creative/'+data;
                    }
                });
            }
            else if(adtype == "fm_breaking_news"){

                var postData = new FormData();
                postData.append('breakingNews', $('#BreakingNews_Text').val());
                postData.append('creative', JSON.stringify(data));
                postData.append('adtype', adtype);

                $.ajax({
                    url: 'creative/save/breaking-news',
                    type: "POST",
                    data: postData,
                    contentType: false,
                    processData:false,
                    beforeSend: function(){
                        $('#wrapper').append('<div class="loader"></div>');
                    },
                    success: function(data){
                        window.location = 'https://monitor.adsplay.net/creative/'+data;
                    }
                });
            }
        })
    });

})(typeof window === 'undefined' ? this : window);

