'use strict';		
var fs = require('fs');
JSON.minify = JSON.minify || require("node-json-minify");

 var jsonDataFromInputFile = {

 	getAppInput: function(generator){
		var jsonFilePath = this._getJsonFile(generator);
		return this._getJsonObj(jsonFilePath);
 	},

 	getCrudModulePlusInput: function(generator){
		var jsonFilePath = this._getJsonFile(generator, 'crud-from-json-file');
		return this._getJsonObj(jsonFilePath);
	},
	
	_getJsonFile: function(generator, subFolder){			
		var inputFolderPath = generator.destinationPath('yo-generator-inputs/meanjs-plus/');
		if(subFolder){
			inputFolderPath = inputFolderPath + subFolder + '/';
		}
	 	return inputFolderPath + generator.name + ".json";
	},

	_getJsonObj: function(jsonFilePath){
		var fileData = fs.readFileSync(jsonFilePath, 'utf8');
		var dataWithoutComments = JSON.minify(fileData);
		return JSON.parse(dataWithoutComments);
	}
};

module.exports = jsonDataFromInputFile;