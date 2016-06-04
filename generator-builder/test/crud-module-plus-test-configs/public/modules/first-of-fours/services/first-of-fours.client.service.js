'use strict';

//First of fours service used to communicate First of fours REST endpoints
angular.module('first-of-fours').factory('FirstOfFours', ['$resource',
	function($resource) {
		return $resource('first-of-fours/:firstOfFourId', 
		{ 
			firstOfFourId: '@_id'
		}, 
		{
			update: {
				method: 'PUT'
			}
		});
	}
]);