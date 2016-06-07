'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	FeatureSpreadsheet = mongoose.model('Builder-Featurespreadsheet'),
	Feature = mongoose.model('Builder-Feature'),
	Property = mongoose.model('Builder-Property'),
	Q = require('q');


/*
* @inputParams {featureId: ..., spreadsheetEntries: ..., spreadsheetData: {columns:[..], data: [[..], [..]], columnDataTypes: [..]}
*/
exports.updatePropertyEntriesWithSpreadsheetColumns = function(inputParams) {

	return Q.Promise(function(resolve, reject, notify) {
		if(inputParams.spreadsheetData && inputParams.spreadsheetData.columns && inputParams.spreadsheetData.columns.length) {

		exports.getFeature(inputParams)
			.then(exports.getProperties)
			.then(exports.insertNewProperties)
			.then(exports.saveFeature)
			.then(function(params){
				resolve(params);
			})
			.catch(function(err){
				reject(err);
			});
		} else {
			resolve(inputParams);
		}
	});
};

/*
* @inputParams {featureId: ..., spreadsheetEntries: ..., spreadsheetData: {columns:[..], data: [[..], [..]], columnDataTypes: [..]}
*/
exports.getFeature = function(inputParams) {
	var featureId = inputParams.featureId;
	return Q.Promise(function(resolve, reject, notify) {
		Feature.findById(featureId).lean().exec(function(err, feature){ 
			if (err) {
				reject(err);
			} else {
				if(!feature){
					reject(new Error('Failed to get feature for id ' + featureId));
				} else {
					inputParams.feature = feature;
					inputParams.userId = feature.feature;
					resolve(inputParams);
				}
			}
		});
	});
};

/*
* @inputParams {featureId: ..., feature: ..., spreadsheetEntries: ..., spreadsheetData: {columns:[..], data: [[..], [..]], columnDataTypes: [..]}
*/
exports.getProperties = function(inputParams) {
	var featureId = inputParams.featureId;
	return Q.Promise(function(resolve, reject, notify) {
		var params = {parentId: featureId};

		Property.find(params).lean().exec(function(err, properties) {
			if (err) {
				reject(err);
			} else if(!properties){
					reject(new Error('Failed to get properties for id ' + featureId));
			} else {
				inputParams.properties = properties;
				resolve(inputParams);
			}
		});
	});
};

/*
* @inputParams {featureId: ..., feature: ..., properties: ..., spreadsheetEntries: ..., spreadsheetData: {columns:[..], data: [[..], [..]], columnDataTypes: [..]}
*/
exports.insertNewProperties = function(inputParams) {
	var deferred = Q.defer();
	var spreadsheetData = inputParams.spreadsheetData;
	if(!spreadsheetData || !spreadsheetData.columns || !spreadsheetData.columns.length){
		deferred.resolve(inputParams);
	}

	var ctr = 0;
	function next(){

		var column = spreadsheetData.columns[ctr];
		column = column.trim().toLowerCase();
		var matched = inputParams.properties.filter(function(match){ return match.name.toLowerCase() === column;});
		
		if(matched && matched.length){//already exists			
			inputParams.spreadsheetData.columnDataTypes[ctr] = matched[0].type;
			goToNext();
		} else { //make new entries
			var newEntryObj = {
				name: column,
				type: inputParams.spreadsheetData.columnDataTypes[ctr],
				parentId: inputParams.feature._id,
				user: inputParams.feature.user
			};
			var newProperty = new Property(newEntryObj);
			newProperty.save(function(err, result){
				if(err){
					deferred.reject(err);
				} else {
					inputParams.properties.push(result);
					inputParams.feature.childPropertyPositions.push(result._id);
					goToNext();
				}
			});
		}
	}

	function goToNext(){
		ctr++;
		if(ctr >= spreadsheetData.columns.length){
			deferred.resolve(inputParams);
		} else {
			next();
		}
	}

	next();

	return deferred.promise;
};


/*
* @inputParams {featureId: ..., feature: ..., properties: ..., spreadsheetEntries: ..., spreadsheetData: {columns:[..], data: [[..], [..]], columnDataTypes: [..]}
*/
exports.saveFeature = function(inputParams) {
	var deferred = Q.defer();

	Feature.update({_id: inputParams.featureId}, {$set: {childPropertyPositions: inputParams.feature.childPropertyPositions}}, function(err, result){
		if(err){
			deferred.reject(err);
		} else {
			deferred.resolve(inputParams);
		}
	});

	return deferred.promise;
};


