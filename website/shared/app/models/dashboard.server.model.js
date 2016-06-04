'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Dashboard Schema
 */
var DashboardSchema = new Schema({	
	name: {		
		type: String,
		default: '',
		required: 'Please fill \'name\'',
		trim: true		
	},
	content: {		
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

mongoose.model('Dashboard', DashboardSchema, 'Dashboard');