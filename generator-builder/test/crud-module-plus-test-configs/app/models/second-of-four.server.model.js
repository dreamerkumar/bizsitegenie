'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Second of four Schema
 */
var SecondOfFourSchema = new Schema({	
	parentId: {		
		type: String,
		default: '',
		required: 'Parent Id is missing',
		trim: true		
	},
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

mongoose.model('SecondOfFour', SecondOfFourSchema);