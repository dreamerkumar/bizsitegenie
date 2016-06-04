'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Property = mongoose.model('Builder-Property'),
	Feature = mongoose.model('Builder-Feature'),
	Q = require('q'),
	_ = require('lodash');

exports.addMultipleProperties = function(req, res){
	var user = req.user;
	if(!user){
		return res.status(400).send({message: 'Cannot save. Missing user id.'});
	}
	var parentId = req.body.parentId;
	if(!parentId){
		return res.status(400).send({message: 'Cannot save. Missing parentId.'});
	}

	var type = req.body.type;
	if(!type){
		type = 'textbox';
	}

	var propertyNames = req.body.propertyNames;
	if(!propertyNames || !propertyNames.length){
		return res.status(400).send({message: 'Cannot save. Missing property names.'});
	}
	var propertyNameArray = propertyNames.split(',');

	//remove spaces and turn to lower case
	propertyNameArray = propertyNameArray.map(function(val){
		return _.trim(val).toLowerCase();
	});

	//remove empty entries
	propertyNameArray = propertyNameArray.filter(function(e){return e;}); 

	if(!propertyNameArray.length){
		return res.status(400).send({message: 'Cannot save. Missing property names.'});
	}

	//make it unique
	propertyNameArray = _.uniq(propertyNameArray);

	//Get an array of promises from the array of property names
	var validationPromises = propertyNameArray.map(function(propertyName){return isValidPropertyNameAndNotDuplicate(propertyName, parentId);});

	Q.all(validationPromises)
		.then(function(names){

			//Get an array of promises for saving property names
			var savePromises = propertyNameArray.map(function(name){ return createNewProperty(name, parentId, type, user);});
		
			Q.all(savePromises).then(function(results){

				//Once the properties are saved, we need to update the property positions array for the feature
				getFeatureById(parentId, results)
				.then(function(feature){ return updatePropertyPositions(feature, results); })
				.then(function(){
					return res.status(200).send({message: 'Properties added successfully.'})
				})
				.catch(function (err) {
					return res.status(400).send({message: errorHandler.getErrorMessage(err)})
				});
			})
			.catch(function (err) {
				return res.status(400).send({message: errorHandler.getErrorMessage(err)})
			});
		})
		.catch(function (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)})
		});
};

function getFeatureById(id){

	return Q.Promise(function(resolve, reject, notify) {
		Feature.findById(id).populate('user', 'displayName').exec(function(err, feature) {
			if (err) {
				reject(err);
			} else if (!feature) {
				reject(new Error('Failed to load Feature ' + id));
			} else {
				resolve(feature);
			}
		});
	});
}

function updatePropertyPositions(feature, properties){
	return Q.Promise(function(resolve, reject, notify) {

		var childPropertyPositions = feature.childPropertyPositions;
		childPropertyPositions = childPropertyPositions || [];
		var newIds = properties.map(function(item){return item._id;});
		childPropertyPositions = newIds.concat(childPropertyPositions);
		
		Feature.findByIdAndUpdate(feature._id, { 
			$set: { 
			    'childPropertyPositions':childPropertyPositions       
			 }
		}).exec(function(err, res){ 
			if (err) { 
				reject(err);
			} else {
				if(!res){
					reject(new Error('Failed to update childPropertyPositions for feature ' + feature._id));
				} else {
					resolve(res);
				}
			}
		});
	});
}

function createNewProperty(propertyName, parentId, type, user) {
	return Q.Promise(function(resolve, reject, notify) {
		
		var property = new Property({name: propertyName, parentId: parentId, type: type, user: user});	
		property.save(function(err) {
			if (err) {
				reject(errorHandler.getErrorMessage(err));
			} else {
				resolve(property);
			}
		});
	});
};

function isValidPropertyNameAndNotDuplicate(propertyName, parentId) {
	return Q.Promise(function(resolve, reject, notify) {

		if(!propertyName){
			reject('Name missing');

		} else

		if(/^[0-9].*$/.test(propertyName)){
			reject('Name cannot start with a number: ' + propertyName);

		} else if(!/^[a-zA-Z0-9\s]+$/.test(propertyName)){

			reject('Name should only contain alphabets, numbers and spaces: ' + propertyName);
		} else {

			Property.find({'name': {$regex: new RegExp('^' + propertyName, 'i')}, parentId: parentId}).exec(function(err, res){ 
				if (err) { 
					reject(err);
				} else {
					if(res && res.length > 0){
						reject('Another property with name \'' + propertyName + '\' already exists.');
					} else {
						resolve(propertyName);
					}
				}
			});
		}
	});
};


