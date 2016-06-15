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

	creative._list()
	.success(function(data){
		$scope.$emit("title-page", "Summary Report");

		$scope.items = data;
	});

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
		restrict: 'AE',
		scope: {
			ngTitle: '@',
			ngChart : '@'
		},
		template: `
			<div class="tile">
				<h2 class="tile-title">{{ngTitle}}</h2>
				<div class="p-10">
					<nvd3 options="options" data="data"></nvd3>
				</div>
			</div>
		`,
		link: function ($scope, element, attributes) {
			var obj = [{ "period": 1463331600000, "totalPv": 1326939, "totalImp": 217239, "totalTrv": 139343, "totalClick": 2676 }, { "period": 1462899600000, "totalPv": 1434170, "totalImp": 311467, "totalTrv": 152870, "totalClick": 7994 }, { "period": 1463763600000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1464627600000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1465059600000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1464195600000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1464714000000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1465146000000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1463418000000, "totalPv": 566508, "totalImp": 127354, "totalTrv": 84874, "totalClick": 1278 }, { "period": 1462986000000, "totalPv": 1388998, "totalImp": 396943, "totalTrv": 183333, "totalClick": 10668 }, { "period": 1463850000000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1464282000000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1464454800000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1463158800000, "totalPv": 1538944, "totalImp": 263153, "totalTrv": 174349, "totalClick": 5239 }, { "period": 1462726800000, "totalPv": 1381192, "totalImp": 90692, "totalTrv": 55891, "totalClick": 1995 }, { "period": 1463590800000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1464022800000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1464886800000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1464973200000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1463245200000, "totalPv": 1735514, "totalImp": 235861, "totalTrv": 131437, "totalClick": 2785 }, { "period": 1463677200000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1464109200000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1464541200000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1462813200000, "totalPv": 1222089, "totalImp": 147189, "totalTrv": 125637, "totalClick": 3234 }, { "period": 1463504400000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1463936400000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1464368400000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1463072400000, "totalPv": 1411530, "totalImp": 281331, "totalTrv": 174928, "totalClick": 6015 }, { "period": 1462640400000, "totalPv": 1580133, "totalImp": 83717, "totalTrv": 43958, "totalClick": 1967 }, { "period": 1464800400000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }, { "period": 1465232400000, "totalPv": 0, "totalImp": 0, "totalTrv": 0, "totalClick": 0 }];
		    var base = [];
		    for (var i = 0; i < obj.length ; i++) {
		      base.push([obj[i].period, obj[i].totalPv]);
		    };

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
	                    rotateLabels: 30,
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
	                zoom: {
	                    enabled: true,
	                    scaleExtent: [1, 10],
	                    useFixedDomain: false,
	                    useNiceScale: false,
	                    horizontalOff: false,
	                    verticalOff: true,
	                    unzoomEventType: 'dblclick.zoom'
	                },
	                color: function(d, i) { return "rgba(255,255,255,0.5)"; }
	            }
	        };

        	$scope.data = [
            {
                "key" : "Quantity" ,
                "bar": true,
                "values" : base
            }];

		}
	}
});