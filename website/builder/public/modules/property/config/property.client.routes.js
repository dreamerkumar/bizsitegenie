'use strict';

//Setting up route
angular.module('property').config(['$stateProvider',
	function($stateProvider) {
		// Properties state routing
		$stateProvider.
		state('listProperty', {
			url: '/apps/:appId/item-property/:itemId',
			templateUrl: 'builder/public/modules/property/views/list-property.client.view.html'
		}).
		state('createProperty', {
			url: '/apps/:appId/items/:itemId/property/create',
			templateUrl: 'builder/public/modules/property/views/create-property.client.view.html'
		}).
		state('viewProperty', {
			url: '/apps/:appId/items/:itemId/property/:propertyId',
			templateUrl: 'builder/public/modules/property/views/view-property.client.view.html'
		}).
		state('editProperty', {
			url: '/apps/:appId/items/:itemId/property/:propertyId/edit',
			templateUrl: 'builder/public/modules/property/views/edit-property.client.view.html'
		});
	}
]);