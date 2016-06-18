'use strict';
var util = require('util'),
	inflections = require('underscore.inflections'),
	yeoman = require('yeoman-generator'),
	dbGetter = require('bizsitegenie-get-db-entries'),
	_slugifiedNames = [],
	_reservedModuleNames = ['option'];

var appGenerator = yeoman.generators.NamedBase.extend({
	init: function() {
		var done = this.async();

		if(!this.name){
			throw Error('Please provide the database id of the app as the first argument');
		}
	
		dbGetter.getAppByID(this.name, function(err, app){

			if(err) throw err;
			if(!app) throw 'The app data could not be retrieved from the database';			 

			//extract the configuration data
			var jsonInput = {
				appName: app.Name,
				appAuthor: app.Author,
				appKeyword: app.appKeyword,
				appDescription: app.appDescription,
				bootstrapTheme: app.bootstrapTheme
			};
		
			this.composeWith('meanjs-plus:app-base', {
				options: jsonInput,
				args : [app.name]
			});
			this.log('We are done');
			done();

		}.bind(this));
	},

	/*
	* This function thankfully gets called after all the composeWith functions which appear to run async. We can use this function to exit
	* http://stackoverflow.com/questions/33010498/composewith-in-yeoman-generator-not-emitting-an-end-event-and-thus-not-driving
	*/
	end: function(){
		this.log('The generator is exiting now');
		process.exit(0);
	}
});

module.exports = appGenerator;