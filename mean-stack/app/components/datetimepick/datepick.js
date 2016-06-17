webApp.directive('datePick', function(){
	return{
		restrict: 'E',
		scope: {
			ngTitle: '@',
		},
		template: '<div class="input-icon datetime-pick date-only">'+
					'<input data-format="dd/MM/yyyy" type="text" class="form-control input-sm" />'+
					'<span class="add-on">'+
					'<i class="sa-plus"></i>'+
					'</span>'+
				   '</div>',
		link: function ($scope, element, attributes) {
			var that = element.find('.date-only');

			element.datetimepicker({
				pickTime: false
			});

			element.find('input:text').on('click', function(){
	            $(this).closest('.datetime-pick').find('.add-on i').click();
			});
		}
	}
});