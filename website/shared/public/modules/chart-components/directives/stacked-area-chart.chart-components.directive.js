'use strict';

angular.module('chart-components')

	.directive('stackedAreaChart', function(){

		return {
			restrict: 'E',
			scope: {
				settings: '=',
				widgetHandleToChild: '='
			},
			templateUrl: 'shared/public/modules/chart-components/views/stacked-area-chart.chart-components.directive.view.html',
			controller: function($scope, $timeout, $http, CoreFunctions){
				if(!$scope.settings || !$scope.settings.referencedFeatureName || !$scope.settings.propertyNames){
					console.error('Stacked area chart cannot be configured. Invalid settings', $scope.settings);
					return;
				}
		        var properties = $scope.settings.propertyNames.split(',');
		        var chartData = [];
		        properties.forEach(function(property){
		        	chartData.push({ values: [], key: property})
		        });
		        $http.get($scope.settings.referencedFeatureName).then(function(response) {
                    if(response && response.data && response.data.length){
                        
                        response.data.forEach(function(val){
                        	chartData.forEach(function(entry){
	                            var y = Number(val[CoreFunctions.getPropertyColumnName(entry.key)]); //TODO: remove number parsing when right data type is selected
	                            var x = new Date(val.created);
	                            entry.values.push([x,y]);
                        	});

                        });
                        
                        $scope.data = chartData;
			        }
			    }, function(error){
			    	console.error('Stacked area chart data could not be retrieved', error);
			    	 $scope.data = [];
			    });

		        $scope.options = {
		            chart: {
		                type: 'stackedAreaChart',
				        margin : {
		                    top: 20,
		                    right: 20,
		                    bottom: 30,
		                    left: 40
		                },
		                x: function(d){return d[0];},
		                y: function(d){return d[1];},
		                useVoronoi: false,
		                clipEdge: true,
		                duration: 100,
		                useInteractiveGuideline: true,
		                xAxis: {
		                    showMaxMin: false,
		                    tickFormat: function(d) {
		                        return d3.time.format('%x')(new Date(d))
		                    }
		                },
		                yAxis: {
		                    tickFormat: function(d){
		                        return d3.format(',.2f')(d);
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
