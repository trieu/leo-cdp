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

    function collectBookingData() {
        var data = {};
        var numFields = {imp:1,prcModel:1 };

        $('body *[data-booking-field]').each(function(){
            var fieldName = $(this).attr('data-booking-field');
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
        data['is3rdAd'] = data['vastXml3rd'] !== '';
        return data;
    }


    jQuery(document).ready(function(){
        /*check url*/
        var current_url = window.location.href;
        if(current_url.indexOf('video') < 0){
            $('[data-ad-type="1"]').hide();
        }

        document.getElementById("bk_running_date").valueAsDate = new Date();

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

        $('#bk_action_ok').click(function(){
            var data = collectBookingData();

            if(data.name.length < 10){
                modal_alert('Name must be more 10 characters!');
                return false;
            }
            if(data.imp < 0){
                modal_alert('Impression number must be larger than zero!');
                return false;
            }
            if(data.tgpfs.length === 0){
                modal_alert('Device Platform must be selected !');
                return false;
            }

            // if(document.getElementById("bk_running_date").valueAsDate.getTime() >= document.getElementById("bk_expired_date").valueAsDate.getTime()){
            //     modal_alert('Running date must be before Expire Date!');
            //     return false;
            // }

            //validate all data
            var nodes = $('input:required:invalid');
            if( nodes.length === 0){
                var postData = {booking: JSON.stringify(data)};
                $.post('booking/save',postData,function(result){
                    //OK we got result
                    window.location = '/booking/list/all';
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
