'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Property = mongoose.model('Builder-Property'),
	Q = require('q'),
	Feature = mongoose.model('Builder-Feature'),
	_ = require('lodash'),
	authorization = require('../../../app/controllers/users/users.authorization.server.controller');

/**
 * Create a Property
 */
exports.create = function(req, res) {
	var property = new Property(req.body);
	property.user = req.user;

	property.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(property);
		}
	});
};

/**
 * Show the current Property
 */
exports.read = function(req, res) {
	res.jsonp(req.property);
};

/**
 * Update a Property
 */
exports.update = function(req, res) {
	var property = req.property ;

	property = _.extend(property , req.body);

	property.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(property);
		}
	});
};

/**
 * Delete an Property
 */
exports.delete = function(req, res) {
	var property = req.property;
	exports.deleteEntryFromFeature(property.parentId, property._id)
	.then(
	property.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(property);
		}
	}))
	.catch(function (err) {
		return res.status(400).send({message: errorHandler.getErrorMessage(err)})
	});
};

exports.deleteEntryFromFeature = function(featureId, propertyId){
	return Q.Promise(function(resolve, reject, notify) {
		Feature.findById(featureId).exec(function(err, feature){ 
			if (err) { 
				reject(err);
			} else {
				if(!feature){
					reject(new Error('Failed to get childPropertyPositions for feature ' + featureId));
				} else {
					
					if(feature.childPropertyPositions && feature.childPropertyPositions.length){
						var index = feature.childPropertyPositions.indexOf(propertyId);
						feature.childPropertyPositions.splice(index, 1);
					}
					feature.save(function(saveError) {
						if (saveError) {
							reject({
								message: errorHandler.getErrorMessage(saveError)
							});
						} else {
							resolve(true);
						}
					});
				}
			}
		});
	});
};

/**
 * Search matching multiple columns to a single search value
 */
exports.search = function(req, res) {	
	if(!req.query || !req.query.parentId){
		return res.status(400).send({
			message: 'Required parameter parentId missing'
		});
	}

	var params = {parentId: req.query.parentId};

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
	
	Property.find(params).or(findQueryArray)
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
 * List of Properties
 */
exports.list = function(req, res) {	
	if(!req.query || !req.query.parentId){
		return res.status(400).send({
			message: 'Required parameter parentId missing'
		});
	}

	exports.getFeature(req.query.parentId, req)
		.then(exports.getSortedPropertyListForFeature)
		.then(function(result){
			res.jsonp(result);
		})
		.catch(function (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)})
		});
};

exports.getSortedPropertyListForFeature = function(parentFeature, req){
	return Q.Promise(function(resolve, reject, notify) {
		
		var childPropertyPositions = parentFeature.childPropertyPositions;
		var params = {parentId: parentFeature._id};

		authorization.checkAccess(req, 'property', 'read').then(function(accessResult){
			if(accessResult === 'hasAccessIfUserCreatedIt'){
				params.user = req.user.id;
			}

			Property.find(params).populate('user', 'displayName').lean().exec(function(err, property) {
				if (err) {
					reject(errorHandler.getErrorMessage(err));
				} else {
					//rearrange the property list in the array based on the entries in feature childPropertyPositions
					if(property && property.length && childPropertyPositions && childPropertyPositions.length) {
						property.sort(function(first, second){

							var indexOfFirst = exports.getPositionIndexOfMatchingProperty(childPropertyPositions, first);

							var indexOfSecond = exports.getPositionIndexOfMatchingProperty(childPropertyPositions, second);

							if(indexOfFirst < 0 || indexOfSecond < 0) {
								reject('Missing items on the feature childPropertyPositions');
							}
							return indexOfFirst - indexOfSecond;
						});
					}
					
					resolve(property);
				}
			});
		})
		.catch(function(err){
			reject(err);
		});
	});
};

exports.getPositionIndexOfMatchingProperty = function(childPropertyPositions, property){
	var length = childPropertyPositions.length;
	for(var ctr = 0; ctr < length; ctr++){
		if(childPropertyPositions[ctr] == property._id){
			return ctr;
		}
	}
	return -1;
};

exports.getFeature = function(featureId, req) {
	return Q.Promise(function(resolve, reject, notify) {
		Feature.findById(featureId).exec(function(err, res){ 
			if (err) {
				reject(err);
			} else {
				if(!res){
					reject(new Error('Failed to get feature for id ' + featureId));
				} else {
					resolve(res, req);
				}
			}
		});
	});
};



/**
 * Property middleware
 */
exports.propertyByID = function(req, res, next, id) { 
	Property.findById(id).populate('user', 'displayName').exec(function(err, property) {
		if (err) return next(err);
		if (! property) return next(new Error('Failed to load Property ' + id));
		req.property = property ;
		next();
	});
};

/**
 * Property authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (!req.user || req.property.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.hasReadAuthorization = function(req, res, next) {
	authorization.checkAccess(req, 'property', 'read')
		.then(function(accessResult){
			if(accessResult === 'hasAccessIfUserCreatedIt'){
				if (!req.user || req.property.user.id !== req.user.id) {
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
	authorization.checkAccess(req, 'property', 'create')
		.then(function(accessResult){
			next();

		})
		.catch(function(err){
			return res.status(403).send({message: err});
		});
};

exports.hasEditAuthorization = function(req, res, next) {
	authorization.checkAccess(req, 'property', 'edit')
		.then(function(accessResult){
			if(accessResult === 'hasAccessIfUserCreatedIt'){
				if (!req.user || req.property.user.id !== req.user.id) {
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
	authorization.checkAccess(req, 'property', 'delete')
		.then(function(accessResult){
			if(accessResult === 'hasAccessIfUserCreatedIt'){
				if (!req.user || req.property.user.id !== req.user.id) {
					return res.status(403).send('User is not authorized');
				}
			}
			next();

		})
		.catch(function(err){
			return res.status(403).send({message: err});
		});
};





