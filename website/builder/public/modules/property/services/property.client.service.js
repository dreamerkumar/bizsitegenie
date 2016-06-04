'use strict';

//Properties service used to communicate Properties REST endpoints
angular.module('property').factory('Property', ['$resource',
	function($resource) {
		return $resource('property/:propertyId', 
		{ 
			propertyId: '@_id',
			parentId: '@parentId'
		}, 
		{
			search: {
				url: '/property/search/',
				method: 'GET',
				isArray: true
			},
			update: {
				method: 'PUT'
			}
		});
	}
]);