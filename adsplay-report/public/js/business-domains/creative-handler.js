(function (global, undefined) {
    'use strict';
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
            var value = $(this).val().trim();
            if(numFields[fieldName] === 1){
                value = parseInt(value);
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


    jQuery(document).ready(function(){
        /*check url*/
        var current_url = window.location.href;
        if(current_url.indexOf('video') < 0){
            $('[data-ad-type="1"]').hide();
        }

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
            console.log(data);

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

            //validate all data
            var nodes = $('input:required:invalid');
            if( nodes.length === 0){
                var ytb_url = $('#youtube_url').val();
                var postData = {creative: JSON.stringify(data), adtype : 'fm_tvc_video', youtube_url:ytb_url};
                $.post('creative/save/tvc-ad',postData,function(adId){
                    //OK we got result
                   // console.log(adId);
                    window.location = 'https://monitor.adsplay.net/creative/'+adId;
                });
            } else {
                var msg = '';
                nodes.each(function(){
                    msg += ($(this).attr('placeholder') + '\n')
                });
                modal_alert('Some information is invalid, please: \n' + msg);
            }
        })
    });

})(typeof window === 'undefined' ? this : window);
