'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Lookupfromprop Schema
 */
var LookupfrompropSchema = new Schema({	
	parentId: {		
		type: String,
		default: '',
		required: 'Please fill \'parent\'',
		trim: true		
	},
	name: {		
		type: String,
		default: '',
		required: 'Please fill \'name\'',
		trim: true		
	},
	positionIndex: {		
		type: String,
		default: '',
		required: 'Please fill \'position index\'',
		trim: true		
	},
	refId: {		
		type: String,
		default: '',
		required: 'Please fill \'ref\'',
		trim: true		
	},
	referencedFeatureName: {		
		type: String,
		default: '',
		required: 'Please fill \'referenced feature name\'',
		trim: true		
	},
	referencedPropertyName: {		
		type: String,
		default: '',
		required: 'Please fill \'referenced property name\'',
		trim: true		
	},
	refDescription: {		
		type: String,
		default: '',
		required: 'Please fill \'ref description\'',
		trim: true		
	},
	selectorControlType: {		
		type: String,
		default: '',
		required: 'Please fill \'selector control type\'',
		trim: true		
	},
	selectorControlAttribute: {		
		type: String,
		default: '',
		required: 'Please fill \'selector control attribute\'',
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

mongoose.model('Builder-Lookupfromprop', LookupfrompropSchema, 'Lookupfromprop');