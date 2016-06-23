webApp.controller('creativeListCtrl', function($scope, creative) {
	$scope.items = {};

	creative._list()
	.success(function(data){
		$scope.$emit("title-page", "Creative List");

		$scope.items = data;
	});

});

webApp.controller('creativeSummaryCtrl', function($scope, creative) {

	$scope.end = new moment().format("YYYY-MM-DD");
	$scope.begin = new moment().subtract(30, 'days').format("YYYY-MM-DD");

	$scope.$emit("title-page", "Summary Report");

	function initialize(){
		//sum
		$scope.sumTotalPv = 0;
		$scope.sumTotalImp = 0;
		$scope.sumTotalTrv = 0;
		$scope.sumTotalClick = 0;

		//chart data
		$scope.chartPv = new Array();
		$scope.chartImp = new Array();
		$scope.chartTrv = new Array();
		$scope.chartClick = new Array();
	}

	function render(begin, end){

		initialize();

		//chart data
		creative._summary(begin, end)
		.success(function(data){

			for(var i in data){
				// var date = new moment(data[i].period).format("YYYY-MM-DD");
				// data[i].period = date;
				$scope.sumTotalPv += data[i].totalPv;
				$scope.sumTotalImp += data[i].totalImp;
				$scope.sumTotalTrv += data[i].totalTrv;
				$scope.sumTotalClick += data[i].totalClick;
			}

			for(var i in data){
				$scope.chartPv.push([data[i].period, data[i].totalPv]);
				$scope.chartImp.push([data[i].period, data[i].totalImp]);
				$scope.chartTrv.push([data[i].period, data[i].totalTrv]);
				$scope.chartClick.push([data[i].period, data[i].totalClick]);
			};
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