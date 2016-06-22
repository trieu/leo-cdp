webApp.factory('monitor', function($http) {
	return {
		_inventory_paytv : function(begin, end){
			return $http.get('/monitor/api/inventory/paytv?begin='+begin+'&end='+end);
		}
	}
});

webApp.controller('monitorInventoryPayTvCtrl', function($scope, monitor) {
	$scope.items = new Array();
	$scope.sum = new Array();

	$scope.end = new moment().format("YYYY-MM-DD");
	$scope.begin = new moment().subtract(30, 'days').format("YYYY-MM-DD");

	$scope.$emit("title-page", "Inventory PayTV Report");

	function render(begin, end){

		var chartData
		//chart data
		monitor._inventory_paytv(begin, end)
		.success(function(data){
			var items = data.Root.item;
			var chartTotal = new Array();
			for(var i in items){
				
				for(var j in items[i]){

					var chartData = new Array();
					if (j == "ListView") {
						var list = items[i][j];
						var countView = 0;
						for (var k in list) {
							chartData.push([list[k].Category , list[k].ToltalView])
							countView += parseInt(list[k].ToltalView);
						}
					}

				}
				//insert total chart
				chartTotal.push([items[i].TypeName, countView]);

				$scope.items.push({TypeName: items[i].TypeName, chartData: chartData});
			};

			$scope.items.push({TypeName: "Tổng lượt xem", chartData: chartTotal});
			
			$scope.sum.push(chartTotal);
		});
	}

	render($scope.begin, $scope.end);

	$scope.submit = function(){
		$scope.$watchGroup(['begin', 'end'], 
		function (newVal){
			render(newVal[0], newVal[1]);
		},true);
	};

});

