'use strict';

// Dashboards controller
angular.module('dashboard').controller('DashboardController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication', 'Dashboard',
	function($rootScope, $scope, $stateParams, $location, Authentication, Dashboard) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		// Create new Dashboard
		$scope.create = function() {
			// Create new Dashboard object
			var dashboard = new Dashboard ({
					
				
					name: this.name,
				
					content: this.content,
				
			});

			// Redirect after save
			dashboard.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/dashboard/' + response._id);

				// Clear form fields
				
				$scope.name = '';
				
				$scope.content = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Dashboard
		$scope.remove = function(dashboard) {
			if ( dashboard ) { 
				dashboard.$remove();

				for (var i in $scope.dashboard) {
					if ($scope.dashboard [i] === dashboard) {
						$scope.dashboard.splice(i, 1);
					}
				}
			} else {
				$scope.dashboard.$remove(function() {
					$location.path($scope.parentRouteUrl + '/dashboard');
				});
			}
		};

		// Update existing Dashboard
		$scope.update = function() {
			var dashboard = $scope.dashboard;

			dashboard.$update(function() {
				$location.path($scope.parentRouteUrl + '/dashboard/' + dashboard._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Dashboards
		$scope.find = function() {
			$scope.dashboard = Dashboard.query();
		};

		// Find existing Dashboard
		$scope.findOne = function() {
			$scope.dashboard = Dashboard.get({ 
				dashboardId: $stateParams.dashboardId
			});
		};
	}
]);