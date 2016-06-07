'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),	
	Entity = mongoose.model('Builder-Feature'),
	_ = require('lodash');

/**
 * Get List
 * @parentId is the app id
 * @parentCrudId is applicable when a feature is is a child module of another feature
 * It defaults to zero for features at the app level
 */
exports.list = function(parentId, parentCrudId, next) {	
	if(!parentId){
		return next(new Error('Required parameter parentId missing'));
	}
	var params = {parentId: parentId, parentCrudId: parentCrudId || 0};
	Entity.find(params).sort('positionIndex').exec(function(err, values) {
		if (err) return next(err);
		next(null, values);
	});
};

