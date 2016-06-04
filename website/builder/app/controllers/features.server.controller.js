'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Feature = mongoose.model('Builder-Feature'),
	Q = require('q'),
	_ = require('lodash');

/**
 * Create a Feature
 */
exports.create = function(req, res) {
	var feature = new Feature(req.body);
	feature.user = req.user;

	isNameProper(feature)
	.then(isDuplicateName)
	.then(setPositionIndex)
	.then(function(feature){
		feature.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(feature);
			}
		});

	})
	.catch(function (err) {
		return res.status(400).send({message: errorHandler.getErrorMessage(err)})
	});
};

function setPositionIndex(feature){
	return Q.Promise(function(resolve, reject, notify) {

		var params = {parentId: feature.parentId};

		if(!feature.parentCrudId || feature.parentCrudId === '0' || feature.parentCrudId === 0){
			params.parentCrudId = '0';
			feature.parentCrudId = '0';
		} else {
			params.parentCrudId = feature.parentCrudId
		}

		Feature.find(params).exec(function(err, features) {
			if (err) {
				reject(err);
			} else {
				if(features && features.length > 0){
					feature.positionIndex = features.length + 1;
				} else {
					feature.positionIndex = 1;
				}
				resolve(feature);
			}
		});
	});
};

function isNameProper(feature) {
	var reservedModuleNames = ['app', 'apps', 'feature', 'features', 'property', 'break','case','class','catch','const','continue','debugger','default','delete','do','else','export','extends',
		'finally','for','function','if','import','in','instanceof','new','return','super','switch','this','throw','try','typeof','var','void','while',
		'with','yield','enum','implements','package','protected','static','let','interface','private','public','await','abstract','boolean','byte','char',
		'double','final','float','goto','int','long','native','short','synchronized','throws','transient','volatile','user','users','option','options','role',
		'roles','userGroup','userGroups','userGroupRole', 'userGroupRoles', 'userGroupUser', 'userGroupUsers', 'visualizations', 'featureroles'];

	return Q.Promise(function(resolve, reject, notify) {
		
		if(!feature.name){
			reject('Feature name missing');
		}

		if(/^[0-9].*$/.test(feature.name)){
			reject('Name cannot start with a number');
		};

		if(!/^[a-zA-Z0-9]+$/.test(feature.name)){
			reject('Name should only contain alphabets and numbers');
		};

		var matchesReservedName = false;
		reservedModuleNames.forEach(function(moduleName){
			if(!matchesReservedName && moduleName.toLowerCase() === feature.name.toLowerCase()){
				matchesReservedName = true;
			}
		});
		if(matchesReservedName){
			reject('This name is reserved. Please use a different name for your feature');
		}

		resolve(feature);
	});
};

function isDuplicateName(feature) {
	return Q.Promise(function(resolve, reject, notify) {

		Feature.find({'name': {$regex: new RegExp('^' + feature.name.toLowerCase(), 'i')}}).exec(function(err, res){ 
			if (err) { 
				reject(err);
			} else {
				if(res && res.length > 0){
					reject('Another feature with this name already exists. Please choose a unique name.');
				} else {
					resolve(feature);
				}
			}
		});
	});
};

/**
 * Show the current Feature
 */
exports.read = function(req, res) {
	res.jsonp(req.feature);
};

/**
 * Update a Feature
 */
exports.update = function(req, res) {
	var feature = req.feature ;
	//todo: check for name issues before updating the feature
	feature = _.extend(feature , req.body);

	feature.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(feature);
		}
	});
};

/**
 * Delete an Feature
 */
exports.delete = function(req, res) {
	var feature = req.feature ;
	//todo: delete child properties as well
	feature.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(feature);
		}
	});
};

/**
 * List of Features
 */
exports.list = function(req, res) {	
	if(!req.query || !req.query.parentId){
		return res.status(400).send({
			message: 'Required parameter parentId missing'
		});
	}

	var params = {parentId: req.query.parentId};
	if(req.query.parentCrudId){		
		params.parentCrudId = req.query.parentCrudId;
	}
	Feature.find(params).sort('-created').populate('user', 'displayName').exec(function(err, features) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(features);
		}
	});
};

/**
 * Feature middleware
 */
exports.featureByID = function(req, res, next, id) { 
	Feature.findById(id).populate('user', 'displayName').exec(function(err, feature) {
		if (err) return next(err);
		if (! feature) return next(new Error('Failed to load Feature ' + id));
		req.feature = feature;
		next();
	});
};

/**
 * Feature authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.feature.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
