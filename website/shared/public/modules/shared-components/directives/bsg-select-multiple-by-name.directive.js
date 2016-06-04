'use strict';

angular.module('shared-components').directive('bsgSelectMultipleByName', function($injector){
	return {
		restrict: 'E',
		templateUrl: 'shared/public/modules/shared-components/views/bsg-select-multiple-by-name.directive.view.html',
		scope: {
			title: '@',
			serviceName: '@',
			onSelect: '&',
			onUnselect: '&',
			currentSelection: '='
		},
		controller: function($scope){
			$scope.addToList = function(newObject) {
				$scope.list.unshift(newObject);
			};

			$scope.onChangeCheckStatus = function(name){
				var checkedState = $scope.checkedState[name];

				if(checkedState && $scope.onSelect){
					$scope.onSelect()(name);
				} else if(!checkedState && $scope.onUnselect){
					$scope.onUnselect()(name);
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

			scope.$watch('currentSelection.items', function(selectedRoles){
				if(selectedRoles && selectedRoles.length){
					selectedRoles.forEach(function(roleName){
						scope.checkedState[roleName] = true;
					})
				}
			});
		}

	};
});