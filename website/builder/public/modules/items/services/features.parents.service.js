'use strict';

//Gets the list of parent items for a given item
angular.module('items').factory('ItemParents', ['Items', 'Authentication',
	function(Items, Authentication) {
		return {

			getParents: function(item, callback){
				function idExists(id){
					return id && id !== '0';
				}

				function errorFn(err){
					var message;
					if(err.data && err.data.message){
						message = err.data.message;
					} else {
						message = err;
					}
					callback(null, err);
				}

				function getParentsRecursive(parentCrudId, insertAtTopOfThisArray, callback){
					
					if(!idExists(parentCrudId)){
						callback(null, 'parentCrudId missing');
						return;
					}
					if(!insertAtTopOfThisArray || !Array.isArray(insertAtTopOfThisArray))
					{
						callback(null, 'Pass an array to insert values to as the second parameter');
						return;
					}

					Items.get({
						itemId: parentCrudId
					}).$promise.then(function(parentItem){
						var newParent = {
							id: parentItem._id,
							name: parentItem.name,
							positionIndex: parentItem.positionIndex
						};
						insertAtTopOfThisArray.splice(0,0, newParent);
						if(idExists(parentItem.parentCrudId)){
							getParentsRecursive(parentItem.parentCrudId, insertAtTopOfThisArray, callback);
						} else {
							callback(insertAtTopOfThisArray);
						}
					}, errorFn);				
				}

				var parents = [];
				if(!idExists(item.parentCrudId)){
					callback(parents);//return an empty list
					return;
				}

				getParentsRecursive(item.parentCrudId, parents, callback);
			}
		};	
	}
]);