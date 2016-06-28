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