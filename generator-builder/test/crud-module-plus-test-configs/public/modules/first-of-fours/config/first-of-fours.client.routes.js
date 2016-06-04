'use strict';

//Setting up route
angular.module('first-of-fours').config(['$stateProvider',
	function($stateProvider) {
		// First of fours state routing
		$stateProvider.
		state('listFirstOfFours', {
			url: '/first-of-fours',
			templateUrl: 'modules/first-of-fours/views/list-first-of-fours.client.view.html'
		}).
		state('createFirstOfFour', {
			url: '/first-of-fours/create',
			templateUrl: 'modules/first-of-fours/views/create-first-of-four.client.view.html'
		}).
		state('viewFirstOfFour', {
			url: '/first-of-fours/:firstOfFourId',
			templateUrl: 'modules/first-of-fours/views/view-first-of-four.client.view.html'
		}).
		state('editFirstOfFour', {
			url: '/first-of-fours/:firstOfFourId/edit',
			templateUrl: 'modules/first-of-fours/views/edit-first-of-four.client.view.html'
		});
	}
]);