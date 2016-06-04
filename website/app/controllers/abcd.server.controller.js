'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Abcd = mongoose.model('Abcd'),
	_ = require('lodash'),
	authorization = require('./users/users.authorization.server.controller');;

/**
 * Create a Abcd
 */
exports.create = function(req, res) {
	var abcd = new Abcd(req.body);
	abcd.user = req.user;

	abcd.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(abcd);
		}
	});
};

/**
 * Show the current Abcd
 */
exports.read = function(req, res) {
	res.jsonp(req.abcd);
};

/**
 * Update a Abcd
 */
exports.update = function(req, res) {
	var abcd = req.abcd ;

	abcd = _.extend(abcd , req.body);

	abcd.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(abcd);
		}
	});
};

/**
 * Delete an Abcd
 */
exports.delete = function(req, res) {
	var abcd = req.abcd ;

	abcd.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(abcd);
		}
	});
};

/**
 * Search matching multiple columns to a single search value
 */
exports.search = function(req, res) {	
	var findQueryArray = [];
	var searchKeys = req.query.searchKeys;
	if(!searchKeys){
		return res.status(400).send('Search key(s) missing');
	}
	var searchKeyArray = searchKeys.split(',');
	searchKeyArray.forEach(function(key){
		var findQuery = {};
		findQuery[key] = { "$regex": req.query.searchValue, "$options": "i" };
		findQueryArray.push(findQuery);
	});
	
	Abcd.find().or(findQueryArray)
			.where('user').equals(req.user.id)
			.sort('-created').populate('user', 'displayName').lean().exec(function(err, results) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(results);
		}
	});
};


/**
 * List of Abcds
 */
exports.list = function(req, res) {	
	
	authorization.checkAccess(req, '57509fe4aa937cd61da7591e', 'read')
	.then(function(accessResult){
		var params = {};
		if(accessResult === 'hasAccessIfUserCreatedIt'){
			params.user = req.user.id;
		}
		
		Abcd.find(params)
				.sort('-created').populate('user', 'displayName').exec(function(err, abcd) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(abcd);
			}
		});
	})
	.catch(function(err){
		return res.status(403).send({message: err});
	});
};

/**
 * Abcd middleware
 */
exports.abcdByID = function(req, res, next, id) { 
	Abcd.findById(id).populate('user', 'displayName').exec(function(err, abcd) {
		if (err) return next(err);
		if (! abcd) return next(new Error('Failed to load Abcd ' + id));
		req.abcd = abcd ;
		next();
	});
};

exports.hasReadAuthorization = function(req, res, next) {
	authorization.checkAccess(req, '57509fe4aa937cd61da7591e', 'read')
		.then(function(accessResult){
			if(accessResult === 'hasAccessIfUserCreatedIt'){
				if (!req.user || req.abcd.user.id !== req.user.id) {
					return res.status(403).send('User is not authorized');
				}
			}
			next();

		})
		.catch(function(err){
			return res.status(403).send({message: err});
		});
};


exports.hasCreateAuthorization = function(req, res, next) {
	authorization.checkAccess(req, '57509fe4aa937cd61da7591e', 'create')
		.then(function(accessResult){
			next();

		})
		.catch(function(err){
			return res.status(403).send({message: err});
		});
};

exports.hasEditAuthorization = function(req, res, next) {
	authorization.checkAccess(req, '57509fe4aa937cd61da7591e', 'edit')
		.then(function(accessResult){
			if(accessResult === 'hasAccessIfUserCreatedIt'){
				if (!req.user || req.abcd.user.id !== req.user.id) {
					return res.status(403).send('User is not authorized');
				}
			}
			next();

		})
		.catch(function(err){
			return res.status(403).send({message: err});
		});
};

exports.hasDeleteAuthorization = function(req, res, next) {
	authorization.checkAccess(req, '57509fe4aa937cd61da7591e', 'delete')
		.then(function(accessResult){
			if(accessResult === 'hasAccessIfUserCreatedIt'){
				if (!req.user || req.abcd.user.id !== req.user.id) {
					return res.status(403).send('User is not authorized');
				}
			}
			next();

		})
		.catch(function(err){
			return res.status(403).send({message: err});
		});
};


