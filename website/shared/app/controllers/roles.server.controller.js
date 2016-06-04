'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Role = mongoose.model('Role'),
	_ = require('lodash'),
	Q = require('q');


/**
 * Create a Role
 */
exports.create = function(req, res) {
	var newObject = new Role(req.body);
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
	var reservedNames = ['everyone', 'allloggedinusers', 'onlycreator', 'creatorandroles', 'roles'];

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

		Role.find({'name': {$regex: new RegExp('^' + newObject.name.toLowerCase(), 'i')}}).exec(function(err, res){ 
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
 * Show the current Role
 */
exports.read = function(req, res) {
	res.jsonp(req.role);
};

/**
 * Update a Role
 */
exports.update = function(req, res) {
	var role = req.role ;

	role = _.extend(role , req.body);

	role.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(role);
		}
	});
};

/**
 * Delete an Role
 */
exports.delete = function(req, res) {
	var role = req.role ;
	if(role.name === 'build'){
		return res.status(400).send({
			message: 'Cannot delete the build role'
		});
	}
	role.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(role);
		}
	});
};

/**
 * List of Roles
 */
exports.list = function(req, res) {	
		
	Role.find()
			.where('user').equals(req.user.id)
			.sort('-created').populate('user', 'displayName').exec(function(err, roles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(roles);
		}
	});
};

exports.buildRoleStatus = function(req, res){
	Role.find({name: 'build'}).exec(function(err, roles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if(roles.length > 0){
				res.jsonp({exists: true});
			} else {
				res.jsonp({exists: false});
			}
		}
	});
}

/**
 * Role middleware
 */
exports.roleByID = function(req, res, next, id) { 
	Role.findById(id).populate('user', 'displayName').exec(function(err, role) {
		if (err) return next(err);
		if (! role) return next(new Error('Failed to load Role ' + id));
		req.role = role ;
		next();
	});
};

/**
 * Role authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (!req.user || req.role.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
