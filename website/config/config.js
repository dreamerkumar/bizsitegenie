'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	glob = require('glob');

/**
 * Load app configurations
 */
module.exports = _.extend(
	require('./env/all'),
	require('./env/' + process.env.NODE_ENV) || {}
);

/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRootArray) {
	// For context switching
	var _this = this;

	// URL paths regex
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	// The output array
	var output = [];

	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function(globPattern) {
			output = _.union(output, _this.getGlobbedFiles(globPattern, removeRootArray));
		});
	} else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} else {
			glob(globPatterns, {
				sync: true
			}, function(err, files) {
				if (removeRootArray && removeRootArray.length > 0) {
					files = files.map(function(file) {
						removeRootArray.forEach(function(removeRoot){
							file = file.replace(removeRoot, '');
						});
						return file;
					});
				}

				output = _.union(output, files);
			});
		}
	}

	return output;
};

/**
 * Get the modules JavaScript files
 */
module.exports.getJavaScriptAssets = function(includeTests) {
	var output = this.getGlobbedFiles(this.assets.lib.js.concat(this.assets.js), ['public/']);

	// To include tests
	if (includeTests) {
		output = _.union(output, this.getGlobbedFiles(this.assets.tests));
	}

	return output;
};

/**
 * Get the modules CSS files
 */
module.exports.getCSSAssets = function() {
	var output = this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), ['public/']);
	return output;
};

/**
 * Get the builder modules JavaScript files
 */
module.exports.getBuilderJavaScriptAssets = function(includeTests) {
	var output = this.getGlobbedFiles(this.builderAssets.lib.js.concat(this.builderAssets.js), []);

	// To include tests
	if (includeTests) {
		output = _.union(output, this.getGlobbedFiles(this.builderAssets.tests));
	}

	return output;
};

/**
 * Get the builder modules CSS files
 */
module.exports.getBuilderCSSAssets = function() {
	var output = this.getGlobbedFiles(this.builderAssets.lib.css.concat(this.builderAssets.css), []);
	return output;
};

/**
 * Get the shared modules JavaScript files
 */
module.exports.getSharedJavaScriptAssets = function(includeTests) {
	var output = this.getGlobbedFiles(this.sharedAssets.lib.js.concat(this.sharedAssets.js), []);

	// To include tests
	if (includeTests) {
		output = _.union(output, this.getGlobbedFiles(this.sharedAssets.tests));
	}

	return output;
};

/**
 * Get the shared modules CSS files
 */
module.exports.getSharedCSSAssets = function() {
	var output = this.getGlobbedFiles(this.sharedAssets.lib.css.concat(this.sharedAssets.css), []);
	return output;
};