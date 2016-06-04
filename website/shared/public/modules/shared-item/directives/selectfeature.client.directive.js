'use strict';

angular.module('shared-item').directive('selectItem', function() {
    return {
        restrict: 'E',

        templateUrl: 'shared/public/modules/shared-item/views/selectitem.client.view.html',

        controller: ['$scope', 'Items', '$timeout', '$q', function ($scope, Items, $timeout, $q) {

            $scope.originalItemList = null;
            $scope.highlightSelectedItemClass = '';
            $scope.visualView = true;

            $scope.selected = {
                item: null,
            };

            $scope.getItemListAtAllLevels = function(){
                Items.getAllItemsAndProps(function(results){
                    var unsortedList = $scope.buildFlatList(results);
                    $scope.itemListToDisplay = unsortedList? unsortedList.sort(function(a, b){ return a.level - b.level;}) : unsortedList;

                }, function(error){
                    console.error('Following error occured while getting the item list: ', error);
                });
            };

            $scope.buildFlatList = function(heirarchicalList, list, level, parentPath){
                if(!list){
                    list = [];
                }
                if(!level){
                    level = 1;
                }
                if(heirarchicalList){
                    heirarchicalList.forEach(function(item){
                        item.level = level;
                        item.parentPath = parentPath;
                        list.push(item);
                    });
                    level++;
                    heirarchicalList.forEach(function(item){
                        var subNodeParent = item.parentPath? (item.parentPath + '/' + item.name) : item.name;
                        $scope.buildFlatList(item.children, list, level, subNodeParent);
                    });
                }
                return list;
            };

            $scope.setSelectedItemFromList = function(item){
                $scope.setSelectedItem(item, true);
            };

            $scope.setSelectedItem = function(item, listViewSelection){
                if(!item.properties || item.properties.length <= 0){
                    console.log('Cannot select "' + item.name + '" as a reference as it does not have any properties.');
                    return;
                }
                if(item._id === $scope.selectForItemId){
                    console.log('Cannot select the same item as a reference');
                    return;
                }
                if(!listViewSelection && !item.parentPath){
                    item.parentPath = $scope.getParentPathStringForTreeViewSelection(item);
                }
                $scope.selected.item = item;
                $scope.returnSelectedItem(item);

                // $scope.highlightSelectedItemClass = '';
                // $scope.highlightSelectedItemClass = 'swing';
                // if(!listViewSelection){
                //     $scope.$digest();
                // }
                //$timeout(function(){ $scope.highlightSelectedItemClass = '';}, 500)
            };

            $scope.getParentPathStringForTreeViewSelection = function(item){
                var parentPathArray = [];
                $scope.buildParentPath(item, parentPathArray);
                parentPathArray = parentPathArray.reverse();
                if(parentPathArray.length > 0){
                    parentPathArray = parentPathArray.slice(1); //first one is the 'Items text in the tree view'
                }
                return parentPathArray.join('/');
            };

            $scope.buildParentPath = function(item, pathArray){
                if(item.parent){
                    pathArray.push(item.parent.name);
                    $scope.buildParentPath(item.parent, pathArray);
                }
            };

            $scope.ok = function () {

                var selectedItem = $scope.selected.item;
                if(!selectedItem){
                  alert('Please select a item');
                  return;
                }

                $scope.returnSelectedItem(selectedItem);
            };

            $scope.returnSelectedItem = function(item) {
                var parentPath = item.parentPath;

                parentPath = parentPath? (parentPath + '/' + item.name) :  item.name;

                var result = {
                    description: parentPath,
                    item: item
                };
                $scope.$uibModalInstance.close(result);
            };

            $scope.cancel = function () {
                $scope.$uibModalInstance.dismiss('cancel');
            };
        }],

        link: function(scope, element, attrs) {


        }
    };
});