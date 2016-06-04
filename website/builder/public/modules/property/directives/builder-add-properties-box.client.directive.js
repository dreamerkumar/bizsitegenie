angular.module('property').directive('builderAddPropertiesBox', function(){

	return {
		restrict: 'E',
		scope: {
			onAdd: '&'
		},
		templateUrl: 'builder/public/modules/property/views/builder-add-properties-box.directive.client.view.html',
		controller: function($scope, AddMultipleProperties, $stateParams){
			$scope.toggleAddPropertiesExpander = function(){
				$scope.expand = !$scope.expand;
				$scope.propertyNames = null;
				$scope.error = null;
			};

			$scope.addMultipleProperties = function(){
				$scope.error = null;
				var properties = new AddMultipleProperties({parentId: $stateParams.itemId, propertyNames: $scope.propertyNames});
				
				properties.$save(function(response) {
					$scope.toggleAddPropertiesExpander();
					if($scope.onAdd){
						$scope.onAdd();
					}					
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		}
	}
});