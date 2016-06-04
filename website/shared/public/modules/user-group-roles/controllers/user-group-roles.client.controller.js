'use strict';

// User group roles controller
angular.module('user-group-roles').controller('UserGroupRolesController', ['$scope', '$stateParams', '$location', 'Authentication', 'UserGroupRoles',
	function($scope, $stateParams, $location, Authentication, UserGroupRoles) {
		$scope.authentication = Authentication;
		$scope.parentId = $stateParams.userGroupId;
		$scope.parentRouteUrl = '/user-groups/' + $stateParams.userGroupId + '';

		// Create new User group role
		$scope.create = function() {
			// Create new User group role object
			var userGroupRole = new UserGroupRoles ({
					parentId: $scope.parentId,
				
					roleId: this.roleId,
				
			});

			// Redirect after save
			userGroupRole.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/user-group-roles/' + response._id);

				// Clear form fields
				
				$scope.roleId = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing User group role
		$scope.remove = function(userGroupRole) {
			if ( userGroupRole ) { 
				userGroupRole.$remove();

				for (var i in $scope.userGroupRoles) {
					if ($scope.userGroupRoles [i] === userGroupRole) {
						$scope.userGroupRoles.splice(i, 1);
					}
				}
			} else {
				$scope.userGroupRole.$remove(function() {
					$location.path($scope.parentRouteUrl + '/user-group-roles');
				});
			}
		};

		// Update existing User group role
		$scope.update = function() {
			var userGroupRole = $scope.userGroupRole;

			userGroupRole.$update(function() {
				$location.path($scope.parentRouteUrl + '/user-group-roles/' + userGroupRole._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of User group roles
		$scope.find = function() {
			$scope.userGroupRoles = UserGroupRoles.queryForParentId({parentId: $scope.parentId});
		};

		// Find existing User group role
		$scope.findOne = function() {
			$scope.userGroupRole = UserGroupRoles.get({ 
				userGroupRoleId: $stateParams.userGroupRoleId
			});
		};
	}
]);