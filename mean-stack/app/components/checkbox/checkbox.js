// webApp.directive('checkbox', function(){
// 	return{
// 		restrict: 'E',
//         scope: {
//             name: '=',
//             ngDateMin: '@',
//             ngDateMax: '@'
//         },
// 		template: '\
// 					<label class="box-checkbox"> \
//                     <input type="checkbox" ng-model="items.name" value="1" name="tgpfs" /> \
//                     <span></span> \
//                     {{Web (PC,Laptop)}} \
//                 </label> \
// 				   ',
// 		link: function ($scope, element, attributes) {
//             element.find("input").bind("change", function(changeEvent) {                        
//                 if (typeof(changeEvent.target.files[0]) === 'object') {
//                     $scope[attributes.ngModel] = changeEvent.target.files[0];
//                 };
//             });
// 		}
// 	}
// });