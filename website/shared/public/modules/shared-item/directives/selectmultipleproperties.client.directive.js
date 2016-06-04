'use strict';

angular.module('shared-item').directive('selectMultipleProperties', function() {
    return {
        restrict: 'E',

        templateUrl: 'shared/public/modules/shared-item/views/selectmultipleproperties.client.view.html',

        controller: ['$scope', function ($scope) {

            $scope.propertyFlags = {};

            $scope.selectUnselectProperty = function(property){
                if(property.type === 'foreignkeyref' || property.type === 'lookupfromprop'){
                    console.log('Cannot select a property of type ' + property.type);
                    return;
                }
                $scope.propertyFlags[property.name] = !$scope.propertyFlags[property.name];
                console.log($scope.propertyFlags);
                $scope.selectedProperties = getSelectedPropertiesArray().join(', ');
            };

            $scope.ok = function () {

                var selectedProperties = getSelectedPropertiesArray();

                if(selectedProperties.length <= 0){
                  alert('Please select one or more properties');
                  return;
                }

                $scope.$uibModalInstance.close(selectedProperties.join(','));
            };

            $scope.cancel = function () {
                $scope.$uibModalInstance.dismiss('cancel');
            };

            function getSelectedPropertiesArray(){
                var selectedProperties = [];
                for(var propertyFlag in $scope.propertyFlags){
                    if($scope.propertyFlags[propertyFlag]){
                      selectedProperties.push(propertyFlag);
                    }
                }
                return selectedProperties;
            }
        }],

        link: function(scope, element, attrs) {


        }
    };
});