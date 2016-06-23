webApp.directive('pieChart', function(){
	return{
		restrict: 'E',
		scope: {
			ngTitle: '@',
			ngChartData : '=ngModel'
		},
		template: '<div class="tile">'+
					'<h2 class="tile-title">{{ngTitle}}</h2>'+
					'<div class="p-10">'+
						'<nvd3 options="options" data="data" api="api" config="{refreshDataOnly: true, deepWatchDataDepth: 0}"></nvd3>'+
					'</div>'+
				'</div>',
		link: function ($scope, element, attributes) {

			$scope.options = {
				chart: {
					type: 'pieChart',
					height: 450,
					x: function(d){return d[0];},
					y: function(d){return d[1];},
					showLabels: true,
					duration: 500,
					labelThreshold: 0.01,
					labelType: "percent",
					legend: {
						margin: {
							top: 5,
							right: 35,
							bottom: 5,
							left: 0
						}
					}
				}
			};

			// data demo
			// $scope.data = [
			// 	["One", 5], ["Two", 2], ["Three", 9],
			// 	["Four", 7], ["Five", 4], ["Six", 3]
			// ];

			$scope.data = [];
			
			$scope.$watch('ngChartData', function (newVal) {
				$scope.data = newVal;
				$scope.api.refresh();
			}, true);


		}
	}
});