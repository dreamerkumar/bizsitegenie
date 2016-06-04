'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    integerValidator = require('mongoose-integer');

/**
 * Featurerole Schema
 */
var FeaturerolesSchema = new Schema({	
	parentId: {		
		type: String,
		default: '',		
		trim: true		
	},
	accesstype: {		
		type: String,
		default: '',		
		trim: true		
	},
	role: {		
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

FeaturerolesSchema.plugin(integerValidator);

mongoose.model('Featureroles', FeaturerolesSchema, 'Featureroles');