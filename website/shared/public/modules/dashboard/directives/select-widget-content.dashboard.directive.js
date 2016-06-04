'use strict';

angular.module('dashboard')

	.directive('selectWidgetContent', function(){

		return {
			restrict: 'E',
			templateUrl: 'shared/public/modules/dashboard/views/select-widget-content.dashboard.directive.view.html',
			controller: function($scope) {
				$scope.widgetContentType = $scope.widgetContentType || {};

				$scope.availableWidgetContentTypes = [{
					id: 'pie-chart',
					imageUrl: 'shared/public/modules/chart-components/img/pie.png'
				},{
					id: 'horz-percent-bar-chart',
					imageUrl: 'shared/public/modules/chart-components/img/horz-percent-bar-chart.png'
				},{
					id: 'line-chart',
					imageUrl: 'shared/public/modules/chart-components/img/line.png'
				},{
					id: 'historical-bar-chart',
					imageUrl: 'shared/public/modules/chart-components/img/historical-bar-chart.png'
				},{
					id: 'donut-chart',
					imageUrl: 'shared/public/modules/chart-components/img/donut.png'
				},
				{
					id: 'stacked-area-chart',
					multipleProperties: true,
					imageUrl: 'shared/public/modules/chart-components/img/stacked-area-chart.png'
				},
				{
					id: 'bsg-ui-grid',
					multipleProperties: true,
					imageUrl: 'shared/public/modules/bsg-ui-grid-components/img/ui-grid.png'
				}];

				$scope.dismiss = function() {
					$scope.$uibModalInstance.dismiss();
				};

				$scope.submit = function() {
					if(!$scope.widgetContentType || !$scope.widgetContentType.id){
						alert('Please select a widget content type');
						return;
					}
					$scope.setWidgetContentType($scope.widgetContentType);					
					$scope.$uibModalInstance.close();
				};
		    }
		};
	});
