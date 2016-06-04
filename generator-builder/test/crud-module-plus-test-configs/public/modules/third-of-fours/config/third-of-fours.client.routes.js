'use strict';

//Setting up route
angular.module('third-of-fours').config(['$stateProvider',
	function($stateProvider) {
		// Third of fours state routing
		$stateProvider.
		state('listThirdOfFours', {
			url: '/first-of-fours/:firstOfFourId/second-of-fours/:secondOfFourId/third-of-fours',
			templateUrl: 'modules/third-of-fours/views/list-third-of-fours.client.view.html'
		}).
		state('createThirdOfFour', {
			url: '/first-of-fours/:firstOfFourId/second-of-fours/:secondOfFourId/third-of-fours/create',
			templateUrl: 'modules/third-of-fours/views/create-third-of-four.client.view.html'
		}).
		state('viewThirdOfFour', {
			url: '/first-of-fours/:firstOfFourId/second-of-fours/:secondOfFourId/third-of-fours/:thirdOfFourId',
			templateUrl: 'modules/third-of-fours/views/view-third-of-four.client.view.html'
		}).
		state('editThirdOfFour', {
			url: '/first-of-fours/:firstOfFourId/second-of-fours/:secondOfFourId/third-of-fours/:thirdOfFourId/edit',
			templateUrl: 'modules/third-of-fours/views/edit-third-of-four.client.view.html'
		});
	}
]);