webApp.factory('creative', function($http) {
	return {
		_list : function() {
			return $http.get('/creative/api/');
		},
		_read : function(id) {
			return $http.get('/creative/api/' + id);
		},
		_update : function(id, data) {
			return $http.put('/creative/api/' + id, data);
		},
		_delete : function(id) {
			return $http.delete('/creative/api/' + id);
		},
		_test : function(){
			return $http.get('https://api.adsplay.net/api/adstats?begin=2016-05-17&end=2016-06-16');
		}
	}
});

webApp.controller('creativeListCtrl', function($scope, creative) {
	$scope.items = {};

	creative._list()
	.success(function(data){
		$scope.$emit("title-page", "Creative List");

		$scope.items = data;
	});

});

webApp.controller('creativeSummaryCtrl', function($scope, creative) {
	$scope.items = {};

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

	creative._test()
	.success(function(data){
		$scope.$emit("title-page", "Summary Report");

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

});

