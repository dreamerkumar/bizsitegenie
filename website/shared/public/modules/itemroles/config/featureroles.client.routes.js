'use strict';

//Setting up route
angular.module('itemroles').config(['$stateProvider',
	function($stateProvider) {
		// Itemroles state routing
		$stateProvider.
		state('listItemroles', {
			url: '/itemroles',
			templateUrl: 'shared/public/modules/itemroles/views/list-itemroles.client.view.html'
		}).
		state('createItemroles', {
			url: '/itemroles/create',
			templateUrl: 'shared/public/modules/itemroles/views/create-itemroles.client.view.html'
		}).
		state('viewItemroles', {
			url: '/itemroles/:itemrolesId',
			templateUrl: 'shared/public/modules/itemroles/views/view-itemroles.client.view.html'
		}).
		state('editItemroles', {
			url: '/itemroles/:itemrolesId/edit',
			templateUrl: 'shared/public/modules/itemroles/views/edit-itemroles.client.view.html'
		});
	}
]);