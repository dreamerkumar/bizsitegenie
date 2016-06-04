'use strict';

//Abcds service used to communicate Abcds REST endpoints
angular.module('abcd').factory('Abcd', ['$resource',
	function($resource) {
		return $resource('abcd/:abcdId', 
		{ 
			abcdId: '@_id'
		}, 
		{
			search: {
				url: '/abcd/search/',
				method: 'GET',
				isArray: true
			},
			update: {
				method: 'PUT'
			}
		});
	}
]);