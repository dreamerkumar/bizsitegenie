'use strict';

// User groups controller
angular.module('user-groups').controller('UserGroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'UserGroups', 'UserGroupUsers', 'UserGroupRoles',
	function($scope, $stateParams, $location, Authentication, UserGroups, UserGroupUsers, UserGroupRoles) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		$scope.userGroupUsers = { items: ''};
		$scope.userGroupRoles = { items: ''};

		// Create new User group
		$scope.create = function() {
			// Create new User group object
			var userGroup = new UserGroups ({
					
				
					name: this.name,
				
			});

			// Redirect after save
			userGroup.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/user-groups/' + response._id);

				// Clear form fields
				
				$scope.name = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing User group
		$scope.remove = function(userGroup) {
			if ( userGroup ) { 
				userGroup.$remove().then(function(response){

				for (var i in $scope.userGroups) {
					if ($scope.userGroups [i] === userGroup) {
						$scope.userGroups.splice(i, 1);
					}
				}
			})
				.catch(function(error){
					$scope.error = error.data.message;
					console.log('Could not delete user group ', error.data.message);
				});
			} else {
				$scope.userGroup.$remove(function() {
					$location.path($scope.parentRouteUrl + '/user-groups');
				},function(error){
					$scope.error = error.data.message;
					console.log('Could not delete user group ', error.data.message);
				});
			}
		};

		// Update existing User group
		$scope.update = function() {
			var userGroup = $scope.userGroup;

			userGroup.$update(function() {
				$location.path($scope.parentRouteUrl + '/user-groups/' + userGroup._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of User groups
		$scope.find = function() {
			$scope.userGroups = UserGroups.query();
		};

		$scope.addToList = function(newObject) {
			$scope.userGroups.unshift(newObject);
		};

		// Find existing User group
		$scope.findOne = function() {
			$scope.userGroup = UserGroups.get({ 
				userGroupId: $stateParams.userGroupId
			});

			UserGroupUsers.queryForParentId({parentId: $stateParams.userGroupId}).$promise.then(function(results){
				$scope.userGroupUsers.items = results.map(function(item){ return item.userId._id;});
				$scope.userGroupUsers.objectList = results; //this list can be used to easily delete this entry
			})
			.catch(function(errorResponse){
				$scope.error = errorResponse.data.message
				console.error('Could not get user group users ', $scope.error);
			});

			UserGroupRoles.queryForParentId({parentId: $stateParams.userGroupId}).$promise.then(function(results){
				$scope.userGroupRoles.items = results.map(function(item){ return item.roleId._id;});
				$scope.userGroupRoles.objectList = results; //this list can be used to easily delete this entry
			})
			.catch(function(errorResponse){
				$scope.error = errorResponse.data.message
				console.error('Could not get user group users ', $scope.error);
			});
		};

		// Create new User group user
		$scope.addUser = function(userId) {
			
			// Create new User group user object
			var userGroupUser = new UserGroupUsers ({
				parentId: $scope.userGroup._id,
				userId: userId,
			});

			userGroupUser.$save(function(response) {
				$scope.userGroupUsers.objectList.push(response);
				console.log('User successfully added');				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;;
				console.error('Could not add UserGroupUser ', $scope.error);
			});
		};

		// Remove existing User group user
		$scope.removeUser = function(userId) {
			
			var matchedEntries = $scope.userGroupUsers.objectList.filter(function(item){
				return item.userId._id === userId || item.userId === userId;
			});

			if(matchedEntries && matchedEntries.length){
				var matchedEntry = matchedEntries[0];
				matchedEntry.$remove();
				$scope.userGroupUsers.objectList.splice($scope.userGroupUsers.objectList.indexOf(matchedEntry), 1);
			} else {
				$scope.error = 'UserGroupUser entry could not found';;
				console.error('Could not remove UserGroupUser ', $scope.error);
			}
		};

		// Create new User group role
		$scope.addRole = function(roleId) {
			
			// Create new User group user object
			var userGroupRole = new UserGroupRoles ({
				parentId: $scope.userGroup._id,
				roleId: roleId,
			});

			userGroupRole.$save(function(response) {
				$scope.userGroupRoles.objectList.push(response);
				console.log('Role successfully added');				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;;
				console.error('Could not add UserGroupRole ', $scope.error);
			});
		};

		// Remove existing User group role
		$scope.removeRole = function(roleId) {
			
			var matchedEntries = $scope.userGroupRoles.objectList.filter(function(item){
				return item.roleId._id === roleId || item.roleId === roleId;
			});

			if(matchedEntries && matchedEntries.length){
				var matchedEntry = matchedEntries[0];
				matchedEntry.$remove();
				$scope.userGroupRoles.objectList.splice($scope.userGroupRoles.objectList.indexOf(matchedEntry), 1);
			} else {
				$scope.error = 'UserGroupRole entry could not found';;
				console.error('Could not remove UserGroupRole ', $scope.error);
			}
		};
	}
]);