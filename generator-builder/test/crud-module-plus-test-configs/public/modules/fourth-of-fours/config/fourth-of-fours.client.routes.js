'use strict';

//Setting up route
angular.module('fourth-of-fours').config(['$stateProvider',
	function($stateProvider) {
		// Fourth of fours state routing
		$stateProvider.
		state('listFourthOfFours', {
			url: '/first-of-fours/:firstOfFourId/second-of-fours/:secondOfFourId/third-of-fours/:thirdOfFourId/fourth-of-fours',
			templateUrl: 'modules/fourth-of-fours/views/list-fourth-of-fours.client.view.html'
		}).
		state('createFourthOfFour', {
			url: '/first-of-fours/:firstOfFourId/second-of-fours/:secondOfFourId/third-of-fours/:thirdOfFourId/fourth-of-fours/create',
			templateUrl: 'modules/fourth-of-fours/views/create-fourth-of-four.client.view.html'
		}).
		state('viewFourthOfFour', {
			url: '/first-of-fours/:firstOfFourId/second-of-fours/:secondOfFourId/third-of-fours/:thirdOfFourId/fourth-of-fours/:fourthOfFourId',
			templateUrl: 'modules/fourth-of-fours/views/view-fourth-of-four.client.view.html'
		}).
		state('editFourthOfFour', {
			url: '/first-of-fours/:firstOfFourId/second-of-fours/:secondOfFourId/third-of-fours/:thirdOfFourId/fourth-of-fours/:fourthOfFourId/edit',
			templateUrl: 'modules/fourth-of-fours/views/edit-fourth-of-four.client.view.html'
		});
	}
]);