'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	FirstOfFour = mongoose.model('FirstOfFour'),
	_ = require('lodash');

/**
 * Create a First of four
 */
exports.create = function(req, res) {
	var firstOfFour = new FirstOfFour(req.body);
	firstOfFour.user = req.user;

	firstOfFour.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(firstOfFour);
		}
	});
};

/**
 * Show the current First of four
 */
exports.read = function(req, res) {
	res.jsonp(req.firstOfFour);
};

/**
 * Update a First of four
 */
exports.update = function(req, res) {
	var firstOfFour = req.firstOfFour ;

	firstOfFour = _.extend(firstOfFour , req.body);

	firstOfFour.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(firstOfFour);
		}
	});
};

/**
 * Delete an First of four
 */
exports.delete = function(req, res) {
	var firstOfFour = req.firstOfFour ;

	firstOfFour.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(firstOfFour);
		}
	});
};

/**
 * List of First of fours
 */
exports.list = function(req, res) {	
		
	FirstOfFour.find().sort('-created').populate('user', 'displayName').exec(function(err, firstOfFours) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(firstOfFours);
		}
	});
};

/**
 * First of four middleware
 */
exports.firstOfFourByID = function(req, res, next, id) { 
	FirstOfFour.findById(id).populate('user', 'displayName').exec(function(err, firstOfFour) {
		if (err) return next(err);
		if (! firstOfFour) return next(new Error('Failed to load First of four ' + id));
		req.firstOfFour = firstOfFour ;
		next();
	});
};

/**
 * First of four authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.firstOfFour.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
