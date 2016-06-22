webApp.directive('historicalBarChart', function(){
	return{
		restrict: 'E',
		scope: {
			ngTitle: '@',
			ngChartKey : '@',
			ngChartData : '=ngModel'
		},
		template: '<div class="tile">'+
					'<h2 class="tile-title">{{ngTitle}}</h2>'+
					'<div class="p-10">'+
						'<nvd3 options="options" data="data" api="api" config="{refreshDataOnly: true, deepWatchDataDepth: 0}"></nvd3>'+
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
						color: function(d, i) { return "rgba(255,255,255,0.5)"; },
						clipEdge: true,
						padData: true,
						showLegend: true
					}
				};

			var run = function(values, key){
				
				$scope.data = [
				{
					"key" : key,
					"bar": true,
					"values" : values
				}];
			};
			
			//run first data demo
			run(dataDemo, "Quantity");

			$scope.$watch('ngChartData', function (newVal, oldVal) {
				if (newVal != oldVal) {
					run(newVal, $scope.ngChartKey);
					$scope.api.refresh();
				}
			}, true);


		}
	}
});