'use strict';

//Items service used to communicate Items REST endpoints
angular.module('items').filter('parentCrudOnly', function(){
	return function(items, name){
		var filtered = [];
		if(items){
			items.forEach(function(item){
				if(item.parentCrudId === '0' || item.parentCrudId === 0 || !item.parentCrudId){
					filtered.push(item);
				}
			});
		}
		return filtered;
	};
});
