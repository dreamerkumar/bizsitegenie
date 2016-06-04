'use strict';

// <%= humanizedPluralName %> controller
angular.module('<%= slugifiedPluralName %>').controller('<%= classifiedPluralName %>Controller', ['$scope', '$stateParams', '$location', 'Authentication', 'Authorization', '<%= classifiedPluralName %>',
	function($scope, $stateParams, $location, Authentication, Authorization, <%= classifiedPluralName %>) {
		$scope.authentication = Authentication;
		<%=isChildCrud? "$scope.parentId = $stateParams." + parent.camelizedSingularName + "Id;" : ""%>
		$scope.parentRouteUrl = <%-parentRouteUrl%>;

		
		var accessTypes = ['read', 'create', 'edit', 'delete'];
		accessTypes.forEach(function(accessType){
			Authorization.checkAccess('<%=origArgs.featureId%>', accessType)
			.then(function(result){
				$scope[accessType + 'AccessType'] = result;
				if(accessType === 'create'){
					$scope.createAuthorized = result === 'hasAccess';
					$scope.createUnauthorized = !$scope.createAuthorized;
				} else if(accessType === 'read'){
					if(result === 'hasAccess' || result === 'hasAccessIfUserCreatedIt') {
						$scope.listViewAuthorized = true;
						$scope.listViewUnauthorized = false;
					} else {
						$scope.listViewAuthorized = false;
						$scope.listViewUnauthorized = true;
					}
				}
			})
			.catch(function(err){
				$scope[accessType + 'AccessType'] = null;
				if(accessType === 'create'){
					$scope.createAuthorized = false;
					$scope.createUnauthorized = !$scope.createAuthorized;
				} else if(accessType === 'read'){
					$scope.listViewAuthorized = false;
					$scope.listViewUnauthorized = true;
				}
			});
		});


		$scope.onSuccessfulUploadInCreateMode = function(propertyName, fileName, fileKey) {
			$scope[propertyName] = fileName;
			$scope[propertyName + "_fileKey"] = fileKey;
		};

		$scope.onSuccessfulUploadInEditMode = function(propertyName, fileName, fileKey) {
			$scope.<%= camelizedSingularName %>[propertyName] = fileName;
			$scope.<%= camelizedSingularName %>[propertyName + "_fileKey"] = fileKey;
		};

		// Create new <%= humanizedSingularName %>
		$scope.create = function() {
			// Create new <%= humanizedSingularName %> object
			var <%= camelizedSingularName %> = new <%= classifiedPluralName %> ({
					<%=isChildCrud? "parentId: $scope.parentId," : ""%>
				<% properties.forEach(function(prop){ %>
					<%=prop.camelizedSingularName%>: this.<%=prop.camelizedSingularName%><% 
					if(prop.formFieldType === "foreignkeyref"){%>? this.<%=prop.camelizedSingularName%>._id : null<%}%>,<%
					if(prop.formFieldType === "file" || prop.formFieldType === "image"){ 
					%><%=prop.camelizedSingularName%>_fileKey: this.<%=prop.camelizedSingularName%>_fileKey,<% } %>	
				<% }); %>
			});

			// Redirect after save
			<%= camelizedSingularName %>.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/<%= slugifiedPluralName %>/' + response._id);

				// Clear form fields
				<% properties.forEach(function(prop){ %>
				$scope.<%=prop.camelizedSingularName%> = '';
				<% }); %>
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing <%= humanizedSingularName %>
		$scope.remove = function(<%= camelizedSingularName %>) {
			if ( <%= camelizedSingularName %> ) { 
				<%= camelizedSingularName %>.$remove();

				for (var i in $scope.<%= camelizedPluralName %>) {
					if ($scope.<%= camelizedPluralName %> [i] === <%= camelizedSingularName %>) {
						$scope.<%= camelizedPluralName %>.splice(i, 1);
					}
				}
			} else {
				$scope.<%= camelizedSingularName %>.$remove(function() {
					$location.path($scope.parentRouteUrl + '/<%= slugifiedPluralName %>');
				});
			}
		};

		// Update existing <%= humanizedSingularName %>
		$scope.update = function() {
			var <%= camelizedSingularName %> = $scope.<%= camelizedSingularName %>;

			<%= camelizedSingularName %>.$update(function() {
				$location.path($scope.parentRouteUrl + '/<%= slugifiedPluralName %>/' + <%= camelizedSingularName %>._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of <%= humanizedPluralName %>
		$scope.find = function() {
			$scope.<%= camelizedPluralName %> = <%= classifiedPluralName %>.<%if(isChildCrud){%>queryForParentId({parentId: $scope.parentId})<%}else{%>query()<%}%>;
		};

		// Find existing <%= humanizedSingularName %> for view
		$scope.findOneForRead = function() {
			Authorization.checkAccess('<%=origArgs.featureId%>', 'read')
				.then(function(result){
					$scope.readAccessType = result;
					if($scope.readAccessType !== 'hasAccess' && $scope.readAccessType !== 'hasAccessIfUserCreatedIt'){
						$scope.setUnauthorized();
						return;
					}

					<%= classifiedPluralName %>.get({ 
						<%= camelizedSingularName %>Id: $stateParams.<%= camelizedSingularName %>Id
					}).$promise.then(function(result){
						$scope.<%= camelizedSingularName %> = result;
						if(!result){
							return;
						}
						$scope.setAuthorized();
					}).catch(function(err){
						if(err.status && err.status === 403){
							$scope.setUnauthorized();
						}
						console.error('Error occurred on getting <%= camelizedSingularName %>', err)
					});
				})
				.catch(function(err){
					$scope.setUnauthorized();					
				});
		};

		// Find existing <%= humanizedSingularName %> to edit
		$scope.findOneForEdit = function() {
			Authorization.checkAccess('<%=origArgs.featureId%>', 'edit')
				.then(function(result){
					$scope.editAccessType = result;
					if($scope.editAccessType !== 'hasAccess' && $scope.editAccessType !== 'hasAccessIfUserCreatedIt'){
						$scope.setUnauthorized();
						return;
					}

					<%= classifiedPluralName %>.get({ 
						<%= camelizedSingularName %>Id: $stateParams.<%= camelizedSingularName %>Id
					}).$promise.then(function(result){
						$scope.<%= camelizedSingularName %> = result;
						if(!result){
							return;
						}
						if($scope.editAccessType === 'hasAccess' || ($scope.editAccessType === 'hasAccessIfUserCreatedIt' && Authentication.user._id === result.user._id)) {
							$scope.setAuthorized();
						} else {
							$scope.setUnauthorized();
						}

					}).catch(function(err){
						if(err.status && err.status === 403){
							$scope.setUnauthorized();
						}
						console.error('Error occurred on getting <%= camelizedSingularName %>', err)
					});
				})
				.catch(function(err){
					$scope.setUnauthorized();					
				});
		};

		$scope.setAuthorized = function(){
			$scope.authorized = true;
			$scope.unauthorized = false;
		};

		$scope.setUnauthorized = function(){
			$scope.authorized = false;
			$scope.unauthorized = true;
		};

		$scope.handleToGrid = {};
		$scope.gridColumns = [<% var count = 0; properties.forEach(function(prop){ %><%=(count === 0? '': ',')%>{
				field: '<%=prop.camelizedSingularName%>',
				displayName: '<%=prop.humanizedSingularName%>'
			}<% count++;}); %>
		];
	}
]);