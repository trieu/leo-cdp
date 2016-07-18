$(document).ready(function(){

	var data = [
	{"t":1466269200000, "reach": 1,"imp":67,"playview":26,"completeview":22,"c":0,"ctr":3,"audience":10000, "platformsId": 1},
	{"t":1466355600000,"reach": 3,"imp":913,"playview":779,"completeview":400,"c":358,"ctr":2,"audience":10000, "platformsId": 4},
	{"t":1466442000000,"reach": 1,"imp":884,"playview":607,"completeview":600,"c":464,"ctr":3,"audience":10000, "platformsId": 2},
	{"t":1466528400000,"reach": 2,"imp":996,"playview":855,"completeview":700,"c":599,"ctr":4,"audience":5000, "platformsId": 3},
	{"t":1466614800000,"reach": 1,"imp":706,"playview":693,"completeview":500,"c":37,"ctr":5,"audience":15000, "platformsId": 1},
	{"t":1466701200000,"reach": 3,"imp":606,"playview":566,"completeview":500,"c":16,"ctr":1,"audience":14000, "platformsId": 2},
	{"t":1466787600000,"reach": 3,"imp":878,"playview":608,"completeview":400,"c":55,"ctr":2,"audience":13000, "platformsId": 3},
	{"t":1466874000000,"reach": 2,"imp":540,"playview":400,"completeview":352,"c":10,"ctr":3,"audience":20000, "platformsId": 5},
	{"t":1466960400000,"reach": 1,"imp":230,"playview":200,"completeview":122,"c":20,"ctr":4,"audience":10000, "platformsId": 6}
];

	var end = new moment().format("YYYY-MM-DD");
    var begin = new moment().subtract(30, 'days').format("YYYY-MM-DD");

    $('#begin').datetimepicker({
        format: 'YYYY-MM-DD',
        defaultDate: begin
    });
    $('#end').datetimepicker({
        useCurrent: false, //Important! See issue #1075
        format: 'YYYY-MM-DD',
        defaultDate: end
    });
    $("#begin").on("dp.change", function (e) {
        $('#end').data("DateTimePicker").minDate(e.date);
    });
    $("#end").on("dp.change", function (e) {
        $('#begin').data("DateTimePicker").maxDate(e.date);
    });

    $(".select-multi").multipleSelect({
            filter: true,
            multiple: true,
            width: '100%',
            multipleWidth: '100%',
            selectAllText: 'Chọn tất cả'
    });

    $('#filter-btn').click(function(){
    	render();
    });

	render();

	function render(){
		var obj_date = filter_date();

		var obj_fields = filter_fields();

		var obj_join = $.extend(obj_date, obj_fields);

		console.log(obj_join)

        $.ajax({
			url: '/monitor/inventory-report/api',
			type: "POST",
			contentType: "application/json",
			dataType: 'json',
			data: JSON.stringify(obj_join),
			success: function(result){
                var pie_data = [];
                console.log(result)
				for(var i in result){
					pie_data.push({key: check_device(result[i].pfId), sum: result[i].totalPv});
				}
				pie_chart(pie_data);

				table_data('#table-wrap', result, 
					[	
						{ key: "Device" , field: "pfId"},
						{ key: "Play-View" , field: "totalPv"}
					]
				);
				// render_chart(data);
				// table_data(data);
			}
		});

		render_chart(data);

	}

	function filter_date(){
		var begin = $('#begin').data("DateTimePicker").date().format('YYYY-MM-DD');
		var end = $('#end').data("DateTimePicker").date().format('YYYY-MM-DD');
		return {begin: begin, end: end};
	}

	function filter_fields(){
		var platforms = $('#input_platforms').val();
		var placements = $('#input_placements').val();
		var startTime = $('#input_startTime').val();
		var location = $('#input_location').val();
		return {platforms: platforms, placements: placements, startTime: startTime, location: location};
	}

	function render_chart(data){

		var line_data = stacked = arr_by_field(data, 
			[
				{key: 'Play-View', field: 'playview'},
				{key: 'Impression', field: 'imp'},
				{key: 'Complete-View', field: 'completeview'}
			]
		);

		// line_chart(line_data);

		// stacked_chart(stacked);

	}

	function pie_chart(data){

	    nv.addGraph(function() {
			var chart = nv.models.pieChart()
			.x(function(d) { return d.key })
			.y(function(d) { return d.sum })
			.showLabels(false)
			.showLegend(true)
			.showLabels(true)
			.labelThreshold(.03)
			.labelType("percent");

			d3.select("#piechart svg")
			.datum(data)
			.transition().duration(350)
			.call(chart);

			return chart;
		});
	}

	function line_chart(data){

		nv.addGraph(function() {
	        chart = nv.models.lineChart()
	            .useInteractiveGuideline(true)
                .transitionDuration(350)
                .showLegend(true);

	        chart.xAxis
	            .axisLabel("Time (s)")
	            .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });

	        chart.yAxis
	            .axisLabel('Voltage (v)')
	            .tickFormat(function(d) {
	                if (d == null) {
	                    return 'N/A';
	                }
	                return d3.format(',.0f')(d);
	            })
	        ;

	        d3.select('#linechart svg')
	            .datum(data)
	            .call(chart);

	        nv.utils.windowResize(chart.update);

	        return chart;
	    });
	}

	function stacked_chart(data){
		nv.addGraph(function() {
		var chart = nv.models.multiBarHorizontalChart()
		    .x(function(d) { return d.x })
		    .y(function(d) { return d.y })
		    .margin({top: 30, right: 20, bottom: 50, left: 175})
		    .showValues(true)
		    .tooltips(true)
		    .transitionDuration(350)
		    .showControls(true);

		chart.xAxis
		    .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });
		chart.yAxis
		    .tickFormat(d3.format(',.0f'));

		d3.select('#stackedchart svg')
		    .datum(data)
		    .call(chart);

		nv.utils.windowResize(chart.update);

		return chart;
		});
	}

	function table_data(placementID, data, data_col){
		var table = $('<table class="table-details" class="table table-hover table-striped"><tbody></tbody></table>');
		$(placementID).empty();
		$(placementID).append(table);
		
		for (var k in data){

			var title = [];
			var td = "";
			for (var i in data_col) {
				if(data_col[i].field == 'pfId'){
					data[k][data_col[i].field] = check_device(data[k][data_col[i].field]);
				}
				else{
					data[k][data_col[i].field] = formatNumber(data[k][data_col[i].field]);
				}

				td += '<td>'+data[k][data_col[i].field]+'</td>';
				title.push({title: data_col[i].key});
			}
			var tr = '<tr>'+td+'</tr>';
			table.find('tbody').append(tr);
		}

		
		$('.table-details').DataTable({
			columns: title
		});
	}

	function sum_panel(placementID, arr_data, arr_sum){
		$(placementID).empty();
		var colorArr = ['panel-success', 'panel-info', 'panel-warning', 'panel-danger'];
		var result = [];
		for(var i in arr_sum){

			var color = (i <= 4) ? colorArr[i] : colorArr[Math.floor(Math.random() * colorArr.length)];

			var count = 0;
			for(var j in arr_data){
				count += arr_data[j][arr_sum[i].sum];
			}
			result.push({key: arr_sum[i].key, sum: count});

			var panel = $('<div class="col-md-4 col-xs-12"> \
				    <div class="panel '+color+'"> \
				        <div class="panel-heading"> \
				            <div class="text-right"> \
				                <div class="huge" id="sum-playview">'+count+'</div> \
				                <div class="total-view-text">'+arr_sum[i].key+'</div> \
				            </div> \
				        </div> \
				    </div> \
				</div>');

			$(placementID).append(panel);
		}
		return result;
	}

	function sum_fields(arr_data, arr_sum){
		var result = [];
		for(var i in arr_sum){
			var count = 0;
			for(var j in arr_data){
				count += arr_data[j][arr_sum[i].sum];
			}
			result.push({key: arr_sum[i].key, sum: count});
		}
		return result;
	}

	function arr_by_field(arr_data, arr_group){
		var result = [];
		for(var i in arr_group){
			var group = [];
			for(var j in arr_data){
				group.push({x: arr_data[j].t, y: arr_data[j][arr_group[i].field]});
			}
			result.push({key: arr_group[i].key, values: group});
		}
		return result;
	}

	function check_device(id){
		if(id == 1){
			return 'Web';
		}
		else if(id == 2){
			return 'Mobile Web';
		}
		else if(id == 3){
			return 'Tablet';
		}
		else if(id == 4){
			return 'Mobile App';
		}
		else if(id == 5){
			return 'SmartTV';
		}
		else{
			return 'All Device';
		}
	}

});