'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User group role Schema
 */
var UserGroupRoleSchema = new Schema({	
	parentId: {		
		type: String,
		default: '',
		required: 'Parent Id is missing',
		trim: true		
	},
	roleId: {		
		type: Schema.ObjectId,
		ref: 'Role',
		required: 'Please fill \'role\''
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

mongoose.model('UserGroupRole', UserGroupRoleSchema);