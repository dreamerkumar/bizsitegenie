'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Lookupfromprop = mongoose.model('Builder-Lookupfromprop');

/**
 * Globals
 */
var user, lookupfromprop;

/**
 * Unit tests
 */
describe('Lookupfromprop Model Unit Tests:', function() {
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
			lookupfromprop = new Lookupfromprop({
				
				parentId: 'Lookupfromprop Name',
				
				name: 'Lookupfromprop Name',
				
				positionIndex: 'Lookupfromprop Name',
				
				refId: 'Lookupfromprop Name',
				
				referencedFeatureName: 'Lookupfromprop Name',
				
				referencedPropertyName: 'Lookupfromprop Name',
				
				refDescription: 'Lookupfromprop Name',
				
				selectorControlType: 'Lookupfromprop Name',
				
				selectorControlAttribute: 'Lookupfromprop Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return lookupfromprop.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			lookupfromprop.parentId = '';
			
			lookupfromprop.name = '';
			
			lookupfromprop.positionIndex = '';
			
			lookupfromprop.refId = '';
			
			lookupfromprop.referencedFeatureName = '';
			
			lookupfromprop.referencedPropertyName = '';
			
			lookupfromprop.refDescription = '';
			
			lookupfromprop.selectorControlType = '';
			
			lookupfromprop.selectorControlAttribute = '';
			

			return lookupfromprop.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Lookupfromprop.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
