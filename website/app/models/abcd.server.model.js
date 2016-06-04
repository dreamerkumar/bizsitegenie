'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    integerValidator = require('mongoose-integer');

/**
 * Abcd Schema
 */
var AbcdSchema = new Schema({	
	a: {		
		type: String,
		default: '',		
		trim: true		
	},
	b: {		
		type: String,
		default: '',		
		trim: true		
	},
	c: {		
		type: String,
		default: '',		
		trim: true		
	},
	d: {		
		type: String,
		default: '',		
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

AbcdSchema.plugin(integerValidator);

mongoose.model('Abcd', AbcdSchema, 'Abcd');