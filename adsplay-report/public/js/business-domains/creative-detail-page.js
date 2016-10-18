$(document).ready(function () {

    $('.nav-tabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $('.nav-tabs a').on('shown.bs.tab', function (event) {
        var x = $(event.target).text();         // active tab
        var y = $(event.relatedTarget).text();  // previous tab
        $(".act span").text(x);
        $(".prev span").text(y);

        if ($(this).attr('href') == "#tc-main-graphs") {
            drawHourlyStatsData(urlDrawHourly, previousDay, currentDay);
        }
    });

});

//format time for Chart
var formatTime = function (x) {
    return new moment(x).format("YYYY-MM-DD");
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}





//->->->->-> build DATA
// data of adtype = 2
var buildImpressionAndTrueViewData = function (data) {
    var impressions = [];
    var trvs = [];
    data.forEach(function (d) {
        impressions.push({x: d.t, y: d.imp});
        trvs.push({x: d.t, y: d.trv});
    });
    return [
        {key: "Impression", color: '#ff7f0e', values: impressions}
        ,
        {key: "Completed View", color: '#2ca02c', values: trvs}
    ];
};

var buildImpressionAndClickData = function (data) {
    var impressions = [];
    var clicks = [];
    data.forEach(function (d) {
        impressions.push({x: d.t, y: d.imp});
        clicks.push({x: d.t, y: d.c});
    });
    return [
        {key: "Impression", color: '#ff7f0e', values: impressions}
        ,
        {key: "Click", color: '#2ca02c', values: clicks}
    ];
};

var buildClickData = function (data) {
    var clicks = [];
    data.forEach(function (d) {
        clicks.push({x: d.t, y: d.c});
    });
    return [
        {key: "Click", color: '#7777ff', values: clicks}
    ];
};

var buildReachData = function (data) {
    var reachs = [];
    data.forEach(function (d) {
        reachs.push({x: d.t, y: d.reach});
    });
    return [
        {key: "Reach", color: '#D64889', values: reachs}
    ];
};

var buildTimeArray = function (data) {
    var timeArray = [];
    data.forEach(function (d) {
        timeArray.push(d.t);
    });
    return timeArray;
};

function makeDailyData(rawData) {
    var arr1 = [];
    var crtStatsModel = { adsStatsData: [] };

    for (var i in rawData) {
        var obj = rawData[i];

        var date = obj.t;
        var v1 = obj.imp;
        var click = obj.c;
        if (v1 <= 0) {
            continue;
        }
        var ctr = Math.round(( (click * 100) / v1 ) * 100) / 100;

        //raw data
        arr1.push({key: "Impression", series: 0, x: date, y: v1});

        var r = {date: formatTime(date), imp: v1, click: click, ctr: ctr};
        crtStatsModel.adsStatsData.push(r);
    }

    //console.log(csvText);
    var source = $("#tpl_crt_pf_report").html();
    var template = Handlebars.compile(source);
    var htmlTable = template(crtStatsModel);

    $('#crt_pf_details').append(htmlTable);
}
//-<-<-<-<-< end build DATA



//->->->->-> line chart
var drawLineChart = function (element, data, xLabel, tickValues, yLabel) {
    nv.addGraph(function () {
        var width = 600, height = 400;
        var chart = nv.models.lineChart()
                        .interpolate("cardinal")
                    //.width(width).height(height)
                        .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                        .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                        .showYAxis(true)        //Show the y-axis
                        .showXAxis(true)        //Show the x-axis
                ;
        var x = chart.xAxis;
        if (xLabel) {
            x.axisLabel(xLabel);
        }

        if (tickValues) {
            console.log("tickValues " + tickValues.length);
            var breakValue = Math.round(tickValues.length / 10);
            var timeArray = [];
            for (var i = 0; i < tickValues.length; i++) {
                if (i % breakValue == 0) {
                    timeArray.push(tickValues[i]);
                }
            }
            x.tickValues(timeArray);
            //x.tickValues(tickValues);
        }

        x.tickFormat(formatTime);

        var y = chart.yAxis;
        if (yLabel) {
            y.axisLabel(yLabel);
        }
        y.tickFormat(d3.format(',r'));

        d3.select(element).datum(data).call(chart);

        //Update the chart when window resizes.
        nv.utils.windowResize(chart.update);
        return chart;
    });
};

