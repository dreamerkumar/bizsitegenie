'use strict';

(function() {
	// First of fours Controller Spec
	describe('First of fours Controller Tests', function() {
		// Initialize global variables
		var FirstOfFoursController,
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

			// Initialize the First of fours controller.
			FirstOfFoursController = $controller('FirstOfFoursController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one First of four object fetched from XHR', inject(function(FirstOfFours) {
			// Create sample First of four using the First of fours service
			var sampleFirstOfFour = new FirstOfFours({
				
				name: 'New First of four',
				
			});

			// Create a sample First of fours array that includes the new First of four
			var sampleFirstOfFours = [sampleFirstOfFour];

			// Set GET response
			$httpBackend.expectGET('first-of-fours').respond(sampleFirstOfFours);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.firstOfFours).toEqualData(sampleFirstOfFours);
		}));

		it('$scope.findOne() should create an array with one First of four object fetched from XHR using a firstOfFourId URL parameter', inject(function(FirstOfFours) {
			// Define a sample First of four object
			var sampleFirstOfFour = new FirstOfFours({
				
				name: 'New First of four',
				
			});

			// Set the URL parameter
			$stateParams.firstOfFourId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/first-of-fours\/([0-9a-fA-F]{24})$/).respond(sampleFirstOfFour);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.firstOfFour).toEqualData(sampleFirstOfFour);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(FirstOfFours) {
			// Create a sample First of four object
			var sampleFirstOfFourPostData = new FirstOfFours({
				
				name: 'New First of four',
				
			});

			// Create a sample First of four response
			var sampleFirstOfFourResponse = new FirstOfFours({
				_id: '525cf20451979dea2c000001',
				
				name: 'New First of four',
				
			});

			// Fixture mock form input values
			
			scope.name = 'New First of four';
			

			// Set POST response
			$httpBackend.expectPOST('first-of-fours', sampleFirstOfFourPostData).respond(sampleFirstOfFourResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			
			expect(scope.name).toEqual('');
			


			// Test URL redirection after the First of four was created
			expect($location.path()).toBe('/first-of-fours/' + sampleFirstOfFourResponse._id);
		}));

		it('$scope.update() should update a valid First of four', inject(function(FirstOfFours) {
			// Define a sample First of four put data
			var sampleFirstOfFourPutData = new FirstOfFours({
				_id: '525cf20451979dea2c000001',
				
				name: 'New First of four',
				
			});

			// Mock First of four in scope
			scope.firstOfFour = sampleFirstOfFourPutData;

			// Set PUT response
			$httpBackend.expectPUT(/first-of-fours\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/first-of-fours/' + sampleFirstOfFourPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid firstOfFourId and remove the First of four from the scope', inject(function(FirstOfFours) {
			// Create new First of four object
			var sampleFirstOfFour = new FirstOfFours({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new First of fours array and include the First of four
			scope.firstOfFours = [sampleFirstOfFour];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/first-of-fours\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFirstOfFour);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.firstOfFours.length).toBe(0);
		}));
	});
}());