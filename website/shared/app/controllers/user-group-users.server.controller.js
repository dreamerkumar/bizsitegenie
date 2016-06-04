'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	UserGroupUser = mongoose.model('UserGroupUser'),
	_ = require('lodash');

/**
 * Create a User group user
 */
exports.create = function(req, res) {
	var userGroupUser = new UserGroupUser(req.body);
	userGroupUser.user = req.user;

	userGroupUser.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userGroupUser);
		}
	});
};

/**
 * Show the current User group user
 */
exports.read = function(req, res) {
	res.jsonp(req.userGroupUser);
};

/**
 * Update a User group user
 */
exports.update = function(req, res) {
	var userGroupUser = req.userGroupUser ;

	userGroupUser = _.extend(userGroupUser , req.body);

	userGroupUser.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userGroupUser);
		}
	});
};

/**
 * Delete an User group user
 */
exports.delete = function(req, res) {
	var userGroupUser = req.userGroupUser ;

	userGroupUser.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userGroupUser);
		}
	});
};

/**
 * List of User group users
 */
exports.list = function(req, res) {	
	if(!req.query || !req.query.parentId){
		return res.status(400).send({
			message: 'Required parameter parentId missing'
		});
	}	
	UserGroupUser.find({parentId: req.query.parentId})
			.where('user').equals(req.user.id)
			.sort('-created').populate('userId', 'displayName').exec(function(err, userGroupUsers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userGroupUsers);
		}
	});
};

/**
 * User group user middleware
 */
exports.userGroupUserByID = function(req, res, next, id) { 
	UserGroupUser.findById(id).populate('userId', 'displayName').populate('user', 'displayName').exec(function(err, userGroupUser) {
		if (err) return next(err);
		if (! userGroupUser) return next(new Error('Failed to load User group user ' + id));
		req.userGroupUser = userGroupUser ;
		next();
	});
};

/**
 * User group user authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (!req.user || req.userGroupUser.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
