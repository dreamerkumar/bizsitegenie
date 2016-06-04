'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Checkbox = mongoose.model('Builder-Checkbox'),
	Email = mongoose.model('Builder-Email'),
	Option11 = mongoose.model('Builder-Option11'),
	Option1 = mongoose.model('Builder-Option1'),
	Password = mongoose.model('Builder-Password'),
	Radio = mongoose.model('Builder-Radio'),
	Select = mongoose.model('Builder-Select'),
	Textarea = mongoose.model('Builder-Textarea'),
	Textbox = mongoose.model('Builder-Textbox'),
	Foreignkeyref = mongoose.model('Builder-Foreignkeyref'),
	Lookupfromprop = mongoose.model('Builder-Lookupfromprop'),
	Q = require('q'),
	_ = require('lodash');

exports.get = function(req, res){

	exports.getAllPropertiesForParentId(req.query.parentId)
		.then(function(result){
			res.jsonp(result);
		})
		.catch(function (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)})
		});
};

exports.getAllPropertiesForParentId = function(parentId){
	return Q.Promise(function(resolve, reject, notify) {
		
		if(!parentId){
			reject('Required parameter parentId missing');
		}

		getProperties(Checkbox, 'checkbox', parentId, [])
		.then(function(result){ return getProperties(Email, 'checkbox', parentId, result); })
		.then(function(result){ return getProperties(Password, 'password', parentId, result); })
		.then(function(result){ return getProperties(Radio, 'radioButtons', parentId, result, Option11); })
		.then(function(result){ return getProperties(Select, 'dropDown', parentId, result, Option1); })
		.then(function(result){ return getProperties(Textarea, 'textarea', parentId, result); })
		.then(function(result){ return getProperties(Textbox, 'textbox', parentId, result); })
		.then(function(result){ return getProperties(Foreignkeyref, 'foreignkeyref', parentId, result); })
		.then(function(result){ return getProperties(Lookupfromprop, 'lookupfromprop', parentId, result); })
		.then(function(result){
			
			result.sort(function(a,b){
				return parseInt(a.positionIndex) - parseInt(b.positionIndex);
			})
			resolve(result);
		})
		.catch(function (err) {
			reject(err);
		});
	});
};

function getProperties(modelRef, itemType, parentId, properties, childCollectionRef){
	return Q.Promise(function(resolve, reject, notify) {
		modelRef.find({parentId: parentId}).sort('positionIndex').exec(function(err, results) {
			if (err) { 
				reject(err);
			} else {
				var childCallError = null;
				properties = properties.concat(results.map(function(val){
					if(childCallError){
						return null;
					}
					var item = { type: itemType, id: val._id, positionIndex: val.positionIndex, label: val.name};
					if(childCollectionRef){
						getChildCollection(val._id, childCollectionRef)
							.then(function(options){
								item.options = options;
							})
							.catch(function(errorInChildCall){
								childCallError = errorInChildCall;
							})
					}
					return item;
				}));
				if(!childCallError){
					resolve(properties);
				} else {
					reject(childCallError);
				}
			}
		});
	});
}

function getChildCollection(parentId, childCollectionRef){
	return Q.Promise(function(resolve, reject, notify) {
		childCollectionRef.find({parentId: parentId}).sort('-created').exec(function(err, results) {
			if (err) { 
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
}
