'use strict';

angular.module('chart-components')

    .directive('lineChart', function(){
        return {
            restrict: 'E',
            scope: {
                settings: '=',
                widgetHandleToChild: '='
            },
            templateUrl: 'shared/public/modules/chart-components/views/pie-chart.chart-components.directive.view.html',
            controller: function($scope, $timeout,$http, CoreFunctions) {
                if(!$scope.settings || !$scope.settings.referencedFeatureName || !$scope.settings.referencedPropertyName){
                    console.error('Line chart cannot be configured. Invalid settings', $scope.settings);
                    return;
                }
                
                $http.get($scope.settings.referencedFeatureName).then(function(response) {
                    if(response && response.data && response.data.length){
                        var data = [];
                        response.data.forEach(function(val){
                            var y = Number(val[CoreFunctions.getPropertyColumnName($scope.settings.referencedPropertyName)]); //TODO: remove number parsing when right data type is selected
                            var x = new Date(val.created);
                            var entry = {x: x, y: y};
                            data.push(entry);
                        });
                        
                        $scope.data = [{
                            values: data,      //values - represents the array of {x,y} data points
                            key: $scope.settings.referencedPropertyName, //key  - the name of the series.
                            color: '#ff7f0e'  //color - optional: choose your own line color.
                        }];
                    }  
                }, function(error){
                    console.error('Line chart data could not be retrieved', error);
                     $scope.data = null;
                });
                
                var format = d3.time.format("%Y-%m-%d");
                $scope.options = {
                    chart: {
                        type: 'lineChart',
                        margin : {
                            top: 20,
                            right: 40,
                            bottom: 40,
                            left: 55
                        },
                        x: function(d){ return d.x; },
                        y: function(d){ return d.y; },
                        useInteractiveGuideline: true,
                        dispatch: {
                            stateChange: function(e){ console.log("stateChange"); },
                            changeState: function(e){ console.log("changeState"); },
                            tooltipShow: function(e){ console.log("tooltipShow"); },
                            tooltipHide: function(e){ console.log("tooltipHide"); }
                        },
                        xAxis: {
                            axisLabel: 'Date',
                            tickFormat: function(date) { return format(new Date(date)) } 
                        },
                        yAxis: {
                            axisLabel: $scope.settings.referencedPropertyName,
                            
                            axisLabelDistance: -10
                        },
                        callback: function(chart){
                            
                        }
                    }
                };

                $scope.updateLayout = function(){
                    $timeout(function(){
                        if ($scope.api && $scope.api.update) {
                            $scope.api.update();
                        }
                    },200);
                };

                $scope.events = {
                    resize: function(e, scope){
                        $scope.updateLayout();
                    }
                };

                $scope.widgetHandleToChild.updateLayout = $scope.updateLayout;

                $scope.config = { visible: false };

                //make chart visible after grid have been created
                $timeout(function(){
                    $scope.config.visible = true;
                }, 200);

            }
        };
    });