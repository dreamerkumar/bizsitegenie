'use strict';

//http://codepen.io/danielemoraschi/pen/qFmol#0
angular.module('chart-components')
    .directive('horzPercentBarChart', function () {
        return {
            restrict: 'E',
            
            scope: {
                settings: '=',
                widgetHandleToChild: '='
            },

            controller: function($scope, $timeout, $http, CoreFunctions){
                if(!$scope.settings || !$scope.settings.referencedFeatureName || !$scope.settings.referencedPropertyName){
                    console.error('Horizontal percent bar chart cannot be configured. Invalid settings', $scope.settings);
                    return;
                }
                
                $http.get($scope.settings.referencedFeatureName).then(function(response) {
                    $scope.data = [];
                    var total = 0;
                    if(response && response.data && response.data.length){
                        var keyValues = {};
                        response.data.forEach(function(val){
                            var specificPropertyValue = val[CoreFunctions.getPropertyColumnName($scope.settings.referencedPropertyName)];
                            if(keyValues[specificPropertyValue]){
                                keyValues[specificPropertyValue] = keyValues[specificPropertyValue] + 1;
                            } else {
                                keyValues[specificPropertyValue] = 1;
                            }
                            total++;
                        });
                        var data = [];
                        for(var key in keyValues){
                            data.push({key: key, percent: Math.round(keyValues[key]*100/total)});
                        }
                        $scope.data = data;
                    }
                }, function(error){
                    console.error('Horizontal percent bar chart data could not be retrieved', error);
                     $scope.data = [];
                });

                $scope.updateLayout = function(){
                    $timeout(function(){
                        // if ($scope.api && $scope.api.update) {
                        //     $scope.api.update();
                        // }
                        //TODO: WRITE FUNCTION TO UPDATE CHART IF IT IS NOT UPDATING BY ITSELF
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
            },

            link: function (scope, element, attrs) {
                scope.$watch('data', function(data) {
                    if(!data){
                        return;
                    }
                    var chart = d3.select(element[0])
                        .append("div").attr("class", "horz-percent-bar-chart")
                        .selectAll('div')
                        .data(data).enter()
                        .append("div")
                        .transition().ease("elastic")
                        .style("width", function(d) { return d.percent + "%"; })
                        .text(function(d) { return d.key + ' ' + d.percent + "%"; });
                });
            }
        };
    });