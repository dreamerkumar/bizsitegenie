'use strict';

//Setting up route
angular.module('second-of-fours').config(['$stateProvider',
	function($stateProvider) {
		// Second of fours state routing
		$stateProvider.
		state('listSecondOfFours', {
			url: '/first-of-fours/:firstOfFourId/second-of-fours',
			templateUrl: 'modules/second-of-fours/views/list-second-of-fours.client.view.html'
		}).
		state('createSecondOfFour', {
			url: '/first-of-fours/:firstOfFourId/second-of-fours/create',
			templateUrl: 'modules/second-of-fours/views/create-second-of-four.client.view.html'
		}).
		state('viewSecondOfFour', {
			url: '/first-of-fours/:firstOfFourId/second-of-fours/:secondOfFourId',
			templateUrl: 'modules/second-of-fours/views/view-second-of-four.client.view.html'
		}).
		state('editSecondOfFour', {
			url: '/first-of-fours/:firstOfFourId/second-of-fours/:secondOfFourId/edit',
			templateUrl: 'modules/second-of-fours/views/edit-second-of-four.client.view.html'
		});
	}
]);