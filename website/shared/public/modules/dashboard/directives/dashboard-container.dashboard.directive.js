'use strict';

angular.module('dashboard')

	.directive('dashboardContainer', function(){

		return {
			restrict: 'E',
			scope: {

			},
			templateUrl: 'shared/public/modules/dashboard/views/dashboard-container.dashboard.directive.view.html',
			controller: function($scope, $timeout, $stateParams, Dashboard, $rootScope, Authentication, $location){
				$scope.authentication = Authentication;
				// Update existing Dashboard
				$scope.update = function() {
					var dashboard = $scope.dashboard;
					dashboard.content = angular.toJson($scope.content);
					dashboard.$update(function() {
						console.log('Dashboard updated', dashboard);
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				};

				// Find existing Dashboard
				$scope.findOne = function() {
					$rootScope.displayExpandedView = true;
					Dashboard.get({ 
						dashboardId: $stateParams.dashboardId
					}, function(response){
						$scope.dashboard = response;
						if(!$scope.dashboard.content || !$scope.dashboard.content.length){
							$scope.content = { widgets: []};
						} else {
							$scope.content = angular.fromJson($scope.dashboard.content);
						}
					}, function(error){
						console.error('The following error occured while trying to get the dashboard', error);
					});
				};

				  // grid manipulation
			    $scope.clear = function() {
			        $scope.content.widgets = [];
			        $scope.update();
			    };

			    $scope.addWidget = function() {
			        $scope.content.widgets.push({
			          name: "New Widget",
			          sizeX: 1,
			          sizeY: 1
			        });
			        $scope.update();
			    };

				// Remove existing Dashboard
				$scope.removeDashboard = function(dashboard) {
					if ( dashboard ) { 
						dashboard.$remove();

						for (var i in $scope.dashboard) {
							if ($scope.dashboard [i] === dashboard) {
								$scope.dashboard.splice(i, 1);
							}
						}
					} else {
						$scope.dashboard.$remove(function() {
							$location.path('/dashboard');
						});
					}
				};

				$scope.removeWidget = function(widget) {
			        $scope.content.widgets.splice($scope.content.widgets.indexOf(widget), 1);
			        $scope.update();
			    };

			    $scope.gridsterOptions = {
			        margins: [10, 10],
			        columns: 4,
			        mobileBreakPoint: 1000,
			        mobileModeEnabled: true,
			        draggable: {
			         	handle: 'h3', // optional selector for resize handle
						start: function(event, $element, widget) {}, // optional callback fired when drag is started,
						drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
						
						stop: function(event, $element, widget) { // optional callback fired when item is finished dragging
							$scope.updateWidgetOnDashboardLayoutChange(widget);
						} 
			        },
			        resizable: {
			          enabled: true,
			          handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],

			          // optional callback fired when resize is started
			          start: function(event, $element, widget) {},

			          // optional callback fired when item is resized,
			          resize: function(event, $element, widget) {
			          },

			          // optional callback fired when item is finished resizing
			          stop: function(event, $element, widget) {
						$scope.updateWidgetOnDashboardLayoutChange(widget);
			          }
			        }
				};

				$scope.updateWidgetOnDashboardLayoutChange = function(widget){
		            $timeout(function(){
		            	widget.justGotResized = true;
						$scope.update();
		            },400);
				};
			}
		};
	});