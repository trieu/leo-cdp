webApp.directive('datePick', function(){
	return{
		restrict: 'E',
		scope: {
			ngModel: '=',
			ngDateMin: '@',
			ngDateMax: '@'
		},
		require: 'ngModel',
		template: '<div class="input-icon date-only">'+
                    '<input type="text" class="form-control input-sm" ng-model="ngModel" />'+
                    '<span class="add-on">'+
                        '<span class="sa-plus"></span>'+
                    '</span>'+
                '</div>'
				   ,
		link: function ($scope, element, attributes) {

			element.find("input:text").datetimepicker({
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