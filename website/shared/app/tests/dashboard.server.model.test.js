'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Dashboard = mongoose.model('Dashboard');

/**
 * Globals
 */
var user, dashboard;

/**
 * Unit tests
 */
describe('Dashboard Model Unit Tests:', function() {
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
			dashboard = new Dashboard({
				
				name: 'Dashboard Name',
				
				content: 'Dashboard Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return dashboard.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			dashboard.name = '';
			
			dashboard.content = '';
			

			return dashboard.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Dashboard.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
