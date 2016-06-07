/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	FeatureSpreadsheet = mongoose.model('Builder-Featurespreadsheet'),
	Feature = mongoose.model('Builder-Feature'),
	spreadsheetDataGetter = require('./get-rows-from-csv-file-in-s3'),
	dataTypeAnalyzer = require('./data-type-analyzer');
	schemaUpdater = require('./schema-updater'),
	Q = require('q'),
    _str = require('underscore.string'),
    nameProcessor = require('../../../../../common/name-processor');

exports.uploadSpreadsheetSchemaAndData = function(featureId) {	
	return Q.Promise(function(resolve, reject, notify) {

		if(!featureId){
			reject('Cannot get feature spreadsheets. Missing Feature Id.');
			return;
		}

		exports.getFeatureSpreadSheets(featureId)
			.then(spreadsheetDataGetter.getCsvRowsForFeatureSpreadsheetRows)
			.then(dataTypeAnalyzer.setDataTypesForCsvData)
			.then(schemaUpdater.updatePropertyEntriesWithSpreadsheetColumns)
			.then(exports.uploadSpreadsheetDataToMongoDBDatabase)
			.then(exports.updateSpreadsheetUploadStatus)
			.then(function(){
				resolve();
			})
			.catch(function (err) {
				reject(err);
			});
		});
};

/*
* @featureId
*/
exports.getFeatureSpreadSheets = function(featureId) {
	return Q.Promise(function(resolve, reject, notify) {

		FeatureSpreadsheet.find({parentId:featureId}).lean()
			.where('status').equals('uploaded')
			.sort('-created')
			.exec(function(err, results) {
				if (err) {
					reject(err);					
				} else {
					resolve({featureId: featureId, spreadsheetEntries: results});
				}
			});
	});
};

/*
* @inputParams {featureId: ..., spreadsheetEntries: ..., spreadsheetData: {columns:[..], data: [[..], [..]], columnDataTypes: [..]}
*/
exports.updateSpreadsheetUploadStatus = function(inputParams) {
	var deferred = Q.defer();
	if(!inputParams.spreadsheetEntries || !inputParams.spreadsheetEntries.length) {
		deferred.resolve();
	} else {
		var ctr = 0;
		
		function next(){
			var entry = inputParams.spreadsheetEntries[ctr];
			FeatureSpreadsheet.findByIdAndUpdate(entry._id, { $set: { status: entry.status }}, function (err, result) {
			  	if (err) {
			  		deferred.reject(err);
			  	} else {
			  		ctr++;
					if(ctr >= inputParams.spreadsheetEntries.length){
						deferred.resolve();
					} else {
						next();
					}
			  	}
			});
		}

		next();
	}

	return deferred.promise;
};


/*
* @inputParams: @inputParams {featureId: ..., feature: ..., spreadsheetEntries: ..., spreadsheetData: {columns:[..], data: [[..], [..]], columnDataTypes: [..]}
*/
exports.uploadSpreadsheetDataToMongoDBDatabase = function(inputParams){

	return Q.Promise(function(resolve, reject, notify) {
		if(inputParams.spreadsheetData && inputParams.spreadsheetData.columns && inputParams.spreadsheetData.columns.length) {
		
			var rejected = false;
			var featureName = inputParams.feature.name;
			var spreadsheetData = inputParams.spreadsheetData;
			var userId = inputParams.feature.user;

			if(!featureName){
				reject('Cannot update spreadsheet data. Feature name missing');
				rejected = true;
			}

			if(!userId){
				reject('Cannot update spreadsheet data. userId missing');
				rejected = true;
			}

		    if(!rejected) {
			    var featureMongooseCollectionName = exports.getSlugifiedClassName(featureName);
				var Schema = mongoose.Schema;
				var flexibleSchema = new Schema({}, { strict: false, collection: featureMongooseCollectionName });
				var Model = mongoose.model(featureName, flexibleSchema);

				var documents = [];
				spreadsheetData.data.forEach(function(dataRow){
					var documentObject = {};
					for(var ctr = 0; ctr < dataRow.length; ctr++){
						var propertyName = nameProcessor.getSimpleName(spreadsheetData.columns[ctr]);
						var columnDataType = spreadsheetData.columnDataTypes[ctr];
						var propertyData = exports.getDataInRightFormat(dataRow[ctr], columnDataType);
						documentObject[propertyName] = propertyData;
					}
					documentObject['user'] = userId;
					documentObject['created'] = new Date();
					documents.push(documentObject);
				});

			    Model.collection.insert(documents, function(err, result){
			    	if(err) {
				    	reject('Error occured while inserting spreadsheet data for ' + featureName, err);
				    	rejected = true;
			    	} else {
			    		resolve(inputParams)
			    	}
			    });
			}
		} else {
			resolve(inputParams);
		}
	});
};

exports.getSlugifiedClassName =function(name){
	var slugifiedName = _str.slugify(name);
	return _str.classify(slugifiedName);
};

exports.getDataInRightFormat = function(data, columnDataType) {
	if(!data || !data.length){
		return data;
	}
	data = data.trim();

	switch(columnDataType){
		case 'integer':
			return Number(data);
		case 'number':
			return parseFloat(data);
		case 'datetime':
			return Date.parse(data);
		case 'checkbox':
			var lowercase = data.toLowerCase();
			if(lowercase === 'y' || lowercase === 'Y' || lowercase === 'true'){
				return true;
			} else if(lowercase === 'n' || lowercase === 'N' || lowercase === 'false'){
				return false;
			} else {
				return data;
			}
		default:
			return data;
	}
};

