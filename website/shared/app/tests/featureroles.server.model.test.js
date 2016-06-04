'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Featureroles = mongoose.model('Featureroles');

/**
 * Globals
 */
var user, featureroles;

/**
 * Unit tests
 */
describe('Featurerole Model Unit Tests:', function() {
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
			featureroles = new Featureroles({
				
				parentId: 'Featurerole Name',
				
				accesstype: 'Featurerole Name',
				
				role: 'Featurerole Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return featureroles.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			featureroles.parentId = '';
			
			featureroles.accesstype = '';
			
			featureroles.role = '';
			

			return featureroles.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Featureroles.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
