'use strict';

//User groups service used to communicate User groups REST endpoints
angular.module('user-groups').factory('UserGroups', ['$resource',
	function($resource) {
		return $resource('user-groups/:userGroupId', 
		{ 
			userGroupId: '@_id'
		}, 
		{
			update: {
				method: 'PUT'
			}
		});
	}
]);