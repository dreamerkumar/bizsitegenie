'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Property Schema
 */
var PropertySchema = new Schema({	
	referenceDisplayFormat: {		
		type: String,
		default: '',
		trim: true		
	},
	col: {		
		type: String,
		default: '',
		trim: true		
	},
	selectorControlType: {		
		type: String,
		default: '',
		trim: true		
	},
	parentId: {		
		type: String,
		default: '',
		required: 'Please fill \'parent id\'',
		trim: true		
	},
	row: {		
		type: String,
		default: '',
		trim: true		
	},
	option: {		
		type: String,
		default: '',
		trim: true		
	},
	refDescription: {		
		type: String,
		default: '',
		trim: true		
	},
	referencedPropertyName: {		
		type: String,
		default: '',
		trim: true		
	},
	selectorControlAttribute: {		
		type: String,
		default: '',
		trim: true		
	},
	type: {		
		type: String,
		default: '',
		required: 'Please fill \'type\'',
		trim: true		
	},
	name: {		
		type: String,
		default: '',
		required: 'Please fill \'name\'',
		trim: true		
	},
	value: {		
		type: String,
		default: '',
		trim: true		
	},
	referencedFeatureId: {		
		type: String,
		default: '',
		trim: true		
	},
	referencedFeatureName: {		
		type: String,
		default: '',
		trim: true		
	},
	propertyNamesForDisplay: {		
		type: String,
		default: '',
		trim: true		
	},
	referenceDescription: {		
		type: String,
		default: '',
		trim: true		
	},
	required: {
		type: Boolean,
		default: false
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

mongoose.model('Builder-Property', PropertySchema);