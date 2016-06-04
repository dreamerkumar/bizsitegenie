'use strict';

// Itemroles controller
angular.module('itemroles').controller('ItemrolesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Itemroles',
	function($scope, $stateParams, $location, Authentication, Itemroles) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		$scope.onSuccessfulUploadInCreateMode = function(propertyName, fileName, fileKey) {
			$scope[propertyName] = fileName;
			$scope[propertyName + "_fileKey"] = fileKey;
		};

		$scope.onSuccessfulUploadInEditMode = function(propertyName, fileName, fileKey) {
			$scope.itemroles[propertyName] = fileName;
			$scope.itemroles[propertyName + "_fileKey"] = fileKey;
		};

		// Create new Itemrole
		$scope.create = function() {
			// Create new Itemrole object
			var itemroles = new Itemroles ({
					
				
					parentId: this.parentId,	
				
					accesstype: this.accesstype,	
				
					role: this.role,	
				
			});

			// Redirect after save
			itemroles.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/itemroles/' + response._id);

				// Clear form fields
				
				$scope.parentId = '';
				
				$scope.accesstype = '';
				
				$scope.role = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Itemrole
		$scope.remove = function(itemroles) {
			if ( itemroles ) { 
				itemroles.$remove();

				for (var i in $scope.itemroles) {
					if ($scope.itemroles [i] === itemroles) {
						$scope.itemroles.splice(i, 1);
					}
				}
			} else {
				$scope.itemroles.$remove(function() {
					$location.path($scope.parentRouteUrl + '/itemroles');
				});
			}
		};

		// Update existing Itemrole
		$scope.update = function() {
			var itemroles = $scope.itemroles;

			itemroles.$update(function() {
				$location.path($scope.parentRouteUrl + '/itemroles/' + itemroles._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Itemroles
		$scope.find = function() {
			$scope.itemroles = Itemroles.query();
		};

		// Find existing Itemrole
		$scope.findOne = function() {
			$scope.itemroles = Itemroles.get({ 
				itemrolesId: $stateParams.itemrolesId
			});
		};
	}
]);