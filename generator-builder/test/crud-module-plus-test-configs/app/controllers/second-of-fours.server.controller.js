'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	SecondOfFour = mongoose.model('SecondOfFour'),
	_ = require('lodash');

/**
 * Create a Second of four
 */
exports.create = function(req, res) {
	var secondOfFour = new SecondOfFour(req.body);
	secondOfFour.user = req.user;

	secondOfFour.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(secondOfFour);
		}
	});
};

/**
 * Show the current Second of four
 */
exports.read = function(req, res) {
	res.jsonp(req.secondOfFour);
};

/**
 * Update a Second of four
 */
exports.update = function(req, res) {
	var secondOfFour = req.secondOfFour ;

	secondOfFour = _.extend(secondOfFour , req.body);

	secondOfFour.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(secondOfFour);
		}
	});
};

/**
 * Delete an Second of four
 */
exports.delete = function(req, res) {
	var secondOfFour = req.secondOfFour ;

	secondOfFour.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(secondOfFour);
		}
	});
};

/**
 * List of Second of fours
 */
exports.list = function(req, res) {	
	if(!req.query || !req.query.parentId){
		return res.status(400).send({
			message: 'Required parameter parentId missing'
		});
	}	
	SecondOfFour.find({parentId: req.query.parentId}).sort('-created').populate('user', 'displayName').exec(function(err, secondOfFours) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(secondOfFours);
		}
	});
};

/**
 * Second of four middleware
 */
exports.secondOfFourByID = function(req, res, next, id) { 
	SecondOfFour.findById(id).populate('user', 'displayName').exec(function(err, secondOfFour) {
		if (err) return next(err);
		if (! secondOfFour) return next(new Error('Failed to load Second of four ' + id));
		req.secondOfFour = secondOfFour ;
		next();
	});
};

/**
 * Second of four authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.secondOfFour.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
