'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Email = mongoose.model('Email'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, email;

/**
 * Email routes tests
 */
describe('Email CRUD tests', function() {
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

		// Save a user to the test db and create new Email
		user.save(function() {
			email = {
				
				name: 'Email Name',
				
				positionIndex: 'Email Name',
				
			};

			done();
		});
	});

	it('should be able to save Email instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Email
				agent.post('/emails')
					.send(email)
					.expect(200)
					.end(function(emailSaveErr, emailSaveRes) {
						// Handle Email save error
						if (emailSaveErr) done(emailSaveErr);

						// Get a list of Emails
						agent.get('/emails')
							.end(function(emailsGetErr, emailsGetRes) {
								// Handle Email save error
								if (emailsGetErr) done(emailsGetErr);

								// Get Emails list
								var emails = emailsGetRes.body;

								// Set assertions
								(emails[0].user._id).should.equal(userId);

								
								(emails[0].name).should.match('Email Name');
								
								(emails[0].positionIndex).should.match('Email Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Email instance if not logged in', function(done) {
		agent.post('/emails')
			.send(email)
			.expect(401)
			.end(function(emailSaveErr, emailSaveRes) {
				// Call the assertion callback
				done(emailSaveErr);
			});
	});

	it('should not be able to save Email instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		email.name = '';
		
		email.positionIndex = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Email
				agent.post('/emails')
					.send(email)
					.expect(400)
					.end(function(emailSaveErr, emailSaveRes) {
						// Set message assertion
						(emailSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle Email save error
						done(emailSaveErr);
					});
			});
	});

	it('should be able to update Email instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Email
				agent.post('/emails')
					.send(email)
					.expect(200)
					.end(function(emailSaveErr, emailSaveRes) {
						// Handle Email save error
						if (emailSaveErr) done(emailSaveErr);

						// Update Email property name
						
						email.name = 'WHY YOU GOTTA BE SO MEAN?';
						
						email.positionIndex = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Email
						agent.put('/emails/' + emailSaveRes.body._id)
							.send(email)
							.expect(200)
							.end(function(emailUpdateErr, emailUpdateRes) {
								// Handle Email update error
								if (emailUpdateErr) done(emailUpdateErr);

								// Set assertions
								(emailUpdateRes.body._id).should.equal(emailSaveRes.body._id);
								
								(emailUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(emailUpdateRes.body.positionIndex).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Emails if not signed in', function(done) {
		// Create new Email model instance
		var emailObj = new Email(email);

		// Save the Email
		emailObj.save(function() {
			// Request Emails
			request(app).get('/emails')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Email if not signed in', function(done) {
		// Create new Email model instance
		var emailObj = new Email(email);

		// Save the Email
		emailObj.save(function() {
			request(app).get('/emails/' + emailObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', email.name);
					
					res.body.should.be.an.Object.with.property('positionIndex', email.positionIndex);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Email instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Email
				agent.post('/emails')
					.send(email)
					.expect(200)
					.end(function(emailSaveErr, emailSaveRes) {
						// Handle Email save error
						if (emailSaveErr) done(emailSaveErr);

						// Delete existing Email
						agent.delete('/emails/' + emailSaveRes.body._id)
							.send(email)
							.expect(200)
							.end(function(emailDeleteErr, emailDeleteRes) {
								// Handle Email error error
								if (emailDeleteErr) done(emailDeleteErr);

								// Set assertions
								(emailDeleteRes.body._id).should.equal(emailSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Email instance if not signed in', function(done) {
		// Set Email user 
		email.user = user;

		// Create new Email model instance
		var emailObj = new Email(email);

		// Save the Email
		emailObj.save(function() {
			// Try deleting Email
			request(app).delete('/emails/' + emailObj._id)
			.expect(401)
			.end(function(emailDeleteErr, emailDeleteRes) {
				// Set message assertion
				(emailDeleteRes.body.message).should.match('User is not logged in');

				// Handle Email error error
				done(emailDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Email.remove().exec(function(){
				done();
			});	
		});
	});
});
