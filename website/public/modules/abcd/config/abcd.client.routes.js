'use strict';

//Setting up route
angular.module('abcd').config(['$stateProvider',
	function($stateProvider) {
		// Abcds state routing
		$stateProvider.
		state('listAbcd', {
			url: '/abcd',
			templateUrl: 'modules/abcd/views/list-abcd.client.view.html'
		}).
		state('createAbcd', {
			url: '/abcd/create',
			templateUrl: 'modules/abcd/views/create-abcd.client.view.html'
		}).
		state('viewAbcd', {
			url: '/abcd/:abcdId',
			templateUrl: 'modules/abcd/views/view-abcd.client.view.html'
		}).
		state('editAbcd', {
			url: '/abcd/:abcdId/edit',
			templateUrl: 'modules/abcd/views/edit-abcd.client.view.html'
		});
	}
]);