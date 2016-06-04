'use strict';

// User group users controller
angular.module('user-group-users').controller('UserGroupUsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'UserGroupUsers',
	function($scope, $stateParams, $location, Authentication, UserGroupUsers) {
		$scope.authentication = Authentication;
		$scope.parentId = $stateParams.userGroupId;
		$scope.parentRouteUrl = '/user-groups/' + $stateParams.userGroupId + '';

		// Create new User group user
		$scope.create = function() {
			// Create new User group user object
			var userGroupUser = new UserGroupUsers ({
					parentId: $scope.parentId,
				
					userId: this.userId,
				
			});

			// Redirect after save
			userGroupUser.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/user-group-users/' + response._id);

				// Clear form fields
				
				$scope.userId = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing User group user
		$scope.remove = function(userGroupUser) {
			if ( userGroupUser ) { 
				userGroupUser.$remove();

				for (var i in $scope.userGroupUsers) {
					if ($scope.userGroupUsers [i] === userGroupUser) {
						$scope.userGroupUsers.splice(i, 1);
					}
				}
			} else {
				$scope.userGroupUser.$remove(function() {
					$location.path($scope.parentRouteUrl + '/user-group-users');
				});
			}
		};

		// Update existing User group user
		$scope.update = function() {
			var userGroupUser = $scope.userGroupUser;

			userGroupUser.$update(function() {
				$location.path($scope.parentRouteUrl + '/user-group-users/' + userGroupUser._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of User group users
		$scope.find = function() {
			$scope.userGroupUsers = UserGroupUsers.queryForParentId({parentId: $scope.parentId});
		};

		// Find existing User group user
		$scope.findOne = function() {
			$scope.userGroupUser = UserGroupUsers.get({ 
				userGroupUserId: $stateParams.userGroupUserId
			});
		};
	}
]);