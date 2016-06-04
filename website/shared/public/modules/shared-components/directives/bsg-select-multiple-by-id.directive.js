'use strict';

angular.module('shared-components').directive('bsgSelectMultipleById', function($injector){
	return {
		restrict: 'E',
		templateUrl: 'shared/public/modules/shared-components/views/bsg-select-multiple-by-id.directive.view.html',
		scope: {
			title: '@',
			serviceName: '@',
			displayProperties: '@',
			allowAdd: '@',
			onSelect: '&',
			onUnselect: '&',
			currentSelection: '='
		},
		controller: function($scope){

			$scope.addToList = function(newObject) {
				$scope.list.unshift(newObject);
			};

			$scope.onChangeCheckStatus = function(id){
				var checkedState = $scope.checkedState[id];

				if(checkedState && $scope.onSelect){
					$scope.onSelect()(id);
				} else if(!checkedState && $scope.onUnselect){
					$scope.onUnselect()(id);
				}
			};
		},
		link: function(scope){

			if(!scope.serviceName) {
				scope.selectMultipleByNameError = 'Unable to initialize bsgSelectMultipleByName. Cannot identify the service to call.';
				return;	
			}

			scope.serviceHandle = $injector.get(scope.serviceName);

			if(!scope.serviceHandle) {
				scope.selectMultipleByNameError = 'Unable to initialize bsgSelectMultipleByName. Cannot identify the service to call.';
				return;					
			}
			scope.checkedState = {};
			scope.list = scope.serviceHandle.query();

			if(scope.displayProperties && scope.displayProperties.length){
				scope.displayPropertyArray = scope.displayProperties.split(',');				
			}

			//the below code executes on first time load to update the status of the prior selections
			scope.$watch('currentSelection.items', function(selectedItemIds){
				if(selectedItemIds && selectedItemIds.length){
					selectedItemIds.forEach(function(selectedItemId){
						scope.checkedState[selectedItemId] = true;
					});
				}
			});
		}
	};
});