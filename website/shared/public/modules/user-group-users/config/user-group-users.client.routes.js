'use strict';

//Setting up route
angular.module('user-group-users').config(['$stateProvider',
	function($stateProvider) {
		// User group users state routing
		$stateProvider.
		state('listUserGroupUsers', {
			url: '/user-groups/:userGroupId/user-group-users',
			templateUrl: 'shared/public/modules/user-group-users/views/list-user-group-users.client.view.html'
		}).
		state('createUserGroupUser', {
			url: '/user-groups/:userGroupId/user-group-users/create',
			templateUrl: 'shared/public/modules/user-group-users/views/create-user-group-user.client.view.html'
		}).
		state('viewUserGroupUser', {
			url: '/user-groups/:userGroupId/user-group-users/:userGroupUserId',
			templateUrl: 'shared/public/modules/user-group-users/views/view-user-group-user.client.view.html'
		}).
		state('editUserGroupUser', {
			url: '/user-groups/:userGroupId/user-group-users/:userGroupUserId/edit',
			templateUrl: 'shared/public/modules/user-group-users/views/edit-user-group-user.client.view.html'
		});
	}
]);