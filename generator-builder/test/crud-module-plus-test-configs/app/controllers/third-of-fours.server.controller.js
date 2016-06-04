'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ThirdOfFour = mongoose.model('ThirdOfFour'),
	_ = require('lodash');

/**
 * Create a Third of four
 */
exports.create = function(req, res) {
	var thirdOfFour = new ThirdOfFour(req.body);
	thirdOfFour.user = req.user;

	thirdOfFour.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(thirdOfFour);
		}
	});
};

/**
 * Show the current Third of four
 */
exports.read = function(req, res) {
	res.jsonp(req.thirdOfFour);
};

/**
 * Update a Third of four
 */
exports.update = function(req, res) {
	var thirdOfFour = req.thirdOfFour ;

	thirdOfFour = _.extend(thirdOfFour , req.body);

	thirdOfFour.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(thirdOfFour);
		}
	});
};

/**
 * Delete an Third of four
 */
exports.delete = function(req, res) {
	var thirdOfFour = req.thirdOfFour ;

	thirdOfFour.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(thirdOfFour);
		}
	});
};

/**
 * List of Third of fours
 */
exports.list = function(req, res) {	
	if(!req.query || !req.query.parentId){
		return res.status(400).send({
			message: 'Required parameter parentId missing'
		});
	}	
	ThirdOfFour.find({parentId: req.query.parentId}).sort('-created').populate('user', 'displayName').exec(function(err, thirdOfFours) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(thirdOfFours);
		}
	});
};

/**
 * Third of four middleware
 */
exports.thirdOfFourByID = function(req, res, next, id) { 
	ThirdOfFour.findById(id).populate('user', 'displayName').exec(function(err, thirdOfFour) {
		if (err) return next(err);
		if (! thirdOfFour) return next(new Error('Failed to load Third of four ' + id));
		req.thirdOfFour = thirdOfFour ;
		next();
	});
};

/**
 * Third of four authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.thirdOfFour.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
