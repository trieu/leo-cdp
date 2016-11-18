//convert datetime YYYY-MM-DD-HH
function dateTimeValid(a, b){
	var time_begin = new Date($('#ads_date_run').text()).getTime();
	var time_end = new Date($('#ads_date_expired').text()).getTime();

	var int_begin = moment(a).valueOf();
	var int_end = moment(b).valueOf();

	var formatDatetime = function(val){
		return moment(val).format('YYYY-MM-DD-HH');
	};

	var temp_begin = (time_begin <= int_begin) ? formatDatetime(int_begin) : formatDatetime(time_begin);
	//FIX ME
	//var temp_end = (time_end >= int_end) ? formatDatetime(int_end) : formatDatetime(time_end);
	var temp_end = formatDatetime(int_end);
	return {begin: temp_begin, end: temp_end};
	
}

//onclick call drawHourlyStatsData
function drawHourlyStatsChange(){
	var getDateTime = dateTimeValid($("#export_begin").val(),$("#export_end").val());
	var url = urlDrawHourly;
	drawHourlyStatsData(url, getDateTime.begin, getDateTime.end);
}

$(window).load(function() {

	// export data form url with begin & end & id 
	// data-export='{"url": "export/excel/Impression-CompletedView", "begin": "{{begin}}", "end": "{{end}}", "id": {{crtId}} }'

	var _this = $('.export_form');
	var data = JSON.parse(_this.attr('data-export')); //get config

	
	//set default date
	var begin = moment(data.begin).format('YYYY-MM-DD');
	var end = moment(data.end).format('YYYY-MM-DD');

	//reconfiguration
	if ($("#Impression-CompletedView").length > 0) {
		var now = moment();
		//var count = now.diff(begin, 'days'); //count day now vs begin
		end = now.format('YYYY-MM-DDTHH:mm');
		begin = now.subtract(1, 'days').format('YYYY-MM-DDTHH:mm');
	}

	function exportRender(begin, end){
		var export_form = $('<form class="form-inline">\
                        <div class="form-group">\
                            <label>Begin</label>\
                            <input type="datetime-local" class="form-control" id="export_begin" value="'+begin+'" placeholder="Enter Begin Date">\
                        </div>\
                        <div class="form-group">\
                            <label>End</label>\
                            <input type="datetime-local" class="form-control" id="export_end" value="'+end+'" placeholder="Enter End Date">\
                        </div>\
                        <button type="button" onclick="drawHourlyStatsChange()" id="export_ok" class="btn btn-primary">Ok</button>\
                        <a href="#" target="_blank" id="export_btn" class="btn btn-primary">Export</a>\
                    </form>');
		$('.export_form').append(export_form);
	}
	exportRender(begin, end);

	//event click export
	$(document).on("click", "#export_btn", function(){
		$("#export_ok").trigger("click");

		var getDateTime = dateTimeValid($("#export_begin").val(),$("#export_end").val());

		var url = data.url+"?id="+data.id+"&begin="+getDateTime.begin+"&end="+getDateTime.end;

		$(this).attr('href', url);
		
		return;
	});

});