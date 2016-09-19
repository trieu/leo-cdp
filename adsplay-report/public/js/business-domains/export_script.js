function dateTimeValid(a, b){
	var time_begin = new Date($('#ads_date_run').text()).getTime();
	var time_end = new Date($('#ads_date_expired').text()).getTime();

	var int_begin = new Date(a).getTime();
	var int_end = new Date(b).getTime();

	var formatDatetime = function(val){
		return moment(val).format('YYYY-MM-DD-HH');
	};

	var temp_begin = (int_begin < time_begin) ? formatDatetime(time_begin) : formatDatetime(int_begin);
	var temp_end = (int_end > time_end) ? formatDatetime(time_end) : formatDatetime(int_end);

	return {begin: temp_begin, end: temp_end};
	
}
function drawHourlyStatsChange(){
	var getDateTime = dateTimeValid($("#export_begin").val(),$("#export_end").val());
	
	drawHourlyStatsData(getDateTime.begin, getDateTime.end);
}
$(window).load(function() {

	var _this = $('.export_form');
	var data = JSON.parse(_this.attr('data-export'));
	
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
                        <button type="button" onclick="drawHourlyStatsChange()" class="btn btn-primary">Ok</button>\
                        <a href="#" target="_blank" id="export_btn" class="btn btn-primary">Export</a>\
                    </form>');
		$('.export_form').append(export_form);
	}
	exportRender(begin, end);

	$(document).on("click", "#export_btn", function(){

		var getDateTime = dateTimeValid($("#export_begin").val(),$("#export_end").val());

		var url = data.url+"?id="+data.id+"&begin="+getDateTime.begin+"&end="+getDateTime.end;

		$(this).attr('href', url);
		
		return;
	});

});