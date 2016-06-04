'use strict';

angular.module('items').controller('ItemUploadSpreadsheetController', function($scope, $stateParams, $timeout, $location, Authentication, Itemspreadsheet) {
		$scope.authentication = Authentication;

		$scope.showCurrentList = function(){
			Itemspreadsheet.search({searchKeys: 'parentId', searchValue: $stateParams.itemId}).$promise.then(function(response) {
				$scope.currentlyUploadedSpreadsheets = response;
		    }, function(error){
		    	console.error('Existing spreadsheet list could not be retrieved retrieved', error);
		    });
		};

		$scope.showCurrentList();

		$scope.onSuccessfulUploadOfSpreadsheet = function(unusedParam, fileName, fileKey){
			console.log('Successfully uploaded', fileName);
			console.log('FileKey is ', fileKey );

			var itemspreadsheet = new Itemspreadsheet ({
					fileName: fileName,	
					fileKey: fileKey,	
					parentId: $stateParams.itemId,	
					status: 'uploaded'
			});

			// Redirect after save
			itemspreadsheet.$save(function(response) {
				console.log('Spreadsheet successfully uploaded');
				$scope.showCurrentList();
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				console.error(errorResponse.data.message);
			});
		};
	}
);