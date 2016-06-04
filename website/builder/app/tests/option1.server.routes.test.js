'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Option1 = mongoose.model('Option1'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, option1;

/**
 * Option routes tests
 */
describe('Option CRUD tests', function() {
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

		// Save a user to the test db and create new Option
		user.save(function() {
			option1 = {
				
				text: 'Option Name',
				
				value: 'Option Name',
				
			};

			done();
		});
	});

	it('should be able to save Option instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Option
				agent.post('/option1s')
					.send(option1)
					.expect(200)
					.end(function(option1SaveErr, option1SaveRes) {
						// Handle Option save error
						if (option1SaveErr) done(option1SaveErr);

						// Get a list of Options
						agent.get('/option1s')
							.end(function(option1sGetErr, option1sGetRes) {
								// Handle Option save error
								if (option1sGetErr) done(option1sGetErr);

								// Get Options list
								var option1s = option1sGetRes.body;

								// Set assertions
								(option1s[0].user._id).should.equal(userId);

								
								(option1s[0].text).should.match('Option Name');
								
								(option1s[0].value).should.match('Option Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Option instance if not logged in', function(done) {
		agent.post('/option1s')
			.send(option1)
			.expect(401)
			.end(function(option1SaveErr, option1SaveRes) {
				// Call the assertion callback
				done(option1SaveErr);
			});
	});

	it('should not be able to save Option instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		option1.text = '';
		
		option1.value = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Option
				agent.post('/option1s')
					.send(option1)
					.expect(400)
					.end(function(option1SaveErr, option1SaveRes) {
						// Set message assertion
						(option1SaveRes.body.message).should.match('Please fill \'text\'');
						
						// Handle Option save error
						done(option1SaveErr);
					});
			});
	});

	it('should be able to update Option instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Option
				agent.post('/option1s')
					.send(option1)
					.expect(200)
					.end(function(option1SaveErr, option1SaveRes) {
						// Handle Option save error
						if (option1SaveErr) done(option1SaveErr);

						// Update Option property name
						
						option1.text = 'WHY YOU GOTTA BE SO MEAN?';
						
						option1.value = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Option
						agent.put('/option1s/' + option1SaveRes.body._id)
							.send(option1)
							.expect(200)
							.end(function(option1UpdateErr, option1UpdateRes) {
								// Handle Option update error
								if (option1UpdateErr) done(option1UpdateErr);

								// Set assertions
								(option1UpdateRes.body._id).should.equal(option1SaveRes.body._id);
								
								(option1UpdateRes.body.text).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(option1UpdateRes.body.value).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Options if not signed in', function(done) {
		// Create new Option model instance
		var option1Obj = new Option1(option1);

		// Save the Option
		option1Obj.save(function() {
			// Request Options
			request(app).get('/option1s')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Option if not signed in', function(done) {
		// Create new Option model instance
		var option1Obj = new Option1(option1);

		// Save the Option
		option1Obj.save(function() {
			request(app).get('/option1s/' + option1Obj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('text', option1.text);
					
					res.body.should.be.an.Object.with.property('value', option1.value);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Option instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Option
				agent.post('/option1s')
					.send(option1)
					.expect(200)
					.end(function(option1SaveErr, option1SaveRes) {
						// Handle Option save error
						if (option1SaveErr) done(option1SaveErr);

						// Delete existing Option
						agent.delete('/option1s/' + option1SaveRes.body._id)
							.send(option1)
							.expect(200)
							.end(function(option1DeleteErr, option1DeleteRes) {
								// Handle Option error error
								if (option1DeleteErr) done(option1DeleteErr);

								// Set assertions
								(option1DeleteRes.body._id).should.equal(option1SaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Option instance if not signed in', function(done) {
		// Set Option user 
		option1.user = user;

		// Create new Option model instance
		var option1Obj = new Option1(option1);

		// Save the Option
		option1Obj.save(function() {
			// Try deleting Option
			request(app).delete('/option1s/' + option1Obj._id)
			.expect(401)
			.end(function(option1DeleteErr, option1DeleteRes) {
				// Set message assertion
				(option1DeleteRes.body.message).should.match('User is not logged in');

				// Handle Option error error
				done(option1DeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Option1.remove().exec(function(){
				done();
			});	
		});
	});
});
