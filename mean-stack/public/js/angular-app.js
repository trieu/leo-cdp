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
	.when('/creative/summary',{
		templateUrl: 'app/views/creative/summary.html'
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
				console.log(data);
				element.text(data || 'Ads Play');
			});
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
		_test : function(begin, end){
			return $http.get('https://api.adsplay.net/api/adstats?begin='+begin+'&end='+end);
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
	initialize();

	function render(begin, end){
		initialize();
		//chart data
		creative._test(begin, end)
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
	}

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
webApp.directive('datePick', function(){
	return{
		restrict: 'E',
		scope: {
			ngModel: '=',
			ngDateMin: '@',
			ngDateMax: '@'
		},
		require: 'ngModel',
		template: `<div class='input-icon date-only'>
                    <input type='text' class="form-control input-sm" ng-model="ngModel" />
                    <span class="add-on">
                        <span class="sa-plus"></span>
                    </span>
                </div>`
				   ,
		link: function ($scope, element, attributes) {

			element.find("input").datetimepicker({
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