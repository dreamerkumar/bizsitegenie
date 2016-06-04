'use strict';

(function() {
	// Itemroles Controller Spec
	describe('Itemroles Controller Tests', function() {
		// Initialize global variables
		var ItemrolesController,
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

			// Initialize the Itemroles controller.
			ItemrolesController = $controller('ItemrolesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Itemrole object fetched from XHR', inject(function(Itemroles) {
			// Create sample Itemrole using the Itemroles service
			var sampleItemroles = new Itemroles({
				
				parentId: 'New Itemrole',
				
				accesstype: 'New Itemrole',
				
				role: 'New Itemrole',
				
			});

			// Create a sample Itemroles array that includes the new Itemrole
			var sampleItemroles = [sampleItemroles];

			// Set GET response
			$httpBackend.expectGET('itemroles').respond(sampleItemroles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.itemroles).toEqualData(sampleItemroles);
		}));

		it('$scope.findOne() should create an array with one Itemrole object fetched from XHR using a itemrolesId URL parameter', inject(function(Itemroles) {
			// Define a sample Itemrole object
			var sampleItemroles = new Itemroles({
				
				parentId: 'New Itemrole',
				
				accesstype: 'New Itemrole',
				
				role: 'New Itemrole',
				
			});

			// Set the URL parameter
			$stateParams.itemrolesId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/itemroles\/([0-9a-fA-F]{24})$/).respond(sampleItemroles);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.itemroles).toEqualData(sampleItemroles);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Itemroles) {
			// Create a sample Itemrole object
			var sampleItemrolesPostData = new Itemroles({
				
				parentId: 'New Itemrole',
				
				accesstype: 'New Itemrole',
				
				role: 'New Itemrole',
				
			});

			// Create a sample Itemrole response
			var sampleItemrolesResponse = new Itemroles({
				_id: '525cf20451979dea2c000001',
				
				parentId: 'New Itemrole',
				
				accesstype: 'New Itemrole',
				
				role: 'New Itemrole',
				
			});

			// Fixture mock form input values
			
			scope.parentId = 'New Itemrole';
			
			scope.accesstype = 'New Itemrole';
			
			scope.role = 'New Itemrole';
			

			// Set POST response
			$httpBackend.expectPOST('itemroles', sampleItemrolesPostData).respond(sampleItemrolesResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			
			expect(scope.parentId).toEqual('');
			
			expect(scope.accesstype).toEqual('');
			
			expect(scope.role).toEqual('');
			


			// Test URL redirection after the Itemrole was created
			expect($location.path()).toBe('/itemroles/' + sampleItemrolesResponse._id);
		}));

		it('$scope.update() should update a valid Itemrole', inject(function(Itemroles) {
			// Define a sample Itemrole put data
			var sampleItemrolesPutData = new Itemroles({
				_id: '525cf20451979dea2c000001',
				
				parentId: 'New Itemrole',
				
				accesstype: 'New Itemrole',
				
				role: 'New Itemrole',
				
			});

			// Mock Itemrole in scope
			scope.itemroles = sampleItemrolesPutData;

			// Set PUT response
			$httpBackend.expectPUT(/itemroles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/itemroles/' + sampleItemrolesPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid itemrolesId and remove the Itemrole from the scope', inject(function(Itemroles) {
			// Create new Itemrole object
			var sampleItemroles = new Itemroles({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Itemroles array and include the Itemrole
			scope.itemroles = [sampleItemroles];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/itemroles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleItemroles);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.itemroles.length).toBe(0);
		}));
	});
}());