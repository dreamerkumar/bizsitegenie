'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UserGroupUser = mongoose.model('UserGroupUser'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, userGroupUser;

/**
 * User group user routes tests
 */
describe('User group user CRUD tests', function() {
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

		// Save a user to the test db and create new User group user
		user.save(function() {
			userGroupUser = {
				
				userId: 'User group user Name',
				
			};

			done();
		});
	});

	it('should be able to save User group user instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User group user
				agent.post('/user-group-users')
					.send(userGroupUser)
					.expect(200)
					.end(function(userGroupUserSaveErr, userGroupUserSaveRes) {
						// Handle User group user save error
						if (userGroupUserSaveErr) done(userGroupUserSaveErr);

						// Get a list of User group users
						agent.get('/user-group-users')
							.end(function(userGroupUsersGetErr, userGroupUsersGetRes) {
								// Handle User group user save error
								if (userGroupUsersGetErr) done(userGroupUsersGetErr);

								// Get User group users list
								var userGroupUsers = userGroupUsersGetRes.body;

								// Set assertions
								(userGroupUsers[0].user._id).should.equal(userId);

								
								(userGroupUsers[0].userId).should.match('User group user Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save User group user instance if not logged in', function(done) {
		agent.post('/user-group-users')
			.send(userGroupUser)
			.expect(401)
			.end(function(userGroupUserSaveErr, userGroupUserSaveRes) {
				// Call the assertion callback
				done(userGroupUserSaveErr);
			});
	});

	it('should not be able to save User group user instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		userGroupUser.userId = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User group user
				agent.post('/user-group-users')
					.send(userGroupUser)
					.expect(400)
					.end(function(userGroupUserSaveErr, userGroupUserSaveRes) {
						// Set message assertion
						(userGroupUserSaveRes.body.message).should.match('Please fill \'user\'');
						
						// Handle User group user save error
						done(userGroupUserSaveErr);
					});
			});
	});

	it('should be able to update User group user instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User group user
				agent.post('/user-group-users')
					.send(userGroupUser)
					.expect(200)
					.end(function(userGroupUserSaveErr, userGroupUserSaveRes) {
						// Handle User group user save error
						if (userGroupUserSaveErr) done(userGroupUserSaveErr);

						// Update User group user property name
						
						userGroupUser.userId = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing User group user
						agent.put('/user-group-users/' + userGroupUserSaveRes.body._id)
							.send(userGroupUser)
							.expect(200)
							.end(function(userGroupUserUpdateErr, userGroupUserUpdateRes) {
								// Handle User group user update error
								if (userGroupUserUpdateErr) done(userGroupUserUpdateErr);

								// Set assertions
								(userGroupUserUpdateRes.body._id).should.equal(userGroupUserSaveRes.body._id);
								
								(userGroupUserUpdateRes.body.userId).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of User group users if not signed in', function(done) {
		// Create new User group user model instance
		var userGroupUserObj = new UserGroupUser(userGroupUser);

		// Save the User group user
		userGroupUserObj.save(function() {
			// Request User group users
			request(app).get('/user-group-users')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single User group user if not signed in', function(done) {
		// Create new User group user model instance
		var userGroupUserObj = new UserGroupUser(userGroupUser);

		// Save the User group user
		userGroupUserObj.save(function() {
			request(app).get('/user-group-users/' + userGroupUserObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('userId', userGroupUser.userId);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete User group user instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User group user
				agent.post('/user-group-users')
					.send(userGroupUser)
					.expect(200)
					.end(function(userGroupUserSaveErr, userGroupUserSaveRes) {
						// Handle User group user save error
						if (userGroupUserSaveErr) done(userGroupUserSaveErr);

						// Delete existing User group user
						agent.delete('/user-group-users/' + userGroupUserSaveRes.body._id)
							.send(userGroupUser)
							.expect(200)
							.end(function(userGroupUserDeleteErr, userGroupUserDeleteRes) {
								// Handle User group user error error
								if (userGroupUserDeleteErr) done(userGroupUserDeleteErr);

								// Set assertions
								(userGroupUserDeleteRes.body._id).should.equal(userGroupUserSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete User group user instance if not signed in', function(done) {
		// Set User group user user 
		userGroupUser.user = user;

		// Create new User group user model instance
		var userGroupUserObj = new UserGroupUser(userGroupUser);

		// Save the User group user
		userGroupUserObj.save(function() {
			// Try deleting User group user
			request(app).delete('/user-group-users/' + userGroupUserObj._id)
			.expect(401)
			.end(function(userGroupUserDeleteErr, userGroupUserDeleteRes) {
				// Set message assertion
				(userGroupUserDeleteRes.body.message).should.match('User is not logged in');

				// Handle User group user error error
				done(userGroupUserDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			UserGroupUser.remove().exec(function(){
				done();
			});	
		});
	});
});
