'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Abcd = mongoose.model('Abcd'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, abcd;

/**
 * Abcd routes tests
 */
describe('Abcd CRUD tests', function() {
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

		// Save a user to the test db and create new Abcd
		user.save(function() {
			abcd = {
				
				a: 'Abcd Name',
				
				b: 'Abcd Name',
				
				c: 'Abcd Name',
				
				d: 'Abcd Name',
				
			};

			done();
		});
	});

	it('should be able to save Abcd instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Abcd
				agent.post('/abcd')
					.send(abcd)
					.expect(200)
					.end(function(abcdSaveErr, abcdSaveRes) {
						// Handle Abcd save error
						if (abcdSaveErr) done(abcdSaveErr);

						// Get a list of Abcds
						agent.get('/abcd')
							.end(function(abcdGetErr, abcdGetRes) {
								// Handle Abcd save error
								if (abcdGetErr) done(abcdGetErr);

								// Get Abcds list
								var abcd = abcdGetRes.body;

								// Set assertions
								(abcd[0].user._id).should.equal(userId);

								
								(abcd[0].a).should.match('Abcd Name');
								
								(abcd[0].b).should.match('Abcd Name');
								
								(abcd[0].c).should.match('Abcd Name');
								
								(abcd[0].d).should.match('Abcd Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Abcd instance if not logged in', function(done) {
		agent.post('/abcd')
			.send(abcd)
			.expect(401)
			.end(function(abcdSaveErr, abcdSaveRes) {
				// Call the assertion callback
				done(abcdSaveErr);
			});
	});

	
	it('should not be able to save Abcd instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		abcd.a = '';
		
		abcd.b = '';
		
		abcd.c = '';
		
		abcd.d = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Abcd
				agent.post('/abcd')
					.send(abcd)
					.expect(400)
					.end(function(abcdSaveErr, abcdSaveRes) {
						// Set message assertion
						(abcdSaveRes.body.message).should.match('Please fill \'a\'');
						
						// Handle Abcd save error
						done(abcdSaveErr);
					});
			});
	});
	

	it('should be able to update Abcd instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Abcd
				agent.post('/abcd')
					.send(abcd)
					.expect(200)
					.end(function(abcdSaveErr, abcdSaveRes) {
						// Handle Abcd save error
						if (abcdSaveErr) done(abcdSaveErr);

						// Update Abcd property name
						
						abcd.a = 'WHY YOU GOTTA BE SO MEAN?';
						
						abcd.b = 'WHY YOU GOTTA BE SO MEAN?';
						
						abcd.c = 'WHY YOU GOTTA BE SO MEAN?';
						
						abcd.d = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Abcd
						agent.put('/abcd/' + abcdSaveRes.body._id)
							.send(abcd)
							.expect(200)
							.end(function(abcdUpdateErr, abcdUpdateRes) {
								// Handle Abcd update error
								if (abcdUpdateErr) done(abcdUpdateErr);

								// Set assertions
								(abcdUpdateRes.body._id).should.equal(abcdSaveRes.body._id);
								
								(abcdUpdateRes.body.a).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(abcdUpdateRes.body.b).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(abcdUpdateRes.body.c).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(abcdUpdateRes.body.d).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Abcds if not signed in', function(done) {
		// Create new Abcd model instance
		var abcdObj = new Abcd(abcd);

		// Save the Abcd
		abcdObj.save(function() {
			// Request Abcds
			request(app).get('/abcd')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Abcd if not signed in', function(done) {
		// Create new Abcd model instance
		var abcdObj = new Abcd(abcd);

		// Save the Abcd
		abcdObj.save(function() {
			request(app).get('/abcd/' + abcdObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('a', abcd.a);
					
					res.body.should.be.an.Object.with.property('b', abcd.b);
					
					res.body.should.be.an.Object.with.property('c', abcd.c);
					
					res.body.should.be.an.Object.with.property('d', abcd.d);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Abcd instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Abcd
				agent.post('/abcd')
					.send(abcd)
					.expect(200)
					.end(function(abcdSaveErr, abcdSaveRes) {
						// Handle Abcd save error
						if (abcdSaveErr) done(abcdSaveErr);

						// Delete existing Abcd
						agent.delete('/abcd/' + abcdSaveRes.body._id)
							.send(abcd)
							.expect(200)
							.end(function(abcdDeleteErr, abcdDeleteRes) {
								// Handle Abcd error error
								if (abcdDeleteErr) done(abcdDeleteErr);

								// Set assertions
								(abcdDeleteRes.body._id).should.equal(abcdSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Abcd instance if not signed in', function(done) {
		// Set Abcd user 
		abcd.user = user;

		// Create new Abcd model instance
		var abcdObj = new Abcd(abcd);

		// Save the Abcd
		abcdObj.save(function() {
			// Try deleting Abcd
			request(app).delete('/abcd/' + abcdObj._id)
			.expect(401)
			.end(function(abcdDeleteErr, abcdDeleteRes) {
				// Set message assertion
				(abcdDeleteRes.body.message).should.match('User is not logged in');

				// Handle Abcd error error
				done(abcdDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Abcd.remove().exec(function(){
				done();
			});	
		});
	});
});
