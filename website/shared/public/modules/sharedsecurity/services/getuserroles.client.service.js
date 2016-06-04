'use strict';

angular.module('sharedsecurity').factory('GetUserRoles', ['$resource',
	function($resource) {
		return $resource('get-user-roles',
			{},
	        {
	        	'get': { 
	        		method:'GET', 
	        		cache: true //cache the roles
	        	}
	        });
	}
]);