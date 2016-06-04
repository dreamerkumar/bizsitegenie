'use strict';
var util = require('util'),
	inflections = require('underscore.inflections'),
	yeoman = require('yeoman-generator'),
	jsonDataFromInputFile = require('./jsonDataFromInputFile'),
	_slugifiedNames = [],
	_reservedModuleNames = ['option'];

var appGenerator = yeoman.generators.NamedBase.extend({
	init: function() {
		
		if(!this.name){
			throw Error('Please provide the name of the app as the first argument');
		}

		//get the configuration from the json file
		var jsonInput = jsonDataFromInputFile.getAppInput(this);		
	
		this.composeWith('meanjs-plus:app-base', {
			options: jsonInput,
			args : [this.name]
		});
	}
});

module.exports = appGenerator;