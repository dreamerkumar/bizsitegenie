'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UserGroupRole = mongoose.model('UserGroupRole'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, userGroupRole;

/**
 * User group role routes tests
 */
describe('User group role CRUD tests', function() {
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

		// Save a user to the test db and create new User group role
		user.save(function() {
			userGroupRole = {
				
				roleId: 'User group role Name',
				
			};

			done();
		});
	});

	it('should be able to save User group role instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User group role
				agent.post('/user-group-roles')
					.send(userGroupRole)
					.expect(200)
					.end(function(userGroupRoleSaveErr, userGroupRoleSaveRes) {
						// Handle User group role save error
						if (userGroupRoleSaveErr) done(userGroupRoleSaveErr);

						// Get a list of User group roles
						agent.get('/user-group-roles')
							.end(function(userGroupRolesGetErr, userGroupRolesGetRes) {
								// Handle User group role save error
								if (userGroupRolesGetErr) done(userGroupRolesGetErr);

								// Get User group roles list
								var userGroupRoles = userGroupRolesGetRes.body;

								// Set assertions
								(userGroupRoles[0].user._id).should.equal(userId);

								
								(userGroupRoles[0].roleId).should.match('User group role Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save User group role instance if not logged in', function(done) {
		agent.post('/user-group-roles')
			.send(userGroupRole)
			.expect(401)
			.end(function(userGroupRoleSaveErr, userGroupRoleSaveRes) {
				// Call the assertion callback
				done(userGroupRoleSaveErr);
			});
	});

	it('should not be able to save User group role instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		userGroupRole.roleId = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User group role
				agent.post('/user-group-roles')
					.send(userGroupRole)
					.expect(400)
					.end(function(userGroupRoleSaveErr, userGroupRoleSaveRes) {
						// Set message assertion
						(userGroupRoleSaveRes.body.message).should.match('Please fill \'role\'');
						
						// Handle User group role save error
						done(userGroupRoleSaveErr);
					});
			});
	});

	it('should be able to update User group role instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User group role
				agent.post('/user-group-roles')
					.send(userGroupRole)
					.expect(200)
					.end(function(userGroupRoleSaveErr, userGroupRoleSaveRes) {
						// Handle User group role save error
						if (userGroupRoleSaveErr) done(userGroupRoleSaveErr);

						// Update User group role property name
						
						userGroupRole.roleId = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing User group role
						agent.put('/user-group-roles/' + userGroupRoleSaveRes.body._id)
							.send(userGroupRole)
							.expect(200)
							.end(function(userGroupRoleUpdateErr, userGroupRoleUpdateRes) {
								// Handle User group role update error
								if (userGroupRoleUpdateErr) done(userGroupRoleUpdateErr);

								// Set assertions
								(userGroupRoleUpdateRes.body._id).should.equal(userGroupRoleSaveRes.body._id);
								
								(userGroupRoleUpdateRes.body.roleId).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of User group roles if not signed in', function(done) {
		// Create new User group role model instance
		var userGroupRoleObj = new UserGroupRole(userGroupRole);

		// Save the User group role
		userGroupRoleObj.save(function() {
			// Request User group roles
			request(app).get('/user-group-roles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single User group role if not signed in', function(done) {
		// Create new User group role model instance
		var userGroupRoleObj = new UserGroupRole(userGroupRole);

		// Save the User group role
		userGroupRoleObj.save(function() {
			request(app).get('/user-group-roles/' + userGroupRoleObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('roleId', userGroupRole.roleId);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete User group role instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User group role
				agent.post('/user-group-roles')
					.send(userGroupRole)
					.expect(200)
					.end(function(userGroupRoleSaveErr, userGroupRoleSaveRes) {
						// Handle User group role save error
						if (userGroupRoleSaveErr) done(userGroupRoleSaveErr);

						// Delete existing User group role
						agent.delete('/user-group-roles/' + userGroupRoleSaveRes.body._id)
							.send(userGroupRole)
							.expect(200)
							.end(function(userGroupRoleDeleteErr, userGroupRoleDeleteRes) {
								// Handle User group role error error
								if (userGroupRoleDeleteErr) done(userGroupRoleDeleteErr);

								// Set assertions
								(userGroupRoleDeleteRes.body._id).should.equal(userGroupRoleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete User group role instance if not signed in', function(done) {
		// Set User group role user 
		userGroupRole.user = user;

		// Create new User group role model instance
		var userGroupRoleObj = new UserGroupRole(userGroupRole);

		// Save the User group role
		userGroupRoleObj.save(function() {
			// Try deleting User group role
			request(app).delete('/user-group-roles/' + userGroupRoleObj._id)
			.expect(401)
			.end(function(userGroupRoleDeleteErr, userGroupRoleDeleteRes) {
				// Set message assertion
				(userGroupRoleDeleteRes.body.message).should.match('User is not logged in');

				// Handle User group role error error
				done(userGroupRoleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			UserGroupRole.remove().exec(function(){
				done();
			});	
		});
	});
});
