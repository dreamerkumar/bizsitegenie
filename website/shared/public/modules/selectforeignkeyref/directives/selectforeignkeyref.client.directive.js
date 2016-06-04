'use strict';

angular.module('selectforeignkeyref')

	.directive('selectForeignKeyRef', function(){

		return {
			restrict: 'E',
			scope: {
				searchService: '@searchService',
				matchPropertyNames: '@matchPropertyNames',
				bindingModel: '@bindingModel'
			},
			controller: function ($scope, $resource, $injector, CoreFunctions){
	            if(!$scope.matchPropertyNames){
	            	console.error('Invalid configuration: required attribute match-property-names is missing for the select-foreign-key-ref directive');
	            	return;
	            }
	            if(!$scope.searchService){
	            	console.error('Invalid configuration: required attribute search-service is missing for the select-foreign-key-ref directive');
	            	return;
	            }
				var service = $injector.get($scope.searchService);


		    	$scope.search = function (searchValue) {
			        return service.search({
			           		searchKeys: CoreFunctions.getPropertyColumnNames($scope.matchPropertyNames),
			           		searchValue: searchValue
			            }).$promise.then(function(data){

			            	if(data && data.length > 0){
			            		var matchPropertyNamesArray = $scope.matchPropertyNames.split(',');
			            		data.forEach(function(row){
			            			var displayValues = matchPropertyNamesArray.map(function(matchPropertyName){
			            				return matchPropertyName + ': ' + row[CoreFunctions.getPropertyColumnName(matchPropertyName)];
			            			});
			            			row._select_foreign_key_ref_display = displayValues.join(' ');
			            		});
			            	}

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
		        			reference[objOrProperty] = $item;
		        		}
		        	}
		        };
		    },
			link: function(scope, element, attrs){

			},
			templateUrl: 'shared/public/modules/selectforeignkeyref/views/select-foreign-key-ref.client.view.html'
		};
});