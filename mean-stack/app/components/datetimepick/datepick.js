webApp.directive('datePick', function(){
	return{
		restrict: 'E',
		scope: {
			ngDateValue: '@',
			ngDateMin: '@',
			ngDateMax: '@'
		},
		template: `<div class='input-icon date-only'>
                    <input type='text' class="form-control input-sm" />
                    <span class="add-on">
                        <span class="sa-plus"></span>
                    </span>
                </div>`
				   ,
		link: function ($scope, element, attributes) {

			element.find("input").datetimepicker({
				format: 'YYYY-MM-DD',
				defaultDate: $scope.ngDateValue
			});

			element.find("input").on("dp.change", function (e) {
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