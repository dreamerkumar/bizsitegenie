'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Feature Schema
 */
var FeatureSchema = new Schema({	
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
	parentCrudId: {		
		type: String,
		default: '',
		required: 'Please fill \'parent crud\'',
		trim: true		
	},
	positionIndex: {		
		type: String,
		default: '',
		required: 'Please fill \'position index\'',
		trim: true		
	},
	childPropertyPositions: [{
		type: String,
		notEmpty: true,
		required: true
	}],
	readRoles: {
		type: String,
		default: '',		
		trim: true		
	},
	editRoles: {
		type: String,
		default: '',		
		trim: true		
	},
	createRoles: {
		type: String,
		default: '',		
		trim: true
	},
	deleteRoles: {
		type: String,
		default: '',		
		trim: true	
	},
	managePermissionRoles: {
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

mongoose.model('Builder-Feature', FeatureSchema);