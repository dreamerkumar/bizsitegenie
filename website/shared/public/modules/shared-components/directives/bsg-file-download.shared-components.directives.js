'use strict';

angular.module('shared-components').directive('bsgFileDownload', function () {

    return {
        restrict: 'E',
        scope: {
            fileKey: '@',
            fileName: '@'
        },
        templateUrl: 'shared/public/modules/shared-components/views/bsg-file-download.shared-components.directive.view.html'
    };
});