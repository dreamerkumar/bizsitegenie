'use strict';

angular.module('shared-components').directive('thumbnailSelector', function () {

    return {
        restrict: 'E',
        scope: {
            availableThumbnails: '=',
            selectedThumbnail: '='
        },
        templateUrl: 'shared/public/modules/shared-components/views/thumbnail-selector.shared-components.directive.view.html',
        controller: function($scope){
            $scope.selectThumbnail = function(thumbnail){
                $scope.selectedThumbnail = thumbnail;
            }
        }
    };
});