'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Select = mongoose.model('Select'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, select;

/**
 * Select routes tests
 */
describe('Select CRUD tests', function() {
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

		// Save a user to the test db and create new Select
		user.save(function() {
			select = {
				
				name: 'Select Name',
				
				positionIndex: 'Select Name',
				
			};

			done();
		});
	});

	it('should be able to save Select instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Select
				agent.post('/selects')
					.send(select)
					.expect(200)
					.end(function(selectSaveErr, selectSaveRes) {
						// Handle Select save error
						if (selectSaveErr) done(selectSaveErr);

						// Get a list of Selects
						agent.get('/selects')
							.end(function(selectsGetErr, selectsGetRes) {
								// Handle Select save error
								if (selectsGetErr) done(selectsGetErr);

								// Get Selects list
								var selects = selectsGetRes.body;

								// Set assertions
								(selects[0].user._id).should.equal(userId);

								
								(selects[0].name).should.match('Select Name');
								
								(selects[0].positionIndex).should.match('Select Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Select instance if not logged in', function(done) {
		agent.post('/selects')
			.send(select)
			.expect(401)
			.end(function(selectSaveErr, selectSaveRes) {
				// Call the assertion callback
				done(selectSaveErr);
			});
	});

	it('should not be able to save Select instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		select.name = '';
		
		select.positionIndex = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Select
				agent.post('/selects')
					.send(select)
					.expect(400)
					.end(function(selectSaveErr, selectSaveRes) {
						// Set message assertion
						(selectSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle Select save error
						done(selectSaveErr);
					});
			});
	});

	it('should be able to update Select instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Select
				agent.post('/selects')
					.send(select)
					.expect(200)
					.end(function(selectSaveErr, selectSaveRes) {
						// Handle Select save error
						if (selectSaveErr) done(selectSaveErr);

						// Update Select property name
						
						select.name = 'WHY YOU GOTTA BE SO MEAN?';
						
						select.positionIndex = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Select
						agent.put('/selects/' + selectSaveRes.body._id)
							.send(select)
							.expect(200)
							.end(function(selectUpdateErr, selectUpdateRes) {
								// Handle Select update error
								if (selectUpdateErr) done(selectUpdateErr);

								// Set assertions
								(selectUpdateRes.body._id).should.equal(selectSaveRes.body._id);
								
								(selectUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(selectUpdateRes.body.positionIndex).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Selects if not signed in', function(done) {
		// Create new Select model instance
		var selectObj = new Select(select);

		// Save the Select
		selectObj.save(function() {
			// Request Selects
			request(app).get('/selects')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Select if not signed in', function(done) {
		// Create new Select model instance
		var selectObj = new Select(select);

		// Save the Select
		selectObj.save(function() {
			request(app).get('/selects/' + selectObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', select.name);
					
					res.body.should.be.an.Object.with.property('positionIndex', select.positionIndex);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Select instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Select
				agent.post('/selects')
					.send(select)
					.expect(200)
					.end(function(selectSaveErr, selectSaveRes) {
						// Handle Select save error
						if (selectSaveErr) done(selectSaveErr);

						// Delete existing Select
						agent.delete('/selects/' + selectSaveRes.body._id)
							.send(select)
							.expect(200)
							.end(function(selectDeleteErr, selectDeleteRes) {
								// Handle Select error error
								if (selectDeleteErr) done(selectDeleteErr);

								// Set assertions
								(selectDeleteRes.body._id).should.equal(selectSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Select instance if not signed in', function(done) {
		// Set Select user 
		select.user = user;

		// Create new Select model instance
		var selectObj = new Select(select);

		// Save the Select
		selectObj.save(function() {
			// Try deleting Select
			request(app).delete('/selects/' + selectObj._id)
			.expect(401)
			.end(function(selectDeleteErr, selectDeleteRes) {
				// Set message assertion
				(selectDeleteRes.body.message).should.match('User is not logged in');

				// Handle Select error error
				done(selectDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Select.remove().exec(function(){
				done();
			});	
		});
	});
});
