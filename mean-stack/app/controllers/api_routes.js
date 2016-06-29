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
			return $http.get('/api/summary/creative?begin='+begin+'&end='+end);
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