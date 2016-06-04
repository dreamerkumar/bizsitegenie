'use strict';

// Roles controller
angular.module('roles').controller('RolesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Roles',
	function($scope, $stateParams, $location, Authentication, Roles) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		// Create new Role
		$scope.create = function() {
			// Create new Role object
			var role = new Roles ({
					
				
					name: this.name,
				
			});

			// Redirect after save
			role.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/roles/' + response._id);

				// Clear form fields
				
				$scope.name = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Role
		$scope.remove = function(role) {
			if ( role ) { 
				role.$remove();

				for (var i in $scope.roles) {
					if ($scope.roles [i] === role) {
						$scope.roles.splice(i, 1);
					}
				}
			} else {
				$scope.role.$remove(function() {
					$location.path($scope.parentRouteUrl + '/roles');
				});
			}
		};

		// Update existing Role
		$scope.update = function() {
			var role = $scope.role;

			role.$update(function() {
				$location.path($scope.parentRouteUrl + '/roles/' + role._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Roles
		$scope.find = function() {
			$scope.roles = Roles.query();
		};

		// Find existing Role
		$scope.findOne = function() {
			$scope.role = Roles.get({ 
				roleId: $stateParams.roleId
			});
		};
	}
]);