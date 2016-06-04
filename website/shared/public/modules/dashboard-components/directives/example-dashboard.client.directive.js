'use strict';

angular.module('dashboard-components').directive('exampleDashboard', function(){ return {

  templateUrl: 'shared/public/modules/dashboard-components/views/example-dashboard.client.view.html',
  controller: function($scope, $timeout, generator) {
      $scope.gridsterOptions = {
        margins: [20, 20],
        columns: 4,
        //mobileBreakPoint: 1000,
        mobileModeEnabled: false,
        draggable: {
          handle: 'h3'
        },
        resizable: {
          enabled: true,
          handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],

          // optional callback fired when resize is started
          start: function(event, $element, widget) {},

          // optional callback fired when item is resized,
          resize: function(event, $element, widget) {
            if (widget.chart.api) widget.chart.api.update();
          },

          // optional callback fired when item is finished resizing
          stop: function(event, $element, widget) {
            $timeout(function(){
              if (widget.chart.api) widget.chart.api.update();
            },400)
          }
        }
      };
      //console.log(generator)
      $scope.dashboard = {
        widgets: [{
          col: 0,
          row: 0,
          sizeY: 1,
          sizeX: 2,
          name: "Line Chart Widget",
          type: 'lineChart',
          chart: {
            options: generator.lineChart.options(),
            data: generator.lineChart.data(),
            api: {}
          }
        }, {
          col: 2,
          row: 0,
          sizeY: 1,
          sizeX: 1,
          name: "Pie Chart Widget",
          type: 'pieChart',
          chart: {
            options: generator.pieChart.options(),
            data: generator.pieChart.data(),
            api: {}
          }
        }, {
          col: 3,
          row: 0,
          sizeY: 1,
          sizeX: 1,
          name: "Box Plot Widget",
          type: 'boxPlotChart',
          chart: {
            options: generator.boxPlotChart.options(),
            data: generator.boxPlotChart.data(),
            api: {}
          }
        }, {
          col: 0,
          row: 1,
          sizeY: 1,
          sizeX: 2,
          name: "Discrete Bar Chart Widget",
          type: 'discreteBarChart',
          chart: {
            options: generator.discreteBarChart.options(),
            data: generator.discreteBarChart.data(),
            api: {}
          }
        }, {
          col: 2,
          row: 1,
          sizeY: 1,
          sizeX: 2,
          name: "Stacked Area Chart Widget",
          type: 'stackedAreaChart',
          chart: {
            options: generator.stackedAreaChart.options(),
            data: generator.stackedAreaChart.data(),
            api: {}
          }
        }]
      };

      // widget events
      $scope.events = {
        resize: function(e, scope){
          $timeout(function(){
            if (scope.api && scope.api.update) scope.api.update();
          },200)
        }
      };

      $scope.config = { visible: false };

      //make chart visible after grid have been created
      $timeout(function(){
        $scope.config.visible = true;
      }, 200);

      //subscribe widget on window resize event
      angular.element(window).on('resize', function(e){
        $scope.$broadcast('resize');
      });

      // grid manipulation
      $scope.clear = function() {
        $scope.dashboard.widgets = [];
      };

      $scope.addWidget = function() {
        $scope.dashboard.widgets.push({
          name: "New Widget",
          sizeX: 1,
          sizeY: 1
        });
      };
    }
  

};})
