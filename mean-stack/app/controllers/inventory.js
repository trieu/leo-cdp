webApp.controller('inventoryPayTvCtrl', function($scope, inventory) {

	$scope.end = new moment().format("YYYY-MM-DD");
	$scope.begin = new moment().subtract(30, 'days').format("YYYY-MM-DD");

	$scope.$emit("title-page", "Inventory PayTV Report");

	function render(begin, end){

		var chartData;
		//chart data
		inventory._paytv(begin, end)
		.success(function(data){
			$scope.items = new Array();
			$scope.totalData = new Array();

			var chartTotal = new Array();
			var items = data.Root.item;
			
			//loop chart (render placement #paytvChart)
			for(var i in items){
				
				for(var j in items[i]){

					var chartData = new Array();
					if (j == "ListView") {
						var list = items[i][j];
						var countView = 0;
						for (var k in list) {
							chartData.push([list[k].Category, list[k].ToltalView])
							countView += parseInt(list[k].ToltalView);
						}
					}

				}
				//insert total chart
				chartTotal.push([items[i].TypeName, countView, items[i].TypeID]);

				$scope.items.push({TypeName: items[i].TypeName, chartData: chartData});
			};

			$scope.items.push({TypeName: "Tổng lượt xem", chartData: chartTotal});
			
			//loop total view (render placement #paytvTotalView)
			if(chartTotal.length > 0){
				var countTotalView = 0;
				for(var i in chartTotal){
					if(chartTotal[i][2] == 1){
                        $scope.totalData.push({TypeName: "Total View Film", totalView: chartTotal[i][1]});
                    }
                    else if(chartTotal[i][2] == 2){
                        $scope.totalData.push({TypeName: "Total View Children", totalView: chartTotal[i][1]});
                    }
                    else if(chartTotal[i][2] == 3){
                        $scope.totalData.push({TypeName: "Total View Entertainment", totalView: chartTotal[i][1]});
                    }
                    countTotalView += chartTotal[i][1];
				}
				$scope.totalData.push({TypeName: "Total View", totalView: countTotalView});

			}
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

