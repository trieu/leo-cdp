/**
 * 
 * @author tantrieuf31 (Thomas)
 * 
 * this script contains all functions for common data visualization
 * 
 */

var renderJourneyFlowChart = renderJourneyFlowChart || function(domSelector, defaultMetricName, journeyStages, journeyStageMetrics, journeyNodes, journeyLinks) {
	var configSankey = {
		margin : {
			top : 10,
			left : 10,
			right : 10,
			bottom : 10
		},
		nodes : {
			dynamicSizeFontNode : {
				enabled : true,
				minSize : 14,
				maxSize : 26
			},
			fontSize : 16, // if dynamicSizeFontNode not enabled
			draggableX : false, // default [ false ]
			draggableY : true, // default [ true ]
			colors : d3.scaleOrdinal(d3.schemeCategory20)
		},
		links : {
			formatValue : function(name, val) {
				// console.log('formatValue ' + name)
				var label = journeyStageMetrics[name] ? journeyStageMetrics[name]
						: defaultMetricName
				return d3.format(",.0f")(val) + ' ' + label;
			},
			unit : defaultMetricName
		// if not set formatValue function
		},
		tooltip : {
			infoDiv : true, // if false display default tooltip
			labelSource : 'Input:',
			labelTarget : 'Output:'
		}
	}

	var objSankey = sk.createSankey(domSelector, configSankey, {
		nodes : journeyNodes,
		links : journeyLinks
	});
}

var renderDonutChart = renderDonutChart || function(domSelector, data, totalCount, width, height, radius, percentage){
	
	var arc = d3.arc().outerRadius(radius - 12).innerRadius(100);

	var pie = d3.pie()
	    .sort(null)
	    .value(function(d) {
	        return d.count;
	    });

	var svg = d3.select(domSelector).append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
      .data(pie(data))
      .enter().append("g");    

   	g.append("path").attr("d", arc).style("fill", function(d,i) {
      	return d.data.color;
    });
   	
    g.append("text")
	   .attr("text-anchor", "middle")
		 .attr('font-size', '1.2em')
		 .attr('y', 20)
	   .text(totalCount + ' (~' + percentage + '%)');
}

var loadMediaTouchpoints  = loadMediaTouchpoints || function () {
    var sets = [{
        sets: ["Email"],
        figure: 27.92,
        label: "Email",
        size: 27.92
    }, {
        sets: ["Direct Traffic"],
        figure: 55.28,
        label: "Direct Traffic",
        size: 55.28
    }, {
        sets: ["Search Engine"],
        figure: 7.62,
        label: "Search Engine",
        size: 7.62
    }, {
        sets: ["Email", "Direct Traffic"],
        figure: 3.03,
        label: "Email and Direct Traffic",
        size: 3.03
    }, {
        sets: ["Email", "Search Engine"],
        figure: 1.66,
        label: "Email and Search Engine",
        size: 1.66
    }, {
        sets: ["Direct Traffic", "Search Engine"],
        figure: 2.4,
        label: "Direct Traffic and Search Engine",
        size: 2.4
    }, {
        sets: ["Email", "Direct Traffic", "Search Engine"],
        figure: 1.08,
        label: "Email, Direct Traffic, and Search Engine",
        size: 1.08
    }];

    var chart = venn
        .VennDiagram()
        .width(500)
        .height(400);

    var div2 = d3
        .select("#venn_two")
        .datum(sets)
        .call(chart);
    div2.selectAll("text").style("fill", "white");
    div2
        .selectAll(".venn-circle path")
        .style("fill-opacity", 0.8)
        .style("stroke-width", 1)
        .style("stroke-opacity", 1)
        .style("stroke", "fff");

    var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "venntooltip");

    div2
        .selectAll("g")
        .on("mouseover", function (d, i) {
            // sort all the areas relative to the current item
            venn.sortAreas(div2, d);

            // Display a tooltip with the current size
            tooltip
                .transition()
                .duration(40)
                .style("opacity", 1);
            tooltip.text(d.size + "% media touchpoint " + d.label);

            // highlight the current path
            var selection = d3
                .select(this)
                .transition("tooltip")
                .duration(400);
            selection
                .select("path")
                .style("stroke-width", 3)
                .style("fill-opacity", d.sets.length == 1 ? 0.8 : 0)
                .style("stroke-opacity", 1);
        })

        .on("mousemove", function () {
            tooltip
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY - 28 + "px");
        })

        .on("mouseout", function (d, i) {
            tooltip
                .transition()
                .duration(2500)
                .style("opacity", 0);
            var selection = d3
                .select(this)
                .transition("tooltip")
                .duration(400);
            selection
                .select("path")
                .style("stroke-width", 3)
                .style("fill-opacity", d.sets.length == 1 ? 0.8 : 0)
                .style("stroke-opacity", 1);
        });
}

