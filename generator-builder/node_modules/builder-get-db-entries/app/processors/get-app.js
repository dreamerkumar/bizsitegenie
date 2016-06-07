'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	App = mongoose.model('Builder-App'),
	_ = require('lodash');


/**
 * returns the app for a given id 
 */
exports.getAppByID = function(id,next) { 
	App.findById(id).exec(function(err, app) {
		if (err) return next(err);
		if (!app) return next(new Error('Failed to load App ' + id));
		next(null, app);
	});
};

