'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Feature = mongoose.model('Builder-Feature'),
	App = mongoose.model('Builder-App'),
	Checkbox = mongoose.model('Builder-Checkbox'),
	Email = mongoose.model('Builder-Email'),
	Option11 = mongoose.model('Builder-Option11'),
	Option1 = mongoose.model('Builder-Option1'),
	Password = mongoose.model('Builder-Password'),
	Radio = mongoose.model('Builder-Radio'),
	Select = mongoose.model('Builder-Select'),
	Textarea = mongoose.model('Builder-Textarea'),
	Textbox = mongoose.model('Builder-Textbox'),
	Property = mongoose.model('Builder-Property'),
	getAllProperties = require('./property.server.controller.js'),
	Q = require('q'),
	_ = require('lodash');	

exports.get = function(req, res){
		
		exports.getAppId(req)
		.then(exports.getFeatureListArray, req)
		.then(exports.retriveFeaturesData)
		.then(function(features){
			res.jsonp(features);
		})
		.catch(function (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)})
		});
};

exports.getAppId = function(req){
	return Q.Promise(function(resolve, reject, notify) {
		App.find().sort('-created').exec(function(err, apps) { //todo: make sure we filter in case we decide to have more than one app
			if (err) {
				reject(err);
			} else if(!apps || apps.length <= 0){
				reject('The parent app could not be found');
			} else {
				resolve(apps[0]._id);
			}
		});
	});
}

exports.getFeatureListArray = function(parentId, parentCrudId, req) {	
	return Q.Promise(function(resolve, reject, notify) {
		if(!parentId){
			reject('Parent Id missing');
		}

		var params = {parentId: parentId};
		if(!parentCrudId){
			parentCrudId = 0;
		}
		params.parentCrudId = parentCrudId;
		Feature.find(params).sort('-created').lean().exec(function(err, features) {
			if (err) {
				reject(err)
			} else {
				resolve(features, req);
			}
		});
	});
};

exports.retriveFeaturesData = function(features, req){
	return Q.Promise(function(resolve, reject, notify) {

		if(!features || features.length <= 0){
			resolve(features, req);
			return;
		}

		var ctr = 0;
		features.forEach(function(feature){
			exports.retrieveAndSetProperties(feature, req)
			.then(exports.populateChildModules)
			.then(function(feature){
				ctr++;
				if(ctr === features.length){
					resolve(features, req);
				}				
			})
			.catch(function (err) {
				reject(err);
			});		
		});

	});
};

exports.retrieveAndSetProperties = function(feature, req){
	return Q.Promise(function(resolve, reject, notify) {

		getAllProperties.getSortedPropertyListForFeature(feature, req)
		.then(function(properties){
			feature.properties = properties;
			resolve(feature, req);
		})
		.catch(function (err) {
			reject(err);
		});
	});
};

exports.populateChildModules = function(feature){
	return Q.Promise(function(resolve, reject, notify) {

		exports.getFeatureListArray(feature.parentId, feature._id)
		.then(exports.retriveFeaturesData)
		.then(function(features){
			feature.children = features;
			
			resolve(feature);
		})
		.catch(function (err) {
			reject(err);
		});
	});
};
