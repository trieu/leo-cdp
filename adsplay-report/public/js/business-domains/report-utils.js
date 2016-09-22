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

function getDateFromValue(){
    return $('#from').val();
}

function getDateToValue(){
    return $('#to').val();
}

(function($){
    $.fn.getFormData = function(){
        var data = {};
        this.each(function(i) {
            var ele = $('[name="'+this+'"]');
            if(ele.is('select')){
                data[ele.attr('name')] = ele.val() || [];
            }
            else if(ele.is(':checkbox')){
                var checkboxName = ele.attr('name');
                data[ele.attr('name')] = [];
                $("input[name*='" + checkboxName + "']").each(function () {
                    if (ele.is(":checked")) {
                        data[ele.attr('name')].push(ele.val());
                    }
                });
            }
            else{
                data[ele.attr('name')] = ele.val();
            }
        });

        console.log(data);
        return data;
    }
})(jQuery);