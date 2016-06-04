'use strict';

angular.module('dashboard')

	.directive('dashboardWidget', function(){

		return {
			restrict: 'E',
			scope: {
				widget: '=',
				dashboardId: '@',
				onRemove: '&',
				onUpdate: '&'
			},
			templateUrl: 'shared/public/modules/dashboard/views/dashboard-widget.dashboard.directive.view.html',
			controller: function($scope, Authentication, $uibModal, SelectItemAndProperty){
				
				$scope.handleToChild = {};

				$scope.authentication = Authentication;
				
				$scope.getDirectiveValues = function(){
					return {
						directiveName: $scope.widget.directiveName, 
						directiveAttributes: [
							{name: 'settings', value: 'widget'}, 
							{name: 'widget-handle-to-child', value: 'handleToChild'}
						]
					};
				};
				
				$scope.directiveValues = $scope.getDirectiveValues();
				
				$scope.remove = function(widget) {
			        if($scope.onRemove){
			        	$scope.onRemove()(widget);
			        } else {
			        	console.errror('On remove function not provided');
			        }
			    };

			    $scope.updateWidget = function(newSettings){
			    	angular.extend($scope.widget, newSettings);
			    	//TODO update the widget display when the graph changes
			    	//Right now the graph is not changed on this update. This is for renaming widget for now.
			    	if($scope.onUpdate){
			    		$scope.onUpdate()();
			    	} else {
			    		console.error('onUpdate handler not provided');
			    	}
			    };

			    $scope.setWidgetContentType = function(widgetContentType) {
			    	if(!widgetContentType || !widgetContentType.id){
			    		console.error('No widget content type selected');
			    		return;
			    	}

					$scope.widget.directiveName = widgetContentType.id;
					$scope.widget.widgetContentType = widgetContentType;

					var propertySelectionType = widgetContentType.multipleProperties? 'multiple' : 'single';
			    	
			    	//select a feature
					SelectItemAndProperty.selectItemAndProperty(propertySelectionType).then(function(result){

						if(!result.referencedFeatureName){
							alert('Cannot save. Required attribute referencedFeatureName missing');
							return;
						}
						
					    if(propertySelectionType === 'single'){
						    if(!result.referencedPropertyName){
								alert('Cannot save. Required attribute referencedPropertyName missing');
								return;
							}
						} else {
							if(!result.propertyNames){
								alert('Cannot save. Required attribute referencedPropertyName missing');
								return;
							}
						}
						
						console.log('Successfully got back the selection', result);

						angular.extend($scope.widget, result);

						$scope.directiveValues = $scope.getDirectiveValues();
						$scope.$broadcast('directive-values-changed', $scope.directiveValues);
						if($scope.onUpdate){
				    		$scope.onUpdate()();
				    	} else {
				    		console.error('onUpdate handler not provided');
				    	}
					})
					.catch(function(error){
						console.error(error);
					});
			    };

			    $scope.setWidgetInfo = function(widgetHeading, widgetSubHeading) {

					$scope.widget.widgetHeading = widgetHeading;
					$scope.widget.widgetSubHeading = widgetSubHeading;
					
					if($scope.onUpdate){
			    		$scope.onUpdate()();
			    	} else {
			    		console.error('onUpdate handler not provided');
			    	}					
			    };

			    $scope.openSettings = function(widget) {
			        $uibModal.open({
						scope: $scope,
						templateUrl: 'shared/public/modules/dashboard/views/wrapper-dashboard-widget-settings.dashboard.directive.view.html',
						controller: function($scope, $uibModalInstance){
							$scope.$uibModalInstance = $uibModalInstance;
						}
			        });
			    };

			    $scope.openWidgetContentSelector = function(widget) {
			        $uibModal.open({
						scope: $scope,
						templateUrl: 'shared/public/modules/dashboard/views/wrapper-select-widget-content.dashboard.directive.view.html',
						controller: function($scope, $uibModalInstance){
							$scope.$uibModalInstance = $uibModalInstance;
							$scope.widgetContentType = $scope.widget.widgetContentType;
						},
						size: 'lg'
			        });
			    };

			    $scope.openWidgetInfoEditor = function(widget) {
			        $uibModal.open({
						scope: $scope,
						templateUrl: 'shared/public/modules/dashboard/views/wrapper-set-widget-info.dashboard.directive.view.html',
						controller: function($scope, $uibModalInstance){
							$scope.$uibModalInstance = $uibModalInstance;
							$scope.widgetHeading = $scope.widget.widgetHeading;
							$scope.widgetSubHeading = $scope.widget.widgetSubHeading;
						},
						size: 'lg'
			        });
			    };

			    //subscribe widget on window resize event
				angular.element(window).on('resize', function(e){
					$scope.broadcastWidgetResizeEvent();
				});

				$scope.broadcastWidgetResizeEvent = function(){
					if($scope.handleToChild.updateLayout){
						$scope.handleToChild.updateLayout();
					} else {
						console.error('Cannot update widget contents. Handle to update layout function missing');
					}
				};

				$scope.widget.justGotResized = false;
				$scope.$watch('widget.justGotResized', function(val){
					if($scope.widget.justGotResized){
						console.log('widget.justGotResized');
						$scope.broadcastWidgetResizeEvent();
						$scope.widget.justGotResized = false;
					}
				});
			}
		};
	});