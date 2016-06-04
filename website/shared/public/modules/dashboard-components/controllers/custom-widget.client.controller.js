'use strict';

angular.module('dashboard-components').controller('CustomWidgetCtrl', ['$scope', '$modal',
    function($scope, $modal) {

      $scope.remove = function(widget) {
        $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
      };

      $scope.openSettings = function(widget) {
        $modal.open({
          scope: $scope,
          templateUrl: 'shared/public/modules/dashboard-components/views/widget-settings.client.view.html',
          controller: 'WidgetSettingsCtrl',
          resolve: {
            widget: function() {
              return widget;
            }
          }
        });
      };

    }
  ]);