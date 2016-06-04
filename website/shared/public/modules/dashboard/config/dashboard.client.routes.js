'use strict';

//Setting up route
angular.module('dashboard').config(['$stateProvider',
	function($stateProvider) {
		// Dashboards state routing
		$stateProvider.
		state('listDashboard', {
			url: '/dashboard',
			templateUrl: 'shared/public/modules/dashboard/views/list-dashboard.client.view.html'
		}).
		state('createDashboard', {
			url: '/dashboard/create',
			templateUrl: 'shared/public/modules/dashboard/views/create-dashboard.client.view.html'
		}).
		state('viewDashboard', {
			url: '/dashboard/:dashboardId',
			templateUrl: 'shared/public/modules/dashboard/views/view-dashboard.client.view.html'
		}).
		state('editDashboard', {
			url: '/dashboard/:dashboardId/edit',
			templateUrl: 'shared/public/modules/dashboard/views/edit-dashboard.client.view.html'
		});
	}
]);