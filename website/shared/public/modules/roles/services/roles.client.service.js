'use strict';

//Roles service used to communicate Roles REST endpoints
angular.module('roles').factory('Roles', ['$resource',
	function($resource) {
		return $resource('roles/:roleId', 
		{ 
			roleId: '@_id'
		}, 
		{
			update: {
				method: 'PUT'
			},					
			buildRoleStatus: {
				url: 'build-role-status',
				method: 'GET'
			}
		});
	}
]);