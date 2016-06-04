'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Password = mongoose.model('Password'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, password;

/**
 * Password routes tests
 */
describe('Password CRUD tests', function() {
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

		// Save a user to the test db and create new Password
		user.save(function() {
			password = {
				
				name: 'Password Name',
				
				positionIndex: 'Password Name',
				
			};

			done();
		});
	});

	it('should be able to save Password instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Password
				agent.post('/passwords')
					.send(password)
					.expect(200)
					.end(function(passwordSaveErr, passwordSaveRes) {
						// Handle Password save error
						if (passwordSaveErr) done(passwordSaveErr);

						// Get a list of Passwords
						agent.get('/passwords')
							.end(function(passwordsGetErr, passwordsGetRes) {
								// Handle Password save error
								if (passwordsGetErr) done(passwordsGetErr);

								// Get Passwords list
								var passwords = passwordsGetRes.body;

								// Set assertions
								(passwords[0].user._id).should.equal(userId);

								
								(passwords[0].name).should.match('Password Name');
								
								(passwords[0].positionIndex).should.match('Password Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Password instance if not logged in', function(done) {
		agent.post('/passwords')
			.send(password)
			.expect(401)
			.end(function(passwordSaveErr, passwordSaveRes) {
				// Call the assertion callback
				done(passwordSaveErr);
			});
	});

	it('should not be able to save Password instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		password.name = '';
		
		password.positionIndex = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Password
				agent.post('/passwords')
					.send(password)
					.expect(400)
					.end(function(passwordSaveErr, passwordSaveRes) {
						// Set message assertion
						(passwordSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle Password save error
						done(passwordSaveErr);
					});
			});
	});

	it('should be able to update Password instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Password
				agent.post('/passwords')
					.send(password)
					.expect(200)
					.end(function(passwordSaveErr, passwordSaveRes) {
						// Handle Password save error
						if (passwordSaveErr) done(passwordSaveErr);

						// Update Password property name
						
						password.name = 'WHY YOU GOTTA BE SO MEAN?';
						
						password.positionIndex = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Password
						agent.put('/passwords/' + passwordSaveRes.body._id)
							.send(password)
							.expect(200)
							.end(function(passwordUpdateErr, passwordUpdateRes) {
								// Handle Password update error
								if (passwordUpdateErr) done(passwordUpdateErr);

								// Set assertions
								(passwordUpdateRes.body._id).should.equal(passwordSaveRes.body._id);
								
								(passwordUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(passwordUpdateRes.body.positionIndex).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Passwords if not signed in', function(done) {
		// Create new Password model instance
		var passwordObj = new Password(password);

		// Save the Password
		passwordObj.save(function() {
			// Request Passwords
			request(app).get('/passwords')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Password if not signed in', function(done) {
		// Create new Password model instance
		var passwordObj = new Password(password);

		// Save the Password
		passwordObj.save(function() {
			request(app).get('/passwords/' + passwordObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', password.name);
					
					res.body.should.be.an.Object.with.property('positionIndex', password.positionIndex);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Password instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Password
				agent.post('/passwords')
					.send(password)
					.expect(200)
					.end(function(passwordSaveErr, passwordSaveRes) {
						// Handle Password save error
						if (passwordSaveErr) done(passwordSaveErr);

						// Delete existing Password
						agent.delete('/passwords/' + passwordSaveRes.body._id)
							.send(password)
							.expect(200)
							.end(function(passwordDeleteErr, passwordDeleteRes) {
								// Handle Password error error
								if (passwordDeleteErr) done(passwordDeleteErr);

								// Set assertions
								(passwordDeleteRes.body._id).should.equal(passwordSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Password instance if not signed in', function(done) {
		// Set Password user 
		password.user = user;

		// Create new Password model instance
		var passwordObj = new Password(password);

		// Save the Password
		passwordObj.save(function() {
			// Try deleting Password
			request(app).delete('/passwords/' + passwordObj._id)
			.expect(401)
			.end(function(passwordDeleteErr, passwordDeleteRes) {
				// Set message assertion
				(passwordDeleteRes.body.message).should.match('User is not logged in');

				// Handle Password error error
				done(passwordDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Password.remove().exec(function(){
				done();
			});	
		});
	});
});
