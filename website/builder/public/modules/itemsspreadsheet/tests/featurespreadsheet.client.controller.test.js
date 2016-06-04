'use strict';

(function() {
	// Itemspreadsheets Controller Spec
	describe('Itemspreadsheets Controller Tests', function() {
		// Initialize global variables
		var ItemspreadsheetController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Itemspreadsheets controller.
			ItemspreadsheetController = $controller('ItemspreadsheetController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Itemspreadsheet object fetched from XHR', inject(function(Itemspreadsheet) {
			// Create sample Itemspreadsheet using the Itemspreadsheets service
			var sampleItemspreadsheet = new Itemspreadsheet({
				
				fileName: 'New Itemspreadsheet',
				
				fileKey: 'New Itemspreadsheet',
				
				parentId: 'New Itemspreadsheet',
				
				status: 'New Itemspreadsheet',
				
				updated: 'New Itemspreadsheet',
				
			});

			// Create a sample Itemspreadsheets array that includes the new Itemspreadsheet
			var sampleItemspreadsheet = [sampleItemspreadsheet];

			// Set GET response
			$httpBackend.expectGET('itemspreadsheet').respond(sampleItemspreadsheet);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.itemspreadsheet).toEqualData(sampleItemspreadsheet);
		}));

		it('$scope.findOne() should create an array with one Itemspreadsheet object fetched from XHR using a itemspreadsheetId URL parameter', inject(function(Itemspreadsheet) {
			// Define a sample Itemspreadsheet object
			var sampleItemspreadsheet = new Itemspreadsheet({
				
				fileName: 'New Itemspreadsheet',
				
				fileKey: 'New Itemspreadsheet',
				
				parentId: 'New Itemspreadsheet',
				
				status: 'New Itemspreadsheet',
				
				updated: 'New Itemspreadsheet',
				
			});

			// Set the URL parameter
			$stateParams.itemspreadsheetId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/itemspreadsheet\/([0-9a-fA-F]{24})$/).respond(sampleItemspreadsheet);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.itemspreadsheet).toEqualData(sampleItemspreadsheet);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Itemspreadsheet) {
			// Create a sample Itemspreadsheet object
			var sampleItemspreadsheetPostData = new Itemspreadsheet({
				
				fileName: 'New Itemspreadsheet',
				
				fileKey: 'New Itemspreadsheet',
				
				parentId: 'New Itemspreadsheet',
				
				status: 'New Itemspreadsheet',
				
				updated: 'New Itemspreadsheet',
				
			});

			// Create a sample Itemspreadsheet response
			var sampleItemspreadsheetResponse = new Itemspreadsheet({
				_id: '525cf20451979dea2c000001',
				
				fileName: 'New Itemspreadsheet',
				
				fileKey: 'New Itemspreadsheet',
				
				parentId: 'New Itemspreadsheet',
				
				status: 'New Itemspreadsheet',
				
				updated: 'New Itemspreadsheet',
				
			});

			// Fixture mock form input values
			
			scope.fileName = 'New Itemspreadsheet';
			
			scope.fileKey = 'New Itemspreadsheet';
			
			scope.parentId = 'New Itemspreadsheet';
			
			scope.status = 'New Itemspreadsheet';
			
			scope.updated = 'New Itemspreadsheet';
			

			// Set POST response
			$httpBackend.expectPOST('itemspreadsheet', sampleItemspreadsheetPostData).respond(sampleItemspreadsheetResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			
			expect(scope.fileName).toEqual('');
			
			expect(scope.fileKey).toEqual('');
			
			expect(scope.parentId).toEqual('');
			
			expect(scope.status).toEqual('');
			
			expect(scope.updated).toEqual('');
			


			// Test URL redirection after the Itemspreadsheet was created
			expect($location.path()).toBe('/itemspreadsheet/' + sampleItemspreadsheetResponse._id);
		}));

		it('$scope.update() should update a valid Itemspreadsheet', inject(function(Itemspreadsheet) {
			// Define a sample Itemspreadsheet put data
			var sampleItemspreadsheetPutData = new Itemspreadsheet({
				_id: '525cf20451979dea2c000001',
				
				fileName: 'New Itemspreadsheet',
				
				fileKey: 'New Itemspreadsheet',
				
				parentId: 'New Itemspreadsheet',
				
				status: 'New Itemspreadsheet',
				
				updated: 'New Itemspreadsheet',
				
			});

			// Mock Itemspreadsheet in scope
			scope.itemspreadsheet = sampleItemspreadsheetPutData;

			// Set PUT response
			$httpBackend.expectPUT(/itemspreadsheet\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/itemspreadsheet/' + sampleItemspreadsheetPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid itemspreadsheetId and remove the Itemspreadsheet from the scope', inject(function(Itemspreadsheet) {
			// Create new Itemspreadsheet object
			var sampleItemspreadsheet = new Itemspreadsheet({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Itemspreadsheets array and include the Itemspreadsheet
			scope.itemspreadsheet = [sampleItemspreadsheet];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/itemspreadsheet\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleItemspreadsheet);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.itemspreadsheet.length).toBe(0);
		}));
	});
}());