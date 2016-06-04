'use strict';

angular.module('sharedsecurity').factory('Authorization', function($q, GetUserRoles, Itemroles, Authentication) {
	
	function getAuthorizationType(roleList, accessType){
		var authorizationTypes = [
			'everyone',
			'allloggedinusers',
			'onlycreator',
			'creatorandroles',
			'roles'
		];
		
		if(roleList && roleList.length){
			for(var ctr = 0; ctr < authorizationTypes.length; ctr++){
				var authorizationType = authorizationTypes[ctr];
				if(roleList.indexOf(authorizationType) >= 0){
					return authorizationType;
				}
			}
		}

		return getDefaultAuthorizationType(accessType);
	};


	function getDefaultAuthorizationType(accessType){
		switch(accessType){
			case 'read': 
				return 'everyone';
			case 'create': 
				return 'allloggedinusers';
			case 'edit': 
				return 'creatorandroles';
			case 'delete': 
				return 'creatorandroles';
			case 'manageaccess': 
				return 'creatorandroles';
		}
	};

	return {

		/*
		* Three possible scenarios
		* 1. Resolved with string value hasAccess
		* 2. Resolved with string value hasAccessIfUserCreatedIt
		* 3. Rejected
		*/
		checkAccess: function(featureId, accessType){
			var asyncDeferred = $q.defer();

			//get the roles for the feature id
			Itemroles.query()
				.$promise.then(function(allRoles){
					
					var results = allRoles
						.filter(function(item){ return item.parentId === featureId && item.accesstype === accessType;})
						.map(function(item){
							return item.role;
						});

					var authorizationType = getAuthorizationType(results, accessType);

					//if everyone, return true
					if(authorizationType === 'everyone'){
						asyncDeferred.resolve('hasAccess');
						return;
					}

					//If the above does not apply, then the user has to be logged in
					if(!Authentication || !Authentication.user){
						asyncDeferred.reject('User not authenticated');
						return;
					}

					//if allloggedinusers, return true if user is authenticated
					if(authorizationType === 'allloggedinusers'){
						asyncDeferred.resolve('hasAccess');
						return;
					}

					if(authorizationType === 'onlycreator'){
						asyncDeferred.resolve('hasAccessIfUserCreatedIt');
						return;
					}

					//if creatorandroles or roles
					if(authorizationType === 'creatorandroles' || authorizationType === 'roles'){
						//get the user role list
						GetUserRoles.get().$promise
							.then(function(userRoles){
								
								//check if any feature role matches the user role
								var foundMatchingRole = false;
								for(var ctr = 0; ctr < results.length; ctr++){
									var roleToCheck = results[ctr];
									foundMatchingRole = userRoles[roleToCheck];
									if(foundMatchingRole){
										asyncDeferred.resolve('hasAccess');
										break;
									}
								}
								
								//match not found
								if(!foundMatchingRole){
									//if roles, return false
									if(authorizationType === 'roles'){
										asyncDeferred.reject('User does not have access');
									} else {
										//creatorandroles
										asyncDeferred.resolve('hasAccessIfUserCreatedIt');
										return;
									}
								}
							})
							.catch(function(err){
								asyncDeferred.reject(err);
							});

					} else {
						asyncDeferred.reject('The list of roles for this feature is invalid.');
					}
				})
				.catch(function(err){
					asyncDeferred.reject(err);
				});

			return asyncDeferred.promise;
		}
	};
});