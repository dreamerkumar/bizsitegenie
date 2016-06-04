'use strict';

(function() {
	// Fourth of fours Controller Spec
	describe('Fourth of fours Controller Tests', function() {
		// Initialize global variables
		var FourthOfFoursController,
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

			// Initialize the Fourth of fours controller.
			FourthOfFoursController = $controller('FourthOfFoursController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Fourth of four object fetched from XHR', inject(function(FourthOfFours) {
			// Create sample Fourth of four using the Fourth of fours service
			var sampleFourthOfFour = new FourthOfFours({
				
				name: 'New Fourth of four',
				
			});

			// Create a sample Fourth of fours array that includes the new Fourth of four
			var sampleFourthOfFours = [sampleFourthOfFour];

			// Set GET response
			$httpBackend.expectGET('fourth-of-fours').respond(sampleFourthOfFours);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fourthOfFours).toEqualData(sampleFourthOfFours);
		}));

		it('$scope.findOne() should create an array with one Fourth of four object fetched from XHR using a fourthOfFourId URL parameter', inject(function(FourthOfFours) {
			// Define a sample Fourth of four object
			var sampleFourthOfFour = new FourthOfFours({
				
				name: 'New Fourth of four',
				
			});

			// Set the URL parameter
			$stateParams.fourthOfFourId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/fourth-of-fours\/([0-9a-fA-F]{24})$/).respond(sampleFourthOfFour);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fourthOfFour).toEqualData(sampleFourthOfFour);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(FourthOfFours) {
			// Create a sample Fourth of four object
			var sampleFourthOfFourPostData = new FourthOfFours({
				
				name: 'New Fourth of four',
				
			});

			// Create a sample Fourth of four response
			var sampleFourthOfFourResponse = new FourthOfFours({
				_id: '525cf20451979dea2c000001',
				
				name: 'New Fourth of four',
				
			});

			// Fixture mock form input values
			
			scope.name = 'New Fourth of four';
			

			// Set POST response
			$httpBackend.expectPOST('fourth-of-fours', sampleFourthOfFourPostData).respond(sampleFourthOfFourResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			
			expect(scope.name).toEqual('');
			


			// Test URL redirection after the Fourth of four was created
			expect($location.path()).toBe('/fourth-of-fours/' + sampleFourthOfFourResponse._id);
		}));

		it('$scope.update() should update a valid Fourth of four', inject(function(FourthOfFours) {
			// Define a sample Fourth of four put data
			var sampleFourthOfFourPutData = new FourthOfFours({
				_id: '525cf20451979dea2c000001',
				
				name: 'New Fourth of four',
				
			});

			// Mock Fourth of four in scope
			scope.fourthOfFour = sampleFourthOfFourPutData;

			// Set PUT response
			$httpBackend.expectPUT(/fourth-of-fours\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/fourth-of-fours/' + sampleFourthOfFourPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid fourthOfFourId and remove the Fourth of four from the scope', inject(function(FourthOfFours) {
			// Create new Fourth of four object
			var sampleFourthOfFour = new FourthOfFours({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Fourth of fours array and include the Fourth of four
			scope.fourthOfFours = [sampleFourthOfFour];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/fourth-of-fours\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFourthOfFour);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.fourthOfFours.length).toBe(0);
		}));
	});
}());