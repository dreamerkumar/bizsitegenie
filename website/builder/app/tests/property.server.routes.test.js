'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Property = mongoose.model('Property'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, property;

/**
 * Property routes tests
 */
describe('Property CRUD tests', function() {
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

		// Save a user to the test db and create new Property
		user.save(function() {
			property = {
				
				referenceDisplayFormat: 'Property Name',
				
				col: 'Property Name',
				
				selectorControlType: 'Property Name',
				
				parentId: 'Property Name',
				
				row: 'Property Name',
				
				option: 'Property Name',
				
				refDescription: 'Property Name',
				
				referencedPropertyName: 'Property Name',
				
				selectorControlAttribute: 'Property Name',
				
				type: 'Property Name',
				
				name: 'Property Name',
				
				value: 'Property Name',
				
				referencedFeatureId: 'Property Name',
				
				referencedFeatureName: 'Property Name',
				
				propertyNamesForDisplay: 'Property Name',
				
				referenceDescription: 'Property Name',
				
			};

			done();
		});
	});

	it('should be able to save Property instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Property
				agent.post('/property')
					.send(property)
					.expect(200)
					.end(function(propertySaveErr, propertySaveRes) {
						// Handle Property save error
						if (propertySaveErr) done(propertySaveErr);

						// Get a list of Properties
						agent.get('/property')
							.end(function(propertyGetErr, propertyGetRes) {
								// Handle Property save error
								if (propertyGetErr) done(propertyGetErr);

								// Get Properties list
								var property = propertyGetRes.body;

								// Set assertions
								(property[0].user._id).should.equal(userId);

								
								(property[0].referenceDisplayFormat).should.match('Property Name');
								
								(property[0].col).should.match('Property Name');
								
								(property[0].selectorControlType).should.match('Property Name');
								
								(property[0].parentId).should.match('Property Name');
								
								(property[0].row).should.match('Property Name');
								
								(property[0].option).should.match('Property Name');
								
								(property[0].refDescription).should.match('Property Name');
								
								(property[0].referencedPropertyName).should.match('Property Name');
								
								(property[0].selectorControlAttribute).should.match('Property Name');
								
								(property[0].type).should.match('Property Name');
								
								(property[0].name).should.match('Property Name');
								
								(property[0].value).should.match('Property Name');
								
								(property[0].referencedFeatureId).should.match('Property Name');
								
								(property[0].referencedFeatureName).should.match('Property Name');
								
								(property[0].propertyNamesForDisplay).should.match('Property Name');
								
								(property[0].referenceDescription).should.match('Property Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Property instance if not logged in', function(done) {
		agent.post('/property')
			.send(property)
			.expect(401)
			.end(function(propertySaveErr, propertySaveRes) {
				// Call the assertion callback
				done(propertySaveErr);
			});
	});

	
	it('should not be able to save Property instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		property.referenceDisplayFormat = '';
		
		property.col = '';
		
		property.selectorControlType = '';
		
		property.parentId = '';
		
		property.row = '';
		
		property.option = '';
		
		property.refDescription = '';
		
		property.referencedPropertyName = '';
		
		property.selectorControlAttribute = '';
		
		property.type = '';
		
		property.name = '';
		
		property.value = '';
		
		property.referencedFeatureId = '';
		
		property.referencedFeatureName = '';
		
		property.propertyNamesForDisplay = '';
		
		property.referenceDescription = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Property
				agent.post('/property')
					.send(property)
					.expect(400)
					.end(function(propertySaveErr, propertySaveRes) {
						// Set message assertion
						(propertySaveRes.body.message).should.match('Please fill \'reference display format\'');
						
						// Handle Property save error
						done(propertySaveErr);
					});
			});
	});
	

	it('should be able to update Property instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Property
				agent.post('/property')
					.send(property)
					.expect(200)
					.end(function(propertySaveErr, propertySaveRes) {
						// Handle Property save error
						if (propertySaveErr) done(propertySaveErr);

						// Update Property property name
						
						property.referenceDisplayFormat = 'WHY YOU GOTTA BE SO MEAN?';
						
						property.col = 'WHY YOU GOTTA BE SO MEAN?';
						
						property.selectorControlType = 'WHY YOU GOTTA BE SO MEAN?';
						
						property.parentId = 'WHY YOU GOTTA BE SO MEAN?';
						
						property.row = 'WHY YOU GOTTA BE SO MEAN?';
						
						property.option = 'WHY YOU GOTTA BE SO MEAN?';
						
						property.refDescription = 'WHY YOU GOTTA BE SO MEAN?';
						
						property.referencedPropertyName = 'WHY YOU GOTTA BE SO MEAN?';
						
						property.selectorControlAttribute = 'WHY YOU GOTTA BE SO MEAN?';
						
						property.type = 'WHY YOU GOTTA BE SO MEAN?';
						
						property.name = 'WHY YOU GOTTA BE SO MEAN?';
						
						property.value = 'WHY YOU GOTTA BE SO MEAN?';
						
						property.referencedFeatureId = 'WHY YOU GOTTA BE SO MEAN?';
						
						property.referencedFeatureName = 'WHY YOU GOTTA BE SO MEAN?';
						
						property.propertyNamesForDisplay = 'WHY YOU GOTTA BE SO MEAN?';
						
						property.referenceDescription = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Property
						agent.put('/property/' + propertySaveRes.body._id)
							.send(property)
							.expect(200)
							.end(function(propertyUpdateErr, propertyUpdateRes) {
								// Handle Property update error
								if (propertyUpdateErr) done(propertyUpdateErr);

								// Set assertions
								(propertyUpdateRes.body._id).should.equal(propertySaveRes.body._id);
								
								(propertyUpdateRes.body.referenceDisplayFormat).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(propertyUpdateRes.body.col).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(propertyUpdateRes.body.selectorControlType).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(propertyUpdateRes.body.parentId).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(propertyUpdateRes.body.row).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(propertyUpdateRes.body.option).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(propertyUpdateRes.body.refDescription).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(propertyUpdateRes.body.referencedPropertyName).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(propertyUpdateRes.body.selectorControlAttribute).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(propertyUpdateRes.body.type).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(propertyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(propertyUpdateRes.body.value).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(propertyUpdateRes.body.referencedFeatureId).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(propertyUpdateRes.body.referencedFeatureName).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(propertyUpdateRes.body.propertyNamesForDisplay).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(propertyUpdateRes.body.referenceDescription).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Properties if not signed in', function(done) {
		// Create new Property model instance
		var propertyObj = new Property(property);

		// Save the Property
		propertyObj.save(function() {
			// Request Properties
			request(app).get('/property')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Property if not signed in', function(done) {
		// Create new Property model instance
		var propertyObj = new Property(property);

		// Save the Property
		propertyObj.save(function() {
			request(app).get('/property/' + propertyObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('referenceDisplayFormat', property.referenceDisplayFormat);
					
					res.body.should.be.an.Object.with.property('col', property.col);
					
					res.body.should.be.an.Object.with.property('selectorControlType', property.selectorControlType);
					
					res.body.should.be.an.Object.with.property('parentId', property.parentId);
					
					res.body.should.be.an.Object.with.property('row', property.row);
					
					res.body.should.be.an.Object.with.property('option', property.option);
					
					res.body.should.be.an.Object.with.property('refDescription', property.refDescription);
					
					res.body.should.be.an.Object.with.property('referencedPropertyName', property.referencedPropertyName);
					
					res.body.should.be.an.Object.with.property('selectorControlAttribute', property.selectorControlAttribute);
					
					res.body.should.be.an.Object.with.property('type', property.type);
					
					res.body.should.be.an.Object.with.property('name', property.name);
					
					res.body.should.be.an.Object.with.property('value', property.value);
					
					res.body.should.be.an.Object.with.property('referencedFeatureId', property.referencedFeatureId);
					
					res.body.should.be.an.Object.with.property('referencedFeatureName', property.referencedFeatureName);
					
					res.body.should.be.an.Object.with.property('propertyNamesForDisplay', property.propertyNamesForDisplay);
					
					res.body.should.be.an.Object.with.property('referenceDescription', property.referenceDescription);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Property instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Property
				agent.post('/property')
					.send(property)
					.expect(200)
					.end(function(propertySaveErr, propertySaveRes) {
						// Handle Property save error
						if (propertySaveErr) done(propertySaveErr);

						// Delete existing Property
						agent.delete('/property/' + propertySaveRes.body._id)
							.send(property)
							.expect(200)
							.end(function(propertyDeleteErr, propertyDeleteRes) {
								// Handle Property error error
								if (propertyDeleteErr) done(propertyDeleteErr);

								// Set assertions
								(propertyDeleteRes.body._id).should.equal(propertySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Property instance if not signed in', function(done) {
		// Set Property user 
		property.user = user;

		// Create new Property model instance
		var propertyObj = new Property(property);

		// Save the Property
		propertyObj.save(function() {
			// Try deleting Property
			request(app).delete('/property/' + propertyObj._id)
			.expect(401)
			.end(function(propertyDeleteErr, propertyDeleteRes) {
				// Set message assertion
				(propertyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Property error error
				done(propertyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Property.remove().exec(function(){
				done();
			});	
		});
	});
});
