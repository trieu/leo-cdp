webApp.directive('historicalBarChart', function(){
	return{
		restrict: 'E',
		scope: {
			ngTitle: '@',
			ngChartKey : '@',
			ngChartData : '@'
		},
		template: '<div class="tile">'+
					'<h2 class="tile-title">{{ngTitle}}</h2>'+
					'<div class="p-10">'+
						'<nvd3 options="options" data="data" api="api"></nvd3>'+
					'</div>'+
				'</div>',
		link: function ($scope, element, attributes) {
			var dataDemo = [
				[ 1288497600000 , 1331875.0], [ 1293771600000 , 1154695.0] ,
				[ 1298869200000 , 1194025.0], [ 1304136000000 , 1194025.0] ,
				[ 1309406400000 , 475000.0], [ 1314763200000 , 1244525.0] ,
				[ 1320033600000 , 1194025.0], [ 1325307600000 , 475000.0]
			];

			$scope.options = {
					chart: {
						type: 'historicalBarChart',
						height: 450,
						margin : {
							top: 20,
							right: 20,
							bottom: 65,
							left: 50
						},
						x: function(d){return d[0];},
						y: function(d){return d[1]/100000;},
						showValues: true,
						valueFormat: function(d){
							return d3.format(',.1f')(d);
						},
						duration: 100,
						xAxis: {
							tickFormat: function(d) {
								return d3.time.format('%x')(new Date(d))
							},
							rotateLabels: 30,
							showMaxMin: false
						},
						yAxis: {
							tickFormat: function(d){
								return d3.format(',.1f')(d);
							}
						},
						tooltip: {
							keyFormatter: function(d) {
								return d3.time.format('%x')(new Date(d));
							}
						},
						zoom: {
							enabled: true,
							scaleExtent: [1, 10],
							useFixedDomain: false,
							useNiceScale: false,
							horizontalOff: false,
							verticalOff: true,
							unzoomEventType: 'dblclick.zoom'
						},
						color: function(d, i) { return "rgba(255,255,255,0.5)"; }
					}
				};

			var run = function(values){
				
				$scope.data = [
				{
					"key" : "Quantity" ,
					"bar": true,
					"values" : values
				}];
			};
			
            run(dataDemo);

            $scope.$watch('ngChartData', function (newValue, oldValue) {
            	var data = JSON.parse(newValue);
				if (data.length > 0) {
					run(dataDemo);
					$scope.api.refresh();
				}
			});


		}
	}
});