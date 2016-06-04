'use strict';

angular.module('shared-item').factory('SelectItemAndProperty', ['$q', '$uibModal',
	function($q, $uibModal) {
		return {

			selectItemAndProperty: function(singleOrMultipleProperties){
				var asyncDeferred = $q.defer();
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'shared/public/modules/shared-item/views/wrapper-selectitem.client.view.html',
					controller: function($scope, $uibModalInstance){
						$scope.$uibModalInstance = $uibModalInstance;
					},
					size: 'lg'
			    });

			    modalInstance.result.then(function (selected) {

			    	if(singleOrMultipleProperties === 'single'){
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
							refDescription: selected.description + '/' + property.name
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
							referencedFeatureId: selected.item._id,
							propertyNames: properties,
							refDescription: selected.description
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