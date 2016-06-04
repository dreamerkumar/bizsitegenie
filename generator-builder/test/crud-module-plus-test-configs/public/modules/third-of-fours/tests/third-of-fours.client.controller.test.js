'use strict';

(function() {
	// Third of fours Controller Spec
	describe('Third of fours Controller Tests', function() {
		// Initialize global variables
		var ThirdOfFoursController,
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

			// Initialize the Third of fours controller.
			ThirdOfFoursController = $controller('ThirdOfFoursController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Third of four object fetched from XHR', inject(function(ThirdOfFours) {
			// Create sample Third of four using the Third of fours service
			var sampleThirdOfFour = new ThirdOfFours({
				
				name: 'New Third of four',
				
			});

			// Create a sample Third of fours array that includes the new Third of four
			var sampleThirdOfFours = [sampleThirdOfFour];

			// Set GET response
			$httpBackend.expectGET('third-of-fours').respond(sampleThirdOfFours);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.thirdOfFours).toEqualData(sampleThirdOfFours);
		}));

		it('$scope.findOne() should create an array with one Third of four object fetched from XHR using a thirdOfFourId URL parameter', inject(function(ThirdOfFours) {
			// Define a sample Third of four object
			var sampleThirdOfFour = new ThirdOfFours({
				
				name: 'New Third of four',
				
			});

			// Set the URL parameter
			$stateParams.thirdOfFourId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/third-of-fours\/([0-9a-fA-F]{24})$/).respond(sampleThirdOfFour);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.thirdOfFour).toEqualData(sampleThirdOfFour);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ThirdOfFours) {
			// Create a sample Third of four object
			var sampleThirdOfFourPostData = new ThirdOfFours({
				
				name: 'New Third of four',
				
			});

			// Create a sample Third of four response
			var sampleThirdOfFourResponse = new ThirdOfFours({
				_id: '525cf20451979dea2c000001',
				
				name: 'New Third of four',
				
			});

			// Fixture mock form input values
			
			scope.name = 'New Third of four';
			

			// Set POST response
			$httpBackend.expectPOST('third-of-fours', sampleThirdOfFourPostData).respond(sampleThirdOfFourResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			
			expect(scope.name).toEqual('');
			


			// Test URL redirection after the Third of four was created
			expect($location.path()).toBe('/third-of-fours/' + sampleThirdOfFourResponse._id);
		}));

		it('$scope.update() should update a valid Third of four', inject(function(ThirdOfFours) {
			// Define a sample Third of four put data
			var sampleThirdOfFourPutData = new ThirdOfFours({
				_id: '525cf20451979dea2c000001',
				
				name: 'New Third of four',
				
			});

			// Mock Third of four in scope
			scope.thirdOfFour = sampleThirdOfFourPutData;

			// Set PUT response
			$httpBackend.expectPUT(/third-of-fours\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/third-of-fours/' + sampleThirdOfFourPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid thirdOfFourId and remove the Third of four from the scope', inject(function(ThirdOfFours) {
			// Create new Third of four object
			var sampleThirdOfFour = new ThirdOfFours({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Third of fours array and include the Third of four
			scope.thirdOfFours = [sampleThirdOfFour];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/third-of-fours\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleThirdOfFour);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.thirdOfFours.length).toBe(0);
		}));
	});
}());