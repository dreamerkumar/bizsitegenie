'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User group user Schema
 */
var UserGroupUserSchema = new Schema({	
	parentId: {		
		type: String,
		default: '',
		required: 'Parent Id is missing',
		trim: true		
	},
	userId: {		
		type:  Schema.ObjectId,
		ref: 'User',
		required: 'Please fill \'user\''
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('UserGroupUser', UserGroupUserSchema);