'use strict';

//Setting up route
angular.module('user-group-roles').config(['$stateProvider',
	function($stateProvider) {
		// User group roles state routing
		$stateProvider.
		state('listUserGroupRoles', {
			url: '/user-groups/:userGroupId/user-group-roles',
			templateUrl: 'shared/public/modules/user-group-roles/views/list-user-group-roles.client.view.html'
		}).
		state('createUserGroupRole', {
			url: '/user-groups/:userGroupId/user-group-roles/create',
			templateUrl: 'shared/public/modules/user-group-roles/views/create-user-group-role.client.view.html'
		}).
		state('viewUserGroupRole', {
			url: '/user-groups/:userGroupId/user-group-roles/:userGroupRoleId',
			templateUrl: 'shared/public/modules/user-group-roles/views/view-user-group-role.client.view.html'
		}).
		state('editUserGroupRole', {
			url: '/user-groups/:userGroupId/user-group-roles/:userGroupRoleId/edit',
			templateUrl: 'shared/public/modules/user-group-roles/views/edit-user-group-role.client.view.html'
		});
	}
]);