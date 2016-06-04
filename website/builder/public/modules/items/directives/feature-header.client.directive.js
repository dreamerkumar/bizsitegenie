angular.module('items').directive('itemHeader', function(CreateItemService){

	return {
		restrict: 'E',
		templateUrl: 'builder/public/modules/items/views/item-header.directive.client.view.html',
		controller: function($scope, $stateParams, Authentication, Items, ItemParents){
			$scope.appId = $stateParams.appId;
			$scope.parentRouteUrl = '/apps/' + $stateParams.appId + '';
			$scope.parentItemList = null;
			$scope.backLink = null;
			$scope.isChildItem = null;

			// Find existing Item
			$scope.findOne = function() {
				$scope.backLink = 'items';
				$scope.parentItemList = [];
				if($stateParams.itemId && $stateParams.itemId.length){
					Items.get({ 
						itemId: $stateParams.itemId
					}).$promise.then(function(item){
						$scope.item = item;
						$scope.hasAccess = Authentication.user && Authentication.user._id == $scope.item.user._id;
						$scope.unauthorized = !$scope.hasAccess;
						ItemParents.getParents(item, function(values, error){
							if(error){
								console.error('Could not get the list of parents for the item. Following error occured: ' + error);
							} else{
								$scope.parentItemList = values;
								if(values.length > 0){
									//set backlink to parent item
									$scope.backLink = 'items/' + values[values.length - 1].id;
									$scope.isChildItem = true;
								}
							}
						});
					}, function(err){
						console.error(err);
					});
				}
			};
		},
		link: function(scope, element, attrs){
			scope.itemPageType = attrs.itemPageType;
			scope.atItemHome = !attrs.itemPageType || !attrs.itemPageType.length;
			scope.findOne();

		}
	}
});