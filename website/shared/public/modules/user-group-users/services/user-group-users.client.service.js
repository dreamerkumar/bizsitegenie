'use strict';

//User group users service used to communicate User group users REST endpoints
angular.module('user-group-users').factory('UserGroupUsers', ['$resource',
	function($resource) {
		return $resource('user-group-users/:userGroupUserId', 
		{ 
			userGroupUserId: '@_id'
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