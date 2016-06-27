webApp.directive('uploadFile', function(){
	return{
		restrict: 'E',
		template: '\
					<div class="fileupload fileupload-new" data-provides="fileupload"> \
                        <span class="btn btn-file btn-sm btn-alt"> \
                            <span class="fileupload-new">Select file</span> \
                            <span class="fileupload-exists">Change</span> \
                            <input type="file" /> \
                        </span> \
                        <span class="fileupload-preview"></span> \
                        <a href="#" class="close close-pic fileupload-exists" data-dismiss="fileupload"> \
                            <i class="fa fa-times"></i> \
                        </a> \
                    </div> \
				   ',
		link: function ($scope, element, attributes) {
            element.find("input").bind("change", function(changeEvent) {                        
                if (typeof(changeEvent.target.files[0]) === 'object') {
                    $scope[attributes.ngModel] = changeEvent.target.files[0];
                };
            });
		}
	}
});