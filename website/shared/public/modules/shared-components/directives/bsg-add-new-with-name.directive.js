angular.module('shared-components').directive('bsgAddNewWithName', function(){

	return {
		restrict: 'E',
		scope: {
			serviceName: '@',
			onSuccessfulAdd: '&'
		},
		templateUrl: 'shared/public/modules/shared-components/views/bsg-add-new-with-name.directive.view.html',
		controller: function($scope, $injector){
			if(!$scope.serviceName) {
				$scope.createNewError = 'Cannot add. Cannot identify the service to call.';
				return;	
			}

			$scope.serviceHandle = $injector.get($scope.serviceName);

			$scope.createNew = function(){
				$scope.createNewError = '';
				
				if(!$scope.newName){
					$scope.createNewError = 'Cannot add. Name missing.';
					return;
				}

				if(!$scope.serviceHandle) {
					$scope.createNewError = 'Cannot add. Cannot identify the service to call.';
					return;					
				}

				var newObject = new $scope.serviceHandle ({
						name: $scope.newName
				});

				newObject.$save(function(response) {
					$scope.newName = '';
					if($scope.onSuccessfulAdd){
						$scope.onSuccessfulAdd()(response);
					}
				}, function(errorResponse) {
					console.error(errorResponse.data.message);
					$scope.createNewError = errorResponse.data.message;
				});
			};

			$scope.clearError = function(){
				$scope.createNewError = '';
			};
		}
	}
});
