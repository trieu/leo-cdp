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
	
	$scope.$emit("title-page", "Creative List");

	creative._list()
	.success(function(data){
		$scope.items = data;
		console.log(data)
	});

});