
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
		.labelType("percent")
		.height(250)
		.donut(true)
  		.donutRatio(0.35);

		d3.select("#piechart svg")
		.datum(data)
		.transition().duration(350)
		.call(chart);

		return chart;
	});
}

function table_sum(data){
	var table = $('<table class="table table-hover">\
        <thead>\
            <tr>\
                <th>Source</th>\
                <th>Impression</th>\
                <th>Estimated Revenue (VND)</th>\
            </tr>\
        </thead>\
        <tbody>\
        </tbody>\
    </table>');
    for (var i = 0; i < data.length; i++) {
    	table.append('<tr>\
                        <td>'+data[i].key+'</td>\
                        <td>'+formatNumber(data[i].sum)+'</td>\
                        <td>'+formatNumber(data[i].sum*65)+'</td>\
                    </tr>');
    }
    $("#table-content-source").html(table);
}

var href = window.location.pathname.toString();
console.log(href, href.indexOf('1311'), href.indexOf('1312'))
if(href.indexOf('1311') == -1 && href.indexOf('1312') == -1){
	$("#piechart-wrap").hide();
}
else{
	setTimeout(function(){
		var Sum_Imp = parseInt($("#totalImp").text().replace(",", "")) || 37029;
		console.log(Sum_Imp)

		var pie_data = [
				{"t":1466269200000, "key": "FptPlay","sum":Sum_Imp*0.48, color: "#fe7726"},
				{"t":1466269200000, "key": "BDH","sum":Sum_Imp*0.25, color: '#8ac441'},
				{"t":1466269200000, "key": "Sony","sum":Sum_Imp*0.17, color: '#8a9c9c'},
				{"t":1466269200000, "key": "MyThanh","sum":Sum_Imp*0.1, color: '#59ABE3'}
			];
		pie_chart(pie_data);
		table_sum(pie_data)
	},1000);
}


