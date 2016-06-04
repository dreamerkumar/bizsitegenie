'use strict';
var util = require('util'),
	inflections = require('underscore.inflections'),
	yeoman = require('yeoman-generator'),
	_str = require('underscore.string');


var ModelGenerator = yeoman.generators.NamedBase.extend({
	createModelFile: function() {
		// Set model names
		this.slugifiedModelName = _str.slugify(_str.humanize(this.name));
		this.classifiedModelName = _str.classify(this.slugifiedModelName);
		this.humanizedModelName = _str.humanize(this.slugifiedModelName);
		this.camelizedModelName = _str.camelize(this.slugifiedModelName);

		this.slugifiedPluralModelName = inflections.pluralize(this.slugifiedModelName);

		// We create the model file
		this.template('_.server.model.js', 'app/models/' + this.slugifiedModelName + '.server.model.js');
		// We create the test file for the models
		this.template('_.server.model.test.js', 'app/tests/' + this.slugifiedModelName + '.server.model.test.js');
	}
});

module.exports = ModelGenerator;