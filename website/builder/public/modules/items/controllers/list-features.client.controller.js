'use strict';

// Items controller
angular.module('items').controller('ListItemsController', function($scope, $stateParams, $timeout, $location) {
		$scope.appId = $stateParams.appId;
		$scope.parentRouteUrl = '/apps/' + $stateParams.appId;
		
		$scope.navigateToItem = function(item){
			if(item._id){
				var url = 'apps/' + $scope.appId + '/items/' + item._id;
				$timeout(function(){$location.path(url); }, 1);
			}
		};
	}
);