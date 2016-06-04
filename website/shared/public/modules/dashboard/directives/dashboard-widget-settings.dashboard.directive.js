'use strict';

angular.module('dashboard')

	.directive('dashboardWidgetSettings', function(){

		return {
			restrict: 'E',
			templateUrl: 'shared/public/modules/dashboard/views/dashboard-widget-settings.dashboard.directive.view.html',
			controller: function($scope) {

				$scope.form = {
					name: $scope.widget.name,
					sizeX: $scope.widget.sizeX,
					sizeY: $scope.widget.sizeY,
					col: $scope.widget.col,
					row: $scope.widget.row,
					type: $scope.widget.type
				};
				
				$scope.dismiss = function() {
					$scope.$uibModalInstance.dismiss();
				};

				$scope.removeCallFromSettings = function() {
					$scope.remove(); //call parent widget remove function
					$scope.$uibModalInstance.close();
				};

				$scope.submit = function() {
					$scope.updateWidget($scope.form);					
					$scope.$uibModalInstance.close($scope.widget);
				};
		    }
		};
	});
