'use strict';

(function() {
	// Second of fours Controller Spec
	describe('Second of fours Controller Tests', function() {
		// Initialize global variables
		var SecondOfFoursController,
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

			// Initialize the Second of fours controller.
			SecondOfFoursController = $controller('SecondOfFoursController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Second of four object fetched from XHR', inject(function(SecondOfFours) {
			// Create sample Second of four using the Second of fours service
			var sampleSecondOfFour = new SecondOfFours({
				
				name: 'New Second of four',
				
			});

			// Create a sample Second of fours array that includes the new Second of four
			var sampleSecondOfFours = [sampleSecondOfFour];

			// Set GET response
			$httpBackend.expectGET('second-of-fours').respond(sampleSecondOfFours);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.secondOfFours).toEqualData(sampleSecondOfFours);
		}));

		it('$scope.findOne() should create an array with one Second of four object fetched from XHR using a secondOfFourId URL parameter', inject(function(SecondOfFours) {
			// Define a sample Second of four object
			var sampleSecondOfFour = new SecondOfFours({
				
				name: 'New Second of four',
				
			});

			// Set the URL parameter
			$stateParams.secondOfFourId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/second-of-fours\/([0-9a-fA-F]{24})$/).respond(sampleSecondOfFour);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.secondOfFour).toEqualData(sampleSecondOfFour);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(SecondOfFours) {
			// Create a sample Second of four object
			var sampleSecondOfFourPostData = new SecondOfFours({
				
				name: 'New Second of four',
				
			});

			// Create a sample Second of four response
			var sampleSecondOfFourResponse = new SecondOfFours({
				_id: '525cf20451979dea2c000001',
				
				name: 'New Second of four',
				
			});

			// Fixture mock form input values
			
			scope.name = 'New Second of four';
			

			// Set POST response
			$httpBackend.expectPOST('second-of-fours', sampleSecondOfFourPostData).respond(sampleSecondOfFourResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			
			expect(scope.name).toEqual('');
			


			// Test URL redirection after the Second of four was created
			expect($location.path()).toBe('/second-of-fours/' + sampleSecondOfFourResponse._id);
		}));

		it('$scope.update() should update a valid Second of four', inject(function(SecondOfFours) {
			// Define a sample Second of four put data
			var sampleSecondOfFourPutData = new SecondOfFours({
				_id: '525cf20451979dea2c000001',
				
				name: 'New Second of four',
				
			});

			// Mock Second of four in scope
			scope.secondOfFour = sampleSecondOfFourPutData;

			// Set PUT response
			$httpBackend.expectPUT(/second-of-fours\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/second-of-fours/' + sampleSecondOfFourPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid secondOfFourId and remove the Second of four from the scope', inject(function(SecondOfFours) {
			// Create new Second of four object
			var sampleSecondOfFour = new SecondOfFours({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Second of fours array and include the Second of four
			scope.secondOfFours = [sampleSecondOfFour];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/second-of-fours\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSecondOfFour);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.secondOfFours.length).toBe(0);
		}));
	});
}());