'use strict';

angular.module('chart-components')

    .directive('historicalBarChart', function () {
        return {
            restrict: 'E',
            
            scope: {
                settings: '=',
                widgetHandleToChild: '='
            },
            templateUrl: 'shared/public/modules/chart-components/views/historical-bar-chart.chart-components.directive.view.html',
            controller: function($scope, $timeout, $http, CoreFunctions){
                if(!$scope.settings || !$scope.settings.referencedFeatureName || !$scope.settings.referencedPropertyName){
                    console.error('Historicalß bar chart cannot be configured. Invalid settings', $scope.settings);
                    return;
                }
                
                $http.get($scope.settings.referencedFeatureName).then(function(response) {
                    if(response && response.data && response.data.length){
                        var data = [];
                        response.data.forEach(function(val){
                            var specificPropertyValue = Number(val[CoreFunctions.getPropertyColumnName($scope.settings.referencedPropertyName)]);
                            data.push([new Date(val.created),specificPropertyValue]);
                        });

                        $scope.data = [{
                            "key" : $scope.settings.referencedPropertyName,
                            "bar": true,
                            "values" : data
                        }];
                    }
                }, function(error){
                    console.error('Historical bar chart data could not be retrieved', error);
                     $scope.data = [];
                });


                $scope.options = {
                    chart: {
                        type: 'historicalBarChart',
                        margin : {
                            top: 20,
                            right: 90,
                            bottom: 125,
                            left: 50
                        },
                        x: function(d){return d[0];},
                        y: function(d){return d[1];},
                        showValues: true,
                        valueFormat: function(d){
                            return d3.format(',.1f')(d);
                        },
                        duration: 100,
                        xAxis: {
                            axisLabel: '',
                            tickFormat: function(d) {
                                return d3.time.format('%c')(new Date(d))
                            },
                            rotateLabels: 30,
                            showMaxMin: false
                        },
                        yAxis: {
                            axisLabel: $scope.settings.referencedPropertyName,
                            axisLabelDistance: -10,
                            tickFormat: function(d){
                                return d3.format(',.1f')(d);
                            }
                        },
                        tooltip: {
                            keyFormatter: function(d) {
                                return d3.time.format('%c')(new Date(d));
                            }
                        },
                        zoom: {
                            enabled: true,
                            scaleExtent: [1, 10],
                            useFixedDomain: false,
                            useNiceScale: false,
                            horizontalOff: false,
                            verticalOff: true,
                            unzoomEventType: 'dblclick.zoom'
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