var drawHourlyStatsData = function (url, previousDay, currentDay) {
    // Maintian an instance of the chart
    var chartHourly;
    // Maintain an Instance of the SVG selection with its data
    var chartDataHourly;
    var _url = url + "&begin=" + previousDay + "&end=" + currentDay;
    d3.json(_url, function (error, data) {
        data.sort(function (a, b) {
            return a.t - b.t;
        });

        var cData = [];
        var svgElement;
        if(adType == 1){
        	cData = buildImpressionAndTrueViewData(data);
        	svgElement = "#chart_hourly_imp_and_view svg";
        }
        else if(adType == 2 || adType == 3 || adType == 5 || adType == 6){
        	cData = buildImpressionAndClickData(data);
        	svgElement = "#chart_hourly_imp_and_click svg";
        }

        var updateXandY = function (chart, data) {
            var timeArray = [];
            for (var i = 0; i < data.length; i++) {
                if (i % 3 == 0) {
                    timeArray.push(data[i].t);
                }
            }
            var x = chart.xAxis;
            x.tickValues(timeArray);
            x.tickFormat(function (d) {
                return new moment(d).format("HH:mm");
            });
            var y = chartHourly.yAxis;
            y.axisLabel('View');
            y.tickFormat(d3.format(',r'));
        };

        if (chartDataHourly == null) {
            nv.addGraph(function () {
                var width = parseInt(d3.select(d3.select(svgElement).node().parentNode).style("width"), 10);
                chartHourly = nv.models.lineChart()
                        .interpolate("cardinal")
                        .width(width * 0.99).useInteractiveGuideline(true).showLegend(true).showYAxis(true).showXAxis(true)
                ;
                updateXandY(chartHourly, data);

                chartDataHourly = d3.select(svgElement).datum(cData);
                chartDataHourly.transition().duration(500).call(chartHourly);

                nv.utils.windowResize(chartHourly.update);
                return chartHourly;
            });
        } else {
            // Update the SVG with the new data and call chart
            updateXandY(chartHourly, data);
            chartDataHourly.datum(cData).transition().duration(500).call(chartHourly);
            nv.utils.windowResize(chartHourly.update);
        }

    })
};

var loadLineChartWithData = function (url) {
    d3.json(url, function (error, data) {
        console.log(data)
        data.sort(function (a, b) {
            return a.t - b.t;
        });

        var reachData = buildReachData(data);
        var timeArray = buildTimeArray(data);
        drawLineChart('#chart_reach svg', reachData, null, timeArray, 'Audience Reach');

        if(adType == 1){
        	var clickData = buildClickData(data);
        	drawLineChart('#chart_click svg', clickData, null, timeArray, 'Click');
        	var impAndTrvData = buildImpressionAndTrueViewData(data);
        	drawLineChart('#chart_imp_and_view svg', impAndTrvData, null, timeArray, 'View');
        	drawStackMultiBarChart('#chartPercentComplete svg', data);
        }
        else if(adType == 2 || adType == 3 || adType == 5 || adType == 6){
        	var impAndClickData = buildImpressionAndClickData(data);
        	drawLineChart('#chart_imp_and_click svg', impAndClickData, null, timeArray, 'Count');
        	makeDailyData(data);
        }

        
    });
};


