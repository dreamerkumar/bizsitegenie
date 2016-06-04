'use strict';

angular.module('items').directive('getNameCreateItemModal', function(CreateItemService) {
    return {
        restrict: 'E',
        scope: {
            parentId: '@',
            parentCrudId: '@',
            uibModalInstance: '='
        },
        templateUrl: 'builder/public/modules/items/views/get-name-create-item-modal.client.view.html',

        controller: ['$scope', function ($scope) {

            $scope.ok = function () {
                $scope.validationError = null;
                if(!$scope.name){
                  $scope.validationError = 'Please enter a item name';
                  return;
                }

                CreateItemService.createNewItem($scope.parentId, $scope.parentCrudId, $scope.name)
                    .then(function(response){
                        $scope.uibModalInstance.close(response);
                    })
                    .catch(function(error){
                        console.error(error);
                        $scope.validationError = error;
                    });
            };

            $scope.cancel = function () {
                $scope.uibModalInstance.dismiss('cancel');
            };
        }],

        link: function(scope, element, attrs) {


        }
    };
});