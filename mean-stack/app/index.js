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