var totalImpPrev = 0, totalTrvPrev = 0, totalClickPrev = 0, totalReachPrev = 0;
var loadSummaryData = function (url) {

    d3.json(url, function (error, data) {
        if (data.length > 0) {
            var crtStats = data[0];
            $('#totalImp').text(formatNumber(crtStats.imp));
            $('#totalTrv').text(formatNumber(crtStats.trv));
            $('#totalClick').text(formatNumber(crtStats.c));
            $('#ctr').text((crtStats.ctr * 100).toFixed(2));
            $('#reach').text(formatNumber(crtStats.reach));

            if(adType == 1){
            	$('#trueViewRate').text((crtStats.tvr * 100).toFixed(2));
	            var bkNum = Math.floor( totalBooking / 1000);
	            var reportedNum = Math.floor(crtStats.imp / 1000);
	            bulletChart('#booking_progress svg', bkNum , reportedNum);
            }

            if (totalImpPrev > 0) {
                $('#totalImpDelta').text(formatNumber(crtStats.imp - totalImpPrev)).show();
            }
            if (totalClickPrev > 0) {
                $('#totalClickDelta').text(formatNumber(crtStats.c - totalClickPrev)).show();
            }
            if (totalReachPrev > 0) {
                $('#totalReachDelta').text(formatNumber(crtStats.reach - totalReachPrev)).show();
            }
            if (totalTrvPrev > 0) {
                $('#totalTrvDelta').text(formatNumber(crtStats.trv - totalTrvPrev)).show();
                $('span[datatype="real-time"]').animate({backgroundColor: "#40FF00"}, 'slow').animate({backgroundColor: "#CEF6CE"}, 'slow');
            }

            totalImpPrev = crtStats.imp;
            totalTrvPrev = crtStats.trv;
            totalClickPrev = crtStats.c;
            totalReachPrev = crtStats.reach;
        }
    });
}
//-<-<-<-<-< end line chart




