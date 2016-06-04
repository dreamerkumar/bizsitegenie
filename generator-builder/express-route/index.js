'use strict';
var util = require('util'),
	yeoman = require('yeoman-generator'),
	_str = require('underscore.string');


var RouteGenerator = yeoman.generators.NamedBase.extend({
	createRouteFile: function() {
		this.slugifiedName = _str.slugify(_str.humanize(this.name));

		this.template('_.server.routes.js', 'app/routes/' + this.slugifiedName + '.server.routes.js')
	}
});

module.exports = RouteGenerator;