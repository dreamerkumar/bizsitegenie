'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Featurespreadsheet = mongoose.model('Builder-Featurespreadsheet');

/**
 * Globals
 */
var user, featurespreadsheet;

/**
 * Unit tests
 */
describe('Featurespreadsheet Model Unit Tests:', function() {
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
			featurespreadsheet = new Featurespreadsheet({
				
				fileName: 'Featurespreadsheet Name',
				
				fileKey: 'Featurespreadsheet Name',
				
				parentId: 'Featurespreadsheet Name',
				
				status: 'Featurespreadsheet Name',
				
				updated: 'Featurespreadsheet Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return featurespreadsheet.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			featurespreadsheet.fileName = '';
			
			featurespreadsheet.fileKey = '';
			
			featurespreadsheet.parentId = '';
			
			featurespreadsheet.status = '';
			
			featurespreadsheet.updated = '';
			

			return featurespreadsheet.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Featurespreadsheet.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
