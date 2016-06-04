'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	App = mongoose.model('Builder-App'),
	Role = mongoose.model('Role'),
	UserGroup = mongoose.model('UserGroup'),
	UserGroupUser = mongoose.model('UserGroupUser'),
	UserGroupRole = mongoose.model('UserGroupRole'),
	Q = require('q'),
	_ = require('lodash');

/**
 * Gets the list of roles for the logged in user
 * 		First gets the list of user group user entries which has the logged in user id
 * 		Then gets the corresponding user groups
 *		Then gets the corresponding user group role ids
 * 		Then gets the corresponding role names
 *		Returns a json with roleName: true values
 */
 exports.getUserRoles = function(userId){

 	var asyncDeferred = Q.defer();

 	if(!userId){
 		asyncDeferred.reject('User id missing');
 		return;
 	}

	getUserGroupUserIds(userId)
		.then(getUserGroupRoleIds)
		.then(getUserGroupRoleNames)
		.then(function(roles){
			asyncDeferred.resolve(roles);
		})
		.catch(function (err) {
			asyncDeferred.reject(errorHandler.getErrorMessage(err));
		});

	return asyncDeferred.promise;
};

exports.get = function(req, res) {
	if(!req.user){
		return res.status(400).send({ message: 'Invalid user session'});		
	}

	exports.getUserRoles(req.user._id)
		.then(function(results){
			res.jsonp(results);
		})
		.catch(function(err){
			return res.status(400).send({message: err})
		});
};

function getUserGroupUserIds(userId){
	return Q.Promise(function(resolve, reject, notify) {
		UserGroupUser.find({userId: userId}).exec(function(err, results) {
			if (err) {
				reject(err);
			} else {
				if(results && results.length > 0){
					resolve(results.map(function(val){
						return val.parentId;
					}));
				} else {
					resolve([]);
				}
			}
		});
	});
}

function getUserGroupRoleIds(userGroupIds){
	return Q.Promise(function(resolve, reject, notify) {
		UserGroupRole.find({parentId: {$in: userGroupIds}}).exec(function(err, results) {
			if (err) {
				reject(err);
			} else {
				if(results && results.length > 0){
					resolve(results.map(function(val){
						return val.roleId;
					}));
				} else {
					resolve([]);
				}
			}
		});
	});
}

function getUserGroupRoleNames(roleIds){
	return Q.Promise(function(resolve, reject, notify) {
		Role.find({_id: {$in: roleIds}}).exec(function(err, results) {
			if (err) {
				reject(err);
			} else {
				if(results && results.length > 0){
					var roles = {};
					results.forEach(function(role){
						roles[role.name] = true;
					});
					resolve(roles);
				} else {
					resolve({});
				}
			}
		});
	});
}
