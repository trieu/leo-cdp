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

            var value = $(this).val() ? $(this).val().trim() : '';
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
                data[fieldName] = value;
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

    function change_form_value(url){
        $.ajax({
            dataType: "json",
            url: url,
            success: function(data){

                for(var k in data){
                    if($.isArray(data[k])){
                        $('[data-creative-field="'+k+'"]').each(function( index ) {
                            var value = $(this).val();
                            for (var i = 0; i < data[k].length; i++) {
                                if (data[k][i] == value) {
                                    $(this).attr('checked', true);
                                }
                            }
                        });
                    }
                    else{
                        if (k == 'runDateL' || k == 'expDateL') {
                            var nameTime = (k == 'runDateL') ? 'runDate' : 'expiredDate';
                            var time = moment(data[k]).format('YYYY-MM-DD');
                            $('[data-creative-field="'+nameTime+'"]').val(time);
                        }
                        else if(k == 'media'){

                            if (data['adType'] == 1) {
                                //set adtype, media
                                adtype = "fm_tvc_video";
                                media = data[k];

                                var link = "http://ads.fptplay.net.vn/static/ads/instream/"+data[k];
                                $('#youtube_url').val(link);

                                var iframe = '<video id="video_ads" class="video-js vjs-default-skin vjs-big-play-centered"><source src="'+link+'" type="video/mp4"></video>';
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

    jQuery(document).ready(function(){

        
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
        }

        //get iframe video
        $("#youtube_url").keyup(function() {
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

        var h1 = function(){
            var v = $(this).val() ;
            var checked = $(this).is(':checked');
            var nodes = $('#target_ad_placements').find('input[data-device-id='+v+']');
            if(checked){
                nodes.attr('checked','checked');
            } else {
                nodes.removeAttr('checked');
            }
        };
        $('#ad_target_device input:checked').each(h1);
        $('#ad_target_device input').change(h1);

        $('#ads_action_ok').click(function(){
            var data = collectCreativeData();
            
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

            if(document.getElementById("ads_running_date").valueAsDate.getTime() >= document.getElementById("ads_expired_date").valueAsDate.getTime()){
                modal_alert('Running date must be before Expire Date!');
                return false;
            }

            if (media != null) {
                $('#file').removeAttr('required');
                $('#youtube_url').removeAttr('required');
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

            console.log(data);
            //return;

            if (adtype == "fm_tvc_video") {
                var ytb_url = $('#youtube_url').val();
                var postData = {creative: JSON.stringify(data), adtype : adtype, youtube_url:ytb_url};

                $.ajax({
                    url: 'creative/save/tvc-ad',
                    type: "POST",
                    data: postData,
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
