'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UserGroup = mongoose.model('UserGroup'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, userGroup;

/**
 * User group routes tests
 */
describe('User group CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new User group
		user.save(function() {
			userGroup = {
				
				name: 'User group Name',
				
			};

			done();
		});
	});

	it('should be able to save User group instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User group
				agent.post('/user-groups')
					.send(userGroup)
					.expect(200)
					.end(function(userGroupSaveErr, userGroupSaveRes) {
						// Handle User group save error
						if (userGroupSaveErr) done(userGroupSaveErr);

						// Get a list of User groups
						agent.get('/user-groups')
							.end(function(userGroupsGetErr, userGroupsGetRes) {
								// Handle User group save error
								if (userGroupsGetErr) done(userGroupsGetErr);

								// Get User groups list
								var userGroups = userGroupsGetRes.body;

								// Set assertions
								(userGroups[0].user._id).should.equal(userId);

								
								(userGroups[0].name).should.match('User group Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save User group instance if not logged in', function(done) {
		agent.post('/user-groups')
			.send(userGroup)
			.expect(401)
			.end(function(userGroupSaveErr, userGroupSaveRes) {
				// Call the assertion callback
				done(userGroupSaveErr);
			});
	});

	it('should not be able to save User group instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		userGroup.name = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User group
				agent.post('/user-groups')
					.send(userGroup)
					.expect(400)
					.end(function(userGroupSaveErr, userGroupSaveRes) {
						// Set message assertion
						(userGroupSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle User group save error
						done(userGroupSaveErr);
					});
			});
	});

	it('should be able to update User group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User group
				agent.post('/user-groups')
					.send(userGroup)
					.expect(200)
					.end(function(userGroupSaveErr, userGroupSaveRes) {
						// Handle User group save error
						if (userGroupSaveErr) done(userGroupSaveErr);

						// Update User group property name
						
						userGroup.name = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing User group
						agent.put('/user-groups/' + userGroupSaveRes.body._id)
							.send(userGroup)
							.expect(200)
							.end(function(userGroupUpdateErr, userGroupUpdateRes) {
								// Handle User group update error
								if (userGroupUpdateErr) done(userGroupUpdateErr);

								// Set assertions
								(userGroupUpdateRes.body._id).should.equal(userGroupSaveRes.body._id);
								
								(userGroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of User groups if not signed in', function(done) {
		// Create new User group model instance
		var userGroupObj = new UserGroup(userGroup);

		// Save the User group
		userGroupObj.save(function() {
			// Request User groups
			request(app).get('/user-groups')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single User group if not signed in', function(done) {
		// Create new User group model instance
		var userGroupObj = new UserGroup(userGroup);

		// Save the User group
		userGroupObj.save(function() {
			request(app).get('/user-groups/' + userGroupObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', userGroup.name);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete User group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User group
				agent.post('/user-groups')
					.send(userGroup)
					.expect(200)
					.end(function(userGroupSaveErr, userGroupSaveRes) {
						// Handle User group save error
						if (userGroupSaveErr) done(userGroupSaveErr);

						// Delete existing User group
						agent.delete('/user-groups/' + userGroupSaveRes.body._id)
							.send(userGroup)
							.expect(200)
							.end(function(userGroupDeleteErr, userGroupDeleteRes) {
								// Handle User group error error
								if (userGroupDeleteErr) done(userGroupDeleteErr);

								// Set assertions
								(userGroupDeleteRes.body._id).should.equal(userGroupSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete User group instance if not signed in', function(done) {
		// Set User group user 
		userGroup.user = user;

		// Create new User group model instance
		var userGroupObj = new UserGroup(userGroup);

		// Save the User group
		userGroupObj.save(function() {
			// Try deleting User group
			request(app).delete('/user-groups/' + userGroupObj._id)
			.expect(401)
			.end(function(userGroupDeleteErr, userGroupDeleteRes) {
				// Set message assertion
				(userGroupDeleteRes.body.message).should.match('User is not logged in');

				// Handle User group error error
				done(userGroupDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			UserGroup.remove().exec(function(){
				done();
			});	
		});
	});
});
