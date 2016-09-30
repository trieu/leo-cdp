/**
 * Created by trieu on 6/17/15.
 */

Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();
    return yyyy +'-'+ (mm[1]?mm:"0"+mm[0]) +'-'+ (dd[1]?dd:"0"+dd[0]); // padding
};

function formatNumber(number) {
    var number = number.toFixed(0) + '';
    var x = number.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function scrollTopPage(){
    $('html, body').animate({
        scrollTop: 0
    }, 800);
}

function makeLinePlusBarChart(graphPlaceholderId, data) {
    console.log(data);
    data = data.map(function (series) {
        series.values = series.values.map(function (d) {
            return {x: d[0], y: d[1] }
        });
        return series;
    });
    var chart;
    var placeholder = '#' + graphPlaceholderId + ' svg';
    var margin = {top: 30, right: 50, bottom: 40, left: 50};

    var chart = nv.models.linePlusBarChart()
            .margin(margin)
        ;

    chart.xAxis.tickFormat(function(d) {
        return d3.time.format('%H:00 %d/%m/%Y ')(new Date(d))
    });

    chart.y1Axis.tickFormat(d3.format(',f'));
    chart.y2Axis.tickFormat(d3.format(',f'));

    chart.bars.forceY([0]);

    d3.select(placeholder)
        .datum(data)
        .transition()
        .duration(0)
        .call(chart);
    nv.utils.windowResize(chart.update);
    return chart;
}


function initJqueryDatePicker(){
    $(function () {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        $("#from").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            dateFormat: 'yy-mm-dd',
            onClose: function (selectedDate) {
                $("#to").datepicker("option", "minDate", selectedDate);
            }
        }).datepicker("setDate", d);

        $("#to").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            dateFormat: 'yy-mm-dd',
            onClose: function (selectedDate) {
                $("#from").datepicker("option", "maxDate", selectedDate);
            }
        }).datepicker("setDate", new Date());
    });
}

function modal_alert(str){
    $('#modal-alert .alert-body').text(str);
    $('#modal-alert').modal('show');
}

function checkLinkYoutube(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error';
    }
};

function getDateFromValue(){
    return $('#from').val();
}

function getDateToValue(){
    return $('#to').val();
}

//using all form with attribute name
function getFormData(ele) {
    var form = ele.serializeArray();
    var data = {};
    for(var i in form){

        if(data.hasOwnProperty(form[i].name)){
            
            if(Object.prototype.toString.call( data[form[i].name] ) === '[object Array]'){
                data[form[i].name].push(form[i].value);
            }
            else{
                var temp = data[form[i].name];
                data[form[i].name] = [];
                data[form[i].name].push(temp);
                data[form[i].name].push(form[i].value);
            }
        }
        else{
            data[form[i].name] = form[i].value
        }
    }
    console.log(data)
    return data; //object
}

//using all form with attribute name
function setFormData(ele, data) {

    for(var i in data){
        ele.find('[name]').each(function(key){
            var type = $(this).attr('type');
            var value = $(this).val();
            if(i == $(this).attr('name')){
                if(type === 'checkbox') {
                    for(var j in data[i]){
                        if(value == data[i][j]){
                            $(this).attr('checked', true);
                        }
                    }
                }
                else if(type === 'date'){
                    var date_format = moment(data[i]).format('YYYY-MM-DD');
                    $(this).val(date_format);
                }
                else if(type === 'datetime-local'){
                    var date_format = moment(data[i]).format('YYYY-MM-DDTHH:mm');
                    $(this).val(date_format);
                }
                else if(type === 'radio' ){
                    if(value == data[i]){
                        $(this).attr('checked', true);
                    }
                }
                else if(type === 'select' ){
                    //select multiple
                    if(Object.prototype.toString.call(data[i]) === '[object Array]'){
                        for(var j in data[i]){
                            $(this).find('option').each(function() {
                                if($(this).val() == data[i][j]){
                                    $(this).prop("selected", true);
                                }
                            });
                        }
                    }
                    else{//select one
                        $(this).prop("selected", true);
                    }
                }
                else {
                    $(this).val(data[i]);
                }
            }

        })
    }

}