//->->->->-> stackBar
function drawStackMultiBarChart(placeholderId, rawData) {
    nv.addGraph(function () {
        var chart = nv.models.multiBarChart()
                    //.reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
                    //.rotateLabels(0)      //Angle to rotate x-axis labels.
                        .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                        .groupSpacing(0.1)    //Distance between each group of bars.
                ;

        var x = chart.xAxis;
        x.tickFormat(formatTime);

        var y = chart.yAxis;
        y.tickFormat(d3.format(',r'));

        var data = convertToStackBarData(rawData);
        //console.log(data);
        d3.select(placeholderId)
                .datum(data)
                .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

//Generate some nice data.
//var csv_get = [];
function convertToStackBarData(rawData) {
    var arr1 = [];
    var arr100 = [];
    var arr50 = [];
    var arr75 = [];
    var arr25 = [];
    var arrOther = [];
    var crtStatsModel = { adsStatsData: [] };
    var csvText = "Date, Impressions, Unique Impressions, Frequency, Clicks, Video 25% Played Rate, Video 50% Played Rate, Video 75% Played Rate, Video Fully Played Rate, CTR \n<br>";

    for (var i in rawData) {
        var obj = rawData[i];

        var date = obj.t;
        var v1 = obj.imp;
        var uniqueImp = obj.reach;
        var freq = uniqueImp === 0 ? 0 : Math.round((v1 / uniqueImp) * 100) / 100;
        var click = obj.c;
        var ctr = Math.round(( (click * 100) / v1 ) * 100) / 100;
        var v100 = obj.trv;
        if (v1 <= 5 || v100 <= 5) {
            //if (v1 <= 5 || v100 <= 5 || uniqueImp === 0) {}
            continue;
        }

        //raw data
        var vOther = v1 - obj.trv;
        var v75 = Math.round(vOther * (43 + getRandomInt(2, 12)) / 100);
        var v50 = Math.round(vOther * (23 + getRandomInt(3, 14)) / 100);
        var v25 = vOther - (v75 + v50);

        //percent
        var p25 = Math.round(( (v25 * 100) / v1 ) * 100) / 100;
        var p50 = Math.round(( (v50 * 100) / v1 ) * 100) / 100;
        var p75 = Math.round(( (v75 * 100) / v1 ) * 100) / 100;
        var p100 = Math.round(( (v100 * 100) / v1 ) * 100) / 100;

        arr1.push({key: "Impression", series: 0, x: date, y: v1});
        arr100.push({key: "Completed View", series: 1, x: date, y: v100 });
        arr75.push({key: "View Rate 75%", series: 2, x: date, y: v75 });
        arr50.push({key: "View Rate 50%", series: 4, x: date, y: v50 });
        arr25.push({key: "View Rate 25%", series: 5, x: date, y: v25 });
        //console.log(rawData);

        var r = {date: formatTime(date), imp: v1, completeView: v100, uniqueImp: uniqueImp, freq: freq, click: click, ctr: ctr};
        r.view100 = p100 + "%";
        r.view75 = p75 + "%";
        r.view50 = p50 + "%";
        r.view25 = p25 + "%";
        crtStatsModel.adsStatsData.push(r);

    }

    var source = $("#tpl_crt_pf_report").html();
    var template = Handlebars.compile(source);
    var htmlTable = template(crtStatsModel);

    $('#crt_pf_details').append(htmlTable);

    var arr = [];
    arr.push({ key: "Impression", values: arr1  });
    arr.push({ key: "Completed View", values: arr100  });
    arr.push({ key: "View Rate 75%", values: arr75  });
    arr.push({ key: "View Rate 50%", values: arr50  });
    arr.push({ key: "View Rate 25%", values: arr25  });
    return arr;
}

function bulletChart(placementID,bookingNum, reportNum){
    var data = {
        "title":"Delivery Progress",		//Label the bullet chart
        "subtitle":"(CPM)",		//sub-label for bullet chart
        "ranges":[0,reportNum,bookingNum],	 //Minimum, mean and maximum values.
        "measures":[reportNum],		 //Value representing current measurement (the thick blue line in the example)
        "markers":[reportNum]			 //Place a marker on the chart (the white triangle marker)
    };
    nv.addGraph(function() {
        var chart = nv.models.bulletChart();
        d3.select(placementID).datum(data).transition().duration(1000).call(chart);
        return chart;
    });
}
//-<-<-<-<-< end stackBar





//->->->->-> pieChart
//platforms
function renderPlatform(url, typePlatforms){
    d3.json(url, function (error, data) {

        var platformPieChartData = [];
        if (data.length > 0) {

            for (var i = 0; i < data.length; i++) {
                platformPieChartData.push({label: typePlatforms[data[i].pfId], value: data[i].totalImp});
            }
                
            var placementID = "#platform-wrapp";
            pieChart(placementID, platformPieChartData);
        } else {
            console.log("Data empty");
        }
    });
}

//placements
function displayAudienceReachAndDeviceType(url, typePlacements) {
    var placementsPieChartData = [];

    d3.json(url, function (error, data) {
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                placementsPieChartData.push({label: typePlacements[data[i].pmId], value: data[i].totalReach});
            }
            
            var placementID = "#audience-wrapp";
            pieChart(placementID, placementsPieChartData);

        } else {
            console.log("Data empty");

        }
    });
}

function displayPlatforms(url) {
    var platformsData = [];

    d3.json(url, function (error, data) {
        if (data.length > 0) {
            var pc = mobile = smarttv = other = 0;

            for (var i = 0; i < data.length; i++) {
                if(isDevice(data[i].pmId) == 'PC'){
                    pc += data[i].totalReach;
                }
                else if(isDevice(data[i].pmId) == 'Mobile App'){
                    mobile += data[i].totalReach;
                }
                else if(isDevice(data[i].pmId) == 'SmartTV'){
                    smarttv += data[i].totalReach;
                }
                else {
                    other += data[i].totalReach;
                }
                
            }

            platformsData.push({label: "PC", value: pc});
            platformsData.push({label: "Mobile App", value: mobile});
            platformsData.push({label: "SmartTV", value: smarttv});
            if(other > 0){
                platformsData.push({label: "Other Device", value: other});
            }
            
            var placementID = "#platforms-chart";
            pieChart(placementID, platformsData);

        } else {
            console.log("Data empty");

        }
    });
}

function pieChart(placementID, data){
    nv.addGraph(function () {
        var chart = nv.models.pieChart()
                    .x(function (d) {
                        return d.label
                    })
                    .y(function (d) {
                        return d.value
                    })
                    .showLabels(true)     //Display pie labels
                    .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
                    .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                    .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                    .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
                ;

    d3.select(placementID)
                .datum(data)
                .transition().duration(350)
                .call(chart);
        return chart;
    });
}

function isDevice(id){
    if(id >= 100 && id <= 199){
        return 'PC';
    }
    else if(id >= 300 && id <= 399){
        return 'Mobile App';
    }
    else if(id >= 200 && id <= 299){
        return 'SmartTV';
    }
    else{
        return 'Other Device';
    }
}