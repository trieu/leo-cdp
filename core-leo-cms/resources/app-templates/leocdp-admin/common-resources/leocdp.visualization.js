function renderJourneyFlowChart(domSelector, defaultMetricName, journeyStages, journeyStageMetrics, journeyNodes, journeyLinks) {
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