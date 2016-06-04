'use strict';

//Setting up route
angular.module('user-groups').config(['$stateProvider',
	function($stateProvider) {
		// User groups state routing
		$stateProvider.
		state('listUserGroups', {
			url: '/user-groups',
			templateUrl: 'shared/public/modules/user-groups/views/list-user-groups.client.view.html'
		}).
		state('createUserGroup', {
			url: '/user-groups/create',
			templateUrl: 'shared/public/modules/user-groups/views/create-user-group.client.view.html'
		}).
		state('viewUserGroup', {
			url: '/user-groups/:userGroupId',
			templateUrl: 'shared/public/modules/user-groups/views/view-user-group.client.view.html'
		}).
		state('editUserGroup', {
			url: '/user-groups/:userGroupId/edit',
			templateUrl: 'shared/public/modules/user-groups/views/edit-user-group.client.view.html'
		});
	}
]);