'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	FeatureSpreadsheet = mongoose.model('Builder-Featurespreadsheet'),
	Feature = mongoose.model('Builder-Feature'),
	Q = require('q');


/*
* @inputParams {featureId: ..., spreadsheetEntries: ..., spreadsheetData: ...}
*/
exports.setDataTypesForCsvData = function(inputParams) {
	var rejected = false;
	return Q.Promise(function(resolve, reject, notify) {
		if(inputParams.spreadsheetData && inputParams.spreadsheetData.data && inputParams.spreadsheetData.data.length) {

			var numberOfColumns = inputParams.spreadsheetData.data[0].length;
			var columnLengthMatches = numberOfColumns === inputParams.spreadsheetData.columns.length;
			if(columnLengthMatches){

				var columnDataTypes = [];

				for(var columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
					
					var columnDataType = exports.getConsistentDataTypeValue(columnIndex, inputParams.spreadsheetData.data);
					if(!columnDataType){
						reject('Could not get the column data type for column index ' + columnIndex);
						rejected = true;
						break;
					}
					columnDataTypes.push(columnDataType);
				}


				inputParams.spreadsheetData.columnDataTypes = columnDataTypes;
			} else {
				reject('The number of columns do not match the number of data columns');
			}
		}
		
		if(!rejected){
			resolve(inputParams);
		}
	});
};


exports.getConsistentDataTypeValue = function(columnIndex, data){
	var defaultColumnDataType = 'textbox';
	if(!data || !data.length || columnIndex === undefined){
		return defaultColumnDataType
	}

	var maxMatches = 5; //if five rows give the same data type, don't look beyond that
	var consistentColumnDataType = null;
	var matchCount = 0;
	for(var ctr = 0; ctr < data.length && matchCount < maxMatches; ctr++, matchCount++) {

		var value = data[ctr][columnIndex];
		var newColumnDataType = exports.getDataType(value);

		if(!newColumnDataType){ //default it if no value is found
			return defaultColumnDataType;
		}

		if(newColumnDataType === 'textarea'){ //if one is text area, all can be considered as textarea
			return newColumnDataType;
		}

		if(consistentColumnDataType){
			if(newColumnDataType !== consistentColumnDataType){ //return default type if there is mismatch across rows
				return defaultColumnDataType;
			}
		}

		consistentColumnDataType = newColumnDataType;

	}
	return consistentColumnDataType;
};

exports.getDataType = function(value){
	
	if(value === undefined || value === '' || value === '\'\'' || value === '""') {
		return null;
	}

	value = value.trim();						
	if(value.length <= 0){
		return null;
	}
	
	if(value.length > 100) {
		return'textarea';
	}

	var isNumber = /^[-+]?[0-9]+$/.test(value);
	if(isNumber){
		//var MAX_INT = 4294967295;
		if(value.length <= 9){ //then lets just allow upto 9
			return 'integer';
		}
	}

	var isDecimalNumber = /^[-+]?\d*[0-9](\.\d*[0-9]){1}$/.test(value);
	if(isDecimalNumber){
		return 'number';
	}

	var lowercase = value.toLowerCase()
	var isFlag = /^[yn]{1}$/.test(lowercase);
	if(isFlag || lowercase === 'true' || lowercase === 'false'){
		return 'checkbox';
	}

	var dateValue = Date.parse(value);
	if(!isNaN(dateValue)  && dateValue.toString() !== 'Invalid Date'){
		return 'datetime';
	}

	return null;
};


