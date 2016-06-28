'use strict';
var webApp = angular.module('webApp',['ngRoute', 'ngCookies', 'nvd3', 'ngProgressLite']);

webApp.config(function($routeProvider, $locationProvider){
	$routeProvider
	.when('/',{
		templateUrl: 'app/views/home.html'
	})
	.when('/login',{
		templateUrl: 'app/views/login.html'
	})
	.when('/creative',{
		templateUrl: 'app/views/creative/list.html'
	})
	.when('/creative/read/:id',{
		templateUrl: 'app/views/creative/read.html'
	})
	.when('/creative/edit/:id',{
		templateUrl: 'app/views/creative/edit.html'
	})
	.when('/creative/new',{
		templateUrl: function(params){
			var url = 'app/views/creative/';
			if (params.type == "video") {
				url = url + params.type + '.html';
			}
			else{
				url = url + 'new.html';
			}
			return url;
		}
	})
	.when('/creative/summary',{
		templateUrl: 'app/views/creative/summary.html'
	})
	.when('/inventory/paytv',{
		templateUrl: 'app/views/inventory/paytv.html'
	})
	.when('/inventory/fptplay',{
		templateUrl: 'app/views/fault.html'
	})
	.when('/monitor/content',{
		templateUrl: 'app/views/monitor/content.html'
	})
	.when('/fault',{
		templateUrl: 'app/views/fault.html'
	})
	.when('/404',{
		templateUrl: 'app/views/404.html'
	})
	.otherwise({redirectTo: '/404'});
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
});

webApp.directive("titlePage", function($http, $rootScope){
	return{
		restrict: 'A',
		link: function(scope, element, attrs){
			scope.$on('title-page', function (event, data) {
				//console.log(data);
				element.text(data || 'Ads Play');
			});
		}
	}
});
webApp.factory('auth', function($http) {
	return {
		_signup : function(data) {
			return $http.post('/signup', data);
		},
		_login : function(data) {
			return $http.post('/login', data);
		},
		_logout : function() {
			return $http.get('/logout');
		},
		_loggedin : function() {
			return $http.get('/loggedin');
		}
	}
});

webApp.factory('creative', function($http) {
	return {
		_list : function() {
			return $http.get('/api/creative/');
		},
		_read : function(id) {
			return $http.get('/api/creative/' + id);
		},
		_update : function(id, data) {
			return $http.put('/api/creative/' + id, data);
		},
		_delete : function(id) {
			return $http.delete('/api/creative/' + id);
		},
		_summary : function(begin, end){
			return $http.get('/api/creative/summary?begin='+begin+'&end='+end);
		}
	}
});

webApp.factory('inventory', function($http) {
	return {
		_paytv : function(begin, end){
			return $http.get('/api/inventory/paytv?begin='+begin+'&end='+end);
		}
	}
});

webApp.factory('monitor', function($http) {
	return {
		_content : function(begin, end){
			return $http.get('/api/monitor/content?begin='+begin+'&end='+end);
		}
	}
});
//when application run
webApp.run(function($rootScope, auth, $cookies, ngProgressLite, $location){

	$rootScope.isUser = function(id){
		if (!_null($rootScope.user)) {
			if($rootScope.user.id == id)
				return true;
		}
		return false;
	};

	$rootScope.checkauth = function(data){
		//login (false) => data.self == false , (true) data.self = user data json
		if(data.self == false){
			$rootScope.isAuth = false;
		}
		else{
			$rootScope.isAuth = true;
			$rootScope.user = data.self;
			$location.path(back_url);
		}
	};

	var back_url = ($location.path() == '/login') ? '/' : $location.path();
	//run check once logged in
	auth._loggedin().success(function(data){
		$rootScope.checkauth(data);
	}).error(function(){
		$location.path('/login');
	});

	//when router start
	$rootScope.$on('$routeChangeStart', function(event, current, previous) {
		ngProgressLite.start();
	});

	//when router end
	$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
		ngProgressLite.done();
	});

});

// handle all authentication
webApp.controller('loginCtrl', function($scope, auth, $location) {
	$scope.login = function(){
		auth._login({username: $scope.username, password: $scope.password})
		.success(function(data){
			$scope.checkauth(data);
		}).error(function(){alert('Tài khoản hoặc mật khẩu không đúng')});
	};

});

/* example tag: <a logout> link name </a> */
webApp.directive('logout', function($rootScope, auth, $location){
	return{
		restrict: 'A',
		link: function($scope, element, attributes){
			element.on('click', function(){
				auth._logout();
				$rootScope.isAuth = false;
				$rootScope.user = null;
				$location.path('/login');
			});
		}
	};
});


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

webApp.controller('creativeNewVideoCtrl', function($scope, creative) {
	$scope.items = {};
	$scope.file = null;
	$scope.submit = function(){
		console.log($scope.items)
	};

});

webApp.controller('creativeEditCtrl', function($scope, creative, $routeParams) {

	$scope.items = {};
	console.log($routeParams.id)
	creative._read($routeParams.id)
	.success(function(data){
		console.log(data)
		for (var i in data){

			if (i == 'runDateL' || i == 'expDateL') {
				console.log(i)
				data[i] = moment(data[i]).format('DD-MM-YYYY');
			}
			
		}
		console.log(data);
		$scope.items = data;
	});

	$scope.submit = function(){
		console.log($scope.items)
	};

});
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



webApp.directive('headerPartial', function(){
	return{
		restrict: 'E',
		templateUrl: 'app/views/partials/header.html'
	}
});

