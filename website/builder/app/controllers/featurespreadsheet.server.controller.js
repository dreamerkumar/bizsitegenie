'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Featurespreadsheet = mongoose.model('Builder-Featurespreadsheet'),
	_ = require('lodash');

/**
 * Create a Featurespreadsheet
 */
exports.create = function(req, res) {
	var featurespreadsheet = new Featurespreadsheet(req.body);
	featurespreadsheet.user = req.user;
	featurespreadsheet.updated = new Date();
	featurespreadsheet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(featurespreadsheet);
		}
	});
};

/**
 * Show the current Featurespreadsheet
 */
exports.read = function(req, res) {
	res.jsonp(req.featurespreadsheet);
};

/**
 * Update a Featurespreadsheet
 */
exports.update = function(req, res) {
	var featurespreadsheet = req.featurespreadsheet;

	featurespreadsheet = _.extend(featurespreadsheet , req.body);
	featurespreadsheet.updated = new Date();

	featurespreadsheet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(featurespreadsheet);
		}
	});
};

/**
 * Delete an Featurespreadsheet
 */
exports.delete = function(req, res) {
	var featurespreadsheet = req.featurespreadsheet ;

	featurespreadsheet.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(featurespreadsheet);
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
	
	Featurespreadsheet.find().or(findQueryArray)
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
 * List of Featurespreadsheets
 */
exports.list = function(req, res) {	
		
	Featurespreadsheet.find()
			.where('user').equals(req.user.id)
			.sort('-created').populate('user', 'displayName').exec(function(err, featurespreadsheet) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(featurespreadsheet);
		}
	});
};

/**
 * Featurespreadsheet middleware
 */
exports.featurespreadsheetByID = function(req, res, next, id) { 
	Featurespreadsheet.findById(id).populate('user', 'displayName').exec(function(err, featurespreadsheet) {
		if (err) return next(err);
		if (! featurespreadsheet) return next(new Error('Failed to load Featurespreadsheet ' + id));
		req.featurespreadsheet = featurespreadsheet ;
		next();
	});
};

/**
 * Featurespreadsheet authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (!req.user || req.featurespreadsheet.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


