'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Fourth of four Schema
 */
var FourthOfFourSchema = new Schema({	
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

mongoose.model('FourthOfFour', FourthOfFourSchema);