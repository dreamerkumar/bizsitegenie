'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Featurespreadsheet = mongoose.model('Builder-Featurespreadsheet'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, featurespreadsheet;

/**
 * Featurespreadsheet routes tests
 */
describe('Featurespreadsheet CRUD tests', function() {
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

		// Save a user to the test db and create new Featurespreadsheet
		user.save(function() {
			featurespreadsheet = {
				
				fileName: 'Featurespreadsheet Name',
				
				fileKey: 'Featurespreadsheet Name',
				
				parentId: 'Featurespreadsheet Name',
				
				status: 'Featurespreadsheet Name',
				
				updated: 'Featurespreadsheet Name',
				
			};

			done();
		});
	});

	it('should be able to save Featurespreadsheet instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Featurespreadsheet
				agent.post('/featurespreadsheet')
					.send(featurespreadsheet)
					.expect(200)
					.end(function(featurespreadsheetSaveErr, featurespreadsheetSaveRes) {
						// Handle Featurespreadsheet save error
						if (featurespreadsheetSaveErr) done(featurespreadsheetSaveErr);

						// Get a list of Featurespreadsheets
						agent.get('/featurespreadsheet')
							.end(function(featurespreadsheetGetErr, featurespreadsheetGetRes) {
								// Handle Featurespreadsheet save error
								if (featurespreadsheetGetErr) done(featurespreadsheetGetErr);

								// Get Featurespreadsheets list
								var featurespreadsheet = featurespreadsheetGetRes.body;

								// Set assertions
								(featurespreadsheet[0].user._id).should.equal(userId);

								
								(featurespreadsheet[0].fileName).should.match('Featurespreadsheet Name');
								
								(featurespreadsheet[0].fileKey).should.match('Featurespreadsheet Name');
								
								(featurespreadsheet[0].parentId).should.match('Featurespreadsheet Name');
								
								(featurespreadsheet[0].status).should.match('Featurespreadsheet Name');
								
								(featurespreadsheet[0].updated).should.match('Featurespreadsheet Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Featurespreadsheet instance if not logged in', function(done) {
		agent.post('/featurespreadsheet')
			.send(featurespreadsheet)
			.expect(401)
			.end(function(featurespreadsheetSaveErr, featurespreadsheetSaveRes) {
				// Call the assertion callback
				done(featurespreadsheetSaveErr);
			});
	});

	
	it('should not be able to save Featurespreadsheet instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		featurespreadsheet.fileName = '';
		
		featurespreadsheet.fileKey = '';
		
		featurespreadsheet.parentId = '';
		
		featurespreadsheet.status = '';
		
		featurespreadsheet.updated = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Featurespreadsheet
				agent.post('/featurespreadsheet')
					.send(featurespreadsheet)
					.expect(400)
					.end(function(featurespreadsheetSaveErr, featurespreadsheetSaveRes) {
						// Set message assertion
						(featurespreadsheetSaveRes.body.message).should.match('Please fill \'file name\'');
						
						// Handle Featurespreadsheet save error
						done(featurespreadsheetSaveErr);
					});
			});
	});
	

	it('should be able to update Featurespreadsheet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Featurespreadsheet
				agent.post('/featurespreadsheet')
					.send(featurespreadsheet)
					.expect(200)
					.end(function(featurespreadsheetSaveErr, featurespreadsheetSaveRes) {
						// Handle Featurespreadsheet save error
						if (featurespreadsheetSaveErr) done(featurespreadsheetSaveErr);

						// Update Featurespreadsheet property name
						
						featurespreadsheet.fileName = 'WHY YOU GOTTA BE SO MEAN?';
						
						featurespreadsheet.fileKey = 'WHY YOU GOTTA BE SO MEAN?';
						
						featurespreadsheet.parentId = 'WHY YOU GOTTA BE SO MEAN?';
						
						featurespreadsheet.status = 'WHY YOU GOTTA BE SO MEAN?';
						
						featurespreadsheet.updated = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Featurespreadsheet
						agent.put('/featurespreadsheet/' + featurespreadsheetSaveRes.body._id)
							.send(featurespreadsheet)
							.expect(200)
							.end(function(featurespreadsheetUpdateErr, featurespreadsheetUpdateRes) {
								// Handle Featurespreadsheet update error
								if (featurespreadsheetUpdateErr) done(featurespreadsheetUpdateErr);

								// Set assertions
								(featurespreadsheetUpdateRes.body._id).should.equal(featurespreadsheetSaveRes.body._id);
								
								(featurespreadsheetUpdateRes.body.fileName).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(featurespreadsheetUpdateRes.body.fileKey).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(featurespreadsheetUpdateRes.body.parentId).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(featurespreadsheetUpdateRes.body.status).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(featurespreadsheetUpdateRes.body.updated).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Featurespreadsheets if not signed in', function(done) {
		// Create new Featurespreadsheet model instance
		var featurespreadsheetObj = new Featurespreadsheet(featurespreadsheet);

		// Save the Featurespreadsheet
		featurespreadsheetObj.save(function() {
			// Request Featurespreadsheets
			request(app).get('/featurespreadsheet')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Featurespreadsheet if not signed in', function(done) {
		// Create new Featurespreadsheet model instance
		var featurespreadsheetObj = new Featurespreadsheet(featurespreadsheet);

		// Save the Featurespreadsheet
		featurespreadsheetObj.save(function() {
			request(app).get('/featurespreadsheet/' + featurespreadsheetObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('fileName', featurespreadsheet.fileName);
					
					res.body.should.be.an.Object.with.property('fileKey', featurespreadsheet.fileKey);
					
					res.body.should.be.an.Object.with.property('parentId', featurespreadsheet.parentId);
					
					res.body.should.be.an.Object.with.property('status', featurespreadsheet.status);
					
					res.body.should.be.an.Object.with.property('updated', featurespreadsheet.updated);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Featurespreadsheet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Featurespreadsheet
				agent.post('/featurespreadsheet')
					.send(featurespreadsheet)
					.expect(200)
					.end(function(featurespreadsheetSaveErr, featurespreadsheetSaveRes) {
						// Handle Featurespreadsheet save error
						if (featurespreadsheetSaveErr) done(featurespreadsheetSaveErr);

						// Delete existing Featurespreadsheet
						agent.delete('/featurespreadsheet/' + featurespreadsheetSaveRes.body._id)
							.send(featurespreadsheet)
							.expect(200)
							.end(function(featurespreadsheetDeleteErr, featurespreadsheetDeleteRes) {
								// Handle Featurespreadsheet error error
								if (featurespreadsheetDeleteErr) done(featurespreadsheetDeleteErr);

								// Set assertions
								(featurespreadsheetDeleteRes.body._id).should.equal(featurespreadsheetSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Featurespreadsheet instance if not signed in', function(done) {
		// Set Featurespreadsheet user 
		featurespreadsheet.user = user;

		// Create new Featurespreadsheet model instance
		var featurespreadsheetObj = new Featurespreadsheet(featurespreadsheet);

		// Save the Featurespreadsheet
		featurespreadsheetObj.save(function() {
			// Try deleting Featurespreadsheet
			request(app).delete('/featurespreadsheet/' + featurespreadsheetObj._id)
			.expect(401)
			.end(function(featurespreadsheetDeleteErr, featurespreadsheetDeleteRes) {
				// Set message assertion
				(featurespreadsheetDeleteRes.body.message).should.match('User is not logged in');

				// Handle Featurespreadsheet error error
				done(featurespreadsheetDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Featurespreadsheet.remove().exec(function(){
				done();
			});	
		});
	});
});
