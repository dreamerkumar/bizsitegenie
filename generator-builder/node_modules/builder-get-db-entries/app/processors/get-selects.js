'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),	
	Entity = mongoose.model('Builder-Select'),
	_ = require('lodash');

/**
 * Get List
 */
exports.list = function(parentId, next) {	
	if(!parentId){
		return next(new Error('Required parameter parentId missing'));
	}
		
	Entity.find({parentId: parentId}).lean().exec(function(err, values) {
		if (err) return next(err);
		next(null, values);
	});
};

