'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Feature = mongoose.model('Feature');

/**
 * Globals
 */
var user, feature;

/**
 * Unit tests
 */
describe('Feature Model Unit Tests:', function() {
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
			feature = new Feature({
				
				name: 'Feature Name',
				
				parentCrudId: 'Feature Name',
				
				positionIndex: 'Feature Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return feature.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			feature.name = '';
			
			feature.parentCrudId = '';
			
			feature.positionIndex = '';
			

			return feature.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Feature.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
