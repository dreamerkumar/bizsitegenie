'use strict';

var util = require('util'),
	inflections = require('underscore.inflections'),
	fs = require('fs'),
	yeoman = require('yeoman-generator'),
	_str = require('underscore.string');


var TestGenerator = yeoman.generators.NamedBase.extend({
	renderTestFile: function() {
		// Set model names
		this.slugifiedModelName = _str.slugify(_str.humanize(this.name));
		this.classifiedModelName = _str.classify(this.slugifiedModelName);
		this.humanizedModelName = _str.humanize(this.slugifiedModelName);
		this.camelizedModelName = _str.camelize(this.slugifiedModelName);

		this.slugifiedPluralModelName = inflections.pluralize(this.slugifiedModelName);

		var modelFilePath = process.cwd() + '/app/models/' + this.slugifiedModelName + '.server.model.js';

		// If model file exists we create a test for it otherwise we will first create a model
		if (!fs.existsSync(modelFilePath)) {
			this.template('_.server.model.js', 'app/models/' + this.slugifiedModelName + '.server.model.js')
		}

		this.template('_.server.model.test.js', 'app/tests/' + this.slugifiedModelName + '.server.model.test.js')
	}
});

module.exports = TestGenerator;