'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	UserGroup = mongoose.model('UserGroup'),
	_ = require('lodash'),
	Q = require('q');

/**
 * Create a Role
 */
exports.create = function(req, res) {
	var newObject = new UserGroup(req.body);
	newObject.user = req.user;

	isNameProper(newObject)
	.then(isDuplicateName)
	.then(function(newObject){
		newObject.save(function(err, newSavedObject) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(newSavedObject);
			}
		});

	})
	.catch(function (err) {
		console.log(err);
		return res.status(400).send({message: errorHandler.getErrorMessage(err)})
	});
};

function isNameProper(newObject) {
	var reservedNames = [];

	return Q.Promise(function(resolve, reject, notify) {
		
		if(!newObject.name){
			reject('Name missing');
		}

		if(!/^[a-zA-Z0-9 _\-]+$/.test(newObject.name)){
			reject('Please remove invalid characters from name. Alphabets, numbers, underscore, dash and spaces are allowed.');
			return;
		};

		var matchesReservedName = false;
		reservedNames.forEach(function(reservedName){
			if(!matchesReservedName && reservedName.toLowerCase() === newObject.name.toLowerCase()){
				matchesReservedName = true;
			}
		});
		if(matchesReservedName){
			reject('This name is reserved. Please use a different name.');
			return;
		}

		resolve(newObject);
	});
};

function isDuplicateName(newObject) {
	return Q.Promise(function(resolve, reject, notify) {

		UserGroup.find({'name': {$regex: new RegExp('^' + newObject.name.toLowerCase(), 'i')}}).exec(function(err, res){ 
			if (err) {
				reject(err);
			} else {
				if(res && res.length > 0){
					reject('Another entry with this name already exists. Please choose a unique name.');
				} else {
					resolve(newObject);
				}
			}
		});
	});
};

/**
 * Show the current User group
 */
exports.read = function(req, res) {
	res.jsonp(req.userGroup);
};

/**
 * Delete an User group
 */
exports.delete = function(req, res) {
	var userGroup = req.userGroup ;
	if(userGroup.name === 'creator'){
		return res.status(400).send({
			message: 'Cannot delete the creator user group'
		});
	}
	userGroup.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userGroup);
		}
	});
};

/**
 * List of User groups
 */
exports.list = function(req, res) {	
		
	UserGroup.find()
			.where('user').equals(req.user.id)
			.sort('-created').populate('user', 'displayName').exec(function(err, userGroups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userGroups);
		}
	});
};

/**
 * User group middleware
 */
exports.userGroupByID = function(req, res, next, id) { 
	UserGroup.findById(id).populate('user', 'displayName').exec(function(err, userGroup) {
		if (err) return next(err);
		if (! userGroup) return next(new Error('Failed to load User group ' + id));
		req.userGroup = userGroup ;
		next();
	});
};

/**
 * User group authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (!req.user || req.userGroup.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