var personalityDiagram = personalityDiagram || function () {
    var width = 300,
        height = 300;

    // Config for the Radar chart
    var config = {
        w: width,
        h: height,
        maxValue: 100,
        levels: 5,
        ExtraWidthX: 300
    }

    var data = [
        [{
            "area": "Openness",
            "value": 80
        }, {
            "area": "Conscientiousness",
            "value": 40
        }, {
            "area": "Extraversion ",
            "value": 40
        }, {
            "area": "Agreeableness ",
            "value": 90
        }, {
            "area": "Neuroticism ",
            "value": 60
        }]
    ]

    // Call function to draw the Radar chart

    var svg = d3.select('chart_persornality')
        .append('svg')
        .attr("width", width)
        .attr("height", height);

    RadarChart.draw("#chart_persornality", data, config);
}

var loadProfileAttribution = loadProfileAttribution || function () {
    // set the dimensions and margins of the graph
    var containerW = Math.round($("#profile_attribution").width())
    var margin = { top: 30, right: 60, bottom: 100, left: 140 },
        width = containerW - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#profile_attribution")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Labels of row and columns

    var myGroups = ["Live_in_Saigon", "Visited_Web", "Installed_App", "Used_Credit_Card","Buy_Product"]
    var myVars = ["Buy_Product", "Used_Credit_Card", "Installed_App",  "Visited_Web", "Live_in_Saigon" ]

    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([0, width])
        .domain(myGroups)
        .padding(0.01);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x_axis")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,10)rotate(-30)")
        .style("text-anchor", "end")
        .style("font-size", 15)
        .style("fill", "#E91E0D");

    // Build X scales and axis:
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(myVars)
        .padding(0.01);
    svg.append("g")
        .attr("class", "y_axis")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", 15)
        .style("fill", "#463CC4")
        ;

    // Build color scale
    var myColor = d3.scaleLinear()
        .range(["white", "#008748"])
        .domain([1, 100]);
    
    function select_axis_label(datum) {
        return d3.select('.x_axis').selectAll('text').filter(function(x) { return x == datum.letter; });
    }

    // Read the data
    var urlDataSource = "/public/uploaded-files/sample-profile-attribution.csv?_=" + new Date().getTime();
    d3.csv(urlDataSource, function (data) {
    	
        // Three function that change the tooltip when user hover / move / leave
		// a cell

        var onclick = function (d) {
        	var str = " [Profile attribute: " + d.profile_attr + " - Persona attribute: " + d.persona_attr + "] : Matching Score = " + d.matching_score + " %";
            $('#attribution_description').text(str);
            var myNode = svg.select("#cell_"+ d.profile_attr + '_' + d.persona_attr);
        	
            var str = " [Profile attribute: " + d.profile_attr + " - Persona attribute: " + d.persona_attr + "] : Matching Score = " + d.matching_score + " %";
            $('#attribution_description').text(str).effect("highlight", {color:"#5eeb34"}, 6000 );
        }
       
        var mouseover = function (d) {
        	console.log(d)
        	var myNode = svg.select("#cell_"+ d.profile_attr + '_' + d.persona_attr);
        	myNode.style("fill", "#5eeb34");
        	
        	var str = " [Profile attribute: " + d.profile_attr + " - Persona attribute: " + d.persona_attr + "] : Matching Score = " + d.matching_score + " %";
            $('#attribution_description').text(str);
        }
        
        var mouseout = function(d) {
       		var myNode = svg.select("#cell_"+ d.profile_attr + '_' + d.persona_attr);
           	myNode.style("fill", myColor(d.matching_score) );
        }

        // add the squares
        svg.selectAll()
            .data(data, function (d) { return d.profile_attr + ':' + d.persona_attr; })
            .enter()
            .append("rect")
            .attr("id", function (d) { return "cell_"+ d.profile_attr + '_' + d.persona_attr })
            .attr("x", function (d) { return x(d.profile_attr) } )
            .attr("y", function (d) { return y(d.persona_attr) } )
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) { return myColor(d.matching_score)} )
            .on("click", onclick)
            .on("mouseover", mouseover)
            .on('mouseout', mouseout)
            ;
    })
}