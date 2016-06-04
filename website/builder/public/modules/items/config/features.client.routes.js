'use strict';

//Setting up route
angular.module('items').config(['$stateProvider',
	function($stateProvider) {
		// Items state routing
		$stateProvider.
		state('listItems', {
			url: '/apps/:appId/items',
			templateUrl: 'builder/public/modules/items/views/list-items.client.view.html'
		}).
		state('itemCollections', {
			url: '/apps/:appId/item-collections/:itemId',
			templateUrl: 'builder/public/modules/items/views/item-collections.client.view.html'
		}).
		state('itemUploadSpreadsheet', {
			url: '/apps/:appId/item-upload-spreadsheet/:itemId',
			templateUrl: 'builder/public/modules/items/views/item-upload-spreadsheet.client.view.html'
		}).
		state('createItem', {
			url: '/apps/:appId/items/create',
			templateUrl: 'builder/public/modules/items/views/create-item.client.view.html'
		}).
		state('viewItem', {
			url: '/apps/:appId/items/:itemId',
			templateUrl: 'builder/public/modules/items/views/view-item.client.view.html'
		}).
		state('itemProperties', {
			url: '/apps/:appId/item-properties/:itemId',
			templateUrl: 'builder/public/modules/items/views/item-properties.client.view.html'
		}).
		state('itemPermissions', {
			url: '/apps/:appId/item-permissions/:itemId',
			templateUrl: 'builder/public/modules/items/views/item-permissions.client.view.html'
		});
		// state('editItem', {
		// 	url: '/apps/:appId/items/:itemId/edit',
		// 	templateUrl: 'builder/public/modules/items/views/edit-item.client.view.html'
		// });
	}
]);