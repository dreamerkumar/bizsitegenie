angular.module('items').directive('createItem', function(CreateItemService){

	return {
		restrict: 'E',
		scope: {
			appId: '@',
			parentCrudId: '@',
			onSuccessfulItemAdd: '&'
		},
		templateUrl: 'builder/public/modules/items/views/create-item.directive.client.view.html',
		controller: function($scope){
			$scope.createNewItem = function(){
				$scope.createNewItemError = '';
				if(!$scope.newItemName){
					console.error('Cannot add new item. Item Name missing.');
					return;
				}
				if(!$scope.appId){
					var error = 'Cannot save. App Id is missing';
					console.error(error);
					$scope.createNewItemError = error;
					return;
				}
				CreateItemService.createNewItem($scope.appId, $scope.parentCrudId, $scope.newItemName)
					.then(function(response){
						$scope.newItemName = '';
						$scope.onSuccessfulItemAdd({item: response});
					})
					.catch(function(error){
						console.error(error);
						$scope.createNewItemError = error;
					});
				
			};
		}
	}
});
