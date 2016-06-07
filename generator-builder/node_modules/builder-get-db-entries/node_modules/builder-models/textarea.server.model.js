'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Textarea Schema
 */
var TextareaSchema = new Schema({	
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
	row: {		
		type: String,
		default: '',
		required: 'Please fill \'row\'',
		trim: true		
	},
	col: {		
		type: String,
		default: '',
		required: 'Please fill \'col\'',
		trim: true		
	},
	positionIndex: {		
		type: String,
		default: '',
		required: 'Please fill \'position index\'',
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

mongoose.model('Builder-Textarea', TextareaSchema);