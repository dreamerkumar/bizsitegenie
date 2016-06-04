'use strict';

angular.module('lookupfromproperty')

	.directive('lookupFromProperty', function(){

		return {
			restrict: 'E',
			scope: {
				searchService: '@searchService',
				matchPropertyName: '@matchPropertyName',
				bindingModel: '@bindingModel'
			},
			controller: function ($scope, $resource, $injector){
	            if(!$scope.matchPropertyName){
	            	console.error('Invalid configuration: required attribute match-property-name is missing for the lookup-from-property directive');
	            	return;
	            }
	            if(!$scope.searchService){
	            	console.error('Invalid configuration: required attribute search-service is missing for the lookup-from-property directive');
	            	return;
	            }
				var service = $injector.get($scope.searchService);


		    	$scope.search = function (searchValue) {
			        return service.search({
			           		searchKeys: $scope.matchPropertyName,
			           		searchValue: searchValue
			            }).$promise.then(function(data){
			                return data;
			            
			            }, function(error){
			                console.error('The following error occured while calling the search service' + $scope.searchService + ': ');
			                console.error(error);
			           });
		        };

		        $scope.typeaheadOnSelect = function($item, $model, $label){
		        	var bindingModel = $scope.bindingModel;
		        	if(!bindingModel){
		        		console.error('Binding model not assigned');
		        		return;
		        	}
		        	
		        	//The binding model can be in the format topLevel.oneLevelLower....propertyName
		        	var bindingModelArray = bindingModel.split('.');
		        	var reference = $scope.$parent;
		        	for(var ctr = 0; ctr < bindingModelArray.length; ctr++){

		        		var objOrProperty = bindingModelArray[ctr];

		        		var last = ctr === bindingModelArray.length -1;
		        		if(!last){
		        			//get handle to a child level object
		        			reference = reference[objOrProperty];		        			
		        		} else {
		        			//assign the value to the property
		        			reference[objOrProperty] = $model;
		        		}
		        	}
		        };
		    },
			link: function(scope, element, attrs){

			},
			templateUrl: 'shared/public/modules/lookupfromproperty/views/lookupfromproperty.client.view.html'
		};
});