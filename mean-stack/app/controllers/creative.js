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
	$scope.chart = new Array();
	//////////////////
	$scope.sTotalPv = 0;
	$scope.sTotalImp = 0;
	$scope.sTotalTrv = 0;
	$scope.sTotalClick = 0;

	creative._test()
	.success(function(data){
		$scope.$emit("title-page", "Summary Report");

		for(var i in data){
			var date = new moment(data[i].period).format("YYYY-MM-DD");
			data[i].period = date;
			$scope.sTotalPv += data[i].totalPv;
			$scope.sTotalImp += data[i].totalImp;
			$scope.sTotalTrv += data[i].totalTrv;
			$scope.sTotalClick += data[i].totalClick;
		}

		for(var i in data){
			$scope.chart.push([data[i].period, data[i].totalPv]);
		};


	});

});

