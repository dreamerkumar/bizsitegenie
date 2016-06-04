'use strict';

//Second of fours service used to communicate Second of fours REST endpoints
angular.module('second-of-fours').factory('SecondOfFours', ['$resource',
	function($resource) {
		return $resource('second-of-fours/:secondOfFourId', 
		{ 
			secondOfFourId: '@_id'
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