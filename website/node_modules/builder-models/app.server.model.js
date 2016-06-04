'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * App Schema
 */
var AppSchema = new Schema({	
	name: {		
		type: String,
		default: '',
		required: 'Please fill \'name\'',
		trim: true		
	},
	appDescription: {		
		type: String,
		default: '',
		required: 'Please fill \'app description\'',
		trim: true		
	},
	appKeyword: {		
		type: String,
		default: '',
		required: 'Please fill \'app keyword\'',
		trim: true		
	},
	appAuthor: {		
		type: String,
		default: '',
		required: 'Please fill \'app author\'',
		trim: true		
	},
	bootstrapTheme: {		
		type: String,
		default: '',
		required: 'Please fill \'bootstrap theme\'',
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

mongoose.model('Builder-App', AppSchema);