'use strict';

angular.module('bsg-ui-grid-components')

	.directive('bsgUiGrid', function(){

		return {
			restrict: 'E',
			scope: {
				settings: '=',
				widgetHandleToChild: '='
			},
			templateUrl: 'shared/public/modules/bsg-ui-grid-components/views/bsg-ui-grid.directive.view.html',
			controller: function($scope, $http, CoreFunctions){
				if(!$scope.settings || !$scope.settings.referencedFeatureName || !$scope.settings.propertyNames){
					console.error('UI Grid cannot be configured. Invalid settings', $scope.settings);
					return;
				}

			    var properties = $scope.settings.propertyNames.split(',');
			    var gridColumns = properties.map(function(item){ return {field: CoreFunctions.getPropertyColumnName(item), displayName: item};});
				$scope.columns = gridColumns;
				$scope.gridOptions = {
					enableSorting: true,
					columnDefs: $scope.columns,
					//rowHeight : "uiGridAutoResize", do not enable: this guy resets the grid display to 5 rows after more than 20 rows are inserted. 
					enableGridMenu: true,
					exporterCsvFilename: $scope.settings.referencedFeatureName + '.csv',
					//plugins: [new ngGridFlexibleHeightPlugin()], //Doesn't seem to make any difference. Grid still loaded with default height
					onRegisterApi: function(gridApi) {
      					$scope.gridApi = gridApi;
      				}
				};
		        
		        $http.get($scope.settings.referencedFeatureName).then(function(response) {
		        	if(response && response.data && response.data.length) {
						$scope.gridOptions.data = response.data;
					}

			    }, function(error){
			    	console.error('UI Grid data could not be retrieved', error);
			    	 $scope.gridOptions.data = [];
			    });

			    $scope.widgetHandleToChild.updateLayout = function(){
			    	$scope.gridApi.core.handleWindowResize();
			    }
	    	}
		};
	});
