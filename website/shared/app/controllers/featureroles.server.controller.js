'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Featureroles = mongoose.model('Featureroles'),
	_ = require('lodash'),
	Q = require('q');

/**
 * Create a Featurerole
 */
exports.create = function(req, res) {
	var featureroles = new Featureroles(req.body);
	featureroles.user = req.user;

	featureroles.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(featureroles);
		}
	});
};

/**
 * Show the current Featurerole
 */
exports.read = function(req, res) {
	res.jsonp(req.featureroles);
};

/**
 * Update a Featurerole
 */
exports.update = function(req, res) {
	var featureroles = req.featureroles ;

	featureroles = _.extend(featureroles , req.body);

	featureroles.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(featureroles);
		}
	});
};

/**
 * Delete an Featurerole
 */
exports.delete = function(req, res) {
	var featureroles = req.featureroles ;

	featureroles.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(featureroles);
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
	
	Featureroles.find().or(findQueryArray)
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


exports.getByAccessType = function(req, res) {	
	if(!req.query.parentId){
		return res.status(400).send({
			message: 'Required parameter parent id missing'
		});
	}
	if(!req.query.accesstype){
		return res.status(400).send({
			message: 'Required parameter accesstype id missing'
		});
	}
	
	exports.getByFeatureIdAndAccessType(req.query.parentId, req.query.accesstype)
		.then(function(result){
			res.jsonp(result);
		})
		.catch(function(err){
			return res.status(400).send({
				message: err
			});
		});
};

exports.getByFeatureIdAndAccessType = function(featureId, accessType) {	
	
	var asyncDeferred = Q.defer();

	if(!featureId){
		asyncDeferred.reject('Required parameter featureId missing');
		return;
	}

	if(!accessType){
		asyncDeferred.reject('Required parameter accessType id missing');
		return;
	}
	
	Featureroles.find({parentId: featureId, accesstype: accessType})
		.exec(function(err, featureroles) {
		if (err) {
			asyncDeferred.reject(errorHandler.getErrorMessage(err));
		} else {
			asyncDeferred.resolve(featureroles.map(function(item){return item.role;}));
		}
	});

	return asyncDeferred.promise;
};

exports.deleteFeatureRole = function(req, res) {	
	if(!req.body.parentId){
		return res.status(400).send({
			message: 'Required parameter parent id missing'
		});
	}
	if(!req.body.accesstype){
		return res.status(400).send({
			message: 'Required parameter accesstype id missing'
		});
	}
	if(!req.body.role){
		return res.status(400).send({
			message: 'Required parameter role id missing'
		});
	}
	Featureroles.remove({parentId: req.body.parentId, accesstype: req.body.accesstype, role: req.body.role})
			.where('user').equals(req.user.id)
			.sort('-created').populate('user', 'displayName').exec(function(err, response) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			
			res.jsonp(response);
		}
	});
};

/**
 * List of Featureroles
 */
exports.list = function(req, res) {	
		
	Featureroles.find().exec(function(err, featureroles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(featureroles);
		}
	});
};

/**
 * Featurerole middleware
 */
exports.featurerolesByID = function(req, res, next, id) { 
	Featureroles.findById(id).populate('user', 'displayName').exec(function(err, featureroles) {
		if (err) return next(err);
		if (! featureroles) return next(new Error('Failed to load Featurerole ' + id));
		req.featureroles = featureroles ;
		next();
	});
};

/**
 * Featurerole authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (!req.user || req.featureroles.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


