'use strict';

// Items controller
angular.module('items').controller('ListChildItemsController', function($scope, Items, $stateParams, ItemParents, $q, Authentication, $timeout, $location) {
		$scope.appId = $stateParams.appId;
		$scope.authentication = Authentication;
		$scope.parentRouteUrl = '/apps/' + $stateParams.appId + '';

		$scope.navigateToItem = function(item){
			if(item._id){
				var url = 'apps/' + $scope.appId + '/items/' + item._id;
				$timeout(function(){$location.path(url); }, 1);
			}
		};
	}
);