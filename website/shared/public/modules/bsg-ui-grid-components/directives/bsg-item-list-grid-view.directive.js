'use strict';

angular.module('bsg-ui-grid-components')

	.directive('bsgItemListGridView', function(){

		return {
			restrict: 'E',
			scope: {
				columns: '=',
				sourceItem: '@',
				handleToGrid: '='
			},
			templateUrl: 'shared/public/modules/bsg-ui-grid-components/views/bsg-item-list-grid-view.directive.view.html',
			controller: function($scope, $http, CoreFunctions){
				$scope.gridOptions = {
					enableSorting: true,
					columnDefs: $scope.columns,
					enableGridMenu: true,
					exporterCsvFilename: $scope.sourceItem + '.csv',
					onRegisterApi: function(gridApi) {
      					$scope.gridApi = gridApi;
      				}
				};
		        
		        $http.get('/' + $scope.sourceItem).then(function(response) {
		        	if(response && response.data && response.data.length) {
						$scope.gridOptions.data = response.data;
					}

			    }, function(error){
			    	console.error('UI Grid data could not be retrieved', error);
			    	 $scope.gridOptions.data = [];
			    });

			    $scope.handleToGrid.updateLayout = function(){
			    	$scope.gridApi.core.handleWindowResize();
			    }
	    	}
		};
	});
