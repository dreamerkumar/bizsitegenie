'use strict';

//Features service used to communicate Features REST endpoints
angular.module('shared-user').factory('SharedUser', ['$resource',
	function($resource) {
		return $resource('/users', 
		{ 
			
		}, 
		{
			
		});
	}
]);