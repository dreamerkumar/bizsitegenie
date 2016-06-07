'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Option Schema
 */
var Option11Schema = new Schema({	
	parentId: {		
		type: String,
		default: '',
		required: 'Parent Id is missing',
		trim: true		
	},
	text: {		
		type: String,
		default: '',
		required: 'Please fill \'text\'',
		trim: true		
	},
	value: {		
		type: String,
		default: '',
		required: 'Please fill \'value\'',
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

mongoose.model('Builder-Option11', Option11Schema);