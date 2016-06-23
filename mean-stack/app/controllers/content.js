webApp.controller('monitorContentCtrl', function($scope, monitor) {
	$scope.items = [];

	$scope.end = new moment().format("YYYY-MM-DD");
	$scope.begin = new moment().subtract(30, 'days').format("YYYY-MM-DD");

	$scope.$emit("title-page", "Most viewed content's categories from FptPlay.net");

	function render(begin, end){

		var chartData;
		//chart data
		monitor._content(begin, end)
		.success(function(data){
			for (var i in data) {
				$scope.items.push( [data[i].label, parseInt(data[i].value)] )
			}
		});
	}

	render($scope.begin, $scope.end);

});

