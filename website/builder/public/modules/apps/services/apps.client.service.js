'use strict';

//Apps service used to communicate Apps REST endpoints
angular.module('apps').factory('Apps', ['$resource',
	function($resource) {
		return $resource('apps/:appId', 
		{ 
			appId: '@_id'
		}, 
		{
			update: {
				method: 'PUT'
			},

			generateItems: {
				url: 'apps/generate-items',
				method: 'PUT'
			},

			makeNewItemsAvailableToUse: {
				url: 'apps/make-new-items-available-to-use',
				method: 'PUT'
			},

			checkIfServerIsAlive: {
				url: 'apps/check-if-server-is-alive'
			}
		});
	}
]);