'use strict';

//Third of fours service used to communicate Third of fours REST endpoints
angular.module('third-of-fours').factory('ThirdOfFours', ['$resource',
	function($resource) {
		return $resource('third-of-fours/:thirdOfFourId', 
		{ 
			thirdOfFourId: '@_id'
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