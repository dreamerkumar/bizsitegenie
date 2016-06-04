'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    integerValidator = require('mongoose-integer');

/**
 * Featurespreadsheet Schema
 */
var FeaturespreadsheetSchema = new Schema({	
	fileName: {
		required: 'Please fill \'file name\'', 		
		type: String,
		default: '',		
		trim: true		
	},
	fileKey: {
		required: 'Please fill \'file key\'', 		
		type: String,
		default: '',		
		trim: true		
	},
	parentId: {
		required: 'Please fill \'parent id \'', 		
		type: String,
		default: '',		
		trim: true		
	},
	status: {
		required: 'Please fill \'status\'', 		
		type: String,
		default: '',		
		trim: true		
	},
	updated: {
		required: 'Please fill \'updated\'', 
		type: Date		
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

FeaturespreadsheetSchema.plugin(integerValidator);

mongoose.model('Builder-Featurespreadsheet', FeaturespreadsheetSchema);