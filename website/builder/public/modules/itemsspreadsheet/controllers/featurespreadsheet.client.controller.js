'use strict';

// Itemspreadsheets controller
angular.module('itemspreadsheet').controller('ItemspreadsheetController', ['$scope', '$stateParams', '$location', 'Authentication', 'Itemspreadsheet',
	function($scope, $stateParams, $location, Authentication, Itemspreadsheet) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		$scope.onSuccessfulUploadInCreateMode = function(propertyName, fileName, fileKey) {
			$scope[propertyName] = fileName;
			$scope[propertyName + "_fileKey"] = fileKey;
		};

		$scope.onSuccessfulUploadInEditMode = function(propertyName, fileName, fileKey) {
			$scope.itemspreadsheet[propertyName] = fileName;
			$scope.itemspreadsheet[propertyName + "_fileKey"] = fileKey;
		};

		// Create new Itemspreadsheet
		$scope.create = function() {
			// Create new Itemspreadsheet object
			var itemspreadsheet = new Itemspreadsheet ({
					
				
					fileName: this.fileName,	
				
					fileKey: this.fileKey,	
				
					parentId: this.parentId,	
				
					status: this.status,	
				
					updated: this.updated,	
				
			});

			// Redirect after save
			itemspreadsheet.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/itemspreadsheet/' + response._id);

				// Clear form fields
				
				$scope.fileName = '';
				
				$scope.fileKey = '';
				
				$scope.parentId = '';
				
				$scope.status = '';
				
				$scope.updated = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Itemspreadsheet
		$scope.remove = function(itemspreadsheet) {
			if ( itemspreadsheet ) { 
				itemspreadsheet.$remove();

				for (var i in $scope.itemspreadsheet) {
					if ($scope.itemspreadsheet [i] === itemspreadsheet) {
						$scope.itemspreadsheet.splice(i, 1);
					}
				}
			} else {
				$scope.itemspreadsheet.$remove(function() {
					$location.path($scope.parentRouteUrl + '/itemspreadsheet');
				});
			}
		};

		// Update existing Itemspreadsheet
		$scope.update = function() {
			var itemspreadsheet = $scope.itemspreadsheet;

			itemspreadsheet.$update(function() {
				$location.path($scope.parentRouteUrl + '/itemspreadsheet/' + itemspreadsheet._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Itemspreadsheets
		$scope.find = function() {
			$scope.itemspreadsheet = Itemspreadsheet.query();
		};

		// Find existing Itemspreadsheet
		$scope.findOne = function() {
			$scope.itemspreadsheet = Itemspreadsheet.get({ 
				itemspreadsheetId: $stateParams.itemspreadsheetId
			});
		};
	}
]);