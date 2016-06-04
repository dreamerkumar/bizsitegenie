'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Select = mongoose.model('Select');

/**
 * Globals
 */
var user, select;

/**
 * Unit tests
 */
describe('Select Model Unit Tests:', function() {
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
			select = new Select({
				
				name: 'Select Name',
				
				positionIndex: 'Select Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return select.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			select.name = '';
			
			select.positionIndex = '';
			

			return select.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Select.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
