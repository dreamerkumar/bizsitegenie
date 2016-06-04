'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Foreignkeyref Schema
 */
var ForeignkeyrefSchema = new Schema({	
	propertyNamesForSearch: {		
		type: String,
		default: '',
		required: 'Please fill \'property names for search\'',
		trim: true		
	},
	name: {		
		type: String,
		default: '',
		required: 'Please fill \'name\'',
		trim: true		
	},
	parentId: {		
		type: String,
		default: '',
		required: 'Please fill \'parent id \'',
		trim: true		
	},
	positionIndex: {		
		type: String,
		default: '',
		required: 'Please fill \'position index\'',
		trim: true		
	},
	referencedFeatureId: {		
		type: String,
		default: '',
		required: 'Please fill \'referenced feature\'',
		trim: true		
	},
	referencedFeatureName: {		
		type: String,
		default: '',
		required: 'Please fill \'referenced feature name\'',
		trim: true		
	},
	propertyNamesForDisplay: {		
		type: String,
		default: '',
		required: 'Please fill \'property names for display\'',
		trim: true		
	},
	referenceDescription: {		
		type: String,
		default: '',
		required: 'Please fill \'reference description\'',
		trim: true		
	},
	referenceDisplayFormat: {		
		type: String,
		default: '',
		required: 'Please fill \'reference display format\'',
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

mongoose.model('Builder-Foreignkeyref', ForeignkeyrefSchema, 'Foreignkeyref');