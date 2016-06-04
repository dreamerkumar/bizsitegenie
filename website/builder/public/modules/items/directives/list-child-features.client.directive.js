'use strict';

angular.module('items').directive('listChildItems', function(CreateItemService) {
    return {
        restrict: 'E',
        scope: {
           
        },
        templateUrl: 'builder/public/modules/items/views/list-child-items.directive.client.view.html',

        controller: function ($scope, Items, $timeout, $stateParams) {
            $scope.appId = $stateParams.appId;
            $scope.parentRouteUrl = '/apps/' + $stateParams.appId + '';
            $scope.parentCrudId = $stateParams.itemId;

            $scope.find = function() {
                $scope.items = Items.queryForParentId({parentId: $stateParams.appId, parentCrudId: $stateParams.itemId});
            };

            $scope.addItemToList = function(item){
                if(!$scope.items){
                    $scope.items = [];
                }
                item.isNew = true;
                $scope.items.push(item);
            };
        },

        link: function(scope, element, attrs) {
            scope.find();
        }
    };
});