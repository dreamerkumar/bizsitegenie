'use strict';

angular.module('shared-item').directive('selectSingleProperty', function() {
    return {
        restrict: 'E',

        templateUrl: 'shared/public/modules/shared-item/views/selectsingleproperty.client.view.html',

        controller: ['$scope', function ($scope) {
            $scope.selectProperty = function(property){
                if(property.type === 'foreignkeyref' || property.type === 'lookupfromprop'){
                    console.log('Cannot select a property of type ' + property.type);
                    return;
                }
                $scope.selectedItem = property;
            };

            $scope.ok = function () {

                var selectedItem = $scope.selectedItem;
                if(!selectedItem || !selectedItem.name){
                  alert('Please select a property');
                  return;
                }

                $scope.$uibModalInstance.close(selectedItem);
            };

            $scope.cancel = function () {
                $scope.$uibModalInstance.dismiss('cancel');
            };
        }],

        link: function(scope, element, attrs) {


        }
    };
});