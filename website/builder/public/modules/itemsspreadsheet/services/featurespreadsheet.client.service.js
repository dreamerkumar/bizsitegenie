'use strict';

//Itemspreadsheets service used to communicate Itemspreadsheets REST endpoints
angular.module('itemspreadsheet').factory('Itemspreadsheet', ['$resource',
	function($resource) {
		return $resource('itemspreadsheet/:itemspreadsheetId', 
		{ 
			itemspreadsheetId: '@_id'
		}, 
		{
			search: {
				url: '/itemspreadsheet/search/',
				method: 'GET',
				isArray: true
			},
			update: {
				method: 'PUT'
			}
		});
	}
]);