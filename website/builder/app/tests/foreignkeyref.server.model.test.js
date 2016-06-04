'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Foreignkeyref = mongoose.model('Builder-Foreignkeyref');

/**
 * Globals
 */
var user, foreignkeyref;

/**
 * Unit tests
 */
describe('Foreignkeyref Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			foreignkeyref = new Foreignkeyref({
				
				propertyNamesForSearch: 'Foreignkeyref Name',
				
				name: 'Foreignkeyref Name',
				
				parentId: 'Foreignkeyref Name',
				
				positionIndex: 'Foreignkeyref Name',
				
				referencedFeatureId: 'Foreignkeyref Name',
				
				referencedFeatureName: 'Foreignkeyref Name',
				
				propertyNamesForDisplay: 'Foreignkeyref Name',
				
				referenceDescription: 'Foreignkeyref Name',
				
				referenceDisplayFormat: 'Foreignkeyref Name',
				
				selectorControlType: 'Foreignkeyref Name',
				
				selectorControlAttribute: 'Foreignkeyref Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return foreignkeyref.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			foreignkeyref.propertyNamesForSearch = '';
			
			foreignkeyref.name = '';
			
			foreignkeyref.parentId = '';
			
			foreignkeyref.positionIndex = '';
			
			foreignkeyref.referencedFeatureId = '';
			
			foreignkeyref.referencedFeatureName = '';
			
			foreignkeyref.propertyNamesForDisplay = '';
			
			foreignkeyref.referenceDescription = '';
			
			foreignkeyref.referenceDisplayFormat = '';
			
			foreignkeyref.selectorControlType = '';
			
			foreignkeyref.selectorControlAttribute = '';
			

			return foreignkeyref.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Foreignkeyref.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
