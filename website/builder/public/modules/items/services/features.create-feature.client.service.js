'use strict';

angular.module('items').factory('CreateItemService', function(Items, $q) {
		return {

			createNewItem: function(appId, parentCrudId, itemName) {

				var asyncDeferred = $q.defer();
				
				if(!appId){
					var errorMessage = 'Cannot save. appId is missing';
					console.error(errorMessage);
					asyncDeferred.reject(errorMessage);
					return asyncDeferred.promise;
				}

				if(!itemName || itemName === ''){
					var errorMessage = 'Please enter a item name';
					console.error(errorMessage);
					asyncDeferred.reject(errorMessage);
					return asyncDeferred.promise;
				}

				// Create new Item object
				var item = new Items ({
						parentId: appId,
						name: itemName,
						parentCrudId: parentCrudId
				});

				item.$save(function(response) {
					asyncDeferred.resolve(response);
				}, function(errorResponse) {
					console.error(errorResponse.data.message);
					asyncDeferred.reject(errorResponse.data.message);
				});

				return asyncDeferred.promise;
			}
		};
	}
);





