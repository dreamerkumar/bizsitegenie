'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	featureRoles = require('../../../shared/app/controllers/featureroles.server.controller'),
	getUserRoles = require('../../../shared/app/controllers/getuserroles.server.controller'),
	Q = require('q');

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};

/*
* helper function
*/
exports.getAuthorizationType = function(roleList, accessType){
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

	return exports.getDefaultAuthorizationType(accessType);
};

/*
* helper function
*/
exports.getDefaultAuthorizationType = function(accessType){
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

/*
* Three possible scenarios
* 1. Resolved with string value hasAccess
* 2. Resolved with string value hasAccessIfUserCreatedIt
* 3. Rejected
*/
exports.checkAccess = function(req, featureId, accessType){
	var asyncDeferred = Q.defer();

	//get the roles for the feature id
	featureRoles.getByFeatureIdAndAccessType(featureId, accessType)
		.then(function(results){
			
			var authorizationType = exports.getAuthorizationType(results, accessType);

			//if everyone, return true
			if(authorizationType === 'everyone'){
				asyncDeferred.resolve('hasAccess');
				return;
			}

			//If the above does not apply, then the user has to be logged in
			if(!req.isAuthenticated()){
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
				getUserRoles.getUserRoles(req.user._id)
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
};