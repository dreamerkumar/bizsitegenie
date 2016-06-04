'use strict';

//Dashboards service used to communicate Dashboards REST endpoints
angular.module('dashboard').factory('Dashboard', ['$resource',
	function($resource) {
		return $resource('dashboard/:dashboardId', 
		{ 
			dashboardId: '@_id'
		}, 
		{
			search: {
				url: '/dashboard/search/',
				method: 'GET',
				isArray: true
			},
			update: {
				method: 'PUT'
			}
		});
	}
]);