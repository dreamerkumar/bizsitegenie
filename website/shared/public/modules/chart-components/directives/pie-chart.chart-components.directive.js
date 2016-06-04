'use strict';

angular.module('chart-components')

	.directive('pieChart', function(){

		return {
			restrict: 'E',
			scope: {
				settings: '=',
				widgetHandleToChild: '='
			},
			templateUrl: 'shared/public/modules/chart-components/views/pie-chart.chart-components.directive.view.html',
			controller: function($scope, $timeout, $http, CoreFunctions){
				if(!$scope.settings || !$scope.settings.referencedFeatureName || !$scope.settings.referencedPropertyName){
					console.error('Pie chart cannot be configured. Invalid settings', $scope.settings);
					return;
				}
		        
		        $http.get($scope.settings.referencedFeatureName).then(function(response) {
			        $scope.data = [];
			        if(response && response.data && response.data.length){
			        	var keyValues = {};
			        	response.data.forEach(function(val){
			        		var specificPropertyValue = val[CoreFunctions.getPropertyColumnName($scope.settings.referencedPropertyName)];
			        		if(keyValues[specificPropertyValue]){
			        			keyValues[specificPropertyValue] = keyValues[specificPropertyValue] + 1;
			        		} else {
			        			keyValues[specificPropertyValue] = 1;
			        		}

			        	});
			        	var data = [];
		        		for(var key in keyValues){
		        			data.push({key: key, y: keyValues[key]});
		        		}
		        		$scope.data = data;
			        }
			    }, function(error){
			    	console.error('Pie chart data could not be retrieved', error);
			    	 $scope.data = [];
			    });

		        $scope.options = {
		            chart: {
		                type: 'pieChart',
		                x: function(d){return d.key;},
		                y: function(d){return d.y;},
		                showLabels: true,
		                duration: 500,
		                labelThreshold: 0.01,
		                labelSunbeamLayout: true,
		                legend: {
		                    margin: {
		                        top: 5,
		                        right: 35,
		                        bottom: 5,
		                        left: 0
		                    }
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
