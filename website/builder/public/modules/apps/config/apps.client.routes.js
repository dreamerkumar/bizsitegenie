'use strict';

//Setting up route
angular.module('apps').config(['$stateProvider',
	function($stateProvider) {
		// Apps state routing
		$stateProvider.
		state('listApps', {
			url: '/apps',
			templateUrl: 'builder/public/modules/apps/views/list-apps.client.view.html'
		}).
		state('createApp', {
			url: '/apps/create',
			templateUrl: 'builder/public/modules/apps/views/create-app.client.view.html'
		}).
		state('listThemes', {
			url: '/apps/select-theme/:appId',
			templateUrl: 'builder/public/modules/apps/views/select-theme.client.view.html'
		}).
		state('viewApp', {
			url: '/apps/:appId',
			templateUrl: 'builder/public/modules/apps/views/view-app.client.view.html'
		}).
		state('editApp', {
			url: '/apps/:appId/edit',
			templateUrl: 'builder/public/modules/apps/views/edit-app.client.view.html'
		})
		.state('viewAppCreationStatus', {
			url: '/apps/:appId/view-app-creation-status',
			templateUrl: 'builder/public/modules/apps/views/view-app-creation-status.client.view.html'
		})
		.state('generatedAppStatus', {
			url: '/apps/:appId/generated-app-status',
			templateUrl: 'builder/public/modules/apps/views/generated-app-status.client.view.html'
		});

	}
]);