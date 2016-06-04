'use strict';
var util = require('util'),
	inflections = require('underscore.inflections'),
	yeoman = require('yeoman-generator'),
	_str = require('underscore.string'),
	fs = require('fs'),
	ejs = require('ejs'),
	rimraf = require('rimraf'),
	_ = require('underscore');

JSON.minify = JSON.minify || require("node-json-minify");

if (!String.prototype.format) {
	String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

var ModuleDestroyer = yeoman.generators.NamedBase.extend({
	init: function() {
		if(!this.name){
			throw Error('Please find the name of the crud module you want to delete');
		}
		this.singularName = inflections.singularize(this.name);
	},

	renderModule: function() {		

		this._removeDir(this.name);

		// Remove express module files
		this._removeFile('app/controllers/' + this.name + '.server.controller.js');
		this._removeFile('app/models/' + this.singularName  + '.server.model.js');
		this._removeFile('app/routes/' + this.name  + '.server.routes.js');
		this._removeFile('app/tests/' + this.singularName + '.server.model.test.js');
		this._removeFile('app/tests/' + this.singularName  + '.server.routes.test.js');
	},

	_removeDir: function(slugifiedPluralName){
		var path = 'public/modules/{0}'.format(slugifiedPluralName);
		this.log('Removing directory ' + path)

		// Create module folder
		rimraf(path, this._removeError);
	},

	_removeFile: function(path){
		this.log('Removing file ' + path);
		fs.unlink(path, this._removeError);
	},

	_removeError: function(err) {
		if(err)throw Error(err);
	}
});

module.exports = ModuleDestroyer;