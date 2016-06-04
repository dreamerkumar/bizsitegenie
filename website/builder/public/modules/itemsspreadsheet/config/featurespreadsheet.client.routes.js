'use strict';

//Setting up route
angular.module('itemspreadsheet').config(['$stateProvider',
	function($stateProvider) {
		// Itemspreadsheets state routing
		$stateProvider.
		state('listItemspreadsheet', {
			url: '/itemspreadsheet',
			templateUrl: 'modules/itemspreadsheet/views/list-itemspreadsheet.client.view.html'
		}).
		state('createItemspreadsheet', {
			url: '/itemspreadsheet/create',
			templateUrl: 'modules/itemspreadsheet/views/create-itemspreadsheet.client.view.html'
		}).
		state('viewItemspreadsheet', {
			url: '/itemspreadsheet/:itemspreadsheetId',
			templateUrl: 'modules/itemspreadsheet/views/view-itemspreadsheet.client.view.html'
		}).
		state('editItemspreadsheet', {
			url: '/itemspreadsheet/:itemspreadsheetId/edit',
			templateUrl: 'modules/itemspreadsheet/views/edit-itemspreadsheet.client.view.html'
		});
	}
]);