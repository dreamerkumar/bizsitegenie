'use strict';

//Fourth of fours service used to communicate Fourth of fours REST endpoints
angular.module('fourth-of-fours').factory('FourthOfFours', ['$resource',
	function($resource) {
		return $resource('fourth-of-fours/:fourthOfFourId', 
		{ 
			fourthOfFourId: '@_id'
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