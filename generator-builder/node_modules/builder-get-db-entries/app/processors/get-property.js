'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Property = mongoose.model('Builder-Property'),
	Feature = mongoose.model('Builder-Feature'),
	spreadsheetProcessor = require('../spreadsheet-processors/spreadsheet-processor'),
	Q = require('q');

/**
 * List of Properties
 */
exports.list = function(featureId, next) {	
	if(!featureId){
		next('Cannot get properties. Missing parentId.');
		return;
	}

	spreadsheetProcessor.uploadSpreadsheetSchemaAndData(featureId)
		.then(function(){
			exports.getFeature(featureId)
				.then(exports.getSortedPropertyListForFeature)
				.then(function(result){
					next(null, result);
					return;
				})
				.catch(function (err) {
					next(err);
					return;
				});
		})
		.catch(function (err) {
			next(err);
			return;
		});
};


exports.getFeature = function(featureId) {
	return Q.Promise(function(resolve, reject, notify) {
		Feature.findById(featureId).exec(function(err, res){ 
			if (err) {
				reject(err);
			} else {
				if(!res){
					reject(new Error('Failed to get feature for id ' + featureId));
				} else {
					resolve(res);
				}
			}
		});
	});
};

exports.getSortedPropertyListForFeature = function(parentFeature){
	return Q.Promise(function(resolve, reject, notify) {
		
		var childPropertyPositions = parentFeature.childPropertyPositions;
		var params = {parentId: parentFeature._id};

		Property.find(params).populate('user', 'displayName').lean().exec(function(err, property) {
			if (err) {
				reject(err);
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


