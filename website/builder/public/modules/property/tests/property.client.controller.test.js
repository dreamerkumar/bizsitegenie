'use strict';

(function() {
	// Properties Controller Spec
	describe('Properties Controller Tests', function() {
		// Initialize global variables
		var PropertyController,
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

			// Initialize the Properties controller.
			PropertyController = $controller('PropertyController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Property object fetched from XHR', inject(function(Property) {
			// Create sample Property using the Properties service
			var sampleProperty = new Property({
				
				referenceDisplayFormat: 'New Property',
				
				col: 'New Property',
				
				selectorControlType: 'New Property',
				
				parentId: 'New Property',
				
				row: 'New Property',
				
				option: 'New Property',
				
				refDescription: 'New Property',
				
				referencedPropertyName: 'New Property',
				
				selectorControlAttribute: 'New Property',
				
				type: 'New Property',
				
				name: 'New Property',
				
				value: 'New Property',
				
				referencedFeatureId: 'New Property',
				
				referencedFeatureName: 'New Property',
				
				propertyNamesForDisplay: 'New Property',
				
				referenceDescription: 'New Property',
				
			});

			// Create a sample Properties array that includes the new Property
			var sampleProperty = [sampleProperty];

			// Set GET response
			$httpBackend.expectGET('property').respond(sampleProperty);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.property).toEqualData(sampleProperty);
		}));

		it('$scope.findOne() should create an array with one Property object fetched from XHR using a propertyId URL parameter', inject(function(Property) {
			// Define a sample Property object
			var sampleProperty = new Property({
				
				referenceDisplayFormat: 'New Property',
				
				col: 'New Property',
				
				selectorControlType: 'New Property',
				
				parentId: 'New Property',
				
				row: 'New Property',
				
				option: 'New Property',
				
				refDescription: 'New Property',
				
				referencedPropertyName: 'New Property',
				
				selectorControlAttribute: 'New Property',
				
				type: 'New Property',
				
				name: 'New Property',
				
				value: 'New Property',
				
				referencedFeatureId: 'New Property',
				
				referencedFeatureName: 'New Property',
				
				propertyNamesForDisplay: 'New Property',
				
				referenceDescription: 'New Property',
				
			});

			// Set the URL parameter
			$stateParams.propertyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/property\/([0-9a-fA-F]{24})$/).respond(sampleProperty);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.property).toEqualData(sampleProperty);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Property) {
			// Create a sample Property object
			var samplePropertyPostData = new Property({
				
				referenceDisplayFormat: 'New Property',
				
				col: 'New Property',
				
				selectorControlType: 'New Property',
				
				parentId: 'New Property',
				
				row: 'New Property',
				
				option: 'New Property',
				
				refDescription: 'New Property',
				
				referencedPropertyName: 'New Property',
				
				selectorControlAttribute: 'New Property',
				
				type: 'New Property',
				
				name: 'New Property',
				
				value: 'New Property',
				
				referencedFeatureId: 'New Property',
				
				referencedFeatureName: 'New Property',
				
				propertyNamesForDisplay: 'New Property',
				
				referenceDescription: 'New Property',
				
			});

			// Create a sample Property response
			var samplePropertyResponse = new Property({
				_id: '525cf20451979dea2c000001',
				
				referenceDisplayFormat: 'New Property',
				
				col: 'New Property',
				
				selectorControlType: 'New Property',
				
				parentId: 'New Property',
				
				row: 'New Property',
				
				option: 'New Property',
				
				refDescription: 'New Property',
				
				referencedPropertyName: 'New Property',
				
				selectorControlAttribute: 'New Property',
				
				type: 'New Property',
				
				name: 'New Property',
				
				value: 'New Property',
				
				referencedFeatureId: 'New Property',
				
				referencedFeatureName: 'New Property',
				
				propertyNamesForDisplay: 'New Property',
				
				referenceDescription: 'New Property',
				
			});

			// Fixture mock form input values
			
			scope.referenceDisplayFormat = 'New Property';
			
			scope.col = 'New Property';
			
			scope.selectorControlType = 'New Property';
			
			scope.parentId = 'New Property';
			
			scope.row = 'New Property';
			
			scope.option = 'New Property';
			
			scope.refDescription = 'New Property';
			
			scope.referencedPropertyName = 'New Property';
			
			scope.selectorControlAttribute = 'New Property';
			
			scope.type = 'New Property';
			
			scope.name = 'New Property';
			
			scope.value = 'New Property';
			
			scope.referencedFeatureId = 'New Property';
			
			scope.referencedFeatureName = 'New Property';
			
			scope.propertyNamesForDisplay = 'New Property';
			
			scope.referenceDescription = 'New Property';
			

			// Set POST response
			$httpBackend.expectPOST('property', samplePropertyPostData).respond(samplePropertyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			
			expect(scope.referenceDisplayFormat).toEqual('');
			
			expect(scope.col).toEqual('');
			
			expect(scope.selectorControlType).toEqual('');
			
			expect(scope.parentId).toEqual('');
			
			expect(scope.row).toEqual('');
			
			expect(scope.option).toEqual('');
			
			expect(scope.refDescription).toEqual('');
			
			expect(scope.referencedPropertyName).toEqual('');
			
			expect(scope.selectorControlAttribute).toEqual('');
			
			expect(scope.type).toEqual('');
			
			expect(scope.name).toEqual('');
			
			expect(scope.value).toEqual('');
			
			expect(scope.referencedFeatureId).toEqual('');
			
			expect(scope.referencedFeatureName).toEqual('');
			
			expect(scope.propertyNamesForDisplay).toEqual('');
			
			expect(scope.referenceDescription).toEqual('');
			


			// Test URL redirection after the Property was created
			expect($location.path()).toBe('/property/' + samplePropertyResponse._id);
		}));

		it('$scope.update() should update a valid Property', inject(function(Property) {
			// Define a sample Property put data
			var samplePropertyPutData = new Property({
				_id: '525cf20451979dea2c000001',
				
				referenceDisplayFormat: 'New Property',
				
				col: 'New Property',
				
				selectorControlType: 'New Property',
				
				parentId: 'New Property',
				
				row: 'New Property',
				
				option: 'New Property',
				
				refDescription: 'New Property',
				
				referencedPropertyName: 'New Property',
				
				selectorControlAttribute: 'New Property',
				
				type: 'New Property',
				
				name: 'New Property',
				
				value: 'New Property',
				
				referencedFeatureId: 'New Property',
				
				referencedFeatureName: 'New Property',
				
				propertyNamesForDisplay: 'New Property',
				
				referenceDescription: 'New Property',
				
			});

			// Mock Property in scope
			scope.property = samplePropertyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/property\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/property/' + samplePropertyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid propertyId and remove the Property from the scope', inject(function(Property) {
			// Create new Property object
			var sampleProperty = new Property({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Properties array and include the Property
			scope.property = [sampleProperty];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/property\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProperty);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.property.length).toBe(0);
		}));
	});
}());