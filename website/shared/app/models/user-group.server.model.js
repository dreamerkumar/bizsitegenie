'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User group Schema
 */
var UserGroupSchema = new Schema({	
	name: {		
		type: String,
		default: '',
		required: 'Please fill \'name\'',
		trim: true		
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

mongoose.model('UserGroup', UserGroupSchema);