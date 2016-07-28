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

	var placements_default = {
	    1: [101, 102],
	    4: [301, 302, 303, 304, 305, 306, 308, 308, 333],
	    5: [201, 202]
	};

	//TODO
	var publishers_platform_placement = {
	    1 : {
	        1: [101, 102],
	        4: [301, 302, 303, 304, 305, 306, 308, 308, 333],
	        5: [201, 202]
	    },
	    2 : {
	        1: [103]
	    },
	    3 : {
	        1: [120,121]
	    },
	    4 : {
	        6 : [320]
	    }
	};


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

    $("#input_publishers").multipleSelect({
        filter: true,
        multiple: true,
        width: '100%',
        multipleWidth: '100%',
        selectAllDelimiter: ['', ''],
        selectAllText: 'Select all',
    	allSelected: 'All selected publishers',
		onClick: function(view) {
			if(view.value == 1 && view.checked == false){
				$("#input_platforms").multipleSelect('uncheckAll');
			}
			else{
				$("#input_platforms").multipleSelect('checkAll');
			}
		},
		onUncheckAll: function(view){
			$("#input_platforms").multipleSelect('uncheckAll');
		},
		onCheckAll: function(view){
			$("#input_platforms").multipleSelect('checkAll');
		}
	});

    $("#input_platforms").multipleSelect({
        filter: true,
        multiple: true,
        width: '100%',
        multipleWidth: '100%',
        selectAllDelimiter: ['', ''],
        selectAllText: 'Select all',
    	allSelected: 'All selected platforms',
    	onClick: function(view) {
			if(view.checked == false){
				var data = $('#input_publishers').multipleSelect('getSelects');
				for(var i in data){
					if(parseInt(data[i]) == 1){
						data.splice(i, 1);
					}
				}
				$("#input_publishers").multipleSelect('setSelects', data);
			}
		},
		onUncheckAll: function(view){
			var data = $('#input_publishers').multipleSelect('getSelects');
			for(var i in data){
				if(parseInt(data[i]) == 1){
					data.splice(i, 1);
				}
			}
			$("#input_publishers").multipleSelect('setSelects', data);
		},
		onCheckAll: function(view){
			var data = $('#input_publishers').multipleSelect('getSelects');
			var temp = false;
			for(var i in data){
				if(i == 0 && parseInt(data[i]) != 1){
					data.splice(0, 0, "1");
				}
			}
			$("#input_publishers").multipleSelect('setSelects', data);
		}
    });


    $('#filter-btn').click(function(){
    	render();
    });

	render();

	function render(){
		var obj_date = filter_date();

		var obj_fields = filter_fields();

		var obj_join = obj_date + obj_fields;

		$.ajax({
			url: '/monitor/inventory-report/api?'+obj_join,
			type: "GET",
			success: function(result){
				//console.log(result)
				sum_panel("#sum-panel", result, 
					[
						{key: 'Play-View', sum: 'totalPv'},
						{key: 'Impression', sum: 'totalImp'},
						// {key: 'Complete-View', sum: 'completeview'},
						// {key: 'Reach', sum: 'reach'}
					]
				);

				var pie_data = [];

				for(var i in result){
					var pf = check_device(result[i].pfId);
					pie_data.push({key: pf.device, sum: result[i].totalPv, color: pf.color});
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
		var str_date = 'begin='+begin+'&end='+end;
		return str_date;
	}

	function filter_fields(){
		var platforms = $('#input_platforms').val();
		var platforms_convert = convert_serialize(platforms, placements_default, "pmId");

		var publishers = $('#input_publishers').val();
		var publishers_convert = convert_serialize(publishers, publishers_platform_placement, "pmId");

		// var placements = $('#input_placements').val();
		// var startTime = $('#input_startTime').val();
		// var location = $('#input_location').val();
		return platforms_convert + publishers_convert;
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
			.color(function(d,i){ 
			    return (d.data && d.data.color) || colors[i % colors.length]
			})
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
					var pf = check_device(data[k][data_col[i].field]);
					data[k][data_col[i].field] = pf.device;
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
			if (isNaN(count)){
				count = 0;
			}
			result.push({key: arr_sum[i].key, sum: count});

			var panel = $('<div> \
				    <div class="panel '+color+'"> \
				        <div class="panel-heading"> \
				            <div class="text-right"> \
				                <div class="huge" id="sum-playview">'+formatNumber(count)+'</div> \
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

	function convert_serialize(arr, arr_relation, key){
		if ((typeof(arr) !== 'undefined') && (arr !== null)) {
			var key_str = '&'+key+'=';
			var arr_temp = [];
			for (var i in arr) {
				var number = parseInt(arr[i]);

				for (var j in arr_relation){
					if(number == j){
						if(typeof arr_relation[j] === 'object'){
							for (var k in arr_relation[j]){
								arr_temp.push(arr_relation[j][k]);
							}
						}
						else{
							arr_temp.push(arr_relation[j]);
						}
					}
				}

			}
			var merged = [].concat.apply([], arr_temp);
			return key_str + merged.join(key_str);
		}
		return '';
	}

	function check_device(id){
		if(id == 1){
			return {device: 'Web', color: '#27ae60'};
		}
		else if(id == 2){
			return {device: 'Mobile Web', color: '#8e44ad'};
		}
		else if(id == 3){
			return {device: 'Tablet', color: '#f1c40f'};
		}
		else if(id == 4){
			return {device: 'Mobile App', color: '#2980b9'};
		}
		else if(id == 5){
			return {device: 'SmartTV', color: '#f39c12'};
		}
		else{
			return {device: 'All Device', color: '#d62728'};
		}
	}

});