'use strict';

//User group roles service used to communicate User group roles REST endpoints
angular.module('user-group-roles').factory('UserGroupRoles', ['$resource',
	function($resource) {
		return $resource('user-group-roles/:userGroupRoleId', 
		{ 
			userGroupRoleId: '@_id'
		}, 
		{
			update: {
				method: 'PUT'
			},
			queryForParentId: {
				method: 'GET',
				isArray: true,
				params: { parentId: '@parentId' }
			}
		});
	}
]);