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
		Auth._login({username: $scope.username, password: $scope.password})
		.success(function(data){
			$scope.checkAuth(data);
			$location.path('/');
		}).error(function(){alert('Tài khoản hoặc mật khẩu không đúng')});
	};

});

