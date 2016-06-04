'use strict';
var util = require('util'),
	inflections = require('underscore.inflections'),
	yeoman = require('yeoman-generator'),
	_str = require('underscore.string');


var ControllerGenerator = yeoman.generators.NamedBase.extend({
	createControllerFile: function() {
		this.slugifiedName = _str.slugify(_str.humanize(this.name));

		this.humanizedName = _str.humanize(this.slugifiedName);
		this.humanizedPluralName = inflections.pluralize(_str.humanize(this.slugifiedName));
		this.humanizedSingularName = inflections.singularize(_str.humanize(this.slugifiedName));

		this.template('_.server.controller.js', 'app/controllers/' + this.slugifiedName + '.server.controller.js')
	}
});

module.exports = ControllerGenerator;