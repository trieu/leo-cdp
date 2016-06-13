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
	.otherwise({redirectTo: '/'});
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
});

webApp.run(function($rootScope, $cookies, $http, ngProgressLite, $location){

	$rootScope.isUser = function(id){
		if (!_null($rootScope.user)) {
			if($rootScope.user.id == id)
				return true;
		}
		return false;
	};

	$rootScope.checkAuth = function(data){
		//login (false) => data.self == false , (true) data.self = user data json
		if(data.self == false){
			$rootScope.isAuth = false;
		}
		else{
			$rootScope.isAuth = true;
			$rootScope.user = data.self;
		}
	};

	//run check once logged in
	$http.get('/loggedin').success(function(data){
		$rootScope.checkAuth(data);
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