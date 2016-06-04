'use strict';

angular.module('shared-components').directive('bsgImageViewer', function ($http) {

    return {
        restrict: 'E',
        scope: {
            fileKey: '@',
            fileName: '@',
            width: '@'
        },
        templateUrl: 'shared/public/modules/shared-components/views/bsg-image-viewer.shared-components.directive.view.html',

        link: function(scope, element, attrs){
        	scope.$watch('fileKey', function(val){
        		if(!val) return;
	        	$http.get('/get-signed-url-for-image',{
	        		params: {fileKey: scope.fileKey, width: scope.width}
	        	}).success(function(result){
	        		scope.url = scope.width && result.resizedUrl? result.resizedUrl : result.url;
                    scope.fullSizeUrl = result.url;
	            })
	            .error(function(error) {
	                console.error('Error occured during the metadata setup for viewing the image file', error);
	            });
	        });
        }
    };
});