webApp.directive('sidebarPartial', function(){
	return{
		restrict: 'E',
		templateUrl: 'app/views/partials/sidebar.html'
	}
});

webApp.directive('notificationsPartial', function(){
	return{
		restrict: 'E',
		templateUrl: 'app/views/partials/notifications.html'
	}
});

webApp.directive('breadcrumbPartial', function(){
	return{
		restrict: 'E',
		templateUrl: 'app/views/partials/breadcrumb.html'
	}
});

webApp.directive('messagesPartial', function(){
	return{
		restrict: 'E',
		templateUrl: 'app/views/partials/messages.html'
	}
});
webApp.directive('historicalBarChart', function(){
	return{
		restrict: 'E',
		scope: {
			ngTitle: '@',
			ngChartData : '=ngModel'
		},
		template: '\
					<div class="tile"> \
						<h2 class="tile-title">{{ngTitle}}</h2> \
						<div class="p-10"> \
							<nvd3 options="options" data="data" api="api" config="{refreshDataOnly: true, deepWatchDataDepth: 0}"></nvd3> \
						</div> \
					</div> \
				',
		link: function ($scope, element, attributes) {

			$scope.options = {
				chart: {
					type: 'historicalBarChart',
					height: 450,
					margin : {
						top: 20,
						right: 40,
						bottom: 65,
						left: 80
					},
					x: function(d){return d[0];},
					y: function(d){return d3.format("8")(d[1]);},
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
							return d3.format(',.0f')(d);
						}
					},
					tooltip: {
						keyFormatter: function(d) {
							return d3.time.format('%x')(new Date(d));
						}
					},
					color: function(d, i) { return "rgba(255,255,255,0.6)"; },
					clipEdge: true,
					padData: true
				}
			};

			// data demo
			// $scope.data = [
			// 	[ 1288497600000 , 1331875.0], [ 1293771600000 , 1154695.0] ,
			// 	[ 1298869200000 , 1194025.0], [ 1304136000000 , 1194025.0] ,
			// 	[ 1309406400000 , 475000.0], [ 1314763200000 , 1244525.0] ,
			// 	[ 1320033600000 , 1194025.0], [ 1325307600000 , 475000.0]
			// ];

			$scope.data = [{
				"bar": true,
				"values" : []
			}];

			$scope.$watch('ngChartData', function (newVal, oldVal) {
				if (newVal != oldVal) {

					$scope.data = [{
						"bar": true,
						"values" : newVal
					}];

					$scope.api.refresh();
				}
			}, true);


		}
	}
});
webApp.directive('pieChart', function(){
	return{
		restrict: 'E',
		scope: {
			ngTitle: '@',
			ngChartData : '=ngModel'
		},
		template: '\
					<div class="tile"> \
						<h2 class="tile-title">{{ngTitle}}</h2> \
						<div class="p-10"> \
							<nvd3 options="options" data="data" api="api" config="{refreshDataOnly: true, deepWatchDataDepth: 0}"></nvd3> \
						</div> \
					</div> \
				',
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
webApp.directive('checkbox', function(){
	return{
		restrict: 'A',
        scope: {
            ngModel: '=',
        },
		link: function ($scope, element, attributes) {
            $scope.$watch('ngModel', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    element.find('input[type="checkbox"]').each(function(i){
                        if (newVal[i] == $(this).val()) {
                            $(this).prop('checked', true);
                        }
                    });
                }
            }, true);
		}
	}
});
webApp.directive('datePick', function(){
	return{
		restrict: 'E',
		scope: {
			ngModel: '=',
			ngDateMin: '@',
			ngDateMax: '@'
		},
		require: 'ngModel',
		template: '\
					<div class="input-icon date-only"> \
	                    <input type="text" class="form-control input-sm" ng-model="ngModel" /> \
	                    <span class="add-on"> \
	                        <span class="sa-plus"></span> \
	                    </span> \
	                </div> \
				   ',
		link: function ($scope, element, attributes) {

			element.find("input:text").datetimepicker({
				format: 'YYYY-MM-DD',
				defaultDate: $scope.ngModel
			});

			element.find("input").on("dp.change", function (e) {
				// //set value of ngModel
				 $scope.ngModel = $(this).val();

				if ( typeof($scope.ngDateMin) !== "undefined" && $scope.ngDateMin !== null ) {
					$($scope.ngDateMin+" input").data("DateTimePicker").maxDate(e.date);
				}
				if ( typeof($scope.ngDateMax) !== "undefined" && $scope.ngDateMax !== null ) {
					$($scope.ngDateMax+" input").data("DateTimePicker").minDate(e.date);
				}
				
			});

			
		}
	}
});
webApp.directive('uploadFile', function(){
	return{
		restrict: 'E',
		template: '\
					<div class="fileupload fileupload-new" data-provides="fileupload"> \
                        <span class="btn btn-file btn-sm btn-alt"> \
                            <span class="fileupload-new">Select file</span> \
                            <span class="fileupload-exists">Change</span> \
                            <input type="file" /> \
                        </span> \
                        <span class="fileupload-preview"></span> \
                        <a href="#" class="close close-pic fileupload-exists" data-dismiss="fileupload"> \
                            <i class="fa fa-times"></i> \
                        </a> \
                    </div> \
				   ',
		link: function ($scope, element, attributes) {
            element.find("input").bind("change", function(changeEvent) {                        
                if (typeof(changeEvent.target.files[0]) === 'object') {
                    $scope[attributes.ngModel] = changeEvent.target.files[0];
                };
            });
		}
	}
});