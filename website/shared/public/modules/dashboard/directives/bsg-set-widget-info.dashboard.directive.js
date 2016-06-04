'use strict';

angular.module('dashboard')

	.directive('bsgSetWidgetInfo', function(){

		return {
			restrict: 'E',
			templateUrl: 'shared/public/modules/dashboard/views/bsg-set-widget-info.dashboard.directive.view.html',
			controller: function($scope) {
				$scope.widgetHeading = $scope.widgetHeading || '';
				$scope.widgetSubHeading = $scope.widgetSubHeading || '';

				$scope.dismiss = function() {
					$scope.$uibModalInstance.dismiss();
				};

				$scope.submit = function() {
					$scope.setWidgetInfo($scope.widgetHeading, $scope.widgetSubHeading);					
					$scope.$uibModalInstance.close($scope.widget);
				};
		    }
		};
	});
