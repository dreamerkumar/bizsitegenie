'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	FourthOfFour = mongoose.model('FourthOfFour'),
	_ = require('lodash');

/**
 * Create a Fourth of four
 */
exports.create = function(req, res) {
	var fourthOfFour = new FourthOfFour(req.body);
	fourthOfFour.user = req.user;

	fourthOfFour.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fourthOfFour);
		}
	});
};

/**
 * Show the current Fourth of four
 */
exports.read = function(req, res) {
	res.jsonp(req.fourthOfFour);
};

/**
 * Update a Fourth of four
 */
exports.update = function(req, res) {
	var fourthOfFour = req.fourthOfFour ;

	fourthOfFour = _.extend(fourthOfFour , req.body);

	fourthOfFour.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fourthOfFour);
		}
	});
};

/**
 * Delete an Fourth of four
 */
exports.delete = function(req, res) {
	var fourthOfFour = req.fourthOfFour ;

	fourthOfFour.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fourthOfFour);
		}
	});
};

/**
 * List of Fourth of fours
 */
exports.list = function(req, res) {	
	if(!req.query || !req.query.parentId){
		return res.status(400).send({
			message: 'Required parameter parentId missing'
		});
	}	
	FourthOfFour.find({parentId: req.query.parentId}).sort('-created').populate('user', 'displayName').exec(function(err, fourthOfFours) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fourthOfFours);
		}
	});
};

/**
 * Fourth of four middleware
 */
exports.fourthOfFourByID = function(req, res, next, id) { 
	FourthOfFour.findById(id).populate('user', 'displayName').exec(function(err, fourthOfFour) {
		if (err) return next(err);
		if (! fourthOfFour) return next(new Error('Failed to load Fourth of four ' + id));
		req.fourthOfFour = fourthOfFour ;
		next();
	});
};

/**
 * Fourth of four authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.fourthOfFour.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
