'use strict';

//Items service used to communicate Items REST endpoints
angular.module('shared-item').factory('Items', ['$resource',
	function($resource) {
		return $resource('items/:itemId', 
		{ 
			itemId: '@_id'
		}, 
		{
			update: {
				method: 'PUT'
			},
			queryForParentId: {
				method: 'GET',
				isArray: true,
				params: { parentId: '@parentId' }
			},
			getAllProperties: {
				url: 'build-get-all-properties',
				method: 'GET',
				isArray: true
			},
			getAllItemsAndProps: {
				url: 'get-all-items-and-props',
				method: 'GET',
				isArray: true
			}
		});
	}
]);