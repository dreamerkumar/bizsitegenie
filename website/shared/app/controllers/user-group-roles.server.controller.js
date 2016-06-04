'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	UserGroupRole = mongoose.model('UserGroupRole'),
	_ = require('lodash');

/**
 * Create a User group role
 */
exports.create = function(req, res) {
	var userGroupRole = new UserGroupRole(req.body);
	userGroupRole.user = req.user;

	userGroupRole.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userGroupRole);
		}
	});
};

/**
 * Show the current User group role
 */
exports.read = function(req, res) {
	res.jsonp(req.userGroupRole);
};


/**
 * Delete an User group role
 */
exports.delete = function(req, res) {
	var userGroupRole = req.userGroupRole ;

	userGroupRole.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userGroupRole);
		}
	});
};

/**
 * List of User group roles
 */
exports.list = function(req, res) {	
	if(!req.query || !req.query.parentId){
		return res.status(400).send({
			message: 'Required parameter parentId missing'
		});
	}	
	UserGroupRole.find({parentId: req.query.parentId})
			.where('user').equals(req.user.id)
			.sort('-created').populate('roleId', 'name').populate('user', 'displayName').exec(function(err, userGroupRoles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userGroupRoles);
		}
	});
};

/**
 * User group role middleware
 */
exports.userGroupRoleByID = function(req, res, next, id) { 
	UserGroupRole.findById(id).populate('roleId', 'name').populate('user', 'displayName').exec(function(err, userGroupRole) {
		if (err) return next(err);
		if (! userGroupRole) return next(new Error('Failed to load User group role ' + id));
		req.userGroupRole = userGroupRole ;
		next();
	});
};

/**
 * User group role authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (!req.user || req.userGroupRole.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
