'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Textarea = mongoose.model('Textarea'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, textarea;

/**
 * Textarea routes tests
 */
describe('Textarea CRUD tests', function() {
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

		// Save a user to the test db and create new Textarea
		user.save(function() {
			textarea = {
				
				name: 'Textarea Name',
				
				row: 'Textarea Name',
				
				col: 'Textarea Name',
				
				positionIndex: 'Textarea Name',
				
			};

			done();
		});
	});

	it('should be able to save Textarea instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Textarea
				agent.post('/textareas')
					.send(textarea)
					.expect(200)
					.end(function(textareaSaveErr, textareaSaveRes) {
						// Handle Textarea save error
						if (textareaSaveErr) done(textareaSaveErr);

						// Get a list of Textareas
						agent.get('/textareas')
							.end(function(textareasGetErr, textareasGetRes) {
								// Handle Textarea save error
								if (textareasGetErr) done(textareasGetErr);

								// Get Textareas list
								var textareas = textareasGetRes.body;

								// Set assertions
								(textareas[0].user._id).should.equal(userId);

								
								(textareas[0].name).should.match('Textarea Name');
								
								(textareas[0].row).should.match('Textarea Name');
								
								(textareas[0].col).should.match('Textarea Name');
								
								(textareas[0].positionIndex).should.match('Textarea Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Textarea instance if not logged in', function(done) {
		agent.post('/textareas')
			.send(textarea)
			.expect(401)
			.end(function(textareaSaveErr, textareaSaveRes) {
				// Call the assertion callback
				done(textareaSaveErr);
			});
	});

	it('should not be able to save Textarea instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		textarea.name = '';
		
		textarea.row = '';
		
		textarea.col = '';
		
		textarea.positionIndex = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Textarea
				agent.post('/textareas')
					.send(textarea)
					.expect(400)
					.end(function(textareaSaveErr, textareaSaveRes) {
						// Set message assertion
						(textareaSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle Textarea save error
						done(textareaSaveErr);
					});
			});
	});

	it('should be able to update Textarea instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Textarea
				agent.post('/textareas')
					.send(textarea)
					.expect(200)
					.end(function(textareaSaveErr, textareaSaveRes) {
						// Handle Textarea save error
						if (textareaSaveErr) done(textareaSaveErr);

						// Update Textarea property name
						
						textarea.name = 'WHY YOU GOTTA BE SO MEAN?';
						
						textarea.row = 'WHY YOU GOTTA BE SO MEAN?';
						
						textarea.col = 'WHY YOU GOTTA BE SO MEAN?';
						
						textarea.positionIndex = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Textarea
						agent.put('/textareas/' + textareaSaveRes.body._id)
							.send(textarea)
							.expect(200)
							.end(function(textareaUpdateErr, textareaUpdateRes) {
								// Handle Textarea update error
								if (textareaUpdateErr) done(textareaUpdateErr);

								// Set assertions
								(textareaUpdateRes.body._id).should.equal(textareaSaveRes.body._id);
								
								(textareaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(textareaUpdateRes.body.row).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(textareaUpdateRes.body.col).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(textareaUpdateRes.body.positionIndex).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Textareas if not signed in', function(done) {
		// Create new Textarea model instance
		var textareaObj = new Textarea(textarea);

		// Save the Textarea
		textareaObj.save(function() {
			// Request Textareas
			request(app).get('/textareas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Textarea if not signed in', function(done) {
		// Create new Textarea model instance
		var textareaObj = new Textarea(textarea);

		// Save the Textarea
		textareaObj.save(function() {
			request(app).get('/textareas/' + textareaObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', textarea.name);
					
					res.body.should.be.an.Object.with.property('row', textarea.row);
					
					res.body.should.be.an.Object.with.property('col', textarea.col);
					
					res.body.should.be.an.Object.with.property('positionIndex', textarea.positionIndex);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Textarea instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Textarea
				agent.post('/textareas')
					.send(textarea)
					.expect(200)
					.end(function(textareaSaveErr, textareaSaveRes) {
						// Handle Textarea save error
						if (textareaSaveErr) done(textareaSaveErr);

						// Delete existing Textarea
						agent.delete('/textareas/' + textareaSaveRes.body._id)
							.send(textarea)
							.expect(200)
							.end(function(textareaDeleteErr, textareaDeleteRes) {
								// Handle Textarea error error
								if (textareaDeleteErr) done(textareaDeleteErr);

								// Set assertions
								(textareaDeleteRes.body._id).should.equal(textareaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Textarea instance if not signed in', function(done) {
		// Set Textarea user 
		textarea.user = user;

		// Create new Textarea model instance
		var textareaObj = new Textarea(textarea);

		// Save the Textarea
		textareaObj.save(function() {
			// Try deleting Textarea
			request(app).delete('/textareas/' + textareaObj._id)
			.expect(401)
			.end(function(textareaDeleteErr, textareaDeleteRes) {
				// Set message assertion
				(textareaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Textarea error error
				done(textareaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Textarea.remove().exec(function(){
				done();
			});	
		});
	});
});
