'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Role = mongoose.model('Role'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, role;

/**
 * Role routes tests
 */
describe('Role CRUD tests', function() {
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

		// Save a user to the test db and create new Role
		user.save(function() {
			role = {
				
				name: 'Role Name',
				
			};

			done();
		});
	});

	it('should be able to save Role instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Role
				agent.post('/roles')
					.send(role)
					.expect(200)
					.end(function(roleSaveErr, roleSaveRes) {
						// Handle Role save error
						if (roleSaveErr) done(roleSaveErr);

						// Get a list of Roles
						agent.get('/roles')
							.end(function(rolesGetErr, rolesGetRes) {
								// Handle Role save error
								if (rolesGetErr) done(rolesGetErr);

								// Get Roles list
								var roles = rolesGetRes.body;

								// Set assertions
								(roles[0].user._id).should.equal(userId);

								
								(roles[0].name).should.match('Role Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Role instance if not logged in', function(done) {
		agent.post('/roles')
			.send(role)
			.expect(401)
			.end(function(roleSaveErr, roleSaveRes) {
				// Call the assertion callback
				done(roleSaveErr);
			});
	});

	it('should not be able to save Role instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		role.name = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Role
				agent.post('/roles')
					.send(role)
					.expect(400)
					.end(function(roleSaveErr, roleSaveRes) {
						// Set message assertion
						(roleSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle Role save error
						done(roleSaveErr);
					});
			});
	});

	it('should be able to update Role instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Role
				agent.post('/roles')
					.send(role)
					.expect(200)
					.end(function(roleSaveErr, roleSaveRes) {
						// Handle Role save error
						if (roleSaveErr) done(roleSaveErr);

						// Update Role property name
						
						role.name = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Role
						agent.put('/roles/' + roleSaveRes.body._id)
							.send(role)
							.expect(200)
							.end(function(roleUpdateErr, roleUpdateRes) {
								// Handle Role update error
								if (roleUpdateErr) done(roleUpdateErr);

								// Set assertions
								(roleUpdateRes.body._id).should.equal(roleSaveRes.body._id);
								
								(roleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Roles if not signed in', function(done) {
		// Create new Role model instance
		var roleObj = new Role(role);

		// Save the Role
		roleObj.save(function() {
			// Request Roles
			request(app).get('/roles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Role if not signed in', function(done) {
		// Create new Role model instance
		var roleObj = new Role(role);

		// Save the Role
		roleObj.save(function() {
			request(app).get('/roles/' + roleObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', role.name);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Role instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Role
				agent.post('/roles')
					.send(role)
					.expect(200)
					.end(function(roleSaveErr, roleSaveRes) {
						// Handle Role save error
						if (roleSaveErr) done(roleSaveErr);

						// Delete existing Role
						agent.delete('/roles/' + roleSaveRes.body._id)
							.send(role)
							.expect(200)
							.end(function(roleDeleteErr, roleDeleteRes) {
								// Handle Role error error
								if (roleDeleteErr) done(roleDeleteErr);

								// Set assertions
								(roleDeleteRes.body._id).should.equal(roleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Role instance if not signed in', function(done) {
		// Set Role user 
		role.user = user;

		// Create new Role model instance
		var roleObj = new Role(role);

		// Save the Role
		roleObj.save(function() {
			// Try deleting Role
			request(app).delete('/roles/' + roleObj._id)
			.expect(401)
			.end(function(roleDeleteErr, roleDeleteRes) {
				// Set message assertion
				(roleDeleteRes.body.message).should.match('User is not logged in');

				// Handle Role error error
				done(roleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Role.remove().exec(function(){
				done();
			});	
		});
	});
});
