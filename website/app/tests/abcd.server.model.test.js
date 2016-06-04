'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Abcd = mongoose.model('Abcd');

/**
 * Globals
 */
var user, abcd;

/**
 * Unit tests
 */
describe('Abcd Model Unit Tests:', function() {
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
			abcd = new Abcd({
				
				a: 'Abcd Name',
				
				b: 'Abcd Name',
				
				c: 'Abcd Name',
				
				d: 'Abcd Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return abcd.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			abcd.a = '';
			
			abcd.b = '';
			
			abcd.c = '';
			
			abcd.d = '';
			

			return abcd.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Abcd.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
