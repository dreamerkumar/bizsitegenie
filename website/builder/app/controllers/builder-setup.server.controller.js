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
 * Checks if an entry is already made for an app
 * 		If the entry already exists, returns the app id
 * 		If an entry does not exist then sets up the app for first use
 * 			Creates an entry in the app folder
 * 			Creates an entry called build in the roles table
 * 			Creates a new entry called creator in the user groups table
 * 			Creates a user user group user sub entry with the id of the logged in user
 * 			Creates a user group role sub entry with the id of the build role
 *			Returns the app id
 */
exports.setUpAppOrReturnAppId = function(req, res) {
	
	if(!req.user){
		return res.status(400).send({ message: 'Invalid user session'});		
	}

	checkForExistingApp(req.user)
		.then(function(appId){
			res.jsonp(appId);
		})
		.catch(function (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)})
		});
};

function checkForExistingApp(user){
	return Q.Promise(function(resolve, reject, notify) {
		App.find().sort('-created').populate('user', 'displayName').exec(function(err, apps) {
			if (err) { 
				reject(err);
			} else {
				if(apps && apps.length > 0){
					resolve({appId: apps[0]._id});
				} else {
					createApp(user, resolve, reject, notify);
				}
			}
		});
	});
}

/**
 * Create a App
 */
function createApp(user, resolve, reject, notify) {

	var app = new App({
		name: 'Web Application',
		appDescription: 'A bizsitegenie.com web application',
		appKeyword: 'bizsitegenie.com web application',
		appAuthor: user.displayName,
		bootstrapTheme: 'flatly'
	});
	app.user = user;

	app.save(function(err) {
		if (err) { 
			reject(err);
		} else {
			createRole(user, app._id, resolve, reject, notify);
		}
	});

}

/**
 * Create a Role
 */
function createRole(user, appId, resolve, reject, notify) {
	var role = new Role({
		name: 'build'
	});

	role.user = user;

	role.save(function(err) {
		if (err) { 
			reject(err);
		} else {
			createUserGroup(user, appId, role._id, resolve, reject, notify);
		}
	});
}

/**
 * Create a User Group
 */
function createUserGroup(user, appId, roleId, resolve, reject, notify) {
	var userGroup = new UserGroup({
		name: 'creator'
	});

	userGroup.user = user;

	userGroup.save(function(err) {
		if (err) { 
			reject(err);
		} else {
			createUserGroupUser(user, appId, roleId, userGroup._id, resolve, reject, notify);
		}
	});
}

function createUserGroupUser(user, appId, roleId, userGroupId, resolve, reject, notify) {
	var userGroupUser = new UserGroupUser({
		parentId: userGroupId,
		userId: user._id
	});

	userGroupUser.user = user;

	userGroupUser.save(function(err) {
		if (err) { 
			reject(err);
		} else {
			createUserGroupRole(user, appId, roleId, userGroupId, resolve, reject, notify);
		}
	});	
}

function createUserGroupRole(user, appId, roleId, userGroupId, resolve, reject, notify) {
	var userGroupRole = new UserGroupRole({
		parentId: userGroupId,
		roleId: roleId
	});

	userGroupRole.user = user;

	userGroupRole.save(function(err) {
		if (err) { 
			reject(err);
		} else {
			resolve({appId: appId});
		}
	});		
}


