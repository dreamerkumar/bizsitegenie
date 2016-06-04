'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Property = mongoose.model('Property');

/**
 * Globals
 */
var user, property;

/**
 * Unit tests
 */
describe('Property Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			property = new Property({
				
				referenceDisplayFormat: 'Property Name',
				
				col: 'Property Name',
				
				selectorControlType: 'Property Name',
				
				parentId: 'Property Name',
				
				row: 'Property Name',
				
				option: 'Property Name',
				
				refDescription: 'Property Name',
				
				referencedPropertyName: 'Property Name',
				
				selectorControlAttribute: 'Property Name',
				
				type: 'Property Name',
				
				name: 'Property Name',
				
				value: 'Property Name',
				
				referencedFeatureId: 'Property Name',
				
				referencedFeatureName: 'Property Name',
				
				propertyNamesForDisplay: 'Property Name',
				
				referenceDescription: 'Property Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return property.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			property.referenceDisplayFormat = '';
			
			property.col = '';
			
			property.selectorControlType = '';
			
			property.parentId = '';
			
			property.row = '';
			
			property.option = '';
			
			property.refDescription = '';
			
			property.referencedPropertyName = '';
			
			property.selectorControlAttribute = '';
			
			property.type = '';
			
			property.name = '';
			
			property.value = '';
			
			property.referencedFeatureId = '';
			
			property.referencedFeatureName = '';
			
			property.propertyNamesForDisplay = '';
			
			property.referenceDescription = '';
			

			return property.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Property.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
