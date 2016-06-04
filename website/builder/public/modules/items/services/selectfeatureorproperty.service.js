'use strict';

angular.module('items').factory('SelectItemOrProperty', ['$q', '$uibModal',
	function($q, $uibModal) {
		return {

			getForeignKeyControlProperties: function(referenceType, selectForItemId){
				var asyncDeferred = $q.defer();
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'shared/public/modules/shared-item/views/wrapper-selectitem.client.view.html',
					controller: function($scope, $uibModalInstance){
						$scope.$uibModalInstance = $uibModalInstance;
						$scope.selectForItemId = selectForItemId;
					},
					size: 'lg'
			    });

			    modalInstance.result.then(function (selected) {

			    	if(referenceType === 'lookupfromprop'){
			    		this.processSingleProperty(selected, asyncDeferred);
			    	} else {
			    		this.processMultipleProperties(selected, asyncDeferred);
			    	}

				}.bind(this), function () {
					asyncDeferred.reject('choose item dialog dismissed');
				});
			    return asyncDeferred.promise;
			},

			processSingleProperty: function(selected, asyncDeferred){
				this.getSingleProperty(selected.item)
					.then(function(property){
						
						var result = {
							referencedFeatureName: selected.item.name,
							referencedPropertyName: property.name,
							refId: property._id,
							refDescription: selected.description + '/' + property.name,
							selectorControlType: 'vktypeahead',
							selectorControlAttribute:'attributes_placeholder'
						};			      	
						asyncDeferred.resolve(result);
					},function (error) {
						asyncDeferred.reject(error);
					});
			},

			getSingleProperty: function(item){
				var asyncDeferred = $q.defer();
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'shared/public/modules/shared-item/views/wrapper-selectsingleproperty.client.view.html',
					controller: function($scope, $uibModalInstance){
						$scope.$uibModalInstance = $uibModalInstance;
						$scope.item = item;
					},
					size: 'lg'
			    });

			    modalInstance.result.then(function (selected) {
			      asyncDeferred.resolve(selected);
			    }, function () {
			      asyncDeferred.reject('choose single property dialog dismissed');
			    });

			    return asyncDeferred.promise;
			},

			processMultipleProperties: function(selected, asyncDeferred){
				this.getMultipleProperties(selected.item)
					.then(function(properties){
						
						var result = {
							referencedFeatureName: selected.item.name,
							selectorControlType: 'vktypeahead',
							selectorControlAttribute:'attributes_placeholder',
							referencedFeatureId: selected.item._id,
							propertyNamesForDisplay: properties,
							propertyNamesForSearch: properties,
							referenceDescription: selected.description,
							referenceDisplayFormat: 'display_format_placeholder',
						};			      	
						asyncDeferred.resolve(result);
					},function (error) {
						asyncDeferred.reject(error);
					});
			},

			getMultipleProperties: function(item){
				var asyncDeferred = $q.defer();
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'shared/public/modules/shared-item/views/wrapper-selectmultipleproperties.client.view.html',
					controller: function($scope, $uibModalInstance){
						$scope.$uibModalInstance = $uibModalInstance;
						$scope.item = item;
					},
					size: 'lg'
			    });

			    modalInstance.result.then(function (selected) {
			      asyncDeferred.resolve(selected);
			    }, function () {
			      asyncDeferred.reject('choose multiple properties dialog dismissed');
			    });

			    return asyncDeferred.promise;
			}
		}
	}
]);