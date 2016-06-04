'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Option11 = mongoose.model('Option11'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, option11;

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
			option11 = {
				
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
				agent.post('/option11s')
					.send(option11)
					.expect(200)
					.end(function(option11SaveErr, option11SaveRes) {
						// Handle Option save error
						if (option11SaveErr) done(option11SaveErr);

						// Get a list of Options
						agent.get('/option11s')
							.end(function(option11sGetErr, option11sGetRes) {
								// Handle Option save error
								if (option11sGetErr) done(option11sGetErr);

								// Get Options list
								var option11s = option11sGetRes.body;

								// Set assertions
								(option11s[0].user._id).should.equal(userId);

								
								(option11s[0].text).should.match('Option Name');
								
								(option11s[0].value).should.match('Option Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Option instance if not logged in', function(done) {
		agent.post('/option11s')
			.send(option11)
			.expect(401)
			.end(function(option11SaveErr, option11SaveRes) {
				// Call the assertion callback
				done(option11SaveErr);
			});
	});

	it('should not be able to save Option instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		option11.text = '';
		
		option11.value = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Option
				agent.post('/option11s')
					.send(option11)
					.expect(400)
					.end(function(option11SaveErr, option11SaveRes) {
						// Set message assertion
						(option11SaveRes.body.message).should.match('Please fill \'text\'');
						
						// Handle Option save error
						done(option11SaveErr);
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
				agent.post('/option11s')
					.send(option11)
					.expect(200)
					.end(function(option11SaveErr, option11SaveRes) {
						// Handle Option save error
						if (option11SaveErr) done(option11SaveErr);

						// Update Option property name
						
						option11.text = 'WHY YOU GOTTA BE SO MEAN?';
						
						option11.value = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Option
						agent.put('/option11s/' + option11SaveRes.body._id)
							.send(option11)
							.expect(200)
							.end(function(option11UpdateErr, option11UpdateRes) {
								// Handle Option update error
								if (option11UpdateErr) done(option11UpdateErr);

								// Set assertions
								(option11UpdateRes.body._id).should.equal(option11SaveRes.body._id);
								
								(option11UpdateRes.body.text).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(option11UpdateRes.body.value).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Options if not signed in', function(done) {
		// Create new Option model instance
		var option11Obj = new Option11(option11);

		// Save the Option
		option11Obj.save(function() {
			// Request Options
			request(app).get('/option11s')
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
		var option11Obj = new Option11(option11);

		// Save the Option
		option11Obj.save(function() {
			request(app).get('/option11s/' + option11Obj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('text', option11.text);
					
					res.body.should.be.an.Object.with.property('value', option11.value);
					
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
				agent.post('/option11s')
					.send(option11)
					.expect(200)
					.end(function(option11SaveErr, option11SaveRes) {
						// Handle Option save error
						if (option11SaveErr) done(option11SaveErr);

						// Delete existing Option
						agent.delete('/option11s/' + option11SaveRes.body._id)
							.send(option11)
							.expect(200)
							.end(function(option11DeleteErr, option11DeleteRes) {
								// Handle Option error error
								if (option11DeleteErr) done(option11DeleteErr);

								// Set assertions
								(option11DeleteRes.body._id).should.equal(option11SaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Option instance if not signed in', function(done) {
		// Set Option user 
		option11.user = user;

		// Create new Option model instance
		var option11Obj = new Option11(option11);

		// Save the Option
		option11Obj.save(function() {
			// Try deleting Option
			request(app).delete('/option11s/' + option11Obj._id)
			.expect(401)
			.end(function(option11DeleteErr, option11DeleteRes) {
				// Set message assertion
				(option11DeleteRes.body.message).should.match('User is not logged in');

				// Handle Option error error
				done(option11DeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Option11.remove().exec(function(){
				done();
			});	
		});
	});
});
