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

