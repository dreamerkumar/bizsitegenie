'use strict';
var yeoman = require('yeoman-generator');


var fixBsonExtensionError = yeoman.generators.Base.extend({
	init: function() {
	},
	
	//http://stackoverflow.com/questions/28651028/cannot-find-module-build-release-bson-code-module-not-found-js-bson
	updateBsonReference: function() {
		this.bulkCopy('node_modules/connect-mongo/node_modules/mongodb/node_modules/bson/ext/index.js', 'node_modules/connect-mongo/node_modules/mongodb/node_modules/bson/ext/index.js');
		this.bulkCopy('node_modules/mongoose/node_modules/mongodb/node_modules/bson/ext/index.js', 'node_modules/mongoose/node_modules/mongodb/node_modules/bson/ext/index.js');
		this.log('Fixed bson extension error');
	}	
});

module.exports = fixBsonExtensionError;
