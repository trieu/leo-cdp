webApp.factory('Auth', function($http) {
	return {
		_signup : function(data) {
			return $http.post('/signup', data);
		},
		_login : function(data) {
			return $http.post('/login', data);
		},
		_logout : function() {
			return $http.post('/logout');
		}
	}
});

webApp.controller('loginCtrl', function($scope, Auth, $location) {
	$scope.login = function(){
		Auth._login({username: $scope.username, password: $scope.password}).success(function(data){
			$scope.checkAuth(data);
			$location.path('/');
		}).error(function(){alert('Tài khoản hoặc mật khẩu không đúng')});
	};

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
		//login (false) => data.message == false , (true) data.message = user data json
		if(data.message == false){
			$rootScope.isAuth = false;
			$location.path('/login');
		}
		else{
			$rootScope.isAuth = true;
			$rootScope.user = data.message;
		}
	};

	//run check once logged in
	$http.get('/loggedin').success(function(data){
		$rootScope.checkAuth(data);
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