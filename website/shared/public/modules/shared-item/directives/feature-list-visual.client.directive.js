angular.module('shared-item').directive('itemListVisual', function(){

	return {
		restrict: 'E',
		scope: {
			allowAdd: '@',			
			itemIdToGrayOut: '@',
			startAtNodeId: '@',
			itemSelectionHandler: '&'
		},

		controller: function($scope, $uibModal, $window, $stateParams){
			$scope.appId = $stateParams.appId;
			$scope.tree = null;
			$scope.diagnol = null;
			$scope.root = null;
			$scope.svg = null;
			$scope.duration = 300;
			$scope.idCounter = 0;
			$scope.widthWithMargin = 4000;
			$scope.heightWithMargin = 800;

			$scope.initializeGraph = function(attachTo) {

				$scope.margin = {top: 20, right: 120, bottom: 20, left: 150};
				$scope.width = $scope.widthWithMargin - $scope.margin.right - $scope.margin.left;
				$scope.height = $scope.heightWithMargin - $scope.margin.top - $scope.margin.bottom;

				$scope.tree = d3.layout.tree()
					.size([$scope.height, $scope.width]);

				$scope.diagnol = d3.svg.diagonal()
					.projection(function(d) { return [d.y, d.x]; });

				$scope.svg = d3.select(attachTo).append("svg")
					.attr("width", $scope.width + $scope.margin.right + $scope.margin.left)
					.attr("height", $scope.height + $scope.margin.top + $scope.margin.bottom)
					.append("g")
						.attr("transform", "translate(" + $scope.margin.left + "," + $scope.margin.top + ")");

				d3.select(self.frameElement).style("height", "800px");
			};

			$scope.getChildrenCount = function(d){
				if(d.children){
					return d.children.length;
				}
				if(d._children){
					return d._children.length;
				}
				return 0;
			};

			$scope.onClickOfNodeText = function(d){
				if(d.forAddingANewItem){
					$scope.getNameAndAddNewItem(d);
				} else if(d._id) {
					$scope.itemSelectionHandler({item:d});
				}			
			};

			$scope.createAddNewNodes = function(node, parentId, parentCrudId){
				node.children = node.children || [];
				node.children.forEach(function(childNode){
					$scope.createAddNewNodes(childNode, childNode.parentId, childNode._id);
				});
				node.children.push($scope.constructAddNewNode(parentId, parentCrudId));

			};

			$scope.constructAddNewNode = function(parentId, parentCrudId){
				return {
					name: 'Add New',
					forAddingANewItem: true,
					parentId: parentId,
					parentCrudId: parentCrudId
				};
			};

			$scope.collapse = function(d) {
				if (d.children) {
					d._children = d.children;
					d._children.forEach($scope.collapse);
					d.children = null;
				}
			};

			// Toggle children on click.
			$scope.onClickOfNode = function (d) {
				if(d.forAddingANewItem){
					$scope.getNameAndAddNewItem(d);
				} else {
					if (d.children) {
						d._children = d.children;
						d.children = null;
					} else {
						d.children = d._children;
						d._children = null;
					}
					$scope.update(d);
				}
			};

			$scope.updateGraphWithData = function(data){
				if($scope.allowAdd) {
					$scope.createAddNewNodes(data, $scope.appId, data._id || '0');
				}

				$scope.root = data;
				$scope.root.x0 = $scope.height / 2;
				$scope.root.y0 = 0;

				$scope.root.children.forEach($scope.collapse);
				$scope.update($scope.root);
			};

			$scope.update =	function(source) {

				// Compute the new $scope.tree layout.
				var nodes = $scope.tree.nodes($scope.root).reverse(),
					links = $scope.tree.links(nodes);

				// Normalize for fixed-depth.
				nodes.forEach(function(d) { d.y = d.depth * 180; });

				// Update the nodes…
				var node = $scope.svg.selectAll("g.node")
					.data(nodes, function(d) { return d.id || (d.id = ++$scope.idCounter); });

				// Enter any new nodes at the parent's previous position.
				var nodeEnter = node.enter().append("g")
					.attr("class", function(d){
						var nodeClasses = ["node"];
						if(!d.forAddingANewItem){
							nodeClasses.push("existing-node");
						} else {
							nodeClasses.push("add-new-node");
						}
						if(d._id && (!d.properties || !d.properties.length)){
							nodeClasses.push('zero-properties');
						}
						if($scope.itemIdToGrayOut){
							if($scope.itemIdToGrayOut === d._id){
								nodeClasses.push('gray-out');
							}
						}
						return nodeClasses.join(" ");
					})
					.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
					;

				nodeEnter.append("circle")
					.attr("r", 1e-6)
					.style("fill", function(d) { return $scope.getChildrenCount(d)? "lightsteelblue" : "#fff"; })
					.on("click", $scope.onClickOfNode);

				nodeEnter.append("text")
					.attr("x", function(d) { return $scope.getChildrenCount(d) ? -20 : 20; })
					.attr("dy", ".35em")
					.attr("text-anchor", function(d) { return $scope.getChildrenCount(d)? "end" : "start"; })
					.text(function(d) { 
						var childrenCount = $scope.getChildrenCount(d);
						var name = d.name;
						if(name && name.length > 14){
							name = name.substring(0, 12) + '..';
						}
						return name; 
					})
					.style("fill-opacity", 1e-6)
					.on("click", function(d){
						if(d._id || d.forAddingANewItem){
							$scope.onClickOfNodeText(d);
						} else {
							$scope.onClickOfNode(d);
						}
					});

				// Transition nodes to their new position.
				var nodeUpdate = node.transition()
					.duration($scope.duration)
					.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

				nodeUpdate.select("circle")
					.attr("r", 3)
					.style("fill", function(d) { return $scope.getChildrenCount(d) ? "lightsteelblue" : "#fff"; });

				nodeUpdate.select("text")
					.style("fill-opacity", 1);

				// Transition exiting nodes to the parent's new position.
				var nodeExit = node.exit().transition()
					.duration($scope.duration)
					.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
					.remove();

				nodeExit.select("circle")
					.attr("r", 1e-6);

				nodeExit.select("text")
					.style("fill-opacity", 1e-6);

				// Update the links…
				var link = $scope.svg.selectAll("path.link")
					.data(links, function(d) { return d.target.id; });

				// Enter any new links at the parent's previous position.
				link.enter().insert("path", "g")
					.attr("class", "link")
					.attr("d", function(d) {
						var o = {x: source.x0, y: source.y0};
						return $scope.diagnol({source: o, target: o});
					});

				// Transition links to their new position.
				link.transition()
					.duration($scope.duration)
					.attr("d", $scope.diagnol);

				// Transition exiting nodes to the parent's new position.
				link.exit().transition()
					.duration($scope.duration)
					.attr("d", function(d) {
						var o = {x: source.x, y: source.y};
						return $scope.diagnol({source: o, target: o});
					})
					.remove();

				// Stash the old positions for transition.
				nodes.forEach(function(d) {
					d.x0 = d.x;
					d.y0 = d.y;
				});
			};

			$scope.getNameAndAddNewItem = function(item){
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'builder/public/modules/items/views/wrapper-get-name-create-item-modal.client.view.html',
					controller: function($scope, $uibModalInstance){
						$scope.$uibModalInstance = $uibModalInstance;
						$scope.parentCrudId = item.parentCrudId;
						$scope.parentId = item.parentId;
					},
					size: 'sm'
			    });

			    modalInstance.result.then(function (newItem) {
			    	if(newItem && item && item.parent && item.parent.children){
			    		newItem._children = [];
			    		newItem._children.push($scope.constructAddNewNode(newItem.parentId, newItem._id));

			    		item.parent.children.push(newItem);
			    		$scope.update(item);
			    	}
				}, function () {
					console.log('No new item added');
				});
			};

			$scope.getMatchingNode = function(list){
				if(!list || !list.length) return null;
				for(var ctr = 0; ctr < list.length; ctr++){
					var item = list[ctr]
					if(item._id === $scope.startAtNodeId){
						return item;
					}
					var matchingChildNode = $scope.getMatchingNode(item.children);
					if(matchingChildNode){
						return matchingChildNode;
					}
				}
				return null;
			};
		},

		link: function(scope, element, attributes){

			scope.initializeGraph(element[0]);

			d3.json("get-all-items-and-props", function(error, data) {
				if (error) throw error;

				var itemJson;
				if(scope.startAtNodeId){
					itemJson = scope.getMatchingNode(data);
				} else {
					itemJson = {name: 'Items', children: data};
				}

				scope.updateGraphWithData(itemJson);
			});
		}

	};
});