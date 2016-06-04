'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'webapplication';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  
		'ui.router', 'ui.bootstrap', 'ui.utils', 'as.sortable', 'vk', 'gridster', 'nvd3', 'ui.bootstrap.datetimepicker', 'ngFileUpload', 'ui.grid', 
		'ui.grid.exporter', 'smart-table'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('apps');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('items');

/*
 ng-sortable v1.3.1
 The MIT License (MIT)

 Copyright (c) 2014 Muhammed Ashik

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

/*jshint indent: 2 */
/*global angular: false */

(function () {
  'use strict';
  angular.module('as.sortable', [])
    .constant('sortableConfig', {
      itemClass: 'as-sortable-item',
      handleClass: 'as-sortable-item-handle',
      placeHolderClass: 'as-sortable-placeholder',
      dragClass: 'as-sortable-drag',
      hiddenClass: 'as-sortable-hidden',
      dragging: 'as-sortable-dragging'
    });
}());

/*jshint indent: 2 */
/*global angular: false */

(function () {
  'use strict';

  var mainModule = angular.module('as.sortable');

  /**
   * Helper factory for sortable.
   */
  mainModule.factory('$helper', ['$document', '$window',
    function ($document, $window) {
      return {

        /**
         * Get the height of an element.
         *
         * @param {Object} element Angular element.
         * @returns {String} Height
         */
        height: function (element) {
          return element[0].getBoundingClientRect().height;
        },

        /**
         * Get the width of an element.
         *
         * @param {Object} element Angular element.
         * @returns {String} Width
         */
        width: function (element) {
          return element[0].getBoundingClientRect().width;
        },

        /**
         * Get the offset values of an element.
         *
         * @param {Object} element Angular element.
         * @param {Object} [scrollableContainer] Scrollable container object for calculating relative top & left (optional, defaults to Document)
         * @returns {Object} Object with properties width, height, top and left
         */
        offset: function (element, scrollableContainer) {
          var boundingClientRect = element[0].getBoundingClientRect();
          if (!scrollableContainer) {
            scrollableContainer = $document[0].documentElement;
          }

          return {
            width: boundingClientRect.width || element.prop('offsetWidth'),
            height: boundingClientRect.height || element.prop('offsetHeight'),
            top: boundingClientRect.top + ($window.pageYOffset || scrollableContainer.scrollTop - scrollableContainer.offsetTop),
            left: boundingClientRect.left + ($window.pageXOffset || scrollableContainer.scrollLeft - scrollableContainer.offsetLeft)
          };
        },

        /**
         * get the event object for touch.
         *
         * @param  {Object} event the touch event
         * @return {Object} the touch event object.
         */
        eventObj: function (event) {
          var obj = event;
          if (event.targetTouches !== undefined) {
            obj = event.targetTouches.item(0);
          } else if (event.originalEvent !== undefined && event.originalEvent.targetTouches !== undefined) {
            obj = event.originalEvent.targetTouches.item(0);
          }
          return obj;
        },

        /**
         * Checks whether the touch is valid and multiple.
         *
         * @param event the event object.
         * @returns {boolean} true if touch is multiple.
         */
        isTouchInvalid: function (event) {

          var touchInvalid = false;
          if (event.touches !== undefined && event.touches.length > 1) {
            touchInvalid = true;
          } else if (event.originalEvent !== undefined &&
            event.originalEvent.touches !== undefined && event.originalEvent.touches.length > 1) {
            touchInvalid = true;
          }
          return touchInvalid;
        },

        /**
         * Get the start position of the target element according to the provided event properties.
         *
         * @param {Object} event Event
         * @param {Object} target Target element
         * @param {Object} [scrollableContainer] (optional) Scrollable container object
         * @returns {Object} Object with properties offsetX, offsetY.
         */
        positionStarted: function (event, target, scrollableContainer) {
          var pos = {};
          pos.offsetX = event.pageX - this.offset(target, scrollableContainer).left;
          pos.offsetY = event.pageY - this.offset(target, scrollableContainer).top;
          pos.startX = pos.lastX = event.pageX;
          pos.startY = pos.lastY = event.pageY;
          pos.nowX = pos.nowY = pos.distX = pos.distY = pos.dirAx = 0;
          pos.dirX = pos.dirY = pos.lastDirX = pos.lastDirY = pos.distAxX = pos.distAxY = 0;
          return pos;
        },

        /**
         * Calculates the event position and sets the direction
         * properties.
         *
         * @param pos the current position of the element.
         * @param event the move event.
         */
        calculatePosition: function (pos, event) {
          // mouse position last events
          pos.lastX = pos.nowX;
          pos.lastY = pos.nowY;

          // mouse position this events
          pos.nowX = event.pageX;
          pos.nowY = event.pageY;

          // distance mouse moved between events
          pos.distX = pos.nowX - pos.lastX;
          pos.distY = pos.nowY - pos.lastY;

          // direction mouse was moving
          pos.lastDirX = pos.dirX;
          pos.lastDirY = pos.dirY;

          // direction mouse is now moving (on both axis)
          pos.dirX = pos.distX === 0 ? 0 : pos.distX > 0 ? 1 : -1;
          pos.dirY = pos.distY === 0 ? 0 : pos.distY > 0 ? 1 : -1;

          // axis mouse is now moving on
          var newAx = Math.abs(pos.distX) > Math.abs(pos.distY) ? 1 : 0;

          // calc distance moved on this axis (and direction)
          if (pos.dirAx !== newAx) {
            pos.distAxX = 0;
            pos.distAxY = 0;
          } else {
            pos.distAxX += Math.abs(pos.distX);
            if (pos.dirX !== 0 && pos.dirX !== pos.lastDirX) {
              pos.distAxX = 0;
            }

            pos.distAxY += Math.abs(pos.distY);
            if (pos.dirY !== 0 && pos.dirY !== pos.lastDirY) {
              pos.distAxY = 0;
            }
          }
          pos.dirAx = newAx;
        },

        /**
         * Move the position by applying style.
         *
         * @param event the event object
         * @param element - the dom element
         * @param pos - current position
         * @param container - the bounding container.
         * @param containerPositioning - absolute or relative positioning.
         * @param {Object} [scrollableContainer] (optional) Scrollable container object
         */
        movePosition: function (event, element, pos, container, containerPositioning, scrollableContainer) {
          var bounds;
          var useRelative = (containerPositioning === 'relative');

          element.x = event.pageX - pos.offsetX;
          element.y = event.pageY - pos.offsetY;

          if (container) {
            bounds = this.offset(container, scrollableContainer);

            if (useRelative) {
              // reduce positioning by bounds
              element.x -= bounds.left;
              element.y -= bounds.top;

              // reset bounds
              bounds.left = 0;
              bounds.top = 0;
            }

            if (element.x < bounds.left) {
              element.x = bounds.left;
            } else if (element.x >= bounds.width + bounds.left - this.offset(element).width) {
              element.x = bounds.width + bounds.left - this.offset(element).width;
            }
            if (element.y < bounds.top) {
              element.y = bounds.top;
            } else if (element.y >= bounds.height + bounds.top - this.offset(element).height) {
              element.y = bounds.height + bounds.top - this.offset(element).height;
            }
          }

          element.css({
            'left': element.x + 'px',
            'top': element.y + 'px'
          });

          this.calculatePosition(pos, event);
        },

        /**
         * The drag item info and functions.
         * retains the item info before and after move.
         * holds source item and target scope.
         *
         * @param item - the drag item
         * @returns {{index: *, parent: *, source: *,
                 *          sourceInfo: {index: *, itemScope: (*|.dragItem.sourceInfo.itemScope|$scope.itemScope|itemScope), sortableScope: *},
                 *         moveTo: moveTo, isSameParent: isSameParent, isOrderChanged: isOrderChanged, eventArgs: eventArgs, apply: apply}}
         */
        dragItem: function (item) {

          return {
            index: item.index(),
            parent: item.sortableScope,
            source: item,
            sourceInfo: {
              index: item.index(),
              itemScope: item.itemScope,
              sortableScope: item.sortableScope
            },
            moveTo: function (parent, index) { // Move the item to a new position
              this.parent = parent;
              //If source Item is in the same Parent.
              if (this.isSameParent() && this.source.index() < index) { // and target after
                index = index - 1;
              }
              this.index = index;
            },
            isSameParent: function () {
              return this.parent.element === this.sourceInfo.sortableScope.element;
            },
            isOrderChanged: function () {
              return this.index !== this.sourceInfo.index;
            },
            eventArgs: function () {
              return {
                source: this.sourceInfo,
                dest: {
                  index: this.index,
                  sortableScope: this.parent
                }
              };
            },
            apply: function () {
              // If clone is not set to true, remove the item from the source model.
              if (!this.sourceInfo.sortableScope.options.clone) {
                this.sourceInfo.sortableScope.removeItem(this.sourceInfo.index);
              }

              // If the dragged item is not already there, insert the item. This avoids ng-repeat dupes error
              if(this.parent.options.allowDuplicates || this.parent.modelValue.indexOf(this.source.modelValue) < 0) {
                this.parent.insertItem(this.index, this.source.modelValue);
              }

            }
          };
        },

        /**
         * Check the drag is not allowed for the element.
         *
         * @param element - the element to check
         * @returns {boolean} - true if drag is not allowed.
         */
        noDrag: function (element) {
          return element.attr('no-drag') !== undefined || element.attr('data-no-drag') !== undefined;
        },

        /**
         * Helper function to find the first ancestor with a given selector
         * @param el - angular element to start looking at
         * @param selector - selector to find the parent
         * @returns {Object} - Angular element of the ancestor or body if not found
         * @private
         */
        findAncestor: function (el, selector) {
          el = el[0];
          var matches = Element.matches || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;
          while ((el = el.parentElement) && !matches.call(el, selector)) {
          }
          return el ? angular.element(el) : angular.element(document.body);
        }
      };
    }
  ]);

}());
/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

(function () {

  'use strict';
  var mainModule = angular.module('as.sortable');

  /**
   * Controller for Sortable.
   * @param $scope - the sortable scope.
   */
  mainModule.controller('as.sortable.sortableController', ['$scope', function ($scope) {

    this.scope = $scope;

    $scope.modelValue = null; // sortable list.
    $scope.callbacks = null;
    $scope.type = 'sortable';
    $scope.options = {};
    $scope.isDisabled = false;

    /**
     * Inserts the item in to the sortable list.
     *
     * @param index - the item index.
     * @param itemData - the item model data.
     */
    $scope.insertItem = function (index, itemData) {
      if ($scope.options.allowDuplicates) {
        $scope.modelValue.splice(index, 0, angular.copy(itemData));
      } else {
        $scope.modelValue.splice(index, 0, itemData);
      }
    };

    /**
     * Removes the item from the sortable list.
     *
     * @param index - index to be removed.
     * @returns {*} - removed item.
     */
    $scope.removeItem = function (index) {
      var removedItem = null;
      if (index > -1) {
        removedItem = $scope.modelValue.splice(index, 1)[0];
      }
      return removedItem;
    };

    /**
     * Checks whether the sortable list is empty.
     *
     * @returns {null|*|$scope.modelValue|boolean}
     */
    $scope.isEmpty = function () {
      return ($scope.modelValue && $scope.modelValue.length === 0);
    };

    /**
     * Wrapper for the accept callback delegates to callback.
     *
     * @param sourceItemHandleScope - drag item handle scope.
     * @param destScope - sortable target scope.
     * @param destItemScope - sortable destination item scope.
     * @returns {*|boolean} - true if drop is allowed for the drag item in drop target.
     */
    $scope.accept = function (sourceItemHandleScope, destScope, destItemScope) {
      return $scope.callbacks.accept(sourceItemHandleScope, destScope, destItemScope);
    };

  }]);

  /**
   * Sortable directive - defines callbacks.
   * Parent directive for draggable and sortable items.
   * Sets modelValue, callbacks, element in scope.
   */
  mainModule.directive('asSortable',
    function () {
      return {
        require: 'ngModel', // get a hold of NgModelController
        restrict: 'A',
        scope: true,
        controller: 'as.sortable.sortableController',
        link: function (scope, element, attrs, ngModelController) {

          var ngModel, callbacks;

          ngModel = ngModelController;

          if (!ngModel) {
            return; // do nothing if no ng-model
          }

          // Set the model value in to scope.
          ngModel.$render = function () {
            scope.modelValue = ngModel.$modelValue;
          };
          //set the element in scope to be accessed by its sub scope.
          scope.element = element;
          element.data('_scope',scope); // #144, work with angular debugInfoEnabled(false)

          callbacks = {accept: null, orderChanged: null, itemMoved: null, dragStart: null, dragMove:null, dragCancel: null, dragEnd: null};

          /**
           * Invoked to decide whether to allow drop.
           *
           * @param sourceItemHandleScope - the drag item handle scope.
           * @param destSortableScope - the drop target sortable scope.
           * @param destItemScope - the drop target item scope.
           * @returns {boolean} - true if allowed for drop.
           */
          callbacks.accept = function (sourceItemHandleScope, destSortableScope, destItemScope) {
            return true;
          };

          /**
           * Invoked when order of a drag item is changed.
           *
           * @param event - the event object.
           */
          callbacks.orderChanged = function (event) {
          };

          /**
           * Invoked when the item is moved to other sortable.
           *
           * @param event - the event object.
           */
          callbacks.itemMoved = function (event) {
          };

          /**
           * Invoked when the drag started successfully.
           *
           * @param event - the event object.
           */
          callbacks.dragStart = function (event) {
          };

          /**
           * Invoked when the drag move.
           *
           * @param itemPosition - the item position.
           * @param containment - the containment element.
           * @param eventObj - the event object.
          */
          callbacks.dragMove = angular.noop;

          /**
           * Invoked when the drag cancelled.
           *
           * @param event - the event object.
           */
          callbacks.dragCancel = function (event) {
          };

          /**
           * Invoked when the drag stopped.
           *
           * @param event - the event object.
           */
          callbacks.dragEnd = function (event) {
          };

          //Set the sortOptions callbacks else set it to default.
          scope.$watch(attrs.asSortable, function (newVal, oldVal) {
            angular.forEach(newVal, function (value, key) {
              if (callbacks[key]) {
                if (typeof value === 'function') {
                  callbacks[key] = value;
                }
              } else {
                scope.options[key] = value;
              }
            });
            scope.callbacks = callbacks;
          }, true);

          // Set isDisabled if attr is set, if undefined isDisabled = false
          if (angular.isDefined(attrs.isDisabled)) {
            scope.$watch(attrs.isDisabled, function (newVal, oldVal) {
              if (!angular.isUndefined(newVal)) {
                scope.isDisabled = newVal;
              }
            }, true);
          }
        }
      };
    });

}());

/*jshint indent: 2 */
/*global angular: false */

(function () {

  'use strict';
  var mainModule = angular.module('as.sortable');

  /**
   * Controller for sortableItemHandle
   *
   * @param $scope - item handle scope.
   */
  mainModule.controller('as.sortable.sortableItemHandleController', ['$scope', function ($scope) {

    this.scope = $scope;

    $scope.itemScope = null;
    $scope.type = 'handle';
  }]);

  //Check if a node is parent to another node
  function isParent(possibleParent, elem) {
    if(!elem || elem.nodeName === 'HTML') {
      return false;
    }

    if(elem.parentNode === possibleParent) {
      return true;
    }

    return isParent(possibleParent, elem.parentNode);
  }

  /**
   * Directive for sortable item handle.
   */
  mainModule.directive('asSortableItemHandle', ['sortableConfig', '$helper', '$window', '$document',
    function (sortableConfig, $helper, $window, $document) {
      return {
        require: '^asSortableItem',
        scope: true,
        restrict: 'A',
        controller: 'as.sortable.sortableItemHandleController',
        link: function (scope, element, attrs, itemController) {

          var dragElement, //drag item element.
            placeHolder, //place holder class element.
            placeElement,//hidden place element.
            itemPosition, //drag item element position.
            dragItemInfo, //drag item data.
            containment,//the drag container.
            containerPositioning, // absolute or relative positioning.
            dragListen,// drag listen event.
            scrollableContainer, //the scrollable container
            dragStart,// drag start event.
            dragMove,//drag move event.
            dragEnd,//drag end event.
            dragCancel,//drag cancel event.
            isDraggable,//is element draggable.
            placeHolderIndex,//placeholder index in items elements.
            bindDrag,//bind drag events.
            unbindDrag,//unbind drag events.
            bindEvents,//bind the drag events.
            unBindEvents,//unbind the drag events.
            hasTouch,// has touch support.
            dragHandled, //drag handled.
            createPlaceholder,//create place holder.
            isPlaceHolderPresent,//is placeholder present.
            isDisabled = false, // drag enabled
            escapeListen; // escape listen event

          hasTouch = $window.hasOwnProperty('ontouchstart');

          if (sortableConfig.handleClass) {
            element.addClass(sortableConfig.handleClass);
          }

          scope.itemScope = itemController.scope;
          element.data('_scope', scope); // #144, work with angular debugInfoEnabled(false)

          scope.$watch('sortableScope.isDisabled', function (newVal) {
            if (isDisabled !== newVal) {
              isDisabled = newVal;
              if (isDisabled) {
                unbindDrag();
              } else {
                bindDrag();
              }
            }
          });

          scope.$on('$destroy', function () {
            angular.element($document[0].body).unbind('keydown', escapeListen);
          });

          createPlaceholder = function (itemScope) {
            if (typeof scope.sortableScope.options.placeholder === 'function') {
              return angular.element(scope.sortableScope.options.placeholder(itemScope));
            } else if (typeof scope.sortableScope.options.placeholder === 'string') {
              return angular.element(scope.sortableScope.options.placeholder);
            } else {
              return angular.element($document[0].createElement(itemScope.element.prop('tagName')));
            }
          };

          /**
           * Listens for a 10px movement before
           * dragStart is called to allow for
           * a click event on the element.
           *
           * @param event - the event object.
           */
          dragListen = function (event) {

            var unbindMoveListen = function () {
              angular.element($document).unbind('mousemove', moveListen);
              angular.element($document).unbind('touchmove', moveListen);
              element.unbind('mouseup', unbindMoveListen);
              element.unbind('touchend', unbindMoveListen);
              element.unbind('touchcancel', unbindMoveListen);
            };

            var startPosition;
            var moveListen = function (e) {
              e.preventDefault();
              var eventObj = $helper.eventObj(e);
              if (!startPosition) {
                startPosition = { clientX: eventObj.clientX, clientY: eventObj.clientY };
              }
              if (Math.abs(eventObj.clientX - startPosition.clientX) + Math.abs(eventObj.clientY - startPosition.clientY) > 10) {
                unbindMoveListen();
                dragStart(event);
              }
            };

            angular.element($document).bind('mousemove', moveListen);
            angular.element($document).bind('touchmove', moveListen);
            element.bind('mouseup', unbindMoveListen);
            element.bind('touchend', unbindMoveListen);
            element.bind('touchcancel', unbindMoveListen);
            event.stopPropagation();
          };

          /**
           * Triggered when drag event starts.
           *
           * @param event the event object.
           */
          dragStart = function (event) {

            var eventObj, tagName;

            if (!hasTouch && (event.button === 2 || event.which === 3)) {
              // disable right click
              return;
            }
            if (hasTouch && $helper.isTouchInvalid(event)) {
              return;
            }
            if (dragHandled || !isDraggable(event)) {
              // event has already fired in other scope.
              return;
            }
            // Set the flag to prevent other items from inheriting the drag event
            dragHandled = true;
            event.preventDefault();
            eventObj = $helper.eventObj(event);
            scope.sortableScope = scope.sortableScope || scope.itemScope.sortableScope; //isolate directive scope issue.
            scope.callbacks = scope.callbacks || scope.itemScope.callbacks; //isolate directive scope issue.

            // (optional) Scrollable container as reference for top & left offset calculations, defaults to Document
            scrollableContainer = angular.element($document[0].querySelector(scope.sortableScope.options.scrollableContainer)).length > 0 ?
              $document[0].querySelector(scope.sortableScope.options.scrollableContainer) : $document[0].documentElement;

            containment = (scope.sortableScope.options.containment)? $helper.findAncestor(element, scope.sortableScope.options.containment):angular.element($document[0].body);
            //capture mouse move on containment.
            containment.css('cursor', 'move');
            containment.css('cursor', '-webkit-grabbing');
            containment.css('cursor', '-moz-grabbing');
            containment.addClass('as-sortable-un-selectable');

            // container positioning
            containerPositioning = scope.sortableScope.options.containerPositioning || 'absolute';

            dragItemInfo = $helper.dragItem(scope);
            tagName = scope.itemScope.element.prop('tagName');

            dragElement = angular.element($document[0].createElement(scope.sortableScope.element.prop('tagName')))
              .addClass(scope.sortableScope.element.attr('class')).addClass(sortableConfig.dragClass);
            dragElement.css('width', $helper.width(scope.itemScope.element) + 'px');
            dragElement.css('height', $helper.height(scope.itemScope.element) + 'px');

            placeHolder = createPlaceholder(scope.itemScope)
              .addClass(sortableConfig.placeHolderClass).addClass(scope.sortableScope.options.additionalPlaceholderClass);
            placeHolder.css('width', $helper.width(scope.itemScope.element) + 'px');
            placeHolder.css('height', $helper.height(scope.itemScope.element) + 'px');

            placeElement = angular.element($document[0].createElement(tagName));
            if (sortableConfig.hiddenClass) {
              placeElement.addClass(sortableConfig.hiddenClass);
            }

            itemPosition = $helper.positionStarted(eventObj, scope.itemScope.element, scrollableContainer);
            //fill the immediate vacuum.
            if (!scope.itemScope.sortableScope.options.clone) {
              scope.itemScope.element.after(placeHolder);
            }

            //hidden place element in original position.
            scope.itemScope.element.after(placeElement);

            if (scope.itemScope.sortableScope.options.clone) {
              // clone option is true, so clone the element.
              dragElement.append(scope.itemScope.element.clone());
            }
            else {
              // Not cloning, so use the original element.
              dragElement.append(scope.itemScope.element);
            }

            containment.append(dragElement);
            $helper.movePosition(eventObj, dragElement, itemPosition, containment, containerPositioning, scrollableContainer);

            scope.sortableScope.$apply(function () {
              scope.callbacks.dragStart(dragItemInfo.eventArgs());
            });
            bindEvents();
          };

          /**
           * Allow Drag if it is a proper item-handle element.
           *
           * @param event - the event object.
           * @return boolean - true if element is draggable.
           */
          isDraggable = function (event) {

            var elementClicked, sourceScope, isDraggable;

            elementClicked = angular.element(event.target);

            // look for the handle on the current scope or parent scopes
            sourceScope = fetchScope(elementClicked);

            isDraggable = (sourceScope && sourceScope.type === 'handle');

            //If a 'no-drag' element inside item-handle if any.
            while (isDraggable && elementClicked[0] !== element[0]) {
              if ($helper.noDrag(elementClicked)) {
                isDraggable = false;
              }
              elementClicked = elementClicked.parent();
            }
            return isDraggable;
          };

          /**
           * Inserts the placeHolder in to the targetScope.
           *
           * @param targetElement the target element
           * @param targetScope the target scope
           */
          function insertBefore(targetElement, targetScope) {
            // Ensure the placeholder is visible in the target (unless it's a table row)
            if (placeHolder.css('display') !== 'table-row') {
              placeHolder.css('display', 'block');
            }
            if (!targetScope.sortableScope.options.clone) {
              targetElement[0].parentNode.insertBefore(placeHolder[0], targetElement[0]);
              dragItemInfo.moveTo(targetScope.sortableScope, targetScope.index());
            }
          }

          /**
           * Inserts the placeHolder next to the targetScope.
           *
           * @param targetElement the target element
           * @param targetScope the target scope
           */
          function insertAfter(targetElement, targetScope) {
            // Ensure the placeholder is visible in the target (unless it's a table row)
            if (placeHolder.css('display') !== 'table-row') {
              placeHolder.css('display', 'block');
            }
            if (!targetScope.sortableScope.options.clone) {
              targetElement.after(placeHolder);
              dragItemInfo.moveTo(targetScope.sortableScope, targetScope.index() + 1);
            }
          }

          /**
           * Triggered when drag is moving.
           *
           * @param event - the event object.
           */
          dragMove = function (event) {

            var eventObj, targetX, targetY, targetScope, targetElement;

            if (hasTouch && $helper.isTouchInvalid(event)) {
              return;
            }
            // Ignore event if not handled
            if (!dragHandled) {
              return;
            }
            if (dragElement) {

              event.preventDefault();

              eventObj = $helper.eventObj(event);

              // checking if dragMove callback exists, to prevent application
              // rerenderings on each mouse move event
              if (scope.callbacks.dragMove !== angular.noop) {
                scope.sortableScope.$apply(function () {
                  scope.callbacks.dragMove(itemPosition, containment, eventObj);
                });
              }

              $helper.movePosition(eventObj, dragElement, itemPosition, containment, containerPositioning, scrollableContainer);

              targetX = eventObj.pageX - $document[0].documentElement.scrollLeft;
              targetY = eventObj.pageY - ($window.pageYOffset || $document[0].documentElement.scrollTop);

              //IE fixes: hide show element, call element from point twice to return pick correct element.
              dragElement.addClass(sortableConfig.hiddenClass);
              $document[0].elementFromPoint(targetX, targetY);
              targetElement = angular.element($document[0].elementFromPoint(targetX, targetY));
              dragElement.removeClass(sortableConfig.hiddenClass);

              //Set Class as dragging starts
              dragElement.addClass(sortableConfig.dragging);

              targetScope = fetchScope(targetElement);

              if (!targetScope || !targetScope.type) {
                return;
              }
              if (targetScope.type === 'handle') {
                targetScope = targetScope.itemScope;
              }
              if (targetScope.type !== 'item' && targetScope.type !== 'sortable') {
                return;
              }

              if (targetScope.type === 'item' && targetScope.accept(scope, targetScope.sortableScope, targetScope)) {
                // decide where to insert placeholder based on target element and current placeholder if is present
                targetElement = targetScope.element;

                var placeholderIndex = placeHolderIndex(targetScope.sortableScope.element);
                if (placeholderIndex < 0) {
                  insertBefore(targetElement, targetScope);
                } else {
                  if (placeholderIndex <= targetScope.index()) {
                    insertAfter(targetElement, targetScope);
                  } else {
                    insertBefore(targetElement, targetScope);
                  }
                }
              }

              if (targetScope.type === 'sortable') {//sortable scope.
                if (targetScope.accept(scope, targetScope) &&
                  !isParent(targetScope.element[0], targetElement[0])) {
                  //moving over sortable bucket. not over item.
                  if (!isPlaceHolderPresent(targetElement) && !targetScope.options.clone) {
                    targetElement[0].appendChild(placeHolder[0]);
                    dragItemInfo.moveTo(targetScope, targetScope.modelValue.length);
                  }
                }
              }
            }
          };


          /**
           * Fetch scope from element or parents
           * @param  {object} element Source element
           * @return {object}         Scope, or null if not found
           */
          function fetchScope(element) {
            var scope;
            while (!scope && element.length) {
              scope = element.data('_scope');
              if (!scope) {
                element = element.parent();
              }
            }
            return scope;
          }


          /**
           * Get position of place holder among item elements in itemScope.
           * @param targetElement the target element to check with.
           * @returns {*} -1 if placeholder is not present, index if yes.
           */
          placeHolderIndex = function (targetElement) {
            var itemElements, i;
            // targetElement is placeHolder itself, return index 0
            if (targetElement.hasClass(sortableConfig.placeHolderClass)){
              return 0;
            }
            // find index in target children
            itemElements = targetElement.children();
            for (i = 0; i < itemElements.length; i += 1) {
              //TODO may not be accurate when elements contain other siblings than item elements
              //solve by adding 1 to model index of previous item element
              if (angular.element(itemElements[i]).hasClass(sortableConfig.placeHolderClass)) {
                return i;
              }
            }
            return -1;
          };


          /**
           * Check there is no place holder placed by itemScope.
           * @param targetElement the target element to check with.
           * @returns {*} true if place holder present.
           */
          isPlaceHolderPresent = function (targetElement) {
            return placeHolderIndex(targetElement) >= 0;
          };

          /**
           * Rollback the drag data changes.
           */

          function rollbackDragChanges() {
            placeElement.replaceWith(scope.itemScope.element);
            placeHolder.remove();
            dragElement.remove();
            dragElement = null;
            dragHandled = false;
            containment.css('cursor', '');
            containment.removeClass('as-sortable-un-selectable');
          }

          /**
           * triggered while drag ends.
           *
           * @param event - the event object.
           */
          dragEnd = function (event) {
            // Ignore event if not handled
            if (!dragHandled) {
              return;
            }
            event.preventDefault();
            if (dragElement) {
              //rollback all the changes.
              rollbackDragChanges();
              // update model data
              dragItemInfo.apply();
              scope.sortableScope.$apply(function () {
                if (dragItemInfo.isSameParent()) {
                  if (dragItemInfo.isOrderChanged()) {
                    scope.callbacks.orderChanged(dragItemInfo.eventArgs());
                  }
                } else {
                  scope.callbacks.itemMoved(dragItemInfo.eventArgs());
                }
              });
              scope.sortableScope.$apply(function () {
                scope.callbacks.dragEnd(dragItemInfo.eventArgs());
              });
              dragItemInfo = null;
            }
            unBindEvents();
          };

          /**
           * triggered while drag is cancelled.
           *
           * @param event - the event object.
           */
          dragCancel = function (event) {
            // Ignore event if not handled
            if (!dragHandled) {
              return;
            }
            event.preventDefault();

            if (dragElement) {
              //rollback all the changes.
              rollbackDragChanges();
              scope.sortableScope.$apply(function () {
                scope.callbacks.dragCancel(dragItemInfo.eventArgs());
              });
              dragItemInfo = null;
            }
            unBindEvents();
          };

          /**
           * Binds the drag start events.
           */
          bindDrag = function () {
            element.bind('touchstart', dragListen);
            element.bind('mousedown', dragListen);
          };

          /**
           * Unbinds the drag start events.
           */
          unbindDrag = function () {
            element.unbind('touchstart', dragListen);
            element.unbind('mousedown', dragListen);
          };

          //bind drag start events.
          bindDrag();

          //Cancel drag on escape press.
          escapeListen = function (event) {
            if (event.keyCode === 27) {
              dragCancel(event);
            }
          };
          angular.element($document[0].body).bind('keydown', escapeListen);

          /**
           * Binds the events based on the actions.
           */
          bindEvents = function () {
            angular.element($document).bind('touchmove', dragMove);
            angular.element($document).bind('touchend', dragEnd);
            angular.element($document).bind('touchcancel', dragCancel);
            angular.element($document).bind('mousemove', dragMove);
            angular.element($document).bind('mouseup', dragEnd);
          };

          /**
           * Un binds the events for drag support.
           */
          unBindEvents = function () {
            angular.element($document).unbind('touchend', dragEnd);
            angular.element($document).unbind('touchcancel', dragCancel);
            angular.element($document).unbind('touchmove', dragMove);
            angular.element($document).unbind('mouseup', dragEnd);
            angular.element($document).unbind('mousemove', dragMove);
          };
        }
      };
    }]);
}());

/*jshint indent: 2 */
/*global angular: false */

(function () {

  'use strict';
  var mainModule = angular.module('as.sortable');

  /**
   * Controller for sortable item.
   *
   * @param $scope - drag item scope
   */
  mainModule.controller('as.sortable.sortableItemController', ['$scope', function ($scope) {

    this.scope = $scope;

    $scope.sortableScope = null;
    $scope.modelValue = null; // sortable item.
    $scope.type = 'item';

    /**
     * returns the index of the drag item from the sortable list.
     *
     * @returns {*} - index value.
     */
    $scope.index = function () {
      return $scope.$index;
    };

    /**
     * Returns the item model data.
     *
     * @returns {*} - item model value.
     */
    $scope.itemData = function () {
      return $scope.sortableScope.modelValue[$scope.$index];
    };

  }]);

  /**
   * sortableItem directive.
   */
  mainModule.directive('asSortableItem', ['sortableConfig',
    function (sortableConfig) {
      return {
        require: ['^asSortable', '?ngModel'],
        restrict: 'A',
        controller: 'as.sortable.sortableItemController',
        link: function (scope, element, attrs, ctrl) {
          var sortableController = ctrl[0];
          var ngModelController = ctrl[1];
          if (sortableConfig.itemClass) {
            element.addClass(sortableConfig.itemClass);
          }
          scope.sortableScope = sortableController.scope;
          if (ngModelController) {
            ngModelController.$render = function () {
              scope.modelValue = ngModelController.$modelValue;
            };
          } else {
            scope.modelValue = sortableController.scope.modelValue[scope.$index];
          }
          scope.element = element;
          element.data('_scope',scope); // #144, work with angular debugInfoEnabled(false)
        }
      };
    }]);

}());

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('itemspreadsheet');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('property');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Configuring the new module
angular.module('apps').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Apps', 'apps', 'dropdown', '/apps(/create)?');
		Menus.addSubMenuItem('topbar', 'apps', 'List Apps', 'apps');
		Menus.addSubMenuItem('topbar', 'apps', 'New App', 'apps/create');
	}
]);

'use strict';

//Setting up route
angular.module('apps').config(['$stateProvider',
	function($stateProvider) {
		// Apps state routing
		$stateProvider.
		state('listApps', {
			url: '/apps',
			templateUrl: 'builder/public/modules/apps/views/list-apps.client.view.html'
		}).
		state('createApp', {
			url: '/apps/create',
			templateUrl: 'builder/public/modules/apps/views/create-app.client.view.html'
		}).
		state('listThemes', {
			url: '/apps/select-theme/:appId',
			templateUrl: 'builder/public/modules/apps/views/select-theme.client.view.html'
		}).
		state('viewApp', {
			url: '/apps/:appId',
			templateUrl: 'builder/public/modules/apps/views/view-app.client.view.html'
		}).
		state('editApp', {
			url: '/apps/:appId/edit',
			templateUrl: 'builder/public/modules/apps/views/edit-app.client.view.html'
		})
		.state('viewAppCreationStatus', {
			url: '/apps/:appId/view-app-creation-status',
			templateUrl: 'builder/public/modules/apps/views/view-app-creation-status.client.view.html'
		})
		.state('generatedAppStatus', {
			url: '/apps/:appId/generated-app-status',
			templateUrl: 'builder/public/modules/apps/views/generated-app-status.client.view.html'
		});

	}
]);
'use strict';

// Apps controller
angular.module('apps').controller('AppsController', ['$scope', '$stateParams', '$location', '$interval',  'Authentication', 'Apps',
	function($scope, $stateParams, $location, $interval, Authentication, Apps) {
		$scope.authentication = Authentication;
		$scope.parentRouteUrl = '';

		var errFn = function(errorResponse) {
			var err = 'An error occured: ';
			if(errorResponse && errorResponse.data && errorResponse.data.message){
				err = err + errorResponse.data.message;
			} else {
				err = err + errorResponse;
			}
			$scope.error = err;
		};

		// Create new App
		$scope.create = function() {
			// Create new App object
			var app = new Apps ({
					name: this.name,
					appDescription: this.name || 'temp description',
					appKeyword: this.name || 'temp keyword',
					appAuthor: Authentication.user.displayName,
					bootstrapTheme: 'flatly',
			});

			// Redirect after save
			app.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/apps/select-theme/' + response._id);

				// reset form fields
				$scope.name = '';
				$scope.appDescription = '';
				$scope.appKeyword = '';
				$scope.appAuthor = '';
				$scope.bootstrapTheme = 'flatly';
				
			}, errFn);
		};

		$scope.selectTheme = function(theme){
			var appId = $scope.appId;
			if(!appId){
				$scope.error = 'Error. The app could not be identified';
				return;
			}
			Apps.get({ appId: appId})
				.$promise.then(function(app){
					app.bootstrapTheme = theme;
					app.$update(function() {
					$location.path($scope.parentRouteUrl + '/apps/' + app._id + '/items');
				}, errFn);
			}, errFn);
		};

		// Remove existing App
		$scope.remove = function(app) {
			if ( app ) { 
				app.$remove();

				for (var i in $scope.apps) {
					if ($scope.apps [i] === app) {
						$scope.apps.splice(i, 1);
					}
				}
			} else {
				$scope.app.$remove(function() {
					$location.path($scope.parentRouteUrl + '/apps');
				});
			}
		};

		// Update existing App
		$scope.update = function() {
			var app = $scope.app;

			app.$update(function() {
				$location.path($scope.parentRouteUrl + '/apps/' + app._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Apps
		$scope.find = function() {
			$scope.apps = Apps.query();
		};

		// Find existing App
		$scope.findOne = function() {
			$scope.app = Apps.get({ 
				appId: $stateParams.appId
			});
		};

		$scope.listThemes = function() {
			$scope.appId = $stateParams.appId;
			if(!$scope.appId){
				$scope.error = 'Error. The app could not be identified';
			}
		};

		$scope.appCreationStatus = function() {
			var appId = $stateParams.appId;
			Apps.generateItems({appId: appId}, 
				function(){
					console.log('generateItems call was a success.');
					
					//make items available
					Apps.makeNewItemsAvailableToUse({}, 
						function(){
					}, 
					function(err1){
						//keep checking if the server is alive
						var promise = $interval(function(){Apps.checkIfServerIsAlive({}, 
							function(){
								$interval.cancel(promise);
								$location.path($scope.parentRouteUrl + '/apps/' + $stateParams.appId + '/generated-app-status');
						}, function(){})}, 1000);	
					});
				}, 
				function(err2){
					console.error('Following error occured while trying to generate items: ');
					console.error(err2);
				});
		};

		$scope.generateItems = function(){
			$location.path($scope.parentRouteUrl + '/apps/' + $stateParams.appId + '/view-app-creation-status');
		};
	}
]);
'use strict';

//Apps service used to communicate Apps REST endpoints
angular.module('apps').factory('Apps', ['$resource',
	function($resource) {
		return $resource('apps/:appId', 
		{ 
			appId: '@_id'
		}, 
		{
			update: {
				method: 'PUT'
			},

			generateItems: {
				url: 'apps/generate-items',
				method: 'PUT'
			},

			makeNewItemsAvailableToUse: {
				url: 'apps/make-new-items-available-to-use',
				method: 'PUT'
			},

			checkIfServerIsAlive: {
				url: 'apps/check-if-server-is-alive'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'builder/public/modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';


angular.module('core').controller('BaseController', ['$scope', 'Authentication', 'Menus', 'GetUserRoles', 'BuilderSetup', '$window', '$rootScope',
	function($scope, Authentication, Menus, GetUserRoles, BuilderSetup, $window, $rootScope) {

		var errFn = function(errorResponse) {
			var err = 'An error occured: ';
			if(errorResponse && errorResponse.data && errorResponse.data.message){
				err = err + errorResponse.data.message;
			} else {
				err = err + errorResponse;
			}
			$scope.error = err;
		};

		var body = angular.element(document).find('body');
		$scope.menu = Menus.getMenu('topbar');

		$scope.$on('$stateChangeSuccess', function() {
			$scope.isAuthenticated = Authentication && Authentication.user;
			$rootScope.displayExpandedView = false; //will be set specificaly by pages that need to display expanded

		});

		$scope.$watch('isAuthenticated', function(){
			if($scope.isAuthenticated){

				BuilderSetup.get(function(response){

					$scope.appId = response.appId;
					 GetUserRoles.get(function(userRoles){
						$scope.userRoles = userRoles;
						$scope.userDoesNotHaveAccessToConfigure = !userRoles.build;
					});

				},function(errorResponse) {
					$scope.userRoles = {};
					var err = 'An error occured: ';
					if(errorResponse && errorResponse.data && errorResponse.data.message){
						err = err + errorResponse.data.message;
					} else {
						err = err + errorResponse;
					}
					$scope.error = err;
				});

			} else {
				$scope.userRoles = {};
			}
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';

angular.module('apps').controller('HomeController', ['$scope', '$stateParams', '$window', '$interval',  'Authentication', 'Apps',
	function($scope, $stateParams, $window, $interval, Authentication, Apps) {
		$scope.authentication = Authentication;

		$scope.onLoadOfHomePage = function() {
			if(!$scope.authentication || !$scope.authentication.user){
				$window.location.href = '/';
				return;
			}
		};
	}
]);
'use strict';

angular.module('core').factory('BuilderSetup', ['$resource',
	function($resource) {
		return $resource('builder-setup');
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//Setting up route
angular.module('items').config(['$stateProvider',
	function($stateProvider) {
		// Items state routing
		$stateProvider.
		state('listItems', {
			url: '/apps/:appId/items',
			templateUrl: 'builder/public/modules/items/views/list-items.client.view.html'
		}).
		state('itemCollections', {
			url: '/apps/:appId/item-collections/:itemId',
			templateUrl: 'builder/public/modules/items/views/item-collections.client.view.html'
		}).
		state('itemUploadSpreadsheet', {
			url: '/apps/:appId/item-upload-spreadsheet/:itemId',
			templateUrl: 'builder/public/modules/items/views/item-upload-spreadsheet.client.view.html'
		}).
		state('createItem', {
			url: '/apps/:appId/items/create',
			templateUrl: 'builder/public/modules/items/views/create-item.client.view.html'
		}).
		state('viewItem', {
			url: '/apps/:appId/items/:itemId',
			templateUrl: 'builder/public/modules/items/views/view-item.client.view.html'
		}).
		state('itemProperties', {
			url: '/apps/:appId/item-properties/:itemId',
			templateUrl: 'builder/public/modules/items/views/item-properties.client.view.html'
		}).
		state('itemPermissions', {
			url: '/apps/:appId/item-permissions/:itemId',
			templateUrl: 'builder/public/modules/items/views/item-permissions.client.view.html'
		});
		// state('editItem', {
		// 	url: '/apps/:appId/items/:itemId/edit',
		// 	templateUrl: 'builder/public/modules/items/views/edit-item.client.view.html'
		// });
	}
]);
'use strict';

angular.module('items').controller('ItemPermissions', ["$scope", "$stateParams", "$timeout", "$location", "Authentication", "Items", "Itemroles", function($scope, $stateParams, $timeout, $location, Authentication, Items, Itemroles) {
		$scope.authentication = Authentication;
		
		$scope.readRoleList = {items: ''};
		$scope.editRoleList = {items: ''};
		$scope.deleteRoleList = {items: ''};
		$scope.createRoleList = {items: ''};
		$scope.manageaccessRoleList = {items: ''};
		$scope.accessSelections = {read: '', edit: '', create: '', 'delete': '', manageaccess: ''};
		
		$scope.previousSelections = {};

		$scope.addReadRole = function(roleName){
			$scope.addRole(roleName, 'read');
		};
		$scope.removeReadRole = function(roleName){
			$scope.removeRole(roleName, 'read');
		};

		$scope.addEditRole = function(roleName){
			$scope.addRole(roleName, 'edit');
		};
		$scope.removeEditRole = function(roleName){
			$scope.removeRole(roleName, 'edit');
		};

		$scope.addDeleteRole = function(roleName){
			$scope.addRole(roleName, 'delete');
		};
		$scope.removeDeleteRole = function(roleName){
			$scope.removeRole(roleName, 'delete');
		};

		$scope.addCreateRole = function(roleName){
			$scope.addRole(roleName, 'create');
		};
		$scope.removeCreateRole = function(roleName){
			$scope.removeRole(roleName, 'create');
		};

		$scope.addManageAccessRole = function(roleName){
			$scope.addRole(roleName, 'manageaccess');
		};
		$scope.removeManageAccessRole = function(roleName){
			$scope.removeRole(roleName, 'manageaccess');
		};

		$scope.addRole = function(roleName, accessType){
			$scope.error = null;
			if(!roleName){
				$scope.error = 'Cannot save role. Role name missing';
				return;
			}
			if(!accessType){
				$scope.error = 'Cannot save role. Access type missing';
				return;
			}

			// Create new Itemrole object
			var itemroles = new Itemroles ({
					parentId: $stateParams.itemId,					
					accesstype: accessType,
					role: roleName
			});

			itemroles.$save(function(response) {
				console.log(roleName + ' added successfully');				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.removeRole = function(roleName, accessType){
			$scope.error = null;
			if(!roleName){
				$scope.error = 'Cannot save role. Role name missing';
				return;
			}
			if(!accessType){
				$scope.error = 'Cannot save role. Access type missing';
				return;
			}

			var params = {
				parentId: $stateParams.itemId,
				accesstype: accessType,
				role: roleName
			};

			Itemroles.deleteItemRole(params).$promise.then(function(result){
				console.log(roleName + ' removed successfully');
			}).catch(function(err){
				$scope.error = err;
			});			
		};

		$scope.saveSelection = function(accessType){
			$scope.error = null;
			if(!accessType){
				$scope.error = 'Cannot save. accessType missing';
				return;
			}
			var selection = $scope.accessSelections[accessType];
			$scope.addRole(selection, accessType);
			if($scope.previousSelections[accessType] && $scope.previousSelections[accessType] !== selection){
				$scope.removeRole($scope.previousSelections[accessType], accessType);
				$scope.previousSelections[accessType] = selection;
			}
		};

		$scope.getAuthorizationType = function(roleList, accessType){
			var authorizationTypes = [
				'everyone',
				'allloggedinusers',
				'onlycreator',
				'creatorandroles',
				'roles'
			];
			
			if(roleList && roleList.length){
				for(var ctr = 0; ctr < authorizationTypes.length; ctr++){
					var authorizationType = authorizationTypes[ctr];
					if(roleList.indexOf(authorizationType) >= 0){
						return authorizationType;
					}
				}
			}

			return $scope.getDefaultAuthorizationType(accessType);
		};

		$scope.getDefaultAuthorizationType = function(accessType){
			switch(accessType){
				case 'read': 
					return 'everyone';
				case 'create': 
					return 'allloggedinusers';
				case 'edit': 
					return 'creatorandroles';
				case 'delete': 
					return 'creatorandroles';
				case 'manageaccess':
					return 'creatorandroles';
			}
		};

		$scope.getCurrentRoleSelection = function(accessType){
			$scope.error = null;
			if(!accessType){
				$scope.error = 'Cannot get the current role selection. accessType missing';
				return;
			}
			var params = {
				parentId: $stateParams.itemId,
				accesstype: accessType
			};
			Itemroles.getByAccessType(params).$promise.then(function(result){
				$scope[accessType + 'RoleList'].items = result;
				
				var selectionType = $scope.getAuthorizationType(result, accessType);
 
				$scope.accessSelections[accessType] = selectionType;
				$scope.previousSelections[accessType] = selectionType;
			}).catch(function(err){
				$scope.error = err;
			});
		};

		$scope.getCurrentRoleSelection('read');
		$scope.getCurrentRoleSelection('create');
		$scope.getCurrentRoleSelection('edit');
		$scope.getCurrentRoleSelection('delete');
		$scope.getCurrentRoleSelection('manageaccess');

	}]
);
'use strict';

angular.module('items').controller('ItemUploadSpreadsheetController', ["$scope", "$stateParams", "$timeout", "$location", "Authentication", "Itemspreadsheet", function($scope, $stateParams, $timeout, $location, Authentication, Itemspreadsheet) {
		$scope.authentication = Authentication;

		$scope.showCurrentList = function(){
			Itemspreadsheet.search({searchKeys: 'parentId', searchValue: $stateParams.itemId}).$promise.then(function(response) {
				$scope.currentlyUploadedSpreadsheets = response;
		    }, function(error){
		    	console.error('Existing spreadsheet list could not be retrieved retrieved', error);
		    });
		};

		$scope.showCurrentList();

		$scope.onSuccessfulUploadOfSpreadsheet = function(unusedParam, fileName, fileKey){
			console.log('Successfully uploaded', fileName);
			console.log('FileKey is ', fileKey );

			var itemspreadsheet = new Itemspreadsheet ({
					fileName: fileName,	
					fileKey: fileKey,	
					parentId: $stateParams.itemId,	
					status: 'uploaded'
			});

			// Redirect after save
			itemspreadsheet.$save(function(response) {
				console.log('Spreadsheet successfully uploaded');
				$scope.showCurrentList();
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				console.error(errorResponse.data.message);
			});
		};
	}]
);
'use strict';

// Items controller
angular.module('items').controller('ItemsController', ['$scope', '$stateParams', '$location', 'Authentication', 
		'Items', 'ItemParents', '$timeout', '$q', '$uibModal', '$window',
	function($scope, $stateParams, $location, Authentication, Items, ItemParents, $timeout, $q, $uibModal, $window) {
		$scope.authentication = Authentication;
		$scope.appId = $stateParams.appId;
		$scope.parentRouteUrl = '/apps/' + $stateParams.appId + '';
		$scope.isChildItem = false;

		// Remove existing Item
		$scope.remove = function(item) {
			if ( item ) { 
				item.$remove();

				for (var i in $scope.items) {
					if ($scope.items [i] === item) {
						$scope.items.splice(i, 1);
					}
				}
			} else {
				$scope.item.$remove(function() {
					$location.path($scope.parentRouteUrl + '/items');
				});
			}
		};

		// Update existing Item
		$scope.update = function() {
			var item = $scope.item;

			item.$update(function() {
				$location.path($scope.parentRouteUrl + '/items/' + item._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Items
		// $scope.find = function() {
		// 	$scope.items = Items.queryForParentId({parentId: $scope.appId});
		// };
		
		$scope.overrideSelectExpansion = function(event, el){
			event.preventDefault();
		};

		$scope.sortableOptions = {
			clone: true,
		    accept: function (sourceItemHandleScope, destSortableScope) {
		    	return false;
		    },
		    itemMoved: function (eventObj) {
				var insertedAt = eventObj.dest.index;
				var controlType = $scope.items[insertedAt];
				
				var positionIndex = ItemItems.getPositionIndexForNewlyInsertedItem(insertedAt);
				console.log(insertedAt);
				console.log(positionIndex);
				$scope.insertNewProperty(controlType, positionIndex, insertedAt);

		    },
		    orderChanged: function(event) {//Do what you want
		    	console.log('source orderChanged');
		    },	
		};


		$scope.availableFormControls = ['textbox', 'textarea', 'checkbox', 'dropDown', 'radioButtons', 'foreignkeyref', 'lookupfromprop'];
		$scope.dragControlListeners = {
		    accept: function (sourceItemHandleScope, destSortableScope) {
		    	console.log('accept');
		    	return true;
		    },//override to determine drag is allowed or not. default is true.
		    itemMoved: function (event) {//Do what you want
		    	console.log('itemMoved');
		    	console.log(event);
		    },
		    orderChanged: function(eventObj) {
		    	var movedToIndex = eventObj.dest.index;
		    	var positionIndex = ItemItems.getPositionIndexForNewlyInsertedItem(movedToIndex);
				$scope.items[movedToIndex].positionIndex = positionIndex;
				$scope.items[movedToIndex].savePositionIndex();
		    }
		    //containment: '#board'//optional param.
		};
	}
]);
'use strict';

// Items controller
angular.module('items').controller('ListChildItemsController', ["$scope", "Items", "$stateParams", "ItemParents", "$q", "Authentication", "$timeout", "$location", function($scope, Items, $stateParams, ItemParents, $q, Authentication, $timeout, $location) {
		$scope.appId = $stateParams.appId;
		$scope.authentication = Authentication;
		$scope.parentRouteUrl = '/apps/' + $stateParams.appId + '';

		$scope.navigateToItem = function(item){
			if(item._id){
				var url = 'apps/' + $scope.appId + '/items/' + item._id;
				$timeout(function(){$location.path(url); }, 1);
			}
		};
	}]
);
'use strict';

// Items controller
angular.module('items').controller('ListItemsController', ["$scope", "$stateParams", "$timeout", "$location", function($scope, $stateParams, $timeout, $location) {
		$scope.appId = $stateParams.appId;
		$scope.parentRouteUrl = '/apps/' + $stateParams.appId;
		
		$scope.navigateToItem = function(item){
			if(item._id){
				var url = 'apps/' + $scope.appId + '/items/' + item._id;
				$timeout(function(){$location.path(url); }, 1);
			}
		};
	}]
);
angular.module('items').directive('createItem', ["CreateItemService", function(CreateItemService){

	return {
		restrict: 'E',
		scope: {
			appId: '@',
			parentCrudId: '@',
			onSuccessfulItemAdd: '&'
		},
		templateUrl: 'builder/public/modules/items/views/create-item.directive.client.view.html',
		controller: ["$scope", function($scope){
			$scope.createNewItem = function(){
				$scope.createNewItemError = '';
				if(!$scope.newItemName){
					console.error('Cannot add new item. Item Name missing.');
					return;
				}
				if(!$scope.appId){
					var error = 'Cannot save. App Id is missing';
					console.error(error);
					$scope.createNewItemError = error;
					return;
				}
				CreateItemService.createNewItem($scope.appId, $scope.parentCrudId, $scope.newItemName)
					.then(function(response){
						$scope.newItemName = '';
						$scope.onSuccessfulItemAdd({item: response});
					})
					.catch(function(error){
						console.error(error);
						$scope.createNewItemError = error;
					});
				
			};
		}]
	}
}]);

angular.module('items').directive('itemHeader', ["CreateItemService", function(CreateItemService){

	return {
		restrict: 'E',
		templateUrl: 'builder/public/modules/items/views/item-header.directive.client.view.html',
		controller: ["$scope", "$stateParams", "Authentication", "Items", "ItemParents", function($scope, $stateParams, Authentication, Items, ItemParents){
			$scope.appId = $stateParams.appId;
			$scope.parentRouteUrl = '/apps/' + $stateParams.appId + '';
			$scope.parentItemList = null;
			$scope.backLink = null;
			$scope.isChildItem = null;

			// Find existing Item
			$scope.findOne = function() {
				$scope.backLink = 'items';
				$scope.parentItemList = [];
				if($stateParams.itemId && $stateParams.itemId.length){
					Items.get({ 
						itemId: $stateParams.itemId
					}).$promise.then(function(item){
						$scope.item = item;
						$scope.hasAccess = Authentication.user && Authentication.user._id == $scope.item.user._id;
						$scope.unauthorized = !$scope.hasAccess;
						ItemParents.getParents(item, function(values, error){
							if(error){
								console.error('Could not get the list of parents for the item. Following error occured: ' + error);
							} else{
								$scope.parentItemList = values;
								if(values.length > 0){
									//set backlink to parent item
									$scope.backLink = 'items/' + values[values.length - 1].id;
									$scope.isChildItem = true;
								}
							}
						});
					}, function(err){
						console.error(err);
					});
				}
			};
		}],
		link: function(scope, element, attrs){
			scope.itemPageType = attrs.itemPageType;
			scope.atItemHome = !attrs.itemPageType || !attrs.itemPageType.length;
			scope.findOne();

		}
	}
}]);
'use strict';

angular.module('items').directive('controlLabel', function(){

	return {
		template: '<label ng-show="!item.editingLabel" class="control-label {{item.labelStatusClass()}}"' + 
			'		ng-click="item.changeToEditLabelMode()">{{item.getDisplayLabel()}}</label>' + 
			'	<input ng-show="item.editingLabel" type="text" class="form-control' + 
			'	enter-control-label" enter-key="item.saveItemLabel()"' + 
			'		focus="item.editingLabel" placeholder="Give this a name and press enter" ng-model="item.label">'
	};
});
'use strict';
//http://codepen.io/TheLarkInn/blog/angularjs-directive-labs-ngenterkey
angular.module('items').directive('enterKey', function() {
    return function(scope, element, attrs) {

        element.bind('keydown keypress', function(event) {
            var keyCode = event.which || event.keyCode;
            scope.createNewItemError = null;

            // If enter key is pressed
            if (keyCode === 13) {
                scope.$apply(function() {
                    // Evaluate the expression
                    scope.$eval(attrs.enterKey);
                });

                event.preventDefault();
            }
        });
    };
});
'use strict';

angular.module('items').directive('focus', ["$timeout", "$parse", function($timeout, $parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
          scope.$watch(attrs.focus, function(newValue, oldValue) {
              if (newValue) { element[0].focus(); }
          });
          element.bind('blur', function(e) {
              $timeout(function() {
                  scope.$apply(attrs.focus + '=false'); 
              }, 0);
          });
          element.bind('focus', function(e) {
              $timeout(function() {
                  scope.$apply(attrs.focus + '=true');
              }, 0);
          });
      }
    };
}]);
'use strict';

angular.module('items').directive('getNameCreateItemModal', ["CreateItemService", function(CreateItemService) {
    return {
        restrict: 'E',
        scope: {
            parentId: '@',
            parentCrudId: '@',
            uibModalInstance: '='
        },
        templateUrl: 'builder/public/modules/items/views/get-name-create-item-modal.client.view.html',

        controller: ['$scope', function ($scope) {

            $scope.ok = function () {
                $scope.validationError = null;
                if(!$scope.name){
                  $scope.validationError = 'Please enter a item name';
                  return;
                }

                CreateItemService.createNewItem($scope.parentId, $scope.parentCrudId, $scope.name)
                    .then(function(response){
                        $scope.uibModalInstance.close(response);
                    })
                    .catch(function(error){
                        console.error(error);
                        $scope.validationError = error;
                    });
            };

            $scope.cancel = function () {
                $scope.uibModalInstance.dismiss('cancel');
            };
        }],

        link: function(scope, element, attrs) {


        }
    };
}]);
'use strict';

angular.module('items').directive('listChildItems', ["CreateItemService", function(CreateItemService) {
    return {
        restrict: 'E',
        scope: {
           
        },
        templateUrl: 'builder/public/modules/items/views/list-child-items.directive.client.view.html',

        controller: ["$scope", "Items", "$timeout", "$stateParams", function ($scope, Items, $timeout, $stateParams) {
            $scope.appId = $stateParams.appId;
            $scope.parentRouteUrl = '/apps/' + $stateParams.appId + '';
            $scope.parentCrudId = $stateParams.itemId;

            $scope.find = function() {
                $scope.items = Items.queryForParentId({parentId: $stateParams.appId, parentCrudId: $stateParams.itemId});
            };

            $scope.addItemToList = function(item){
                if(!$scope.items){
                    $scope.items = [];
                }
                item.isNew = true;
                $scope.items.push(item);
            };
        }],

        link: function(scope, element, attrs) {
            scope.find();
        }
    };
}]);
'use strict';

angular.module('items').directive('listRootItems', ["CreateItemService", function(CreateItemService) {
    return {
        restrict: 'E',
        scope: {
           
        },
        templateUrl: 'builder/public/modules/items/views/list-root-items.directive.client.view.html',

        controller: ["$scope", "Items", "$timeout", "$stateParams", function ($scope, Items, $timeout, $stateParams) {
            $scope.appId = $stateParams.appId;
            $scope.parentRouteUrl = '/apps/' + $stateParams.appId + '';

            $scope.find = function() {
                $scope.items = Items.queryForParentId({parentId: $scope.appId});
            };

            $scope.addItemToList = function(item){
                if(!$scope.items){
                    $scope.items = [];
                }
                item.isNew = true;
                $scope.items.push(item);
            };
        }],

        link: function(scope, element, attrs) {
            scope.find();
        }
    };
}]);
'use strict';

//Items service used to communicate Items REST endpoints
angular.module('items').filter('parentCrudOnly', function(){
	return function(items, name){
		var filtered = [];
		if(items){
			items.forEach(function(item){
				if(item.parentCrudId === '0' || item.parentCrudId === 0 || !item.parentCrudId){
					filtered.push(item);
				}
			});
		}
		return filtered;
	};
});

'use strict';

angular.module('items').factory('CreateItemService', ["Items", "$q", function(Items, $q) {
		return {

			createNewItem: function(appId, parentCrudId, itemName) {

				var asyncDeferred = $q.defer();
				
				if(!appId){
					var errorMessage = 'Cannot save. appId is missing';
					console.error(errorMessage);
					asyncDeferred.reject(errorMessage);
					return asyncDeferred.promise;
				}

				if(!itemName || itemName === ''){
					var errorMessage = 'Please enter a item name';
					console.error(errorMessage);
					asyncDeferred.reject(errorMessage);
					return asyncDeferred.promise;
				}

				// Create new Item object
				var item = new Items ({
						parentId: appId,
						name: itemName,
						parentCrudId: parentCrudId
				});

				item.$save(function(response) {
					asyncDeferred.resolve(response);
				}, function(errorResponse) {
					console.error(errorResponse.data.message);
					asyncDeferred.reject(errorResponse.data.message);
				});

				return asyncDeferred.promise;
			}
		};
	}]
);






'use strict';

//Manages the list of items for a given item
angular.module('items').factory('ItemItems', ['ItemItemsPersist',
	function(ItemItemsPersist) {
		var indexIncrement = 10000;
		return {
			positionIndex: 0,

			list: [],

			/*
			* Important to call this on page load 
			*/
			initialize: function(existingList){
				this.list = [];
			
					existingList.forEach(function(persistedItem){
						this.add(persistedItem.type, persistedItem.id, persistedItem.positionIndex, persistedItem.label, persistedItem.options);
					}.bind(this));
				
				return this.getList();
			},

			getPositionIndexForNewlyInsertedItem: function(index){
				var nextElementPositionIndex, previousElementPositionIndex;
				if(this.list.length > index+1){
					nextElementPositionIndex = parseInt(this.list[index+1].positionIndex);
				}

				if(index > 0){
					previousElementPositionIndex = parseInt(this.list[index -1].positionIndex);
				} else {
					previousElementPositionIndex = 0;
				}

				if(nextElementPositionIndex) {
					return previousElementPositionIndex + parseInt((nextElementPositionIndex - previousElementPositionIndex)/2);
				} else {
					return previousElementPositionIndex + indexIncrement;
				}

			},

			add: function(itemType, entityId, itemPositionIndex, itemLabel, itemOptions, replaceObj, replaceAtIndex){

				this.positionIndex = itemPositionIndex;
				var entry = {
					id: entityId,
					type: itemType,
					editingLabel: false,
					positionIndex: itemPositionIndex,
					label: itemLabel || '',
					addingOption: '',
					newOptionText: '',
					options: itemOptions || [],

					getDisplayLabel: function(){
						if(this.doesLabelExist()){
							return this.label;
						} else {
							return 'Click to give a name';
						}
					},
					labelStatusClass: function(){
						if(this.doesLabelExist()){
							return 'label-exists';
						} else {
							return 'add-a-label';
						}
					},
					doesLabelExist: function(){
						return this.label && this.label.length > 0;
					},
					changeToEditLabelMode: function(){
						this.editingLabel = true;
					},
					saveItemLabel: function(){
						var entity = ItemItemsPersist.updateLabel(this.id, this.label, this.type, function(success, err){
							if(success){
								this.editingLabel = false;
							} else {
								console.error(err);
							}
						}.bind(this));						
					},
					savePositionIndex: function(){
						var entity = ItemItemsPersist.updatePositionIndex(this.id, this.positionIndex, this.type, function(success, err){
							if(success){
								console.log('position index successfully updated');
							} else {
								console.error(err);
							}
						}.bind(this));						
					},

					getOptionDisplayLabel: function(){
						switch(this.type){
							case 'radioButtons':
								if(this.options && this.options.length > 0){
									return 'Click to add more options';
								}
								return 'Click to add an option to choose';								
							case 'dropDown':
								if(this.options && this.options.length > 0){
									return 'Click to add more values to this dropdown';
								}
								return 'Click to add a selection value to this dropdown';
							default:
								throw 'Invalid object type';
						}						
					},
					optionAdditionStatusClass: function(){
						if(this.options && this.options.length > 0){
							return 'label-exists';
						} else {
							return 'add-a-label';
						}
					},
					changeToAddOptionMode: function(){
						this.newOptionText = '';
						this.addingOption = true;
					},
					addOption: function(){
						var entity = ItemItemsPersist.addOption(this.id, this.newOptionText, this.type, function(newOption, err){
							if(newOption){
								if(!this.options){
									this.options = [];
								}
								this.options.push({text: newOption.text, value: newOption.value, id: newOption._id});
								this.addingOption = false;
								this.newOptionText ='';
							} else {
								console.error(err);
							}
						}.bind(this));						
					}
				};
				if(replaceObj){
					this.list[replaceAtIndex] = entry;
				} else {
					this.list.push(entry);
				}
				return this.positionIndex;
			},

			removeAt: function(index){
				this.list.splice(index, 1);
			},

			getList: function(){
				return this.list;
			},

			getNewPropertyName: function(){
				var maxCtr = 0;
				this.list.forEach(function(item){
					if(item.label){
						var label = item.label.toLowerCase();
						if(label.indexOf('property') === 0 && label.length > 8){
							var rest = label.substring(8);
							rest = rest.replace(/\D/g, '');
							if(rest.length > 0){
								var val = Number(rest);
								if(val && val > maxCtr){
									maxCtr = val;
								}
							}
						}
					}
				});
				var ctr = maxCtr+1;
				return 'Property' + ctr;
			}
		};	
	}
]);
'use strict';

//Gets the list of parent items for a given item
angular.module('items').factory('ItemParents', ['Items', 'Authentication',
	function(Items, Authentication) {
		return {

			getParents: function(item, callback){
				function idExists(id){
					return id && id !== '0';
				}

				function errorFn(err){
					var message;
					if(err.data && err.data.message){
						message = err.data.message;
					} else {
						message = err;
					}
					callback(null, err);
				}

				function getParentsRecursive(parentCrudId, insertAtTopOfThisArray, callback){
					
					if(!idExists(parentCrudId)){
						callback(null, 'parentCrudId missing');
						return;
					}
					if(!insertAtTopOfThisArray || !Array.isArray(insertAtTopOfThisArray))
					{
						callback(null, 'Pass an array to insert values to as the second parameter');
						return;
					}

					Items.get({
						itemId: parentCrudId
					}).$promise.then(function(parentItem){
						var newParent = {
							id: parentItem._id,
							name: parentItem.name,
							positionIndex: parentItem.positionIndex
						};
						insertAtTopOfThisArray.splice(0,0, newParent);
						if(idExists(parentItem.parentCrudId)){
							getParentsRecursive(parentItem.parentCrudId, insertAtTopOfThisArray, callback);
						} else {
							callback(insertAtTopOfThisArray);
						}
					}, errorFn);				
				}

				var parents = [];
				if(!idExists(item.parentCrudId)){
					callback(parents);//return an empty list
					return;
				}

				getParentsRecursive(item.parentCrudId, parents, callback);
			}
		};	
	}
]);
'use strict';

angular.module('items').factory('SelectItemOrProperty', ['$q', '$uibModal',
	function($q, $uibModal) {
		return {

			getForeignKeyControlProperties: function(referenceType, selectForItemId){
				var asyncDeferred = $q.defer();
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'shared/public/modules/shared-item/views/wrapper-selectitem.client.view.html',
					controller: function($scope, $uibModalInstance){
						$scope.$uibModalInstance = $uibModalInstance;
						$scope.selectForItemId = selectForItemId;
					},
					size: 'lg'
			    });

			    modalInstance.result.then(function (selected) {

			    	if(referenceType === 'lookupfromprop'){
			    		this.processSingleProperty(selected, asyncDeferred);
			    	} else {
			    		this.processMultipleProperties(selected, asyncDeferred);
			    	}

				}.bind(this), function () {
					asyncDeferred.reject('choose item dialog dismissed');
				});
			    return asyncDeferred.promise;
			},

			processSingleProperty: function(selected, asyncDeferred){
				this.getSingleProperty(selected.item)
					.then(function(property){
						
						var result = {
							referencedFeatureName: selected.item.name,
							referencedPropertyName: property.name,
							refId: property._id,
							refDescription: selected.description + '/' + property.name,
							selectorControlType: 'vktypeahead',
							selectorControlAttribute:'attributes_placeholder'
						};			      	
						asyncDeferred.resolve(result);
					},function (error) {
						asyncDeferred.reject(error);
					});
			},

			getSingleProperty: function(item){
				var asyncDeferred = $q.defer();
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'shared/public/modules/shared-item/views/wrapper-selectsingleproperty.client.view.html',
					controller: function($scope, $uibModalInstance){
						$scope.$uibModalInstance = $uibModalInstance;
						$scope.item = item;
					},
					size: 'lg'
			    });

			    modalInstance.result.then(function (selected) {
			      asyncDeferred.resolve(selected);
			    }, function () {
			      asyncDeferred.reject('choose single property dialog dismissed');
			    });

			    return asyncDeferred.promise;
			},

			processMultipleProperties: function(selected, asyncDeferred){
				this.getMultipleProperties(selected.item)
					.then(function(properties){
						
						var result = {
							referencedFeatureName: selected.item.name,
							selectorControlType: 'vktypeahead',
							selectorControlAttribute:'attributes_placeholder',
							referencedFeatureId: selected.item._id,
							propertyNamesForDisplay: properties,
							propertyNamesForSearch: properties,
							referenceDescription: selected.description,
							referenceDisplayFormat: 'display_format_placeholder',
						};			      	
						asyncDeferred.resolve(result);
					},function (error) {
						asyncDeferred.reject(error);
					});
			},

			getMultipleProperties: function(item){
				var asyncDeferred = $q.defer();
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'shared/public/modules/shared-item/views/wrapper-selectmultipleproperties.client.view.html',
					controller: function($scope, $uibModalInstance){
						$scope.$uibModalInstance = $uibModalInstance;
						$scope.item = item;
					},
					size: 'lg'
			    });

			    modalInstance.result.then(function (selected) {
			      asyncDeferred.resolve(selected);
			    }, function () {
			      asyncDeferred.reject('choose multiple properties dialog dismissed');
			    });

			    return asyncDeferred.promise;
			}
		}
	}
]);
'use strict';

// Configuring the new module
angular.module('itemspreadsheet').run(['Menus',
	function(Menus) {
		// Add as a sub menu item to items top bar menu items
		Menus.addSubMenuItem('topbar', 'item', 'Itemspreadsheets', 'itemspreadsheet');
	}
]);

'use strict';

//Setting up route
angular.module('itemspreadsheet').config(['$stateProvider',
	function($stateProvider) {
		// Itemspreadsheets state routing
		$stateProvider.
		state('listItemspreadsheet', {
			url: '/itemspreadsheet',
			templateUrl: 'modules/itemspreadsheet/views/list-itemspreadsheet.client.view.html'
		}).
		state('createItemspreadsheet', {
			url: '/itemspreadsheet/create',
			templateUrl: 'modules/itemspreadsheet/views/create-itemspreadsheet.client.view.html'
		}).
		state('viewItemspreadsheet', {
			url: '/itemspreadsheet/:itemspreadsheetId',
			templateUrl: 'modules/itemspreadsheet/views/view-itemspreadsheet.client.view.html'
		}).
		state('editItemspreadsheet', {
			url: '/itemspreadsheet/:itemspreadsheetId/edit',
			templateUrl: 'modules/itemspreadsheet/views/edit-itemspreadsheet.client.view.html'
		});
	}
]);
'use strict';

// Itemspreadsheets controller
angular.module('itemspreadsheet').controller('ItemspreadsheetController', ['$scope', '$stateParams', '$location', 'Authentication', 'Itemspreadsheet',
	function($scope, $stateParams, $location, Authentication, Itemspreadsheet) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		$scope.onSuccessfulUploadInCreateMode = function(propertyName, fileName, fileKey) {
			$scope[propertyName] = fileName;
			$scope[propertyName + "_fileKey"] = fileKey;
		};

		$scope.onSuccessfulUploadInEditMode = function(propertyName, fileName, fileKey) {
			$scope.itemspreadsheet[propertyName] = fileName;
			$scope.itemspreadsheet[propertyName + "_fileKey"] = fileKey;
		};

		// Create new Itemspreadsheet
		$scope.create = function() {
			// Create new Itemspreadsheet object
			var itemspreadsheet = new Itemspreadsheet ({
					
				
					fileName: this.fileName,	
				
					fileKey: this.fileKey,	
				
					parentId: this.parentId,	
				
					status: this.status,	
				
					updated: this.updated,	
				
			});

			// Redirect after save
			itemspreadsheet.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/itemspreadsheet/' + response._id);

				// Clear form fields
				
				$scope.fileName = '';
				
				$scope.fileKey = '';
				
				$scope.parentId = '';
				
				$scope.status = '';
				
				$scope.updated = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Itemspreadsheet
		$scope.remove = function(itemspreadsheet) {
			if ( itemspreadsheet ) { 
				itemspreadsheet.$remove();

				for (var i in $scope.itemspreadsheet) {
					if ($scope.itemspreadsheet [i] === itemspreadsheet) {
						$scope.itemspreadsheet.splice(i, 1);
					}
				}
			} else {
				$scope.itemspreadsheet.$remove(function() {
					$location.path($scope.parentRouteUrl + '/itemspreadsheet');
				});
			}
		};

		// Update existing Itemspreadsheet
		$scope.update = function() {
			var itemspreadsheet = $scope.itemspreadsheet;

			itemspreadsheet.$update(function() {
				$location.path($scope.parentRouteUrl + '/itemspreadsheet/' + itemspreadsheet._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Itemspreadsheets
		$scope.find = function() {
			$scope.itemspreadsheet = Itemspreadsheet.query();
		};

		// Find existing Itemspreadsheet
		$scope.findOne = function() {
			$scope.itemspreadsheet = Itemspreadsheet.get({ 
				itemspreadsheetId: $stateParams.itemspreadsheetId
			});
		};
	}
]);
'use strict';

//Itemspreadsheets service used to communicate Itemspreadsheets REST endpoints
angular.module('itemspreadsheet').factory('Itemspreadsheet', ['$resource',
	function($resource) {
		return $resource('itemspreadsheet/:itemspreadsheetId', 
		{ 
			itemspreadsheetId: '@_id'
		}, 
		{
			search: {
				url: '/itemspreadsheet/search/',
				method: 'GET',
				isArray: true
			},
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('property').config(['$stateProvider',
	function($stateProvider) {
		// Properties state routing
		$stateProvider.
		state('listProperty', {
			url: '/apps/:appId/item-property/:itemId',
			templateUrl: 'builder/public/modules/property/views/list-property.client.view.html'
		}).
		state('createProperty', {
			url: '/apps/:appId/items/:itemId/property/create',
			templateUrl: 'builder/public/modules/property/views/create-property.client.view.html'
		}).
		state('viewProperty', {
			url: '/apps/:appId/items/:itemId/property/:propertyId',
			templateUrl: 'builder/public/modules/property/views/view-property.client.view.html'
		}).
		state('editProperty', {
			url: '/apps/:appId/items/:itemId/property/:propertyId/edit',
			templateUrl: 'builder/public/modules/property/views/edit-property.client.view.html'
		});
	}
]);
'use strict';

// Properties controller
angular.module('property').controller('ListPropertyController', ['$scope', '$stateParams', '$location', 'Authentication', 'Property', 
		'UpdatePropertyPositions', 'SelectItemOrProperty', 'GetRadioOrSelectOptions',
	function($scope, $stateParams, $location, Authentication, Property, UpdatePropertyPositions, SelectItemOrProperty, GetRadioOrSelectOptions) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		// Remove existing Property
		$scope.remove = function(property) {
			if ( property ) { 
				property.$remove();

				for (var i in $scope.property) {
					if ($scope.property [i] === property) {
						$scope.property.splice(i, 1);
					}
				}
			} else {
				$scope.property.$remove(function() {
					$location.path($scope.parentRouteUrl + '/property');
				});
			}
		};

		$scope.setForeignKeyRef = function(property){
			SelectItemOrProperty.getForeignKeyControlProperties(property.type, $stateParams.itemId).then(function(result){

				if(!result.referencedFeatureName){
					alert('Cannot save. Required attribute referencedFeatureName missing');
					return;
				}

				if(result.referencedFeatureName === $scope.item.name){
					var err = 'Error: You cannot reference a item property to the same item';
					alert(err);
					return;
				}

				if(property.type === "foreignkeyref"){
					if(!result.propertyNamesForDisplay){
						alert('Cannot save. Required attribute propertyNamesForDisplay missing');
						return;
					}
				}
				
				if(property.type === "lookupfromprop"){
					if(!result.referencedPropertyName){
						alert('Cannot save. Required attribute referencedPropertyName missing');
						return;
					}
				}
				
				angular.extend(property, result);
				$scope.updateProperty(property);
								
			})
			.catch(function(error){
				console.error(error);
			});
		};

		$scope.getradioorselectoptions = function(property){
			GetRadioOrSelectOptions.getRadioOrSelectOptions(property).then(function(result){
				
			})
			.catch(function(error){
				if(error) {
					console.error(error);
				}
			});
		};

		// Update existing Property
		$scope.updateProperty = function(modifiedProperty) {
			modifiedProperty.$update(function() {
				console.log('property updated', modifiedProperty)
			}, function(errorResponse) {
				console.error('Error occured while trying to save property', errorResponse);
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Properties
		$scope.find = function() {
			$scope.property = Property.query({parentId: $stateParams.itemId});
		};

		// Find existing Property
		$scope.findOne = function() {
			$scope.property = Property.get({ 
				propertyId: $stateParams.propertyId,
				parentId: $stateParams.itemId
			});
		};

		$scope.dragControlListeners = {
		    orderChanged: function(eventObj) {
		    	var childPropertyPositions = $scope.property.map(function(item){ return item._id;});
		    	var updatePropertyPositions = new UpdatePropertyPositions({itemId: $stateParams.itemId, childPropertyPositions: childPropertyPositions});
				
		    	updatePropertyPositions.$save(function(response) {
					console.log('New positions saved');			
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
		    }

		};
	}
]);
'use strict';

// Properties controller
angular.module('property').controller('PropertyController', ['$scope', '$stateParams', '$location', 'Authentication', 'Property', 'UpdatePropertyPositions', 'SelectItemOrProperty',
	function($scope, $stateParams, $location, Authentication, Property, UpdatePropertyPositions, SelectItemOrProperty) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		// Create new Property
		$scope.create = function() {
			// Create new Property object
			var property = new Property ({
					
				
					referenceDisplayFormat: this.referenceDisplayFormat,
				
					col: this.col,
				
					selectorControlType: this.selectorControlType,
				
					parentId: this.parentId,
				
					row: this.row,
				
					option: this.option,
				
					refDescription: this.refDescription,
				
					referencedPropertyName: this.referencedPropertyName,
				
					selectorControlAttribute: this.selectorControlAttribute,
				
					type: this.type,
				
					name: this.name,
				
					value: this.value,
				
					referencedFeatureId: this.referencedFeatureId,
				
					referencedFeatureName: this.referencedFeatureName,
				
					propertyNamesForDisplay: this.propertyNamesForDisplay,
				
					referenceDescription: this.referenceDescription,
				
			});

			// Redirect after save
			property.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/property/' + response._id);

				// Clear form fields
				
				$scope.referenceDisplayFormat = '';
				
				$scope.col = '';
				
				$scope.selectorControlType = '';
				
				$scope.parentId = '';
				
				$scope.row = '';
				
				$scope.option = '';
				
				$scope.refDescription = '';
				
				$scope.referencedPropertyName = '';
				
				$scope.selectorControlAttribute = '';
				
				$scope.type = '';
				
				$scope.name = '';
				
				$scope.value = '';
				
				$scope.referencedFeatureId = '';
				
				$scope.referencedFeatureName = '';
				
				$scope.propertyNamesForDisplay = '';
				
				$scope.referenceDescription = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Property
		$scope.remove = function(property) {
			if ( property ) { 
				property.$remove();

				for (var i in $scope.property) {
					if ($scope.property [i] === property) {
						$scope.property.splice(i, 1);
					}
				}
			} else {
				$scope.property.$remove(function() {
					$location.path($scope.parentRouteUrl + '/property');
				});
			}
		};

		// Update existing Property
		$scope.update = function() {
			var property = $scope.property;

			property.$update(function() {
				$location.path($scope.parentRouteUrl + '/property/' + property._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.setForeignKeyRef = function(property){
			SelectItemOrProperty.getForeignKeyControlProperties(property.type, $stateParams.itemId).then(function(result) {
				
			})
			.catch(function(error){
				if(error) {
					console.error(error);
				}
			});
		};

		// Update existing Property
		$scope.updateProperty = function(modifiedProperty) {
			modifiedProperty.$update(function() {
				console.log('property updated', modifiedProperty);
			}, function(errorResponse) {
				cconsole.error('Error occured while trying to save property', errorResponse);
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Properties
		$scope.find = function() {
			$scope.property = Property.query({parentId: $stateParams.itemId});
		};

		// Find existing Property
		$scope.findOne = function() {
			$scope.property = Property.get({ 
				propertyId: $stateParams.propertyId,
				parentId: $stateParams.itemId
			});
		};

		$scope.dragControlListeners = {
		    orderChanged: function(eventObj) {
		    	var childPropertyPositions = $scope.property.map(function(item){ return item._id;});
		    	var updatePropertyPositions = new UpdatePropertyPositions({itemId: $stateParams.itemId, childPropertyPositions: childPropertyPositions});
				
		    	updatePropertyPositions.$save(function(response) {
					console.log('New positions saved');			
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
		    }

		};
	}
]);
angular.module('property').directive('builderAddPropertiesBox', function(){

	return {
		restrict: 'E',
		scope: {
			onAdd: '&'
		},
		templateUrl: 'builder/public/modules/property/views/builder-add-properties-box.directive.client.view.html',
		controller: ["$scope", "AddMultipleProperties", "$stateParams", function($scope, AddMultipleProperties, $stateParams){
			$scope.toggleAddPropertiesExpander = function(){
				$scope.expand = !$scope.expand;
				$scope.propertyNames = null;
				$scope.error = null;
			};

			$scope.addMultipleProperties = function(){
				$scope.error = null;
				var properties = new AddMultipleProperties({parentId: $stateParams.itemId, propertyNames: $scope.propertyNames});
				
				properties.$save(function(response) {
					$scope.toggleAddPropertiesExpander();
					if($scope.onAdd){
						$scope.onAdd();
					}					
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		}]
	}
});
'use strict';

//Properties service used to communicate Add Multiple Properties REST endpoints
angular.module('property').factory('AddMultipleProperties', ['$resource',
	function($resource) {
		return $resource('property/add-multiple-properties');
	}
]);
'use strict';

angular.module('items').factory('GetRadioOrSelectOptions', ["$q", "$uibModal", function($q, $uibModal) {
		return {

			getRadioOrSelectOptions: function(property) {
				var asyncDeferred = $q.defer();

				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'builder/public/modules/property/views/getradioorselectoptions.popup.directive.view.html',
					controller: function($scope, $uibModalInstance){
			            $scope.addOptionsError = '';
			            $scope.options = property.option && property.option.length? property.option.split(',') : [];
			            
			            $scope.addOptions = function() {
			            	$scope.addOptionsError = null;

			            	if(!$scope.newOptions) {
			            		return;
			            	}
			            	
			            	//put in an array
			            	var newValues = $scope.newOptions.split(',');

			            	//remove spaces
			            	var newValues = newValues.map(function(item){ return item.trim();});
			            	
			            	//remove blank entries
			            	newValues = newValues.filter(function(val) {return val;});

			            	//check for the uniqueness of new values
			            	var lowerCaseExistingValues = $scope.options.map(function(item){ return item.trim().toLowerCase();});
			            	var lowerCaseNewValues = newValues.map(function(item){ return item.toLowerCase();});

			            	for(var ctr = 0; ctr < newValues.length; ctr++) {
			            		var newValue = newValues[ctr].toLowerCase();
			            		if(lowerCaseExistingValues.indexOf(newValue) >= 0){
			            			$scope.addOptionsError = newValues[ctr] + ' already exists';
			            			return;
			            		}
			            		if(lowerCaseNewValues.indexOf(newValue) !== ctr && lowerCaseNewValues.indexOf(newValue) >= 0) {
			            			$scope.addOptionsError = newValues[ctr] + ' is a duplicate';
			            			return;
			            		}
			            	}

			            	//save
			            	var newOptions = $scope.options.concat(newValues);
			            	property.option = newOptions.join(',');

							property.$update(function() {
								console.log('Property updated', property);
								//update display
			            		$scope.options = newOptions;
			            		$scope.newOptions = null;
							}, function(errorResponse) {
								console.error('Error occured while trying to save property', errorResponse);
								$scope.addOptionsError = errorResponse.data.message;
							});
			            };

			            $scope.remove = function(option){
			            	var newOptions = $scope.options.filter(function(item){ return item !== option;});
			            	property.option = newOptions.join(',');
			            	property.$update(function() {
			            		$scope.options = newOptions;
								console.log('Option deleted for property ', property);
							}, function(errorResponse) {
								console.error('Error occured while trying to save property', errorResponse);
							});
			            };

			            $scope.close = function () {
			                $uibModalInstance.dismiss();
			            };
					},
					size: 'md'
			    });

			    modalInstance.result.then(function (selected) {

				}, function () {
					asyncDeferred.reject();
				});

			    return asyncDeferred.promise;
			}
	}
}]);
'use strict';

//Properties service used to communicate Properties REST endpoints
angular.module('property').factory('Property', ['$resource',
	function($resource) {
		return $resource('property/:propertyId', 
		{ 
			propertyId: '@_id',
			parentId: '@parentId'
		}, 
		{
			search: {
				url: '/property/search/',
				method: 'GET',
				isArray: true
			},
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

angular.module('property').factory('UpdatePropertyPositions', ['$resource',
	function($resource) {
		return $resource('property/update-property-positions');
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'builder/public/modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'builder/public/modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'builder/public/modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'builder/public/modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'builder/public/modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'builder/public/modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'builder/public/modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'builder/public/modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'builder/public/modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('bsg-ui-grid-components');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('chart-components');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('dashboard-components');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('dashboard');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('itemroles');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('lookupfromproperty');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('roles');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('selectforeignkeyref');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('shared-components');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('shared-item');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('shared-user');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('sharedsecurity');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('user-group-roles');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('user-group-users');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('user-groups');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('visualizations');
'use strict';

angular.module('bsg-ui-grid-components')

	.directive('bsgItemListGridView', function(){

		return {
			restrict: 'E',
			scope: {
				columns: '=',
				sourceItem: '@',
				handleToGrid: '='
			},
			templateUrl: 'shared/public/modules/bsg-ui-grid-components/views/bsg-item-list-grid-view.directive.view.html',
			controller: ["$scope", "$http", "CoreFunctions", function($scope, $http, CoreFunctions){
				$scope.gridOptions = {
					enableSorting: true,
					columnDefs: $scope.columns,
					enableGridMenu: true,
					exporterCsvFilename: $scope.sourceItem + '.csv',
					onRegisterApi: function(gridApi) {
      					$scope.gridApi = gridApi;
      				}
				};
		        
		        $http.get('/' + $scope.sourceItem).then(function(response) {
		        	if(response && response.data && response.data.length) {
						$scope.gridOptions.data = response.data;
					}

			    }, function(error){
			    	console.error('UI Grid data could not be retrieved', error);
			    	 $scope.gridOptions.data = [];
			    });

			    $scope.handleToGrid.updateLayout = function(){
			    	$scope.gridApi.core.handleWindowResize();
			    }
	    	}]
		};
	});

'use strict';

angular.module('bsg-ui-grid-components')

	.directive('bsgUiGrid', function(){

		return {
			restrict: 'E',
			scope: {
				settings: '=',
				widgetHandleToChild: '='
			},
			templateUrl: 'shared/public/modules/bsg-ui-grid-components/views/bsg-ui-grid.directive.view.html',
			controller: ["$scope", "$http", "CoreFunctions", function($scope, $http, CoreFunctions){
				if(!$scope.settings || !$scope.settings.referencedFeatureName || !$scope.settings.propertyNames){
					console.error('UI Grid cannot be configured. Invalid settings', $scope.settings);
					return;
				}

			    var properties = $scope.settings.propertyNames.split(',');
			    var gridColumns = properties.map(function(item){ return {field: CoreFunctions.getPropertyColumnName(item), displayName: item};});
				$scope.columns = gridColumns;
				$scope.gridOptions = {
					enableSorting: true,
					columnDefs: $scope.columns,
					//rowHeight : "uiGridAutoResize", do not enable: this guy resets the grid display to 5 rows after more than 20 rows are inserted. 
					enableGridMenu: true,
					exporterCsvFilename: $scope.settings.referencedFeatureName + '.csv',
					//plugins: [new ngGridFlexibleHeightPlugin()], //Doesn't seem to make any difference. Grid still loaded with default height
					onRegisterApi: function(gridApi) {
      					$scope.gridApi = gridApi;
      				}
				};
		        
		        $http.get($scope.settings.referencedFeatureName).then(function(response) {
		        	if(response && response.data && response.data.length) {
						$scope.gridOptions.data = response.data;
					}

			    }, function(error){
			    	console.error('UI Grid data could not be retrieved', error);
			    	 $scope.gridOptions.data = [];
			    });

			    $scope.widgetHandleToChild.updateLayout = function(){
			    	$scope.gridApi.core.handleWindowResize();
			    }
	    	}]
		};
	});

function ngGridFlexibleHeightPlugin (opts) {
    var self = this;
    self.grid = null;
    self.scope = null;
    self.init = function (scope, grid, services) {
        self.domUtilityService = services.DomUtilityService;
        self.grid = grid;
        self.scope = scope;
        var recalcHeightForData = function () { setTimeout(innerRecalcForData, 1); };
        var innerRecalcForData = function () {
            var gridId = self.grid.gridId;
            var footerPanelSel = '.' + gridId + ' .ngFooterPanel';
            var extraHeight = self.grid.$topPanel.height() + $(footerPanelSel).height();
            var naturalHeight = self.grid.$canvas.height() + 1;
            if (opts != null) {
                if (opts.minHeight != null && (naturalHeight + extraHeight) < opts.minHeight) {
                    naturalHeight = opts.minHeight - extraHeight - 2;
                }
                if (opts.maxHeight != null && (naturalHeight + extraHeight) > opts.maxHeight) {
                    naturalHeight = opts.maxHeight;
                }
            }

            var newViewportHeight = naturalHeight + 3;
            if (!self.scope.baseViewportHeight || self.scope.baseViewportHeight !== newViewportHeight) {
                self.grid.$viewport.css('height', newViewportHeight + 'px');
                self.grid.$root.css('height', (newViewportHeight + extraHeight) + 'px');
                self.scope.baseViewportHeight = newViewportHeight;
                self.domUtilityService.RebuildGrid(self.scope, self.grid);
            }
        };
        self.scope.catHashKeys = function () {
            var hash = '',
                idx;
            for (idx in self.scope.renderedRows) {
                hash += self.scope.renderedRows[idx].$$hashKey;
            }
            return hash;
        };
        self.scope.$watch('catHashKeys()', innerRecalcForData);
        self.scope.$watch(self.grid.config.data, recalcHeightForData);
    };
}
(function() {
  'use strict';
  /**
   *  @ngdoc overview
   *  @name ui.grid.autoResize
   *  https://github.com/angular-ui/ui-grid/blob/c61f680/src/features/auto-resize-grid/js/auto-resize.js (Code taken from Github on 11-Feb-2016)
   *  @description
   *
   *  #ui.grid.autoResize
   *
   *  <div class="alert alert-warning" role="alert"><strong>Beta</strong> This feature is ready for testing, but it either hasn't seen a lot of use or has some known bugs.</div>
   *
   *  This module provides auto-resizing functionality to UI-Grid.
   */
  var module = angular.module('ui.grid.autoResize', ['ui.grid']);


  module.directive('uiGridAutoResize', ['$timeout', 'gridUtil', function ($timeout, gridUtil) {
    return {
      require: 'uiGrid',
      scope: false,
      link: function ($scope, $elm, $attrs, uiGridCtrl) {
        var prevGridWidth, prevGridHeight;

        function getDimensions() {
          prevGridHeight = gridUtil.elementHeight($elm);
          prevGridWidth = gridUtil.elementWidth($elm);
        }

        // Initialize the dimensions
        getDimensions();

        var resizeTimeoutId;
        function startTimeout() {
          clearTimeout(resizeTimeoutId);

          resizeTimeoutId = setTimeout(function () {
            var newGridHeight = gridUtil.elementHeight($elm);
            var newGridWidth = gridUtil.elementWidth($elm);

            if (newGridHeight !== prevGridHeight || newGridWidth !== prevGridWidth) {
              uiGridCtrl.grid.gridHeight = newGridHeight;
              uiGridCtrl.grid.gridWidth = newGridWidth;

              $scope.$apply(function () {
                uiGridCtrl.grid.refresh()
                  .then(function () {
                    getDimensions();

                    startTimeout();
                  });
              });
            }
            else {
              startTimeout();
            }
          }, 250);
        }

        startTimeout();

        $scope.$on('$destroy', function() {
          clearTimeout(resizeTimeoutId);
        });
      }
    };
  }]);
})();
'use strict';

angular.module('chart-components')

    .controller('boxPlotChartCtrl', ["$scope", function($scope){
        $scope.options = {
            chart: {
                type: 'boxPlotChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 50
                },
                color:['darkblue', 'darkorange', 'green', 'darkred', 'darkviolet'],
                x: function(d){return d.label;},
                //y: function(d){return d.values.Q3;},
                maxBoxWidth: 55,
                yDomain: [0, 500]
            }
        };

        $scope.data = [
            {
                label: "Sample A",
                values: {
                    Q1: 180,
                    Q2: 200,
                    Q3: 250,
                    whisker_low: 115,
                    whisker_high: 400,
                    outliers: [50, 100, 425]
                }
            },
            {
                label: "Sample B",
                values: {
                    Q1: 300,
                    Q2: 350,
                    Q3: 400,
                    whisker_low: 225,
                    whisker_high: 425,
                    outliers: [175, 450, 480]
                }
            },
            {
                label: "Sample C",
                values: {
                    Q1: 100,
                    Q2: 200,
                    Q3: 300,
                    whisker_low: 25,
                    whisker_high: 400,
                    outliers: [450, 475]
                }
            },
            {
                label: "Sample D",
                values: {
                    Q1: 75,
                    Q2: 100,
                    Q3: 125,
                    whisker_low: 50,
                    whisker_high: 300,
                    outliers: [450]
                }
            },
            {
                label: "Sample E",
                values: {
                    Q1: 325,
                    Q2: 400,
                    Q3: 425,
                    whisker_low: 225,
                    whisker_high: 475,
                    outliers: [50, 100, 200]
                }
            }
        ];
    }])
'use strict';

angular.module('chart-components')

    .controller('bulletChartCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'bulletChart',
                duration: 500
            }
        };

        $scope.data = {
            "title": "Revenue",
            "subtitle": "US$, in thousands",
            "ranges": [150,225,300],
            "measures": [220],
            "markers": [250]
        }
    }])
'use strict';

angular.module('chart-components')

    .controller('candlestickBarChartCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'candlestickBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 60
                },
                x: function(d){ return d['date']; },
                y: function(d){ return d['close']; },
                duration: 100,

                xAxis: {
                    axisLabel: 'Dates',
                    tickFormat: function(d) {
                        return d3.time.format('%x')(new Date(new Date() - (20000 * 86400000) + (d * 86400000)));
                    },
                    showMaxMin: false
                },

                yAxis: {
                    axisLabel: 'Stock Price',
                    tickFormat: function(d){
                        return '$' + d3.format(',.1f')(d);
                    },
                    showMaxMin: false
                },
                zoom: {
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        $scope.data = [{values: [
            {"date": 15854, "open": 165.42, "high": 165.8, "low": 164.34, "close": 165.22, "volume": 160363400, "adjusted": 164.35},
            {"date": 15855, "open": 165.35, "high": 166.59, "low": 165.22, "close": 165.83, "volume": 107793800, "adjusted": 164.96},
            {"date": 15856, "open": 165.37, "high": 166.31, "low": 163.13, "close": 163.45, "volume": 176850100, "adjusted": 162.59},
            {"date": 15859, "open": 163.83, "high": 164.46, "low": 162.66, "close": 164.35, "volume": 168390700, "adjusted": 163.48},
            {"date": 15860, "open": 164.44, "high": 165.1, "low": 162.73, "close": 163.56, "volume": 157631500, "adjusted": 162.7},
            {"date": 15861, "open": 163.09, "high": 163.42, "low": 161.13, "close": 161.27, "volume": 211737800, "adjusted": 160.42},
            {"date": 15862, "open": 161.2, "high": 162.74, "low": 160.25, "close": 162.73, "volume": 200225500, "adjusted": 161.87},
            {"date": 15863, "open": 163.85, "high": 164.95, "low": 163.14, "close": 164.8, "volume": 188337800, "adjusted": 163.93},
            {"date": 15866, "open": 165.31, "high": 165.4, "low": 164.37, "close": 164.8, "volume": 105667100, "adjusted": 163.93},
            {"date": 15867, "open": 163.3, "high": 164.54, "low": 162.74, "close": 163.1, "volume": 159505400, "adjusted": 162.24},
            {"date": 15868, "open": 164.22, "high": 164.39, "low": 161.6, "close": 161.75, "volume": 177361500, "adjusted": 160.9},
            {"date": 15869, "open": 161.66, "high": 164.5, "low": 161.3, "close": 164.21, "volume": 163587800, "adjusted": 163.35},
            {"date": 15870, "open": 164.03, "high": 164.67, "low": 162.91, "close": 163.18, "volume": 141197500, "adjusted": 162.32},
            {"date": 15873, "open": 164.29, "high": 165.22, "low": 163.22, "close": 164.44, "volume": 136295600, "adjusted": 163.57},
            {"date": 15874, "open": 164.53, "high": 165.99, "low": 164.52, "close": 165.74, "volume": 114695600, "adjusted": 164.87},
            {"date": 15875, "open": 165.6, "high": 165.89, "low": 163.38, "close": 163.45, "volume": 206149500, "adjusted": 162.59},
            {"date": 15876, "open": 161.86, "high": 163.47, "low": 158.98, "close": 159.4, "volume": 321255900, "adjusted": 158.56},
            {"date": 15877, "open": 159.64, "high": 159.76, "low": 157.47, "close": 159.07, "volume": 271956800, "adjusted": 159.07},
            {"date": 15880, "open": 157.41, "high": 158.43, "low": 155.73, "close": 157.06, "volume": 222329000, "adjusted": 157.06},
            {"date": 15881, "open": 158.48, "high": 160.1, "low": 157.42, "close": 158.57, "volume": 162262200, "adjusted": 158.57},
            {"date": 15882, "open": 159.87, "high": 160.5, "low": 159.25, "close": 160.14, "volume": 134848000, "adjusted": 160.14},
            {"date": 15883, "open": 161.1, "high": 161.82, "low": 160.95, "close": 161.08, "volume": 129483700, "adjusted": 161.08},
            {"date": 15884, "open": 160.63, "high": 161.4, "low": 159.86, "close": 160.42, "volume": 160402900, "adjusted": 160.42},
            {"date": 15887, "open": 161.26, "high": 162.48, "low": 161.08, "close": 161.36, "volume": 131954800, "adjusted": 161.36},
            {"date": 15888, "open": 161.12, "high": 162.3, "low": 160.5, "close": 161.21, "volume": 154863700, "adjusted": 161.21},
            {"date": 15889, "open": 160.48, "high": 161.77, "low": 160.22, "close": 161.28, "volume": 75216400, "adjusted": 161.28},
            {"date": 15891, "open": 162.47, "high": 163.08, "low": 161.3, "close": 163.02, "volume": 122416900, "adjusted": 163.02},
            {"date": 15894, "open": 163.86, "high": 164.39, "low": 163.08, "close": 163.95, "volume": 108092500, "adjusted": 163.95},
            {"date": 15895, "open": 164.98, "high": 165.33, "low": 164.27, "close": 165.13, "volume": 119298000, "adjusted": 165.13},
            {"date": 15896, "open": 164.97, "high": 165.75, "low": 164.63, "close": 165.19, "volume": 121410100, "adjusted": 165.19},
            {"date": 15897, "open": 167.11, "high": 167.61, "low": 165.18, "close": 167.44, "volume": 135592200, "adjusted": 167.44},
            {"date": 15898, "open": 167.39, "high": 167.93, "low": 167.13, "close": 167.51, "volume": 104212700, "adjusted": 167.51},
            {"date": 15901, "open": 167.97, "high": 168.39, "low": 167.68, "close": 168.15, "volume": 69450600, "adjusted": 168.15},
            {"date": 15902, "open": 168.26, "high": 168.36, "low": 167.07, "close": 167.52, "volume": 88702100, "adjusted": 167.52},
            {"date": 15903, "open": 168.16, "high": 168.48, "low": 167.73, "close": 167.95, "volume": 92873900, "adjusted": 167.95},
            {"date": 15904, "open": 168.31, "high": 169.27, "low": 168.2, "close": 168.87, "volume": 103620100, "adjusted": 168.87},
            {"date": 15905, "open": 168.52, "high": 169.23, "low": 168.31, "close": 169.17, "volume": 103831700, "adjusted": 169.17},
            {"date": 15908, "open": 169.41, "high": 169.74, "low": 169.01, "close": 169.5, "volume": 79428600, "adjusted": 169.5},
            {"date": 15909, "open": 169.8, "high": 169.83, "low": 169.05, "close": 169.14, "volume": 80829700, "adjusted": 169.14},
            {"date": 15910, "open": 169.79, "high": 169.86, "low": 168.18, "close": 168.52, "volume": 112914000, "adjusted": 168.52},
            {"date": 15911, "open": 168.22, "high": 169.08, "low": 167.94, "close": 168.93, "volume": 111088600, "adjusted": 168.93},
            {"date": 15912, "open": 168.22, "high": 169.16, "low": 167.52, "close": 169.11, "volume": 107814600, "adjusted": 169.11},
            {"date": 15915, "open": 168.68, "high": 169.06, "low": 168.11, "close": 168.59, "volume": 79695000, "adjusted": 168.59},
            {"date": 15916, "open": 169.1, "high": 169.28, "low": 168.19, "close": 168.59, "volume": 85209600, "adjusted": 168.59},
            {"date": 15917, "open": 168.94, "high": 169.85, "low": 168.49, "close": 168.71, "volume": 142388700, "adjusted": 168.71},
            {"date": 15918, "open": 169.99, "high": 170.81, "low": 169.9, "close": 170.66, "volume": 110438400, "adjusted": 170.66},
            {"date": 15919, "open": 170.28, "high": 170.97, "low": 170.05, "close": 170.95, "volume": 91116700, "adjusted": 170.95},
            {"date": 15922, "open": 170.57, "high": 170.96, "low": 170.35, "close": 170.7, "volume": 54072700, "adjusted": 170.7},
            {"date": 15923, "open": 170.37, "high": 170.74, "low": 169.35, "close": 169.73, "volume": 87495000, "adjusted": 169.73},
            {"date": 15924, "open": 169.19, "high": 169.43, "low": 168.55, "close": 169.18, "volume": 84854700, "adjusted": 169.18},
            {"date": 15925, "open": 169.98, "high": 170.18, "low": 168.93, "close": 169.8, "volume": 102181300, "adjusted": 169.8},
            {"date": 15926, "open": 169.58, "high": 170.1, "low": 168.72, "close": 169.31, "volume": 91757700, "adjusted": 169.31},
            {"date": 15929, "open": 168.46, "high": 169.31, "low": 168.38, "close": 169.11, "volume": 68593300, "adjusted": 169.11},
            {"date": 15930, "open": 169.41, "high": 169.9, "low": 168.41, "close": 169.61, "volume": 80806000, "adjusted": 169.61},
            {"date": 15931, "open": 169.53, "high": 169.8, "low": 168.7, "close": 168.74, "volume": 79829200, "adjusted": 168.74},
            {"date": 15932, "open": 167.41, "high": 167.43, "low": 166.09, "close": 166.38, "volume": 152931800, "adjusted": 166.38},
            {"date": 15933, "open": 166.06, "high": 166.63, "low": 165.5, "close": 165.83, "volume": 130868200, "adjusted": 165.83},
            {"date": 15936, "open": 165.64, "high": 166.21, "low": 164.76, "close": 164.77, "volume": 96437600, "adjusted": 164.77},
            {"date": 15937, "open": 165.04, "high": 166.2, "low": 164.86, "close": 165.58, "volume": 89294400, "adjusted": 165.58},
            {"date": 15938, "open": 165.12, "high": 166.03, "low": 164.19, "close": 164.56, "volume": 159530500, "adjusted": 164.56},
            {"date": 15939, "open": 164.9, "high": 166.3, "low": 164.89, "close": 166.06, "volume": 101471400, "adjusted": 166.06},
            {"date": 15940, "open": 166.55, "high": 166.83, "low": 165.77, "close": 166.62, "volume": 90888900, "adjusted": 166.62},
            {"date": 15943, "open": 166.79, "high": 167.3, "low": 165.89, "close": 166, "volume": 89702100, "adjusted": 166},
            {"date": 15944, "open": 164.36, "high": 166, "low": 163.21, "close": 163.33, "volume": 158619400, "adjusted": 163.33},
            {"date": 15945, "open": 163.26, "high": 164.49, "low": 163.05, "close": 163.91, "volume": 108113000, "adjusted": 163.91},
            {"date": 15946, "open": 163.55, "high": 165.04, "low": 163.4, "close": 164.17, "volume": 119200500, "adjusted": 164.17},
            {"date": 15947, "open": 164.51, "high": 164.53, "low": 163.17, "close": 163.65, "volume": 134560800, "adjusted": 163.65},
            {"date": 15951, "open": 165.23, "high": 165.58, "low": 163.7, "close": 164.39, "volume": 142322300, "adjusted": 164.39},
            {"date": 15952, "open": 164.43, "high": 166.03, "low": 164.13, "close": 165.75, "volume": 97304000, "adjusted": 165.75},
            {"date": 15953, "open": 165.85, "high": 166.4, "low": 165.73, "close": 165.96, "volume": 62930500, "adjusted": 165.96}
        ]}];
    }])

'use strict';

angular.module('chart-components')

    .controller('cumulativeLineChartCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'cumulativeLineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 65
                },
                x: function(d){ return d[0]; },
                y: function(d){ return d[1]/100; },
                average: function(d) { return d.mean/100; },

                color: d3.scale.category10().range(),
                duration: 300,
                useInteractiveGuideline: true,
                clipVoronoi: false,

                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        return d3.time.format('%m/%d/%y')(new Date(d))
                    },
                    showMaxMin: false,
                    staggerLabels: true
                },

                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d){
                        return d3.format(',.1%')(d);
                    },
                    axisLabelDistance: 0
                }
            }
        };

        $scope.data = [
            {
                key: "Long",
                values: [ [ 1083297600000 , -2.974623048543] , [ 1085976000000 , -1.7740300785979] , [ 1088568000000 , 4.4681318138177] , [ 1091246400000 , 7.0242541001353] , [ 1093924800000 , 7.5709603667586] , [ 1096516800000 , 20.612245065736] , [ 1099195200000 , 21.698065237316] , [ 1101790800000 , 40.501189458018] , [ 1104469200000 , 50.464679413194] , [ 1107147600000 , 48.917421973355] , [ 1109566800000 , 63.750936549160] , [ 1112245200000 , 59.072499126460] , [ 1114833600000 , 43.373158880492] , [ 1117512000000 , 54.490918947556] , [ 1120104000000 , 56.661178852079] , [ 1122782400000 , 73.450103545496] , [ 1125460800000 , 71.714526354907] , [ 1128052800000 , 85.221664349607] , [ 1130734800000 , 77.769261392481] , [ 1133326800000 , 95.966528716500] , [ 1136005200000 , 107.59132116397] , [ 1138683600000 , 127.25740096723] , [ 1141102800000 , 122.13917498830] , [ 1143781200000 , 126.53657279774] , [ 1146369600000 , 132.39300992970] , [ 1149048000000 , 120.11238242904] , [ 1151640000000 , 118.41408917750] , [ 1154318400000 , 107.92918924621] , [ 1156996800000 , 110.28057249569] , [ 1159588800000 , 117.20485334692] , [ 1162270800000 , 141.33556756948] , [ 1164862800000 , 159.59452727893] , [ 1167541200000 , 167.09801853304] , [ 1170219600000 , 185.46849659215] , [ 1172638800000 , 184.82474099990] , [ 1175313600000 , 195.63155213887] , [ 1177905600000 , 207.40597044171] , [ 1180584000000 , 230.55966698196] , [ 1183176000000 , 239.55649035292] , [ 1185854400000 , 241.35915085208] , [ 1188532800000 , 239.89428956243] , [ 1191124800000 , 260.47781917715] , [ 1193803200000 , 276.39457482225] , [ 1196398800000 , 258.66530682672] , [ 1199077200000 , 250.98846121893] , [ 1201755600000 , 226.89902618127] , [ 1204261200000 , 227.29009273807] , [ 1206936000000 , 218.66476654350] , [ 1209528000000 , 232.46605902918] , [ 1212206400000 , 253.25667081117] , [ 1214798400000 , 235.82505363925] , [ 1217476800000 , 229.70112774254] , [ 1220155200000 , 225.18472705952] , [ 1222747200000 , 189.13661746552] , [ 1225425600000 , 149.46533007301] , [ 1228021200000 , 131.00340772114] , [ 1230699600000 , 135.18341728866] , [ 1233378000000 , 109.15296887173] , [ 1235797200000 , 84.614772549760] , [ 1238472000000 , 100.60810015326] , [ 1241064000000 , 141.50134895610] , [ 1243742400000 , 142.50405083675] , [ 1246334400000 , 139.81192372672] , [ 1249012800000 , 177.78205544583] , [ 1251691200000 , 194.73691933074] , [ 1254283200000 , 209.00838460225] , [ 1256961600000 , 198.19855877420] , [ 1259557200000 , 222.37102417812] , [ 1262235600000 , 234.24581081250] , [ 1264914000000 , 228.26087689346] , [ 1267333200000 , 248.81895126250] , [ 1270008000000 , 270.57301075186] , [ 1272600000000 , 292.64604322550] , [ 1275278400000 , 265.94088520518] , [ 1277870400000 , 237.82887467569] , [ 1280548800000 , 265.55973314204] , [ 1283227200000 , 248.30877330928] , [ 1285819200000 , 278.14870066912] , [ 1288497600000 , 292.69260960288] , [ 1291093200000 , 300.84263809599] , [ 1293771600000 , 326.17253914628] , [ 1296450000000 , 337.69335966505] , [ 1298869200000 , 339.73260965121] , [ 1301544000000 , 346.87865120765] , [ 1304136000000 , 347.92991526628] , [ 1306814400000 , 342.04627502669] , [ 1309406400000 , 333.45386231233] , [ 1312084800000 , 323.15034181243] , [ 1314763200000 , 295.66126882331] , [ 1317355200000 , 251.48014579253] , [ 1320033600000 , 295.15424257905] , [ 1322629200000 , 294.54766764397] , [ 1325307600000 , 295.72906119051] , [ 1327986000000 , 325.73351347613] , [ 1330491600000 , 340.16106061186] , [ 1333166400000 , 345.15514071490] , [ 1335758400000 , 337.10259395679] , [ 1338436800000 , 318.68216333837] , [ 1341028800000 , 317.03683945246] , [ 1343707200000 , 318.53549659997] , [ 1346385600000 , 332.85381464104] , [ 1348977600000 , 337.36534373477] , [ 1351656000000 , 350.27872156161] , [ 1354251600000 , 349.45128876100]]
                ,
                mean: 250
            },
            {
                key: "Short",
                values: [ [ 1083297600000 , -0.77078283705125] , [ 1085976000000 , -1.8356366650335] , [ 1088568000000 , -5.3121322073127] , [ 1091246400000 , -4.9320975829662] , [ 1093924800000 , -3.9835408823225] , [ 1096516800000 , -6.8694685316805] , [ 1099195200000 , -8.4854877428545] , [ 1101790800000 , -15.933627197384] , [ 1104469200000 , -15.920980069544] , [ 1107147600000 , -12.478685045651] , [ 1109566800000 , -17.297761889305] , [ 1112245200000 , -15.247129891020] , [ 1114833600000 , -11.336459046839] , [ 1117512000000 , -13.298990907415] , [ 1120104000000 , -16.360027000056] , [ 1122782400000 , -18.527929522030] , [ 1125460800000 , -22.176516738685] , [ 1128052800000 , -23.309665368330] , [ 1130734800000 , -21.629973409748] , [ 1133326800000 , -24.186429093486] , [ 1136005200000 , -29.116707312531] , [ 1138683600000 , -37.188037874864] , [ 1141102800000 , -34.689264821198] , [ 1143781200000 , -39.505932105359] , [ 1146369600000 , -45.339572492759] , [ 1149048000000 , -43.849353192764] , [ 1151640000000 , -45.418353922571] , [ 1154318400000 , -44.579281059919] , [ 1156996800000 , -44.027098363370] , [ 1159588800000 , -41.261306759439] , [ 1162270800000 , -47.446018534027] , [ 1164862800000 , -53.413782948909] , [ 1167541200000 , -50.700723647419] , [ 1170219600000 , -56.374090913296] , [ 1172638800000 , -61.754245220322] , [ 1175313600000 , -66.246241587629] , [ 1177905600000 , -75.351650899999] , [ 1180584000000 , -81.699058262032] , [ 1183176000000 , -82.487023368081] , [ 1185854400000 , -86.230055113277] , [ 1188532800000 , -84.746914818507] , [ 1191124800000 , -100.77134971977] , [ 1193803200000 , -109.95435565947] , [ 1196398800000 , -99.605672965057] , [ 1199077200000 , -99.607249394382] , [ 1201755600000 , -94.874614950188] , [ 1204261200000 , -105.35899063105] , [ 1206936000000 , -106.01931193802] , [ 1209528000000 , -110.28883571771] , [ 1212206400000 , -119.60256203030] , [ 1214798400000 , -115.62201315802] , [ 1217476800000 , -106.63824185202] , [ 1220155200000 , -99.848746318951] , [ 1222747200000 , -85.631219602987] , [ 1225425600000 , -63.547909262067] , [ 1228021200000 , -59.753275364457] , [ 1230699600000 , -63.874977883542] , [ 1233378000000 , -56.865697387488] , [ 1235797200000 , -54.285579501988] , [ 1238472000000 , -56.474659581885] , [ 1241064000000 , -63.847137745644] , [ 1243742400000 , -68.754247867325] , [ 1246334400000 , -69.474257009155] , [ 1249012800000 , -75.084828197067] , [ 1251691200000 , -77.101028237237] , [ 1254283200000 , -80.454866854387] , [ 1256961600000 , -78.984349952220] , [ 1259557200000 , -83.041230807854] , [ 1262235600000 , -84.529748348935] , [ 1264914000000 , -83.837470195508] , [ 1267333200000 , -87.174487671969] , [ 1270008000000 , -90.342293007487] , [ 1272600000000 , -93.550928464991] , [ 1275278400000 , -85.833102140765] , [ 1277870400000 , -79.326501831592] , [ 1280548800000 , -87.986196903537] , [ 1283227200000 , -85.397862121771] , [ 1285819200000 , -94.738167050020] , [ 1288497600000 , -98.661952897151] , [ 1291093200000 , -99.609665952708] , [ 1293771600000 , -103.57099836183] , [ 1296450000000 , -104.04353411322] , [ 1298869200000 , -108.21382792587] , [ 1301544000000 , -108.74006900920] , [ 1304136000000 , -112.07766650960] , [ 1306814400000 , -109.63328199118] , [ 1309406400000 , -106.53578966772] , [ 1312084800000 , -103.16480871469] , [ 1314763200000 , -95.945078001828] , [ 1317355200000 , -81.226687340874] , [ 1320033600000 , -90.782206596168] , [ 1322629200000 , -89.484445370113] , [ 1325307600000 , -88.514723135326] , [ 1327986000000 , -93.381292724320] , [ 1330491600000 , -97.529705609172] , [ 1333166400000 , -99.520481439189] , [ 1335758400000 , -99.430184898669] , [ 1338436800000 , -93.349934521973] , [ 1341028800000 , -95.858475286491] , [ 1343707200000 , -95.522755836605] , [ 1346385600000 , -98.503848862036] , [ 1348977600000 , -101.49415251896] , [ 1351656000000 , -101.50099325672] , [ 1354251600000 , -99.487094927489]]
                ,
                mean: -60
            },


            {
                key: "Gross",
                mean: 125,
                values: [ [ 1083297600000 , -3.7454058855943] , [ 1085976000000 , -3.6096667436314] , [ 1088568000000 , -0.8440003934950] , [ 1091246400000 , 2.0921565171691] , [ 1093924800000 , 3.5874194844361] , [ 1096516800000 , 13.742776534056] , [ 1099195200000 , 13.212577494462] , [ 1101790800000 , 24.567562260634] , [ 1104469200000 , 34.543699343650] , [ 1107147600000 , 36.438736927704] , [ 1109566800000 , 46.453174659855] , [ 1112245200000 , 43.825369235440] , [ 1114833600000 , 32.036699833653] , [ 1117512000000 , 41.191928040141] , [ 1120104000000 , 40.301151852023] , [ 1122782400000 , 54.922174023466] , [ 1125460800000 , 49.538009616222] , [ 1128052800000 , 61.911998981277] , [ 1130734800000 , 56.139287982733] , [ 1133326800000 , 71.780099623014] , [ 1136005200000 , 78.474613851439] , [ 1138683600000 , 90.069363092366] , [ 1141102800000 , 87.449910167102] , [ 1143781200000 , 87.030640692381] , [ 1146369600000 , 87.053437436941] , [ 1149048000000 , 76.263029236276] , [ 1151640000000 , 72.995735254929] , [ 1154318400000 , 63.349908186291] , [ 1156996800000 , 66.253474132320] , [ 1159588800000 , 75.943546587481] , [ 1162270800000 , 93.889549035453] , [ 1164862800000 , 106.18074433002] , [ 1167541200000 , 116.39729488562] , [ 1170219600000 , 129.09440567885] , [ 1172638800000 , 123.07049577958] , [ 1175313600000 , 129.38531055124] , [ 1177905600000 , 132.05431954171] , [ 1180584000000 , 148.86060871993] , [ 1183176000000 , 157.06946698484] , [ 1185854400000 , 155.12909573880] , [ 1188532800000 , 155.14737474392] , [ 1191124800000 , 159.70646945738] , [ 1193803200000 , 166.44021916278] , [ 1196398800000 , 159.05963386166] , [ 1199077200000 , 151.38121182455] , [ 1201755600000 , 132.02441123108] , [ 1204261200000 , 121.93110210702] , [ 1206936000000 , 112.64545460548] , [ 1209528000000 , 122.17722331147] , [ 1212206400000 , 133.65410878087] , [ 1214798400000 , 120.20304048123] , [ 1217476800000 , 123.06288589052] , [ 1220155200000 , 125.33598074057] , [ 1222747200000 , 103.50539786253] , [ 1225425600000 , 85.917420810943] , [ 1228021200000 , 71.250132356683] , [ 1230699600000 , 71.308439405118] , [ 1233378000000 , 52.287271484242] , [ 1235797200000 , 30.329193047772] , [ 1238472000000 , 44.133440571375] , [ 1241064000000 , 77.654211210456] , [ 1243742400000 , 73.749802969425] , [ 1246334400000 , 70.337666717565] , [ 1249012800000 , 102.69722724876] , [ 1251691200000 , 117.63589109350] , [ 1254283200000 , 128.55351774786] , [ 1256961600000 , 119.21420882198] , [ 1259557200000 , 139.32979337027] , [ 1262235600000 , 149.71606246357] , [ 1264914000000 , 144.42340669795] , [ 1267333200000 , 161.64446359053] , [ 1270008000000 , 180.23071774437] , [ 1272600000000 , 199.09511476051] , [ 1275278400000 , 180.10778306442] , [ 1277870400000 , 158.50237284410] , [ 1280548800000 , 177.57353623850] , [ 1283227200000 , 162.91091118751] , [ 1285819200000 , 183.41053361910] , [ 1288497600000 , 194.03065670573] , [ 1291093200000 , 201.23297214328] , [ 1293771600000 , 222.60154078445] , [ 1296450000000 , 233.35556801977] , [ 1298869200000 , 231.22452435045] , [ 1301544000000 , 237.84432503045] , [ 1304136000000 , 235.55799131184] , [ 1306814400000 , 232.11873570751] , [ 1309406400000 , 226.62381538123] , [ 1312084800000 , 219.34811113539] , [ 1314763200000 , 198.69242285581] , [ 1317355200000 , 168.90235629066] , [ 1320033600000 , 202.64725756733] , [ 1322629200000 , 203.05389378105] , [ 1325307600000 , 204.85986680865] , [ 1327986000000 , 229.77085616585] , [ 1330491600000 , 239.65202435959] , [ 1333166400000 , 242.33012622734] , [ 1335758400000 , 234.11773262149] , [ 1338436800000 , 221.47846307887] , [ 1341028800000 , 216.98308827912] , [ 1343707200000 , 218.37781386755] , [ 1346385600000 , 229.39368622736] , [ 1348977600000 , 230.54656412916] , [ 1351656000000 , 243.06087025523] , [ 1354251600000 , 244.24733578385]]
            },
            {
                key: "S&P 1500",
                values: [ [ 1083297600000 , -1.7798428181819] , [ 1085976000000 , -0.36883324836999] , [ 1088568000000 , 1.7312581046040] , [ 1091246400000 , -1.8356125950460] , [ 1093924800000 , -1.5396564170877] , [ 1096516800000 , -0.16867791409247] , [ 1099195200000 , 1.3754263993413] , [ 1101790800000 , 5.8171640898041] , [ 1104469200000 , 9.4350145241608] , [ 1107147600000 , 6.7649081510160] , [ 1109566800000 , 9.1568499314776] , [ 1112245200000 , 7.2485090994419] , [ 1114833600000 , 4.8762222306595] , [ 1117512000000 , 8.5992339354652] , [ 1120104000000 , 9.0896517982086] , [ 1122782400000 , 13.394644048577] , [ 1125460800000 , 12.311842010760] , [ 1128052800000 , 13.221003650717] , [ 1130734800000 , 11.218481009206] , [ 1133326800000 , 15.565352598445] , [ 1136005200000 , 15.623703865926] , [ 1138683600000 , 19.275255326383] , [ 1141102800000 , 19.432433717836] , [ 1143781200000 , 21.232881244655] , [ 1146369600000 , 22.798299192958] , [ 1149048000000 , 19.006125095476] , [ 1151640000000 , 19.151889158536] , [ 1154318400000 , 19.340022855452] , [ 1156996800000 , 22.027934841859] , [ 1159588800000 , 24.903300681329] , [ 1162270800000 , 29.146492833877] , [ 1164862800000 , 31.781626082589] , [ 1167541200000 , 33.358770738428] , [ 1170219600000 , 35.622684613497] , [ 1172638800000 , 33.332821711366] , [ 1175313600000 , 34.878748635832] , [ 1177905600000 , 40.582332613844] , [ 1180584000000 , 45.719535502920] , [ 1183176000000 , 43.239344722386] , [ 1185854400000 , 38.550955100342] , [ 1188532800000 , 40.585368816283] , [ 1191124800000 , 45.601374057981] , [ 1193803200000 , 48.051404337892] , [ 1196398800000 , 41.582581696032] , [ 1199077200000 , 40.650580792748] , [ 1201755600000 , 32.252222066493] , [ 1204261200000 , 28.106390258553] , [ 1206936000000 , 27.532698196687] , [ 1209528000000 , 33.986390463852] , [ 1212206400000 , 36.302660526438] , [ 1214798400000 , 25.015574480172] , [ 1217476800000 , 23.989494069029] , [ 1220155200000 , 25.934351445531] , [ 1222747200000 , 14.627592011699] , [ 1225425600000 , -5.2249403809749] , [ 1228021200000 , -12.330933408050] , [ 1230699600000 , -11.000291508188] , [ 1233378000000 , -18.563864948088] , [ 1235797200000 , -27.213097001687] , [ 1238472000000 , -20.834133840523] , [ 1241064000000 , -12.717886701719] , [ 1243742400000 , -8.1644613083526] , [ 1246334400000 , -7.9108408918201] , [ 1249012800000 , -0.77002391591209] , [ 1251691200000 , 2.8243816569672] , [ 1254283200000 , 6.8761411421070] , [ 1256961600000 , 4.5060912230294] , [ 1259557200000 , 10.487179794349] , [ 1262235600000 , 13.251375597594] , [ 1264914000000 , 9.2207594803415] , [ 1267333200000 , 12.836276936538] , [ 1270008000000 , 19.816793904978] , [ 1272600000000 , 22.156787167211] , [ 1275278400000 , 12.518039090576] , [ 1277870400000 , 6.4253587440854] , [ 1280548800000 , 13.847372028409] , [ 1283227200000 , 8.5454736090364] , [ 1285819200000 , 18.542801953304] , [ 1288497600000 , 23.037064683183] , [ 1291093200000 , 23.517422401888] , [ 1293771600000 , 31.804723416068] , [ 1296450000000 , 34.778247386072] , [ 1298869200000 , 39.584883855230] , [ 1301544000000 , 40.080647664875] , [ 1304136000000 , 44.180050667889] , [ 1306814400000 , 42.533535927221] , [ 1309406400000 , 40.105374449011] , [ 1312084800000 , 37.014659267156] , [ 1314763200000 , 29.263745084262] , [ 1317355200000 , 19.637463417584] , [ 1320033600000 , 33.157645345770] , [ 1322629200000 , 32.895053150988] , [ 1325307600000 , 34.111544824647] , [ 1327986000000 , 40.453985817473] , [ 1330491600000 , 46.435700783313] , [ 1333166400000 , 51.062385488671] , [ 1335758400000 , 50.130448220658] , [ 1338436800000 , 41.035476682018] , [ 1341028800000 , 46.591932296457] , [ 1343707200000 , 48.349391180634] , [ 1346385600000 , 51.913011286919] , [ 1348977600000 , 55.747238313752] , [ 1351656000000 , 52.991824077209] , [ 1354251600000 , 49.556311883284]]
            }
        ];
    }])

'use strict';

angular.module('chart-components')

    .controller('discreteBarChartCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',.4f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'X Axis'
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: -10
                }
            }
        };

        $scope.data = [
            {
                key: "Cumulative Return",
                values: [
                    {
                        "label" : "A" ,
                        "value" : -29.765957771107
                    } ,
                    {
                        "label" : "B" ,
                        "value" : 0
                    } ,
                    {
                        "label" : "C" ,
                        "value" : 32.807804682612
                    } ,
                    {
                        "label" : "D" ,
                        "value" : 196.45946739256
                    } ,
                    {
                        "label" : "E" ,
                        "value" : 0.19434030906893
                    } ,
                    {
                        "label" : "F" ,
                        "value" : -98.079782601442
                    } ,
                    {
                        "label" : "G" ,
                        "value" : -13.925743130903
                    } ,
                    {
                        "label" : "H" ,
                        "value" : -5.1387322875705
                    }
                ]
            }
        ]
    }])
'use strict';

angular.module('chart-components')

    .controller('donutChartCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 450,
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,

                pie: {
                    startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
                    endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
                },
                duration: 500,
                legend: {
                    margin: {
                        top: 5,
                        right: 140,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.data = [
            {
                key: "One",
                y: 5
            },
            {
                key: "Two",
                y: 2
            },
            {
                key: "Three",
                y: 9
            },
            {
                key: "Four",
                y: 7
            },
            {
                key: "Five",
                y: 4
            },
            {
                key: "Six",
                y: 3
            },
            {
                key: "Seven",
                y: .5
            }
        ];
    }])
'use strict';

angular.module('chart-components')

    .controller('historicalBarChartCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'historicalBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 65,
                    left: 50
                },
                x: function(d){return d[0];},
                y: function(d){return d[1]/100000;},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',.1f')(d);
                },
                duration: 100,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        return d3.time.format('%x')(new Date(d))
                    },
                    rotateLabels: 30,
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: -10,
                    tickFormat: function(d){
                        return d3.format(',.1f')(d);
                    }
                },
                tooltip: {
                    keyFormatter: function(d) {
                        return d3.time.format('%x')(new Date(d));
                    }
                },
                zoom: {
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        $scope.data = [
            {
                "key" : "Quantity" ,
                "bar": true,
                "values" : [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
            }];

    }])
'use strict';

angular.module('chart-components', [])

    .controller('lineChartCtrl', ["$scope", function($scope){
        $scope.options = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (ms)'
                },
                yAxis: {
                    axisLabel: 'Voltage (v)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Title for Line Chart'
            },
            subtitle: {
                enable: true,
                text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };

        $scope.data = sinAndCos();

        /*Random Data Generator */
        function sinAndCos() {
            var sin = [],sin2 = [],
                cos = [];

            //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < 100; i++) {
                sin.push({x: i, y: Math.sin(i/10)});
                sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
                cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
            }

            //Line chart data should be sent as an array of series objects.
            return [
                {
                    values: sin,      //values - represents the array of {x,y} data points
                    key: 'Sine Wave', //key  - the name of the series.
                    color: '#ff7f0e'  //color - optional: choose your own line color.
                },
                {
                    values: cos,
                    key: 'Cosine Wave',
                    color: '#2ca02c'
                },
                {
                    values: sin2,
                    key: 'Another sine wave',
                    color: '#7777ff',
                    area: true      //area - set to true if you want this line to turn into a filled area chart.
                }
            ];
        };
    }])
'use strict';

angular.module('chart-components')

    .controller('linePlusBarChartCtrl', ["$scope", function($scope){
        $scope.options = {
            chart: {
                type: 'linePlusBarChart',
                height: 450,
                margin : {
                    top: 30,
                    right: 75,
                    bottom: 50,
                    left: 75
                },
                x: function(d, i){return i;},
                y: function(d){return d[1];},
                color: d3.scale.category10().range(),
                duration: 250,
                xAxis: {
                    axisLabel: 'X Axis',
                    showMaxMin: false,
                    tickFormat: function(d) {
                        var dx = $scope.data[0].values[d] && $scope.data[0].values[d][0] || 0;
                        return dx ? d3.time.format('%x')(new Date(dx)) : '';
                    },
                    staggerLabels: true
                },
                y1Axis: {
                    axisLabel: 'Y1 Axis',
                    tickFormat: function(d){return d3.format(',f')(d)}
                },
                y2Axis: {
                    axisLabel: 'Y2 Axis',
                    tickFormat: function(d) { return '$' + d3.format(',.2f')(d);}
                }
            }
        };

        $scope.data = [
            {
                "key" : "Quantity" ,
                "bar": true,
                "values" : [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
            },
            {
                "key" : "Price" ,
                "values" : [ [ 1136005200000 , 71.89] , [ 1138683600000 , 75.51] , [ 1141102800000 , 68.49] , [ 1143781200000 , 62.72] , [ 1146369600000 , 70.39] , [ 1149048000000 , 59.77] , [ 1151640000000 , 57.27] , [ 1154318400000 , 67.96] , [ 1156996800000 , 67.85] , [ 1159588800000 , 76.98] , [ 1162270800000 , 81.08] , [ 1164862800000 , 91.66] , [ 1167541200000 , 84.84] , [ 1170219600000 , 85.73] , [ 1172638800000 , 84.61] , [ 1175313600000 , 92.91] , [ 1177905600000 , 99.8] , [ 1180584000000 , 121.191] , [ 1183176000000 , 122.04] , [ 1185854400000 , 131.76] , [ 1188532800000 , 138.48] , [ 1191124800000 , 153.47] , [ 1193803200000 , 189.95] , [ 1196398800000 , 182.22] , [ 1199077200000 , 198.08] , [ 1201755600000 , 135.36] , [ 1204261200000 , 125.02] , [ 1206936000000 , 143.5] , [ 1209528000000 , 173.95] , [ 1212206400000 , 188.75] , [ 1214798400000 , 167.44] , [ 1217476800000 , 158.95] , [ 1220155200000 , 169.53] , [ 1222747200000 , 113.66] , [ 1225425600000 , 107.59] , [ 1228021200000 , 92.67] , [ 1230699600000 , 85.35] , [ 1233378000000 , 90.13] , [ 1235797200000 , 89.31] , [ 1238472000000 , 105.12] , [ 1241064000000 , 125.83] , [ 1243742400000 , 135.81] , [ 1246334400000 , 142.43] , [ 1249012800000 , 163.39] , [ 1251691200000 , 168.21] , [ 1254283200000 , 185.35] , [ 1256961600000 , 188.5] , [ 1259557200000 , 199.91] , [ 1262235600000 , 210.732] , [ 1264914000000 , 192.063] , [ 1267333200000 , 204.62] , [ 1270008000000 , 235.0] , [ 1272600000000 , 261.09] , [ 1275278400000 , 256.88] , [ 1277870400000 , 251.53] , [ 1280548800000 , 257.25] , [ 1283227200000 , 243.1] , [ 1285819200000 , 283.75] , [ 1288497600000 , 300.98] , [ 1291093200000 , 311.15] , [ 1293771600000 , 322.56] , [ 1296450000000 , 339.32] , [ 1298869200000 , 353.21] , [ 1301544000000 , 348.5075] , [ 1304136000000 , 350.13] , [ 1306814400000 , 347.83] , [ 1309406400000 , 335.67] , [ 1312084800000 , 390.48] , [ 1314763200000 , 384.83] , [ 1317355200000 , 381.32] , [ 1320033600000 , 404.78] , [ 1322629200000 , 382.2] , [ 1325307600000 , 405.0] , [ 1327986000000 , 456.48] , [ 1330491600000 , 542.44] , [ 1333166400000 , 599.55] , [ 1335758400000 , 583.98] ]
            }
        ];
    }])
'use strict';

angular.module('chart-components')

    .controller('linePlusBarWithFocusChartCtrl', ["$scope", function($scope){
        $scope.options = {
            chart: {
                type: 'linePlusBarChart',
                height: 500,
                margin: {
                    top: 30,
                    right: 75,
                    bottom: 50,
                    left: 75
                },
                bars: {
                    forceY: [0]
                },
                bars2: {
                    forceY: [0]
                },
                color: ['#2ca02c', 'darkred'],
                x: function(d,i) { return i },
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        var dx = $scope.data[0].values[d] && $scope.data[0].values[d].x || 0;
                        if (dx > 0) {
                            return d3.time.format('%x')(new Date(dx))
                        }
                        return null;
                    }
                },
                x2Axis: {
                    tickFormat: function(d) {
                        var dx = $scope.data[0].values[d] && $scope.data[0].values[d].x || 0;
                        return d3.time.format('%b-%Y')(new Date(dx))
                    },
                    showMaxMin: false
                },
                y1Axis: {
                    axisLabel: 'Y1 Axis',
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    },
                    axisLabelDistance: 12
                },
                y2Axis: {
                    axisLabel: 'Y2 Axis',
                    tickFormat: function(d) {
                        return '$' + d3.format(',.2f')(d)
                    }
                },
                y3Axis: {
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    }
                },
                y4Axis: {
                    tickFormat: function(d) {
                        return '$' + d3.format(',.2f')(d)
                    }
                }
            }
        };

        $scope.data = [
            {
                "key" : "Quantity" ,
                "bar": true,
                "values" : [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
            },
            {
                "key" : "Price" ,
                "values" : [ [ 1136005200000 , 71.89] , [ 1138683600000 , 75.51] , [ 1141102800000 , 68.49] , [ 1143781200000 , 62.72] , [ 1146369600000 , 70.39] , [ 1149048000000 , 59.77] , [ 1151640000000 , 57.27] , [ 1154318400000 , 67.96] , [ 1156996800000 , 67.85] , [ 1159588800000 , 76.98] , [ 1162270800000 , 81.08] , [ 1164862800000 , 91.66] , [ 1167541200000 , 84.84] , [ 1170219600000 , 85.73] , [ 1172638800000 , 84.61] , [ 1175313600000 , 92.91] , [ 1177905600000 , 99.8] , [ 1180584000000 , 121.191] , [ 1183176000000 , 122.04] , [ 1185854400000 , 131.76] , [ 1188532800000 , 138.48] , [ 1191124800000 , 153.47] , [ 1193803200000 , 189.95] , [ 1196398800000 , 182.22] , [ 1199077200000 , 198.08] , [ 1201755600000 , 135.36] , [ 1204261200000 , 125.02] , [ 1206936000000 , 143.5] , [ 1209528000000 , 173.95] , [ 1212206400000 , 188.75] , [ 1214798400000 , 167.44] , [ 1217476800000 , 158.95] , [ 1220155200000 , 169.53] , [ 1222747200000 , 113.66] , [ 1225425600000 , 107.59] , [ 1228021200000 , 92.67] , [ 1230699600000 , 85.35] , [ 1233378000000 , 90.13] , [ 1235797200000 , 89.31] , [ 1238472000000 , 105.12] , [ 1241064000000 , 125.83] , [ 1243742400000 , 135.81] , [ 1246334400000 , 142.43] , [ 1249012800000 , 163.39] , [ 1251691200000 , 168.21] , [ 1254283200000 , 185.35] , [ 1256961600000 , 188.5] , [ 1259557200000 , 199.91] , [ 1262235600000 , 210.732] , [ 1264914000000 , 192.063] , [ 1267333200000 , 204.62] , [ 1270008000000 , 235.0] , [ 1272600000000 , 261.09] , [ 1275278400000 , 256.88] , [ 1277870400000 , 251.53] , [ 1280548800000 , 257.25] , [ 1283227200000 , 243.1] , [ 1285819200000 , 283.75] , [ 1288497600000 , 300.98] , [ 1291093200000 , 311.15] , [ 1293771600000 , 322.56] , [ 1296450000000 , 339.32] , [ 1298869200000 , 353.21] , [ 1301544000000 , 348.5075] , [ 1304136000000 , 350.13] , [ 1306814400000 , 347.83] , [ 1309406400000 , 335.67] , [ 1312084800000 , 390.48] , [ 1314763200000 , 384.83] , [ 1317355200000 , 381.32] , [ 1320033600000 , 404.78] , [ 1322629200000 , 382.2] , [ 1325307600000 , 405.0] , [ 1327986000000 , 456.48] , [ 1330491600000 , 542.44] , [ 1333166400000 , 599.55] , [ 1335758400000 , 583.98]]
            }
        ].map(function(series) {
                series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
                return series;
            });
    }])
'use strict';

angular.module('chart-components')

    .controller('lineWithFisheyeChartCtrl', ["$scope", function($scope){
        $scope.options = {
            chart: {
                type: 'lineWithFisheyeChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 50
                },
                xAxis: {
                    axisLabel: 'X Axis'
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    },
                    axisLabelDistance: 35
                }
            }
        };

        $scope.data = sinAndCos();

        /*Random Data Generator */
        function sinAndCos() {
            var sin = [],
                cos = [];

            //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < 500; i++) {
                sin.push({x: i, y: Math.sin(i/10)});
                cos.push({x: i, y: .5 * Math.cos(i/10 + 2) + Math.random() / 10});
            }

            //Line chart data should be sent as an array of series objects.
            return [
                {
                    values: sin,      //values - represents the array of {x,y} data points
                    key: 'Sine Wave', //key  - the name of the series.
                    color: '#ff7f0e'  //color - optional: choose your own line color.
                },
                {
                    values: cos,
                    key: 'Cosine Wave',
                    color: '#2ca02c'
                }
            ];
        };
    }])
'use strict';

angular.module('chart-components')

    .controller('lineWithFocusChartCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'lineWithFocusChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 40
                },
                duration: 500,
                useInteractiveGuideline: true,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    }
                },
                x2Axis: {
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    },
                    rotateYLabel: false
                },
                y2Axis: {
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    }
                }

            }
        };

        $scope.data = generateData();

        /* Random Data Generator (took from nvd3.org) */
        function generateData() {
            return stream_layers(3,10+Math.random()*200,.1).map(function(data, i) {
                return {
                    key: 'Stream' + i,
                    values: data
                };
            });
        }

        /* Inspired by Lee Byron's test data generator. */
        function stream_layers(n, m, o) {
            if (arguments.length < 3) o = 0;
            function bump(a) {
                var x = 1 / (.1 + Math.random()),
                    y = 2 * Math.random() - .5,
                    z = 10 / (.1 + Math.random());
                for (var i = 0; i < m; i++) {
                    var w = (i / m - y) * z;
                    a[i] += x * Math.exp(-w * w);
                }
            }
            return d3.range(n).map(function() {
                var a = [], i;
                for (i = 0; i < m; i++) a[i] = o + o * Math.random();
                for (i = 0; i < 5; i++) bump(a);
                return a.map(stream_index);
            });
        }

        /* Another layer generator using gamma distributions. */
        function stream_waves(n, m) {
            return d3.range(n).map(function(i) {
                return d3.range(m).map(function(j) {
                    var x = 20 * j / m - i / 3;
                    return 2 * x * Math.exp(-.5 * x);
                }).map(stream_index);
            });
        }

        function stream_index(d, i) {
            return {x: i, y: Math.max(0, d)};
        }
    }])
'use strict';

angular.module('chart-components')

    .controller('multiBarChartCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'multiBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 45,
                    left: 45
                },
                clipEdge: true,
                //staggerLabels: true,
                duration: 500,
                stacked: true,
                xAxis: {
                    axisLabel: 'Time (ms)',
                    showMaxMin: false,
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: -20,
                    tickFormat: function(d){
                        return d3.format(',.1f')(d);
                    }
                }
            }
        };

        $scope.data = generateData();

        /* Random Data Generator (took from nvd3.org) */
        function generateData() {
            return stream_layers(3,50+Math.random()*50,.1).map(function(data, i) {
                return {
                    key: 'Stream' + i,
                    values: data
                };
            });
        }

        /* Inspired by Lee Byron's test data generator. */
        function stream_layers(n, m, o) {
            if (arguments.length < 3) o = 0;
            function bump(a) {
                var x = 1 / (.1 + Math.random()),
                    y = 2 * Math.random() - .5,
                    z = 10 / (.1 + Math.random());
                for (var i = 0; i < m; i++) {
                    var w = (i / m - y) * z;
                    a[i] += x * Math.exp(-w * w);
                }
            }
            return d3.range(n).map(function() {
                var a = [], i;
                for (i = 0; i < m; i++) a[i] = o + o * Math.random();
                for (i = 0; i < 5; i++) bump(a);
                return a.map(stream_index);
            });
        }

        /* Another layer generator using gamma distributions. */
        function stream_waves(n, m) {
            return d3.range(n).map(function(i) {
                return d3.range(m).map(function(j) {
                    var x = 20 * j / m - i / 3;
                    return 2 * x * Math.exp(-.5 * x);
                }).map(stream_index);
            });
        }

        function stream_index(d, i) {
            return {x: i, y: Math.max(0, d)};
        }


    }])
'use strict';

angular.module('chart-components')

    .controller('multiBarHorizontalChartCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'multiBarHorizontalChart',
                height: 450,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                //yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
                showControls: true,
                showValues: true,
                duration: 500,
                xAxis: {
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'Values',
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    }
                }
            }
        };

        $scope.data = [
            {
                "key": "Series1",
                "color": "#d62728",
                "values": [
                    {
                        "label" : "Group A" ,
                        "value" : -1.8746444827653
                    } ,
                    {
                        "label" : "Group B" ,
                        "value" : -8.0961543492239
                    } ,
                    {
                        "label" : "Group C" ,
                        "value" : -0.57072943117674
                    } ,
                    {
                        "label" : "Group D" ,
                        "value" : -2.4174010336624
                    } ,
                    {
                        "label" : "Group E" ,
                        "value" : -0.72009071426284
                    } ,
                    {
                        "label" : "Group F" ,
                        "value" : -0.77154485523777
                    } ,
                    {
                        "label" : "Group G" ,
                        "value" : -0.90152097798131
                    } ,
                    {
                        "label" : "Group H" ,
                        "value" : -0.91445417330854
                    } ,
                    {
                        "label" : "Group I" ,
                        "value" : -0.055746319141851
                    }
                ]
            },
            {
                "key": "Series2",
                "color": "#1f77b4",
                "values": [
                    {
                        "label" : "Group A" ,
                        "value" : 25.307646510375
                    } ,
                    {
                        "label" : "Group B" ,
                        "value" : 16.756779544553
                    } ,
                    {
                        "label" : "Group C" ,
                        "value" : 18.451534877007
                    } ,
                    {
                        "label" : "Group D" ,
                        "value" : 8.6142352811805
                    } ,
                    {
                        "label" : "Group E" ,
                        "value" : 7.8082472075876
                    } ,
                    {
                        "label" : "Group F" ,
                        "value" : 5.259101026956
                    } ,
                    {
                        "label" : "Group G" ,
                        "value" : 0.30947953487127
                    } ,
                    {
                        "label" : "Group H" ,
                        "value" : 0
                    } ,
                    {
                        "label" : "Group I" ,
                        "value" : 0
                    }
                ]
            }
        ]
    }])
'use strict';

/* Controllers */

angular.module('chart-components')

    .controller('multiChartCtrl', ["$scope", function($scope){
        $scope.options = {
            chart: {
                type: 'multiChart',
                height: 450,
                margin : {
                    top: 30,
                    right: 60,
                    bottom: 50,
                    left: 70
                },
                color: d3.scale.category10().range(),
                //useInteractiveGuideline: true,
                duration: 500,
                xAxis: {
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    }
                },
                yAxis1: {
                    tickFormat: function(d){
                        return d3.format(',.1f')(d);
                    }
                },
                yAxis2: {
                    tickFormat: function(d){
                        return d3.format(',.1f')(d);
                    }
                }
            }
        };

        $scope.data = generateData();

        function generateData(){
            var testdata = stream_layers(7,10+Math.random()*100,.1).map(function(data, i) {
                return {
                    key: 'Stream' + i,
                    values: data.map(function(a){a.y = a.y * (i <= 1 ? -1 : 1); return a})
                };
            });

            testdata[0].type = "area"
            testdata[0].yAxis = 1
            testdata[1].type = "area"
            testdata[1].yAxis = 1
            testdata[2].type = "line"
            testdata[2].yAxis = 1
            testdata[3].type = "line"
            testdata[3].yAxis = 2
            testdata[4].type = "bar"
            testdata[4].yAxis = 2
            testdata[5].type = "bar"
            testdata[5].yAxis = 2
            testdata[6].type = "bar"
            testdata[6].yAxis = 2

            return testdata;
        }

        /* Inspired by Lee Byron's test data generator. */
        function stream_layers(n, m, o) {
            if (arguments.length < 3) o = 0;
            function bump(a) {
                var x = 1 / (.1 + Math.random()),
                    y = 2 * Math.random() - .5,
                    z = 10 / (.1 + Math.random());
                for (var i = 0; i < m; i++) {
                    var w = (i / m - y) * z;
                    a[i] += x * Math.exp(-w * w);
                }
            }
            return d3.range(n).map(function() {
                var a = [], i;
                for (i = 0; i < m; i++) a[i] = o + o * Math.random();
                for (i = 0; i < 5; i++) bump(a);
                return a.map(stream_index);
            });
        }

        function stream_index(d, i) {
            return {x: i, y: Math.max(0, d)};
        }

    }])
'use strict';

angular.module('chart-components')

    .controller('ohlcBarChartCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'ohlcBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 60
                },
                x: function(d){ return d['date']; },
                y: function(d){ return d['close']; },
                duration: 100,

                xAxis: {
                    axisLabel: 'Dates',
                    tickFormat: function(d) {
                        return d3.time.format('%x')(new Date(new Date() - (20000 * 86400000) + (d * 86400000)));
                    },
                    showMaxMin: false
                },

                yAxis: {
                    axisLabel: 'Stock Price',
                    tickFormat: function(d){
                        return '$' + d3.format(',.1f')(d);
                    },
                    showMaxMin: false
                },

                zoom: {
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        $scope.data = [{values: [
            {"date": 15707, "open": 145.11, "high": 146.15, "low": 144.73, "close": 146.06, "volume": 192059000, "adjusted": 144.65},
            {"date": 15708, "open": 145.99, "high": 146.37, "low": 145.34, "close": 145.73, "volume": 144761800, "adjusted": 144.32},
            {"date": 15709, "open": 145.97, "high": 146.61, "low": 145.67, "close": 146.37, "volume": 116817700, "adjusted": 144.95},
            {"date": 15712, "open": 145.85, "high": 146.11, "low": 145.43, "close": 145.97, "volume": 110002500, "adjusted": 144.56},
            {"date": 15713, "open": 145.71, "high": 145.91, "low": 144.98, "close": 145.55, "volume": 121265100, "adjusted": 144.14},
            {"date": 15714, "open": 145.87, "high": 146.32, "low": 145.64, "close": 145.92, "volume": 90745600, "adjusted": 144.51},
            {"date": 15715, "open": 146.73, "high": 147.09, "low": 145.97, "close": 147.08, "volume": 130735400, "adjusted": 145.66},
            {"date": 15716, "open": 147.04, "high": 147.15, "low": 146.61, "close": 147.07, "volume": 113917300, "adjusted": 145.65},
            {"date": 15719, "open": 146.89, "high": 147.07, "low": 146.43, "close": 146.97, "volume": 89567200, "adjusted": 145.55},
            {"date": 15720, "open": 146.29, "high": 147.21, "low": 146.2, "close": 147.07, "volume": 93172600, "adjusted": 145.65},
            {"date": 15721, "open": 146.77, "high": 147.28, "low": 146.61, "close": 147.05, "volume": 104849500, "adjusted": 145.63},
            {"date": 15722, "open": 147.7, "high": 148.42, "low": 147.15, "close": 148, "volume": 133833500, "adjusted": 146.57},
            {"date": 15723, "open": 147.97, "high": 148.49, "low": 147.43, "close": 148.33, "volume": 169906000, "adjusted": 146.9},
            {"date": 15727, "open": 148.33, "high": 149.13, "low": 147.98, "close": 149.13, "volume": 111797300, "adjusted": 147.69},
            {"date": 15728, "open": 149.13, "high": 149.5, "low": 148.86, "close": 149.37, "volume": 104596100, "adjusted": 147.93},
            {"date": 15729, "open": 149.15, "high": 150.14, "low": 149.01, "close": 149.41, "volume": 146426400, "adjusted": 147.97},
            {"date": 15730, "open": 149.88, "high": 150.25, "low": 149.37, "close": 150.25, "volume": 147211600, "adjusted": 148.8},
            {"date": 15733, "open": 150.29, "high": 150.33, "low": 149.51, "close": 150.07, "volume": 113357700, "adjusted": 148.62},
            {"date": 15734, "open": 149.77, "high": 150.85, "low": 149.67, "close": 150.66, "volume": 105694400, "adjusted": 149.2},
            {"date": 15735, "open": 150.64, "high": 150.94, "low": 149.93, "close": 150.07, "volume": 137447700, "adjusted": 148.62},
            {"date": 15736, "open": 149.89, "high": 150.38, "low": 149.6, "close": 149.7, "volume": 108975800, "adjusted": 148.25},
            {"date": 15737, "open": 150.65, "high": 151.42, "low": 150.39, "close": 151.24, "volume": 131173000, "adjusted": 149.78},
            {"date": 15740, "open": 150.32, "high": 151.27, "low": 149.43, "close": 149.54, "volume": 159073600, "adjusted": 148.09},
            {"date": 15741, "open": 150.35, "high": 151.48, "low": 150.29, "close": 151.05, "volume": 113912400, "adjusted": 149.59},
            {"date": 15742, "open": 150.52, "high": 151.26, "low": 150.41, "close": 151.16, "volume": 138762800, "adjusted": 149.7},
            {"date": 15743, "open": 151.21, "high": 151.35, "low": 149.86, "close": 150.96, "volume": 162490000, "adjusted": 149.5},
            {"date": 15744, "open": 151.22, "high": 151.89, "low": 151.22, "close": 151.8, "volume": 103133700, "adjusted": 150.33},
            {"date": 15747, "open": 151.74, "high": 151.9, "low": 151.39, "close": 151.77, "volume": 73775000, "adjusted": 150.3},
            {"date": 15748, "open": 151.78, "high": 152.3, "low": 151.61, "close": 152.02, "volume": 65392700, "adjusted": 150.55},
            {"date": 15749, "open": 152.33, "high": 152.61, "low": 151.72, "close": 152.15, "volume": 82322600, "adjusted": 150.68},
            {"date": 15750, "open": 151.69, "high": 152.47, "low": 151.52, "close": 152.29, "volume": 80834300, "adjusted": 150.82},
            {"date": 15751, "open": 152.43, "high": 152.59, "low": 151.55, "close": 152.11, "volume": 215226500, "adjusted": 150.64},
            {"date": 15755, "open": 152.37, "high": 153.28, "low": 152.16, "close": 153.25, "volume": 95105400, "adjusted": 151.77},
            {"date": 15756, "open": 153.14, "high": 153.19, "low": 151.26, "close": 151.34, "volume": 160574800, "adjusted": 149.88},
            {"date": 15757, "open": 150.96, "high": 151.42, "low": 149.94, "close": 150.42, "volume": 183257000, "adjusted": 148.97},
            {"date": 15758, "open": 151.15, "high": 151.89, "low": 150.49, "close": 151.89, "volume": 106356600, "adjusted": 150.42},
            {"date": 15761, "open": 152.63, "high": 152.86, "low": 149, "close": 149, "volume": 245824800, "adjusted": 147.56},
            {"date": 15762, "open": 149.72, "high": 150.2, "low": 148.73, "close": 150.02, "volume": 186596200, "adjusted": 148.57},
            {"date": 15763, "open": 149.89, "high": 152.33, "low": 149.76, "close": 151.91, "volume": 150781900, "adjusted": 150.44},
            {"date": 15764, "open": 151.9, "high": 152.87, "low": 151.41, "close": 151.61, "volume": 126866000, "adjusted": 150.14},
            {"date": 15765, "open": 151.09, "high": 152.34, "low": 150.41, "close": 152.11, "volume": 170634800, "adjusted": 150.64},
            {"date": 15768, "open": 151.76, "high": 152.92, "low": 151.52, "close": 152.92, "volume": 99010200, "adjusted": 151.44},
            {"date": 15769, "open": 153.66, "high": 154.7, "low": 153.64, "close": 154.29, "volume": 121431900, "adjusted": 152.8},
            {"date": 15770, "open": 154.84, "high": 154.92, "low": 154.16, "close": 154.5, "volume": 94469900, "adjusted": 153.01},
            {"date": 15771, "open": 154.7, "high": 154.98, "low": 154.52, "close": 154.78, "volume": 86101400, "adjusted": 153.28},
            {"date": 15772, "open": 155.46, "high": 155.65, "low": 154.66, "close": 155.44, "volume": 123477800, "adjusted": 153.94},
            {"date": 15775, "open": 155.32, "high": 156.04, "low": 155.13, "close": 156.03, "volume": 83746800, "adjusted": 154.52},
            {"date": 15776, "open": 155.92, "high": 156.1, "low": 155.21, "close": 155.68, "volume": 105755800, "adjusted": 154.17},
            {"date": 15777, "open": 155.76, "high": 156.12, "low": 155.23, "close": 155.9, "volume": 92550900, "adjusted": 154.39},
            {"date": 15778, "open": 156.31, "high": 156.8, "low": 155.91, "close": 156.73, "volume": 126329900, "adjusted": 155.21},
            {"date": 15779, "open": 155.85, "high": 156.04, "low": 155.31, "close": 155.83, "volume": 138601100, "adjusted": 155.01},
            {"date": 15782, "open": 154.34, "high": 155.64, "low": 154.2, "close": 154.97, "volume": 126704300, "adjusted": 154.15},
            {"date": 15783, "open": 155.3, "high": 155.51, "low": 153.59, "close": 154.61, "volume": 167567300, "adjusted": 153.8},
            {"date": 15784, "open": 155.52, "high": 155.95, "low": 155.26, "close": 155.69, "volume": 113759300, "adjusted": 154.87},
            {"date": 15785, "open": 154.76, "high": 155.64, "low": 154.1, "close": 154.36, "volume": 128605000, "adjusted": 153.55},
            {"date": 15786, "open": 154.85, "high": 155.6, "low": 154.73, "close": 155.6, "volume": 111163600, "adjusted": 154.78},
            {"date": 15789, "open": 156.01, "high": 156.27, "low": 154.35, "close": 154.95, "volume": 151322300, "adjusted": 154.13},
            {"date": 15790, "open": 155.59, "high": 156.23, "low": 155.42, "close": 156.19, "volume": 86856600, "adjusted": 155.37},
            {"date": 15791, "open": 155.26, "high": 156.24, "low": 155, "close": 156.19, "volume": 99950600, "adjusted": 155.37},
            {"date": 15792, "open": 156.09, "high": 156.85, "low": 155.75, "close": 156.67, "volume": 102932800, "adjusted": 155.85},
            {"date": 15796, "open": 156.59, "high": 156.91, "low": 155.67, "close": 156.05, "volume": 99194100, "adjusted": 155.23},
            {"date": 15797, "open": 156.61, "high": 157.21, "low": 156.37, "close": 156.82, "volume": 101504300, "adjusted": 155.99},
            {"date": 15798, "open": 156.91, "high": 157.03, "low": 154.82, "close": 155.23, "volume": 154167400, "adjusted": 154.41},
            {"date": 15799, "open": 155.43, "high": 156.17, "low": 155.09, "close": 155.86, "volume": 131885000, "adjusted": 155.04},
            {"date": 15800, "open": 153.95, "high": 155.35, "low": 153.77, "close": 155.16, "volume": 159666000, "adjusted": 154.34},
            {"date": 15803, "open": 155.27, "high": 156.22, "low": 154.75, "close": 156.21, "volume": 86571200, "adjusted": 155.39},
            {"date": 15804, "open": 156.5, "high": 157.32, "low": 155.98, "close": 156.75, "volume": 101922200, "adjusted": 155.92},
            {"date": 15805, "open": 157.17, "high": 158.87, "low": 157.13, "close": 158.67, "volume": 135711100, "adjusted": 157.83},
            {"date": 15806, "open": 158.7, "high": 159.71, "low": 158.54, "close": 159.19, "volume": 110142500, "adjusted": 158.35},
            {"date": 15807, "open": 158.68, "high": 159.04, "low": 157.92, "close": 158.8, "volume": 116359900, "adjusted": 157.96},
            {"date": 15810, "open": 158, "high": 158.13, "low": 155.1, "close": 155.12, "volume": 217259000, "adjusted": 154.3},
            {"date": 15811, "open": 156.29, "high": 157.49, "low": 155.91, "close": 157.41, "volume": 147507800, "adjusted": 156.58},
            {"date": 15812, "open": 156.29, "high": 156.32, "low": 154.28, "close": 155.11, "volume": 226834800, "adjusted": 154.29},
            {"date": 15813, "open": 155.37, "high": 155.41, "low": 153.55, "close": 154.14, "volume": 167583200, "adjusted": 153.33},
            {"date": 15814, "open": 154.5, "high": 155.55, "low": 154.12, "close": 155.48, "volume": 149687600, "adjusted": 154.66},
            {"date": 15817, "open": 155.78, "high": 156.54, "low": 154.75, "close": 156.17, "volume": 106553500, "adjusted": 155.35},
            {"date": 15818, "open": 156.95, "high": 157.93, "low": 156.17, "close": 157.78, "volume": 166141300, "adjusted": 156.95},
            {"date": 15819, "open": 157.83, "high": 158.3, "low": 157.54, "close": 157.88, "volume": 96781200, "adjusted": 157.05},
            {"date": 15820, "open": 158.34, "high": 159.27, "low": 158.1, "close": 158.52, "volume": 131060600, "adjusted": 157.69},
            {"date": 15821, "open": 158.33, "high": 158.6, "low": 157.73, "close": 158.24, "volume": 95918800, "adjusted": 157.41},
            {"date": 15824, "open": 158.67, "high": 159.65, "low": 158.42, "close": 159.3, "volume": 88572800, "adjusted": 158.46},
            {"date": 15825, "open": 159.27, "high": 159.72, "low": 158.61, "close": 159.68, "volume": 116010700, "adjusted": 158.84},
            {"date": 15826, "open": 159.33, "high": 159.41, "low": 158.1, "close": 158.28, "volume": 138874200, "adjusted": 157.45},
            {"date": 15827, "open": 158.68, "high": 159.89, "low": 158.53, "close": 159.75, "volume": 96407600, "adjusted": 158.91},
            {"date": 15828, "open": 161.14, "high": 161.88, "low": 159.78, "close": 161.37, "volume": 144202300, "adjusted": 160.52},
            {"date": 15831, "open": 161.49, "high": 162.01, "low": 161.42, "close": 161.78, "volume": 66882100, "adjusted": 160.93},
            {"date": 15832, "open": 162.13, "high": 162.65, "low": 161.67, "close": 162.6, "volume": 90359200, "adjusted": 161.74},
            {"date": 15833, "open": 162.42, "high": 163.39, "low": 162.33, "close": 163.34, "volume": 97419200, "adjusted": 162.48},
            {"date": 15834, "open": 163.27, "high": 163.7, "low": 162.47, "close": 162.88, "volume": 106738600, "adjusted": 162.02},
            {"date": 15835, "open": 162.99, "high": 163.55, "low": 162.51, "close": 163.41, "volume": 103203000, "adjusted": 162.55},
            {"date": 15838, "open": 163.2, "high": 163.81, "low": 162.82, "close": 163.54, "volume": 81843200, "adjusted": 162.68},
            {"date": 15839, "open": 163.67, "high": 165.35, "low": 163.67, "close": 165.23, "volume": 119000900, "adjusted": 164.36},
            {"date": 15840, "open": 164.96, "high": 166.45, "low": 164.91, "close": 166.12, "volume": 120718500, "adjusted": 165.25},
            {"date": 15841, "open": 165.78, "high": 166.36, "low": 165.09, "close": 165.34, "volume": 109913600, "adjusted": 164.47},
            {"date": 15842, "open": 165.95, "high": 167.04, "low": 165.73, "close": 166.94, "volume": 129801000, "adjusted": 166.06},
            {"date": 15845, "open": 166.78, "high": 167.58, "low": 166.61, "close": 166.93, "volume": 85071200, "adjusted": 166.05},
            {"date": 15846, "open": 167.08, "high": 167.8, "low": 166.5, "close": 167.17, "volume": 95804200, "adjusted": 166.29},
            {"date": 15847, "open": 167.34, "high": 169.07, "low": 165.17, "close": 165.93, "volume": 244031800, "adjusted": 165.06},
            {"date": 15848, "open": 164.16, "high": 165.91, "low": 163.94, "close": 165.45, "volume": 211064400, "adjusted": 164.58},
            {"date": 15849, "open": 164.47, "high": 165.38, "low": 163.98, "close": 165.31, "volume": 151573900, "adjusted": 164.44},
            {"date": 15853, "open": 167.04, "high": 167.78, "low": 165.81, "close": 166.3, "volume": 143679800, "adjusted": 165.42},
            {"date": 15854, "open": 165.42, "high": 165.8, "low": 164.34, "close": 165.22, "volume": 160363400, "adjusted": 164.35},
            {"date": 15855, "open": 165.35, "high": 166.59, "low": 165.22, "close": 165.83, "volume": 107793800, "adjusted": 164.96},
            {"date": 15856, "open": 165.37, "high": 166.31, "low": 163.13, "close": 163.45, "volume": 176850100, "adjusted": 162.59},
            {"date": 15859, "open": 163.83, "high": 164.46, "low": 162.66, "close": 164.35, "volume": 168390700, "adjusted": 163.48},
            {"date": 15860, "open": 164.44, "high": 165.1, "low": 162.73, "close": 163.56, "volume": 157631500, "adjusted": 162.7},
            {"date": 15861, "open": 163.09, "high": 163.42, "low": 161.13, "close": 161.27, "volume": 211737800, "adjusted": 160.42},
            {"date": 15862, "open": 161.2, "high": 162.74, "low": 160.25, "close": 162.73, "volume": 200225500, "adjusted": 161.87},
            {"date": 15863, "open": 163.85, "high": 164.95, "low": 163.14, "close": 164.8, "volume": 188337800, "adjusted": 163.93},
            {"date": 15866, "open": 165.31, "high": 165.4, "low": 164.37, "close": 164.8, "volume": 105667100, "adjusted": 163.93},
            {"date": 15867, "open": 163.3, "high": 164.54, "low": 162.74, "close": 163.1, "volume": 159505400, "adjusted": 162.24},
            {"date": 15868, "open": 164.22, "high": 164.39, "low": 161.6, "close": 161.75, "volume": 177361500, "adjusted": 160.9},
            {"date": 15869, "open": 161.66, "high": 164.5, "low": 161.3, "close": 164.21, "volume": 163587800, "adjusted": 163.35},
            {"date": 15870, "open": 164.03, "high": 164.67, "low": 162.91, "close": 163.18, "volume": 141197500, "adjusted": 162.32},
            {"date": 15873, "open": 164.29, "high": 165.22, "low": 163.22, "close": 164.44, "volume": 136295600, "adjusted": 163.57},
            {"date": 15874, "open": 164.53, "high": 165.99, "low": 164.52, "close": 165.74, "volume": 114695600, "adjusted": 164.87},
            {"date": 15875, "open": 165.6, "high": 165.89, "low": 163.38, "close": 163.45, "volume": 206149500, "adjusted": 162.59},
            {"date": 15876, "open": 161.86, "high": 163.47, "low": 158.98, "close": 159.4, "volume": 321255900, "adjusted": 158.56},
            {"date": 15877, "open": 159.64, "high": 159.76, "low": 157.47, "close": 159.07, "volume": 271956800, "adjusted": 159.07},
            {"date": 15880, "open": 157.41, "high": 158.43, "low": 155.73, "close": 157.06, "volume": 222329000, "adjusted": 157.06},
            {"date": 15881, "open": 158.48, "high": 160.1, "low": 157.42, "close": 158.57, "volume": 162262200, "adjusted": 158.57},
            {"date": 15882, "open": 159.87, "high": 160.5, "low": 159.25, "close": 160.14, "volume": 134848000, "adjusted": 160.14},
            {"date": 15883, "open": 161.1, "high": 161.82, "low": 160.95, "close": 161.08, "volume": 129483700, "adjusted": 161.08},
            {"date": 15884, "open": 160.63, "high": 161.4, "low": 159.86, "close": 160.42, "volume": 160402900, "adjusted": 160.42},
            {"date": 15887, "open": 161.26, "high": 162.48, "low": 161.08, "close": 161.36, "volume": 131954800, "adjusted": 161.36},
            {"date": 15888, "open": 161.12, "high": 162.3, "low": 160.5, "close": 161.21, "volume": 154863700, "adjusted": 161.21},
            {"date": 15889, "open": 160.48, "high": 161.77, "low": 160.22, "close": 161.28, "volume": 75216400, "adjusted": 161.28},
            {"date": 15891, "open": 162.47, "high": 163.08, "low": 161.3, "close": 163.02, "volume": 122416900, "adjusted": 163.02},
            {"date": 15894, "open": 163.86, "high": 164.39, "low": 163.08, "close": 163.95, "volume": 108092500, "adjusted": 163.95},
            {"date": 15895, "open": 164.98, "high": 165.33, "low": 164.27, "close": 165.13, "volume": 119298000, "adjusted": 165.13},
            {"date": 15896, "open": 164.97, "high": 165.75, "low": 164.63, "close": 165.19, "volume": 121410100, "adjusted": 165.19},
            {"date": 15897, "open": 167.11, "high": 167.61, "low": 165.18, "close": 167.44, "volume": 135592200, "adjusted": 167.44},
            {"date": 15898, "open": 167.39, "high": 167.93, "low": 167.13, "close": 167.51, "volume": 104212700, "adjusted": 167.51},
            {"date": 15901, "open": 167.97, "high": 168.39, "low": 167.68, "close": 168.15, "volume": 69450600, "adjusted": 168.15},
            {"date": 15902, "open": 168.26, "high": 168.36, "low": 167.07, "close": 167.52, "volume": 88702100, "adjusted": 167.52},
            {"date": 15903, "open": 168.16, "high": 168.48, "low": 167.73, "close": 167.95, "volume": 92873900, "adjusted": 167.95},
            {"date": 15904, "open": 168.31, "high": 169.27, "low": 168.2, "close": 168.87, "volume": 103620100, "adjusted": 168.87},
            {"date": 15905, "open": 168.52, "high": 169.23, "low": 168.31, "close": 169.17, "volume": 103831700, "adjusted": 169.17},
            {"date": 15908, "open": 169.41, "high": 169.74, "low": 169.01, "close": 169.5, "volume": 79428600, "adjusted": 169.5},
            {"date": 15909, "open": 169.8, "high": 169.83, "low": 169.05, "close": 169.14, "volume": 80829700, "adjusted": 169.14},
            {"date": 15910, "open": 169.79, "high": 169.86, "low": 168.18, "close": 168.52, "volume": 112914000, "adjusted": 168.52},
            {"date": 15911, "open": 168.22, "high": 169.08, "low": 167.94, "close": 168.93, "volume": 111088600, "adjusted": 168.93},
            {"date": 15912, "open": 168.22, "high": 169.16, "low": 167.52, "close": 169.11, "volume": 107814600, "adjusted": 169.11},
            {"date": 15915, "open": 168.68, "high": 169.06, "low": 168.11, "close": 168.59, "volume": 79695000, "adjusted": 168.59},
            {"date": 15916, "open": 169.1, "high": 169.28, "low": 168.19, "close": 168.59, "volume": 85209600, "adjusted": 168.59},
            {"date": 15917, "open": 168.94, "high": 169.85, "low": 168.49, "close": 168.71, "volume": 142388700, "adjusted": 168.71},
            {"date": 15918, "open": 169.99, "high": 170.81, "low": 169.9, "close": 170.66, "volume": 110438400, "adjusted": 170.66},
            {"date": 15919, "open": 170.28, "high": 170.97, "low": 170.05, "close": 170.95, "volume": 91116700, "adjusted": 170.95},
            {"date": 15922, "open": 170.57, "high": 170.96, "low": 170.35, "close": 170.7, "volume": 54072700, "adjusted": 170.7},
            {"date": 15923, "open": 170.37, "high": 170.74, "low": 169.35, "close": 169.73, "volume": 87495000, "adjusted": 169.73},
            {"date": 15924, "open": 169.19, "high": 169.43, "low": 168.55, "close": 169.18, "volume": 84854700, "adjusted": 169.18},
            {"date": 15925, "open": 169.98, "high": 170.18, "low": 168.93, "close": 169.8, "volume": 102181300, "adjusted": 169.8},
            {"date": 15926, "open": 169.58, "high": 170.1, "low": 168.72, "close": 169.31, "volume": 91757700, "adjusted": 169.31},
            {"date": 15929, "open": 168.46, "high": 169.31, "low": 168.38, "close": 169.11, "volume": 68593300, "adjusted": 169.11},
            {"date": 15930, "open": 169.41, "high": 169.9, "low": 168.41, "close": 169.61, "volume": 80806000, "adjusted": 169.61},
            {"date": 15931, "open": 169.53, "high": 169.8, "low": 168.7, "close": 168.74, "volume": 79829200, "adjusted": 168.74},
            {"date": 15932, "open": 167.41, "high": 167.43, "low": 166.09, "close": 166.38, "volume": 152931800, "adjusted": 166.38},
            {"date": 15933, "open": 166.06, "high": 166.63, "low": 165.5, "close": 165.83, "volume": 130868200, "adjusted": 165.83},
            {"date": 15936, "open": 165.64, "high": 166.21, "low": 164.76, "close": 164.77, "volume": 96437600, "adjusted": 164.77},
            {"date": 15937, "open": 165.04, "high": 166.2, "low": 164.86, "close": 165.58, "volume": 89294400, "adjusted": 165.58},
            {"date": 15938, "open": 165.12, "high": 166.03, "low": 164.19, "close": 164.56, "volume": 159530500, "adjusted": 164.56},
            {"date": 15939, "open": 164.9, "high": 166.3, "low": 164.89, "close": 166.06, "volume": 101471400, "adjusted": 166.06},
            {"date": 15940, "open": 166.55, "high": 166.83, "low": 165.77, "close": 166.62, "volume": 90888900, "adjusted": 166.62},
            {"date": 15943, "open": 166.79, "high": 167.3, "low": 165.89, "close": 166, "volume": 89702100, "adjusted": 166},
            {"date": 15944, "open": 164.36, "high": 166, "low": 163.21, "close": 163.33, "volume": 158619400, "adjusted": 163.33},
            {"date": 15945, "open": 163.26, "high": 164.49, "low": 163.05, "close": 163.91, "volume": 108113000, "adjusted": 163.91},
            {"date": 15946, "open": 163.55, "high": 165.04, "low": 163.4, "close": 164.17, "volume": 119200500, "adjusted": 164.17},
            {"date": 15947, "open": 164.51, "high": 164.53, "low": 163.17, "close": 163.65, "volume": 134560800, "adjusted": 163.65},
            {"date": 15951, "open": 165.23, "high": 165.58, "low": 163.7, "close": 164.39, "volume": 142322300, "adjusted": 164.39},
            {"date": 15952, "open": 164.43, "high": 166.03, "low": 164.13, "close": 165.75, "volume": 97304000, "adjusted": 165.75},
            {"date": 15953, "open": 165.85, "high": 166.4, "low": 165.73, "close": 165.96, "volume": 62930500, "adjusted": 165.96}
        ]}];
    }])
'use strict';

angular.module('chart-components')

    .controller('parallelCoordinatesCtrl', ["$scope", function($scope){
        $scope.options = {
            chart: {
                type: 'parallelCoordinates',
                height: 450,
                margin: {
                    top: 30,
                    right: 0,
                    bottom: 10,
                    left: 0
                },
                dimensions: [
                    "economy (mpg)",
                    "cylinders",
                    "displacement (cc)",
                    "power (hp)",
                    "weight (lb)",
                    "0-60 mph (s)",
                    "year"
                ]
            }
        };

        $scope.data = data();

        function data() {
            return [
                {
                    "name": "AMC Ambassador Brougham",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "360",
                    "power (hp)": "175",
                    "weight (lb)": "3821",
                    "0-60 mph (s)": "11",
                    "year": "73"
                },
                {
                    "name": "AMC Ambassador DPL",
                    "economy (mpg)": "15",
                    "cylinders": "8",
                    "displacement (cc)": "390",
                    "power (hp)": "190",
                    "weight (lb)": "3850",
                    "0-60 mph (s)": "8.5",
                    "year": "70"
                },
                {
                    "name": "AMC Ambassador SST",
                    "economy (mpg)": "17",
                    "cylinders": "8",
                    "displacement (cc)": "304",
                    "power (hp)": "150",
                    "weight (lb)": "3672",
                    "0-60 mph (s)": "11.5",
                    "year": "72"
                },
                {
                    "name": "AMC Concord DL 6",
                    "economy (mpg)": "20.2",
                    "cylinders": "6",
                    "displacement (cc)": "232",
                    "power (hp)": "90",
                    "weight (lb)": "3265",
                    "0-60 mph (s)": "18.2",
                    "year": "79"
                },
                {
                    "name": "AMC Concord DL",
                    "economy (mpg)": "18.1",
                    "cylinders": "6",
                    "displacement (cc)": "258",
                    "power (hp)": "120",
                    "weight (lb)": "3410",
                    "0-60 mph (s)": "15.1",
                    "year": "78"
                },
                {
                    "name": "AMC Concord DL",
                    "economy (mpg)": "23",
                    "cylinders": "4",
                    "displacement (cc)": "151",
                    "power (hp)": "",
                    "weight (lb)": "3035",
                    "0-60 mph (s)": "20.5",
                    "year": "82"
                },
                {
                    "name": "AMC Concord",
                    "economy (mpg)": "19.4",
                    "cylinders": "6",
                    "displacement (cc)": "232",
                    "power (hp)": "90",
                    "weight (lb)": "3210",
                    "0-60 mph (s)": "17.2",
                    "year": "78"
                },
                {
                    "name": "AMC Concord",
                    "economy (mpg)": "24.3",
                    "cylinders": "4",
                    "displacement (cc)": "151",
                    "power (hp)": "90",
                    "weight (lb)": "3003",
                    "0-60 mph (s)": "20.1",
                    "year": "80"
                },
                {
                    "name": "AMC Gremlin",
                    "economy (mpg)": "18",
                    "cylinders": "6",
                    "displacement (cc)": "232",
                    "power (hp)": "100",
                    "weight (lb)": "2789",
                    "0-60 mph (s)": "15",
                    "year": "73"
                },
                {
                    "name": "AMC Gremlin",
                    "economy (mpg)": "19",
                    "cylinders": "6",
                    "displacement (cc)": "232",
                    "power (hp)": "100",
                    "weight (lb)": "2634",
                    "0-60 mph (s)": "13",
                    "year": "71"
                },
                {
                    "name": "AMC Gremlin",
                    "economy (mpg)": "20",
                    "cylinders": "6",
                    "displacement (cc)": "232",
                    "power (hp)": "100",
                    "weight (lb)": "2914",
                    "0-60 mph (s)": "16",
                    "year": "75"
                },
                {
                    "name": "AMC Gremlin",
                    "economy (mpg)": "21",
                    "cylinders": "6",
                    "displacement (cc)": "199",
                    "power (hp)": "90",
                    "weight (lb)": "2648",
                    "0-60 mph (s)": "15",
                    "year": "70"
                },
                {
                    "name": "AMC Hornet Sportabout (Wagon)",
                    "economy (mpg)": "18",
                    "cylinders": "6",
                    "displacement (cc)": "258",
                    "power (hp)": "110",
                    "weight (lb)": "2962",
                    "0-60 mph (s)": "13.5",
                    "year": "71"
                },
                {
                    "name": "AMC Hornet",
                    "economy (mpg)": "18",
                    "cylinders": "6",
                    "displacement (cc)": "199",
                    "power (hp)": "97",
                    "weight (lb)": "2774",
                    "0-60 mph (s)": "15.5",
                    "year": "70"
                },
                {
                    "name": "AMC Hornet",
                    "economy (mpg)": "18",
                    "cylinders": "6",
                    "displacement (cc)": "232",
                    "power (hp)": "100",
                    "weight (lb)": "2945",
                    "0-60 mph (s)": "16",
                    "year": "73"
                },
                {
                    "name": "AMC Hornet",
                    "economy (mpg)": "19",
                    "cylinders": "6",
                    "displacement (cc)": "232",
                    "power (hp)": "100",
                    "weight (lb)": "2901",
                    "0-60 mph (s)": "16",
                    "year": "74"
                },
                {
                    "name": "AMC Hornet",
                    "economy (mpg)": "22.5",
                    "cylinders": "6",
                    "displacement (cc)": "232",
                    "power (hp)": "90",
                    "weight (lb)": "3085",
                    "0-60 mph (s)": "17.6",
                    "year": "76"
                },
                {
                    "name": "AMC Matador (Wagon)",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "304",
                    "power (hp)": "150",
                    "weight (lb)": "4257",
                    "0-60 mph (s)": "15.5",
                    "year": "74"
                },
                {
                    "name": "AMC Matador (Wagon)",
                    "economy (mpg)": "15",
                    "cylinders": "8",
                    "displacement (cc)": "304",
                    "power (hp)": "150",
                    "weight (lb)": "3892",
                    "0-60 mph (s)": "12.5",
                    "year": "72"
                },
                {
                    "name": "AMC Matador",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "304",
                    "power (hp)": "150",
                    "weight (lb)": "3672",
                    "0-60 mph (s)": "11.5",
                    "year": "73"
                },
                {
                    "name": "AMC Matador",
                    "economy (mpg)": "15",
                    "cylinders": "6",
                    "displacement (cc)": "258",
                    "power (hp)": "110",
                    "weight (lb)": "3730",
                    "0-60 mph (s)": "19",
                    "year": "75"
                },
                {
                    "name": "AMC Matador",
                    "economy (mpg)": "15.5",
                    "cylinders": "8",
                    "displacement (cc)": "304",
                    "power (hp)": "120",
                    "weight (lb)": "3962",
                    "0-60 mph (s)": "13.9",
                    "year": "76"
                },
                {
                    "name": "AMC Matador",
                    "economy (mpg)": "16",
                    "cylinders": "6",
                    "displacement (cc)": "258",
                    "power (hp)": "110",
                    "weight (lb)": "3632",
                    "0-60 mph (s)": "18",
                    "year": "74"
                },
                {
                    "name": "AMC Matador",
                    "economy (mpg)": "18",
                    "cylinders": "6",
                    "displacement (cc)": "232",
                    "power (hp)": "100",
                    "weight (lb)": "3288",
                    "0-60 mph (s)": "15.5",
                    "year": "71"
                },
                {
                    "name": "AMC Pacer D/L",
                    "economy (mpg)": "17.5",
                    "cylinders": "6",
                    "displacement (cc)": "258",
                    "power (hp)": "95",
                    "weight (lb)": "3193",
                    "0-60 mph (s)": "17.8",
                    "year": "76"
                },
                {
                    "name": "AMC Pacer",
                    "economy (mpg)": "19",
                    "cylinders": "6",
                    "displacement (cc)": "232",
                    "power (hp)": "90",
                    "weight (lb)": "3211",
                    "0-60 mph (s)": "17",
                    "year": "75"
                },
                {
                    "name": "AMC Rebel SST (Wagon)",
                    "economy (mpg)": "",
                    "cylinders": "8",
                    "displacement (cc)": "360",
                    "power (hp)": "175",
                    "weight (lb)": "3850",
                    "0-60 mph (s)": "11",
                    "year": "70"
                },
                {
                    "name": "AMC Rebel SST",
                    "economy (mpg)": "16",
                    "cylinders": "8",
                    "displacement (cc)": "304",
                    "power (hp)": "150",
                    "weight (lb)": "3433",
                    "0-60 mph (s)": "12",
                    "year": "70"
                },
                {
                    "name": "AMC Spirit DL",
                    "economy (mpg)": "27.4",
                    "cylinders": "4",
                    "displacement (cc)": "121",
                    "power (hp)": "80",
                    "weight (lb)": "2670",
                    "0-60 mph (s)": "15",
                    "year": "79"
                },
                {
                    "name": "Audi 100 LS",
                    "economy (mpg)": "20",
                    "cylinders": "4",
                    "displacement (cc)": "114",
                    "power (hp)": "91",
                    "weight (lb)": "2582",
                    "0-60 mph (s)": "14",
                    "year": "73"
                },
                {
                    "name": "Audi 100 LS",
                    "economy (mpg)": "23",
                    "cylinders": "4",
                    "displacement (cc)": "115",
                    "power (hp)": "95",
                    "weight (lb)": "2694",
                    "0-60 mph (s)": "15",
                    "year": "75"
                },
                {
                    "name": "Audi 100 LS",
                    "economy (mpg)": "24",
                    "cylinders": "4",
                    "displacement (cc)": "107",
                    "power (hp)": "90",
                    "weight (lb)": "2430",
                    "0-60 mph (s)": "14.5",
                    "year": "70"
                },
                {
                    "name": "Audi 4000",
                    "economy (mpg)": "34.3",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "78",
                    "weight (lb)": "2188",
                    "0-60 mph (s)": "15.8",
                    "year": "80"
                },
                {
                    "name": "Audi 5000",
                    "economy (mpg)": "20.3",
                    "cylinders": "5",
                    "displacement (cc)": "131",
                    "power (hp)": "103",
                    "weight (lb)": "2830",
                    "0-60 mph (s)": "15.9",
                    "year": "78"
                },
                {
                    "name": "Audi 5000S (Diesel)",
                    "economy (mpg)": "36.4",
                    "cylinders": "5",
                    "displacement (cc)": "121",
                    "power (hp)": "67",
                    "weight (lb)": "2950",
                    "0-60 mph (s)": "19.9",
                    "year": "80"
                },
                {
                    "name": "Audi Fox",
                    "economy (mpg)": "29",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "83",
                    "weight (lb)": "2219",
                    "0-60 mph (s)": "16.5",
                    "year": "74"
                },
                {
                    "name": "BMW 2002",
                    "economy (mpg)": "26",
                    "cylinders": "4",
                    "displacement (cc)": "121",
                    "power (hp)": "113",
                    "weight (lb)": "2234",
                    "0-60 mph (s)": "12.5",
                    "year": "70"
                },
                {
                    "name": "BMW 320i",
                    "economy (mpg)": "21.5",
                    "cylinders": "4",
                    "displacement (cc)": "121",
                    "power (hp)": "110",
                    "weight (lb)": "2600",
                    "0-60 mph (s)": "12.8",
                    "year": "77"
                },
                {
                    "name": "Buick Century 350",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "175",
                    "weight (lb)": "4100",
                    "0-60 mph (s)": "13",
                    "year": "73"
                },
                {
                    "name": "Buick Century Limited",
                    "economy (mpg)": "25",
                    "cylinders": "6",
                    "displacement (cc)": "181",
                    "power (hp)": "110",
                    "weight (lb)": "2945",
                    "0-60 mph (s)": "16.4",
                    "year": "82"
                },
                {
                    "name": "Buick Century Luxus (Wagon)",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "150",
                    "weight (lb)": "4699",
                    "0-60 mph (s)": "14.5",
                    "year": "74"
                },
                {
                    "name": "Buick Century Special",
                    "economy (mpg)": "20.6",
                    "cylinders": "6",
                    "displacement (cc)": "231",
                    "power (hp)": "105",
                    "weight (lb)": "3380",
                    "0-60 mph (s)": "15.8",
                    "year": "78"
                },
                {
                    "name": "Buick Century",
                    "economy (mpg)": "17",
                    "cylinders": "6",
                    "displacement (cc)": "231",
                    "power (hp)": "110",
                    "weight (lb)": "3907",
                    "0-60 mph (s)": "21",
                    "year": "75"
                },
                {
                    "name": "Buick Century",
                    "economy (mpg)": "22.4",
                    "cylinders": "6",
                    "displacement (cc)": "231",
                    "power (hp)": "110",
                    "weight (lb)": "3415",
                    "0-60 mph (s)": "15.8",
                    "year": "81"
                },
                {
                    "name": "Buick Electra 225 Custom",
                    "economy (mpg)": "12",
                    "cylinders": "8",
                    "displacement (cc)": "455",
                    "power (hp)": "225",
                    "weight (lb)": "4951",
                    "0-60 mph (s)": "11",
                    "year": "73"
                },
                {
                    "name": "Buick Estate Wagon (Wagon)",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "455",
                    "power (hp)": "225",
                    "weight (lb)": "3086",
                    "0-60 mph (s)": "10",
                    "year": "70"
                },
                {
                    "name": "Buick Estate Wagon (Wagon)",
                    "economy (mpg)": "16.9",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "155",
                    "weight (lb)": "4360",
                    "0-60 mph (s)": "14.9",
                    "year": "79"
                },
                {
                    "name": "Buick Lesabre Custom",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "155",
                    "weight (lb)": "4502",
                    "0-60 mph (s)": "13.5",
                    "year": "72"
                },
                {
                    "name": "Buick Opel Isuzu Deluxe",
                    "economy (mpg)": "30",
                    "cylinders": "4",
                    "displacement (cc)": "111",
                    "power (hp)": "80",
                    "weight (lb)": "2155",
                    "0-60 mph (s)": "14.8",
                    "year": "77"
                },
                {
                    "name": "Buick Regal Sport Coupe (Turbo)",
                    "economy (mpg)": "17.7",
                    "cylinders": "6",
                    "displacement (cc)": "231",
                    "power (hp)": "165",
                    "weight (lb)": "3445",
                    "0-60 mph (s)": "13.4",
                    "year": "78"
                },
                {
                    "name": "Buick Skyhawk",
                    "economy (mpg)": "21",
                    "cylinders": "6",
                    "displacement (cc)": "231",
                    "power (hp)": "110",
                    "weight (lb)": "3039",
                    "0-60 mph (s)": "15",
                    "year": "75"
                },
                {
                    "name": "Buick Skylark 320",
                    "economy (mpg)": "15",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "165",
                    "weight (lb)": "3693",
                    "0-60 mph (s)": "11.5",
                    "year": "70"
                },
                {
                    "name": "Buick Skylark Limited",
                    "economy (mpg)": "28.4",
                    "cylinders": "4",
                    "displacement (cc)": "151",
                    "power (hp)": "90",
                    "weight (lb)": "2670",
                    "0-60 mph (s)": "16",
                    "year": "79"
                },
                {
                    "name": "Buick Skylark",
                    "economy (mpg)": "20.5",
                    "cylinders": "6",
                    "displacement (cc)": "231",
                    "power (hp)": "105",
                    "weight (lb)": "3425",
                    "0-60 mph (s)": "16.9",
                    "year": "77"
                },
                {
                    "name": "Buick Skylark",
                    "economy (mpg)": "26.6",
                    "cylinders": "4",
                    "displacement (cc)": "151",
                    "power (hp)": "84",
                    "weight (lb)": "2635",
                    "0-60 mph (s)": "16.4",
                    "year": "81"
                },
                {
                    "name": "Cadillac Eldorado",
                    "economy (mpg)": "23",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "125",
                    "weight (lb)": "3900",
                    "0-60 mph (s)": "17.4",
                    "year": "79"
                },
                {
                    "name": "Cadillac Seville",
                    "economy (mpg)": "16.5",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "180",
                    "weight (lb)": "4380",
                    "0-60 mph (s)": "12.1",
                    "year": "76"
                },
                {
                    "name": "Chevroelt Chevelle Malibu",
                    "economy (mpg)": "16",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "105",
                    "weight (lb)": "3897",
                    "0-60 mph (s)": "18.5",
                    "year": "75"
                },
                {
                    "name": "Chevrolet Bel Air",
                    "economy (mpg)": "15",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "145",
                    "weight (lb)": "4440",
                    "0-60 mph (s)": "14",
                    "year": "75"
                },
                {
                    "name": "Chevrolet Camaro",
                    "economy (mpg)": "27",
                    "cylinders": "4",
                    "displacement (cc)": "151",
                    "power (hp)": "90",
                    "weight (lb)": "2950",
                    "0-60 mph (s)": "17.3",
                    "year": "82"
                },
                {
                    "name": "Chevrolet Caprice Classic",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "400",
                    "power (hp)": "150",
                    "weight (lb)": "4464",
                    "0-60 mph (s)": "12",
                    "year": "73"
                },
                {
                    "name": "Chevrolet Caprice Classic",
                    "economy (mpg)": "17",
                    "cylinders": "8",
                    "displacement (cc)": "305",
                    "power (hp)": "130",
                    "weight (lb)": "3840",
                    "0-60 mph (s)": "15.4",
                    "year": "79"
                },
                {
                    "name": "Chevrolet Caprice Classic",
                    "economy (mpg)": "17.5",
                    "cylinders": "8",
                    "displacement (cc)": "305",
                    "power (hp)": "145",
                    "weight (lb)": "3880",
                    "0-60 mph (s)": "12.5",
                    "year": "77"
                },
                {
                    "name": "Chevrolet Cavalier 2-Door",
                    "economy (mpg)": "34",
                    "cylinders": "4",
                    "displacement (cc)": "112",
                    "power (hp)": "88",
                    "weight (lb)": "2395",
                    "0-60 mph (s)": "18",
                    "year": "82"
                },
                {
                    "name": "Chevrolet Cavalier Wagon",
                    "economy (mpg)": "27",
                    "cylinders": "4",
                    "displacement (cc)": "112",
                    "power (hp)": "88",
                    "weight (lb)": "2640",
                    "0-60 mph (s)": "18.6",
                    "year": "82"
                },
                {
                    "name": "Chevrolet Cavalier",
                    "economy (mpg)": "28",
                    "cylinders": "4",
                    "displacement (cc)": "112",
                    "power (hp)": "88",
                    "weight (lb)": "2605",
                    "0-60 mph (s)": "19.6",
                    "year": "82"
                },
                {
                    "name": "Chevrolet Chevelle Concours (Wagon)",
                    "economy (mpg)": "",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "165",
                    "weight (lb)": "4142",
                    "0-60 mph (s)": "11.5",
                    "year": "70"
                },
                {
                    "name": "Chevrolet Chevelle Concours (Wagon)",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "307",
                    "power (hp)": "130",
                    "weight (lb)": "4098",
                    "0-60 mph (s)": "14",
                    "year": "72"
                },
                {
                    "name": "Chevrolet Chevelle Malibu Classic",
                    "economy (mpg)": "16",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "100",
                    "weight (lb)": "3781",
                    "0-60 mph (s)": "17",
                    "year": "74"
                },
                {
                    "name": "Chevrolet Chevelle Malibu Classic",
                    "economy (mpg)": "17.5",
                    "cylinders": "8",
                    "displacement (cc)": "305",
                    "power (hp)": "140",
                    "weight (lb)": "4215",
                    "0-60 mph (s)": "13",
                    "year": "76"
                },
                {
                    "name": "Chevrolet Chevelle Malibu",
                    "economy (mpg)": "17",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "100",
                    "weight (lb)": "3329",
                    "0-60 mph (s)": "15.5",
                    "year": "71"
                },
                {
                    "name": "Chevrolet Chevelle Malibu",
                    "economy (mpg)": "18",
                    "cylinders": "8",
                    "displacement (cc)": "307",
                    "power (hp)": "130",
                    "weight (lb)": "3504",
                    "0-60 mph (s)": "12",
                    "year": "70"
                },
                {
                    "name": "Chevrolet Chevette",
                    "economy (mpg)": "29",
                    "cylinders": "4",
                    "displacement (cc)": "85",
                    "power (hp)": "52",
                    "weight (lb)": "2035",
                    "0-60 mph (s)": "22.2",
                    "year": "76"
                },
                {
                    "name": "Chevrolet Chevette",
                    "economy (mpg)": "30",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "68",
                    "weight (lb)": "2155",
                    "0-60 mph (s)": "16.5",
                    "year": "78"
                },
                {
                    "name": "Chevrolet Chevette",
                    "economy (mpg)": "30.5",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "63",
                    "weight (lb)": "2051",
                    "0-60 mph (s)": "17",
                    "year": "77"
                },
                {
                    "name": "Chevrolet Chevette",
                    "economy (mpg)": "32.1",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "70",
                    "weight (lb)": "2120",
                    "0-60 mph (s)": "15.5",
                    "year": "80"
                },
                {
                    "name": "Chevrolet Citation",
                    "economy (mpg)": "23.5",
                    "cylinders": "6",
                    "displacement (cc)": "173",
                    "power (hp)": "110",
                    "weight (lb)": "2725",
                    "0-60 mph (s)": "12.6",
                    "year": "81"
                },
                {
                    "name": "Chevrolet Citation",
                    "economy (mpg)": "28",
                    "cylinders": "4",
                    "displacement (cc)": "151",
                    "power (hp)": "90",
                    "weight (lb)": "2678",
                    "0-60 mph (s)": "16.5",
                    "year": "80"
                },
                {
                    "name": "Chevrolet Citation",
                    "economy (mpg)": "28.8",
                    "cylinders": "6",
                    "displacement (cc)": "173",
                    "power (hp)": "115",
                    "weight (lb)": "2595",
                    "0-60 mph (s)": "11.3",
                    "year": "79"
                },
                {
                    "name": "Chevrolet Concours",
                    "economy (mpg)": "17.5",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "110",
                    "weight (lb)": "3520",
                    "0-60 mph (s)": "16.4",
                    "year": "77"
                },
                {
                    "name": "Chevrolet Impala",
                    "economy (mpg)": "11",
                    "cylinders": "8",
                    "displacement (cc)": "400",
                    "power (hp)": "150",
                    "weight (lb)": "4997",
                    "0-60 mph (s)": "14",
                    "year": "73"
                },
                {
                    "name": "Chevrolet Impala",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "165",
                    "weight (lb)": "4274",
                    "0-60 mph (s)": "12",
                    "year": "72"
                },
                {
                    "name": "Chevrolet Impala",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "165",
                    "weight (lb)": "4209",
                    "0-60 mph (s)": "12",
                    "year": "71"
                },
                {
                    "name": "Chevrolet Impala",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "454",
                    "power (hp)": "220",
                    "weight (lb)": "4354",
                    "0-60 mph (s)": "9",
                    "year": "70"
                },
                {
                    "name": "Chevrolet Malibu Classic (Wagon)",
                    "economy (mpg)": "19.2",
                    "cylinders": "8",
                    "displacement (cc)": "267",
                    "power (hp)": "125",
                    "weight (lb)": "3605",
                    "0-60 mph (s)": "15",
                    "year": "79"
                },
                {
                    "name": "Chevrolet Malibu",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "145",
                    "weight (lb)": "3988",
                    "0-60 mph (s)": "13",
                    "year": "73"
                },
                {
                    "name": "Chevrolet Malibu",
                    "economy (mpg)": "20.5",
                    "cylinders": "6",
                    "displacement (cc)": "200",
                    "power (hp)": "95",
                    "weight (lb)": "3155",
                    "0-60 mph (s)": "18.2",
                    "year": "78"
                },
                {
                    "name": "Chevrolet Monte Carlo Landau",
                    "economy (mpg)": "15.5",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "170",
                    "weight (lb)": "4165",
                    "0-60 mph (s)": "11.4",
                    "year": "77"
                },
                {
                    "name": "Chevrolet Monte Carlo Landau",
                    "economy (mpg)": "19.2",
                    "cylinders": "8",
                    "displacement (cc)": "305",
                    "power (hp)": "145",
                    "weight (lb)": "3425",
                    "0-60 mph (s)": "13.2",
                    "year": "78"
                },
                {
                    "name": "Chevrolet Monte Carlo S",
                    "economy (mpg)": "15",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "145",
                    "weight (lb)": "4082",
                    "0-60 mph (s)": "13",
                    "year": "73"
                },
                {
                    "name": "Chevrolet Monte Carlo",
                    "economy (mpg)": "15",
                    "cylinders": "8",
                    "displacement (cc)": "400",
                    "power (hp)": "150",
                    "weight (lb)": "3761",
                    "0-60 mph (s)": "9.5",
                    "year": "70"
                },
                {
                    "name": "Chevrolet Monza 2+2",
                    "economy (mpg)": "20",
                    "cylinders": "8",
                    "displacement (cc)": "262",
                    "power (hp)": "110",
                    "weight (lb)": "3221",
                    "0-60 mph (s)": "13.5",
                    "year": "75"
                },
                {
                    "name": "Chevrolet Nova Custom",
                    "economy (mpg)": "16",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "100",
                    "weight (lb)": "3278",
                    "0-60 mph (s)": "18",
                    "year": "73"
                },
                {
                    "name": "Chevrolet Nova",
                    "economy (mpg)": "15",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "100",
                    "weight (lb)": "3336",
                    "0-60 mph (s)": "17",
                    "year": "74"
                },
                {
                    "name": "Chevrolet Nova",
                    "economy (mpg)": "18",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "105",
                    "weight (lb)": "3459",
                    "0-60 mph (s)": "16",
                    "year": "75"
                },
                {
                    "name": "Chevrolet Nova",
                    "economy (mpg)": "22",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "105",
                    "weight (lb)": "3353",
                    "0-60 mph (s)": "14.5",
                    "year": "76"
                },
                {
                    "name": "Chevrolet Vega (Wagon)",
                    "economy (mpg)": "22",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "72",
                    "weight (lb)": "2408",
                    "0-60 mph (s)": "19",
                    "year": "71"
                },
                {
                    "name": "Chevrolet Vega 2300",
                    "economy (mpg)": "28",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "90",
                    "weight (lb)": "2264",
                    "0-60 mph (s)": "15.5",
                    "year": "71"
                },
                {
                    "name": "Chevrolet Vega",
                    "economy (mpg)": "20",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "90",
                    "weight (lb)": "2408",
                    "0-60 mph (s)": "19.5",
                    "year": "72"
                },
                {
                    "name": "Chevrolet Vega",
                    "economy (mpg)": "21",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "72",
                    "weight (lb)": "2401",
                    "0-60 mph (s)": "19.5",
                    "year": "73"
                },
                {
                    "name": "Chevrolet Vega",
                    "economy (mpg)": "25",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "75",
                    "weight (lb)": "2542",
                    "0-60 mph (s)": "17",
                    "year": "74"
                },
                {
                    "name": "Chevrolet Woody",
                    "economy (mpg)": "24.5",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "60",
                    "weight (lb)": "2164",
                    "0-60 mph (s)": "22.1",
                    "year": "76"
                },
                {
                    "name": "Chevy C10",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "145",
                    "weight (lb)": "4055",
                    "0-60 mph (s)": "12",
                    "year": "76"
                },
                {
                    "name": "Chevy C20",
                    "economy (mpg)": "10",
                    "cylinders": "8",
                    "displacement (cc)": "307",
                    "power (hp)": "200",
                    "weight (lb)": "4376",
                    "0-60 mph (s)": "15",
                    "year": "70"
                },
                {
                    "name": "Chevy S-10",
                    "economy (mpg)": "31",
                    "cylinders": "4",
                    "displacement (cc)": "119",
                    "power (hp)": "82",
                    "weight (lb)": "2720",
                    "0-60 mph (s)": "19.4",
                    "year": "82"
                },
                {
                    "name": "Chrysler Cordoba",
                    "economy (mpg)": "15.5",
                    "cylinders": "8",
                    "displacement (cc)": "400",
                    "power (hp)": "190",
                    "weight (lb)": "4325",
                    "0-60 mph (s)": "12.2",
                    "year": "77"
                },
                {
                    "name": "Chrysler Lebaron Medallion",
                    "economy (mpg)": "26",
                    "cylinders": "4",
                    "displacement (cc)": "156",
                    "power (hp)": "92",
                    "weight (lb)": "2585",
                    "0-60 mph (s)": "14.5",
                    "year": "82"
                },
                {
                    "name": "Chrysler Lebaron Salon",
                    "economy (mpg)": "17.6",
                    "cylinders": "6",
                    "displacement (cc)": "225",
                    "power (hp)": "85",
                    "weight (lb)": "3465",
                    "0-60 mph (s)": "16.6",
                    "year": "81"
                },
                {
                    "name": "Chrysler Lebaron Town & Country (Wagon)",
                    "economy (mpg)": "18.5",
                    "cylinders": "8",
                    "displacement (cc)": "360",
                    "power (hp)": "150",
                    "weight (lb)": "3940",
                    "0-60 mph (s)": "13",
                    "year": "79"
                },
                {
                    "name": "Chrysler New Yorker Brougham",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "440",
                    "power (hp)": "215",
                    "weight (lb)": "4735",
                    "0-60 mph (s)": "11",
                    "year": "73"
                },
                {
                    "name": "Chrysler Newport Royal",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "400",
                    "power (hp)": "190",
                    "weight (lb)": "4422",
                    "0-60 mph (s)": "12.5",
                    "year": "72"
                },
                {
                    "name": "Citroen DS-21 Pallas",
                    "economy (mpg)": "",
                    "cylinders": "4",
                    "displacement (cc)": "133",
                    "power (hp)": "115",
                    "weight (lb)": "3090",
                    "0-60 mph (s)": "17.5",
                    "year": "70"
                },
                {
                    "name": "Datsun 1200",
                    "economy (mpg)": "35",
                    "cylinders": "4",
                    "displacement (cc)": "72",
                    "power (hp)": "69",
                    "weight (lb)": "1613",
                    "0-60 mph (s)": "18",
                    "year": "71"
                },
                {
                    "name": "Datsun 200SX",
                    "economy (mpg)": "23.9",
                    "cylinders": "4",
                    "displacement (cc)": "119",
                    "power (hp)": "97",
                    "weight (lb)": "2405",
                    "0-60 mph (s)": "14.9",
                    "year": "78"
                },
                {
                    "name": "Datsun 200SX",
                    "economy (mpg)": "32.9",
                    "cylinders": "4",
                    "displacement (cc)": "119",
                    "power (hp)": "100",
                    "weight (lb)": "2615",
                    "0-60 mph (s)": "14.8",
                    "year": "81"
                },
                {
                    "name": "Datsun 210",
                    "economy (mpg)": "31.8",
                    "cylinders": "4",
                    "displacement (cc)": "85",
                    "power (hp)": "65",
                    "weight (lb)": "2020",
                    "0-60 mph (s)": "19.2",
                    "year": "79"
                },
                {
                    "name": "Datsun 210",
                    "economy (mpg)": "37",
                    "cylinders": "4",
                    "displacement (cc)": "85",
                    "power (hp)": "65",
                    "weight (lb)": "1975",
                    "0-60 mph (s)": "19.4",
                    "year": "81"
                },
                {
                    "name": "Datsun 210",
                    "economy (mpg)": "40.8",
                    "cylinders": "4",
                    "displacement (cc)": "85",
                    "power (hp)": "65",
                    "weight (lb)": "2110",
                    "0-60 mph (s)": "19.2",
                    "year": "80"
                },
                {
                    "name": "Datsun 280ZX",
                    "economy (mpg)": "32.7",
                    "cylinders": "6",
                    "displacement (cc)": "168",
                    "power (hp)": "132",
                    "weight (lb)": "2910",
                    "0-60 mph (s)": "11.4",
                    "year": "80"
                },
                {
                    "name": "Datsun 310 GX",
                    "economy (mpg)": "38",
                    "cylinders": "4",
                    "displacement (cc)": "91",
                    "power (hp)": "67",
                    "weight (lb)": "1995",
                    "0-60 mph (s)": "16.2",
                    "year": "82"
                },
                {
                    "name": "Datsun 310",
                    "economy (mpg)": "37.2",
                    "cylinders": "4",
                    "displacement (cc)": "86",
                    "power (hp)": "65",
                    "weight (lb)": "2019",
                    "0-60 mph (s)": "16.4",
                    "year": "80"
                },
                {
                    "name": "Datsun 510 (Wagon)",
                    "economy (mpg)": "28",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "92",
                    "weight (lb)": "2288",
                    "0-60 mph (s)": "17",
                    "year": "72"
                },
                {
                    "name": "Datsun 510 Hatchback",
                    "economy (mpg)": "37",
                    "cylinders": "4",
                    "displacement (cc)": "119",
                    "power (hp)": "92",
                    "weight (lb)": "2434",
                    "0-60 mph (s)": "15",
                    "year": "80"
                },
                {
                    "name": "Datsun 510",
                    "economy (mpg)": "27.2",
                    "cylinders": "4",
                    "displacement (cc)": "119",
                    "power (hp)": "97",
                    "weight (lb)": "2300",
                    "0-60 mph (s)": "14.7",
                    "year": "78"
                },
                {
                    "name": "Datsun 610",
                    "economy (mpg)": "22",
                    "cylinders": "4",
                    "displacement (cc)": "108",
                    "power (hp)": "94",
                    "weight (lb)": "2379",
                    "0-60 mph (s)": "16.5",
                    "year": "73"
                },
                {
                    "name": "Datsun 710",
                    "economy (mpg)": "24",
                    "cylinders": "4",
                    "displacement (cc)": "119",
                    "power (hp)": "97",
                    "weight (lb)": "2545",
                    "0-60 mph (s)": "17",
                    "year": "75"
                },
                {
                    "name": "Datsun 710",
                    "economy (mpg)": "32",
                    "cylinders": "4",
                    "displacement (cc)": "83",
                    "power (hp)": "61",
                    "weight (lb)": "2003",
                    "0-60 mph (s)": "19",
                    "year": "74"
                },
                {
                    "name": "Datsun 810 Maxima",
                    "economy (mpg)": "24.2",
                    "cylinders": "6",
                    "displacement (cc)": "146",
                    "power (hp)": "120",
                    "weight (lb)": "2930",
                    "0-60 mph (s)": "13.8",
                    "year": "81"
                },
                {
                    "name": "Datsun 810",
                    "economy (mpg)": "22",
                    "cylinders": "6",
                    "displacement (cc)": "146",
                    "power (hp)": "97",
                    "weight (lb)": "2815",
                    "0-60 mph (s)": "14.5",
                    "year": "77"
                },
                {
                    "name": "Datsun B-210",
                    "economy (mpg)": "32",
                    "cylinders": "4",
                    "displacement (cc)": "85",
                    "power (hp)": "70",
                    "weight (lb)": "1990",
                    "0-60 mph (s)": "17",
                    "year": "76"
                },
                {
                    "name": "Datsun B210 GX",
                    "economy (mpg)": "39.4",
                    "cylinders": "4",
                    "displacement (cc)": "85",
                    "power (hp)": "70",
                    "weight (lb)": "2070",
                    "0-60 mph (s)": "18.6",
                    "year": "78"
                },
                {
                    "name": "Datsun B210",
                    "economy (mpg)": "31",
                    "cylinders": "4",
                    "displacement (cc)": "79",
                    "power (hp)": "67",
                    "weight (lb)": "1950",
                    "0-60 mph (s)": "19",
                    "year": "74"
                },
                {
                    "name": "Datsun F-10 Hatchback",
                    "economy (mpg)": "33.5",
                    "cylinders": "4",
                    "displacement (cc)": "85",
                    "power (hp)": "70",
                    "weight (lb)": "1945",
                    "0-60 mph (s)": "16.8",
                    "year": "77"
                },
                {
                    "name": "Datsun PL510",
                    "economy (mpg)": "27",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "88",
                    "weight (lb)": "2130",
                    "0-60 mph (s)": "14.5",
                    "year": "70"
                },
                {
                    "name": "Datsun PL510",
                    "economy (mpg)": "27",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "88",
                    "weight (lb)": "2130",
                    "0-60 mph (s)": "14.5",
                    "year": "71"
                },
                {
                    "name": "Dodge Aries SE",
                    "economy (mpg)": "29",
                    "cylinders": "4",
                    "displacement (cc)": "135",
                    "power (hp)": "84",
                    "weight (lb)": "2525",
                    "0-60 mph (s)": "16",
                    "year": "82"
                },
                {
                    "name": "Dodge Aries Wagon (Wagon)",
                    "economy (mpg)": "25.8",
                    "cylinders": "4",
                    "displacement (cc)": "156",
                    "power (hp)": "92",
                    "weight (lb)": "2620",
                    "0-60 mph (s)": "14.4",
                    "year": "81"
                },
                {
                    "name": "Dodge Aspen 6",
                    "economy (mpg)": "20.6",
                    "cylinders": "6",
                    "displacement (cc)": "225",
                    "power (hp)": "110",
                    "weight (lb)": "3360",
                    "0-60 mph (s)": "16.6",
                    "year": "79"
                },
                {
                    "name": "Dodge Aspen SE",
                    "economy (mpg)": "20",
                    "cylinders": "6",
                    "displacement (cc)": "225",
                    "power (hp)": "100",
                    "weight (lb)": "3651",
                    "0-60 mph (s)": "17.7",
                    "year": "76"
                },
                {
                    "name": "Dodge Aspen",
                    "economy (mpg)": "18.6",
                    "cylinders": "6",
                    "displacement (cc)": "225",
                    "power (hp)": "110",
                    "weight (lb)": "3620",
                    "0-60 mph (s)": "18.7",
                    "year": "78"
                },
                {
                    "name": "Dodge Aspen",
                    "economy (mpg)": "19.1",
                    "cylinders": "6",
                    "displacement (cc)": "225",
                    "power (hp)": "90",
                    "weight (lb)": "3381",
                    "0-60 mph (s)": "18.7",
                    "year": "80"
                },
                {
                    "name": "Dodge Challenger SE",
                    "economy (mpg)": "15",
                    "cylinders": "8",
                    "displacement (cc)": "383",
                    "power (hp)": "170",
                    "weight (lb)": "3563",
                    "0-60 mph (s)": "10",
                    "year": "70"
                },
                {
                    "name": "Dodge Charger 2.2",
                    "economy (mpg)": "36",
                    "cylinders": "4",
                    "displacement (cc)": "135",
                    "power (hp)": "84",
                    "weight (lb)": "2370",
                    "0-60 mph (s)": "13",
                    "year": "82"
                },
                {
                    "name": "Dodge Colt (Wagon)",
                    "economy (mpg)": "28",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "80",
                    "weight (lb)": "2164",
                    "0-60 mph (s)": "15",
                    "year": "72"
                },
                {
                    "name": "Dodge Colt Hardtop",
                    "economy (mpg)": "25",
                    "cylinders": "4",
                    "displacement (cc)": "97.5",
                    "power (hp)": "80",
                    "weight (lb)": "2126",
                    "0-60 mph (s)": "17",
                    "year": "72"
                },
                {
                    "name": "Dodge Colt Hatchback Custom",
                    "economy (mpg)": "35.7",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "80",
                    "weight (lb)": "1915",
                    "0-60 mph (s)": "14.4",
                    "year": "79"
                },
                {
                    "name": "Dodge Colt M/M",
                    "economy (mpg)": "33.5",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "83",
                    "weight (lb)": "2075",
                    "0-60 mph (s)": "15.9",
                    "year": "77"
                },
                {
                    "name": "Dodge Colt",
                    "economy (mpg)": "26",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "79",
                    "weight (lb)": "2255",
                    "0-60 mph (s)": "17.7",
                    "year": "76"
                },
                {
                    "name": "Dodge Colt",
                    "economy (mpg)": "27.9",
                    "cylinders": "4",
                    "displacement (cc)": "156",
                    "power (hp)": "105",
                    "weight (lb)": "2800",
                    "0-60 mph (s)": "14.4",
                    "year": "80"
                },
                {
                    "name": "Dodge Colt",
                    "economy (mpg)": "28",
                    "cylinders": "4",
                    "displacement (cc)": "90",
                    "power (hp)": "75",
                    "weight (lb)": "2125",
                    "0-60 mph (s)": "14.5",
                    "year": "74"
                },
                {
                    "name": "Dodge Coronet Brougham",
                    "economy (mpg)": "16",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "150",
                    "weight (lb)": "4190",
                    "0-60 mph (s)": "13",
                    "year": "76"
                },
                {
                    "name": "Dodge Coronet Custom (Wagon)",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "150",
                    "weight (lb)": "4457",
                    "0-60 mph (s)": "13.5",
                    "year": "74"
                },
                {
                    "name": "Dodge Coronet Custom",
                    "economy (mpg)": "15",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "150",
                    "weight (lb)": "3777",
                    "0-60 mph (s)": "12.5",
                    "year": "73"
                },
                {
                    "name": "Dodge D100",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "150",
                    "weight (lb)": "3755",
                    "0-60 mph (s)": "14",
                    "year": "76"
                },
                {
                    "name": "Dodge D200",
                    "economy (mpg)": "11",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "210",
                    "weight (lb)": "4382",
                    "0-60 mph (s)": "13.5",
                    "year": "70"
                },
                {
                    "name": "Dodge Dart Custom",
                    "economy (mpg)": "15",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "150",
                    "weight (lb)": "3399",
                    "0-60 mph (s)": "11",
                    "year": "73"
                },
                {
                    "name": "Dodge Diplomat",
                    "economy (mpg)": "19.4",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "140",
                    "weight (lb)": "3735",
                    "0-60 mph (s)": "13.2",
                    "year": "78"
                },
                {
                    "name": "Dodge Magnum XE",
                    "economy (mpg)": "17.5",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "140",
                    "weight (lb)": "4080",
                    "0-60 mph (s)": "13.7",
                    "year": "78"
                },
                {
                    "name": "Dodge Monaco (Wagon)",
                    "economy (mpg)": "12",
                    "cylinders": "8",
                    "displacement (cc)": "383",
                    "power (hp)": "180",
                    "weight (lb)": "4955",
                    "0-60 mph (s)": "11.5",
                    "year": "71"
                },
                {
                    "name": "Dodge Monaco Brougham",
                    "economy (mpg)": "15.5",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "145",
                    "weight (lb)": "4140",
                    "0-60 mph (s)": "13.7",
                    "year": "77"
                },
                {
                    "name": "Dodge Omni",
                    "economy (mpg)": "30.9",
                    "cylinders": "4",
                    "displacement (cc)": "105",
                    "power (hp)": "75",
                    "weight (lb)": "2230",
                    "0-60 mph (s)": "14.5",
                    "year": "78"
                },
                {
                    "name": "Dodge Rampage",
                    "economy (mpg)": "32",
                    "cylinders": "4",
                    "displacement (cc)": "135",
                    "power (hp)": "84",
                    "weight (lb)": "2295",
                    "0-60 mph (s)": "11.6",
                    "year": "82"
                },
                {
                    "name": "Dodge St. Regis",
                    "economy (mpg)": "18.2",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "135",
                    "weight (lb)": "3830",
                    "0-60 mph (s)": "15.2",
                    "year": "79"
                },
                {
                    "name": "Fiat 124 Sport Coupe",
                    "economy (mpg)": "26",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "90",
                    "weight (lb)": "2265",
                    "0-60 mph (s)": "15.5",
                    "year": "73"
                },
                {
                    "name": "Fiat 124 TC",
                    "economy (mpg)": "26",
                    "cylinders": "4",
                    "displacement (cc)": "116",
                    "power (hp)": "75",
                    "weight (lb)": "2246",
                    "0-60 mph (s)": "14",
                    "year": "74"
                },
                {
                    "name": "Fiat 124B",
                    "economy (mpg)": "30",
                    "cylinders": "4",
                    "displacement (cc)": "88",
                    "power (hp)": "76",
                    "weight (lb)": "2065",
                    "0-60 mph (s)": "14.5",
                    "year": "71"
                },
                {
                    "name": "Fiat 128",
                    "economy (mpg)": "24",
                    "cylinders": "4",
                    "displacement (cc)": "90",
                    "power (hp)": "75",
                    "weight (lb)": "2108",
                    "0-60 mph (s)": "15.5",
                    "year": "74"
                },
                {
                    "name": "Fiat 128",
                    "economy (mpg)": "29",
                    "cylinders": "4",
                    "displacement (cc)": "68",
                    "power (hp)": "49",
                    "weight (lb)": "1867",
                    "0-60 mph (s)": "19.5",
                    "year": "73"
                },
                {
                    "name": "Fiat 131",
                    "economy (mpg)": "28",
                    "cylinders": "4",
                    "displacement (cc)": "107",
                    "power (hp)": "86",
                    "weight (lb)": "2464",
                    "0-60 mph (s)": "15.5",
                    "year": "76"
                },
                {
                    "name": "Fiat Strada Custom",
                    "economy (mpg)": "37.3",
                    "cylinders": "4",
                    "displacement (cc)": "91",
                    "power (hp)": "69",
                    "weight (lb)": "2130",
                    "0-60 mph (s)": "14.7",
                    "year": "79"
                },
                {
                    "name": "Fiat X1.9",
                    "economy (mpg)": "31",
                    "cylinders": "4",
                    "displacement (cc)": "79",
                    "power (hp)": "67",
                    "weight (lb)": "2000",
                    "0-60 mph (s)": "16",
                    "year": "74"
                },
                {
                    "name": "Ford Capri II",
                    "economy (mpg)": "25",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "92",
                    "weight (lb)": "2572",
                    "0-60 mph (s)": "14.9",
                    "year": "76"
                },
                {
                    "name": "Ford Country Squire (Wagon)",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "400",
                    "power (hp)": "170",
                    "weight (lb)": "4746",
                    "0-60 mph (s)": "12",
                    "year": "71"
                },
                {
                    "name": "Ford Country Squire (Wagon)",
                    "economy (mpg)": "15.5",
                    "cylinders": "8",
                    "displacement (cc)": "351",
                    "power (hp)": "142",
                    "weight (lb)": "4054",
                    "0-60 mph (s)": "14.3",
                    "year": "79"
                },
                {
                    "name": "Ford Country",
                    "economy (mpg)": "12",
                    "cylinders": "8",
                    "displacement (cc)": "400",
                    "power (hp)": "167",
                    "weight (lb)": "4906",
                    "0-60 mph (s)": "12.5",
                    "year": "73"
                },
                {
                    "name": "Ford Escort 2H",
                    "economy (mpg)": "29.9",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "65",
                    "weight (lb)": "2380",
                    "0-60 mph (s)": "20.7",
                    "year": "81"
                },
                {
                    "name": "Ford Escort 4W",
                    "economy (mpg)": "34.4",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "65",
                    "weight (lb)": "2045",
                    "0-60 mph (s)": "16.2",
                    "year": "81"
                },
                {
                    "name": "Ford F108",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "302",
                    "power (hp)": "130",
                    "weight (lb)": "3870",
                    "0-60 mph (s)": "15",
                    "year": "76"
                },
                {
                    "name": "Ford F250",
                    "economy (mpg)": "10",
                    "cylinders": "8",
                    "displacement (cc)": "360",
                    "power (hp)": "215",
                    "weight (lb)": "4615",
                    "0-60 mph (s)": "14",
                    "year": "70"
                },
                {
                    "name": "Ford Fairmont (Auto)",
                    "economy (mpg)": "20.2",
                    "cylinders": "6",
                    "displacement (cc)": "200",
                    "power (hp)": "85",
                    "weight (lb)": "2965",
                    "0-60 mph (s)": "15.8",
                    "year": "78"
                },
                {
                    "name": "Ford Fairmont (Man)",
                    "economy (mpg)": "25.1",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "88",
                    "weight (lb)": "2720",
                    "0-60 mph (s)": "15.4",
                    "year": "78"
                },
                {
                    "name": "Ford Fairmont 4",
                    "economy (mpg)": "22.3",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "88",
                    "weight (lb)": "2890",
                    "0-60 mph (s)": "17.3",
                    "year": "79"
                },
                {
                    "name": "Ford Fairmont Futura",
                    "economy (mpg)": "24",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "92",
                    "weight (lb)": "2865",
                    "0-60 mph (s)": "16.4",
                    "year": "82"
                },
                {
                    "name": "Ford Fairmont",
                    "economy (mpg)": "26.4",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "88",
                    "weight (lb)": "2870",
                    "0-60 mph (s)": "18.1",
                    "year": "80"
                },
                {
                    "name": "Ford Fiesta",
                    "economy (mpg)": "36.1",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "66",
                    "weight (lb)": "1800",
                    "0-60 mph (s)": "14.4",
                    "year": "78"
                },
                {
                    "name": "Ford Futura",
                    "economy (mpg)": "18.1",
                    "cylinders": "8",
                    "displacement (cc)": "302",
                    "power (hp)": "139",
                    "weight (lb)": "3205",
                    "0-60 mph (s)": "11.2",
                    "year": "78"
                },
                {
                    "name": "Ford Galaxie 500",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "351",
                    "power (hp)": "153",
                    "weight (lb)": "4129",
                    "0-60 mph (s)": "13",
                    "year": "72"
                },
                {
                    "name": "Ford Galaxie 500",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "351",
                    "power (hp)": "153",
                    "weight (lb)": "4154",
                    "0-60 mph (s)": "13.5",
                    "year": "71"
                },
                {
                    "name": "Ford Galaxie 500",
                    "economy (mpg)": "15",
                    "cylinders": "8",
                    "displacement (cc)": "429",
                    "power (hp)": "198",
                    "weight (lb)": "4341",
                    "0-60 mph (s)": "10",
                    "year": "70"
                },
                {
                    "name": "Ford Gran Torino (Wagon)",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "302",
                    "power (hp)": "140",
                    "weight (lb)": "4294",
                    "0-60 mph (s)": "16",
                    "year": "72"
                },
                {
                    "name": "Ford Gran Torino (Wagon)",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "302",
                    "power (hp)": "140",
                    "weight (lb)": "4638",
                    "0-60 mph (s)": "16",
                    "year": "74"
                },
                {
                    "name": "Ford Gran Torino",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "302",
                    "power (hp)": "137",
                    "weight (lb)": "4042",
                    "0-60 mph (s)": "14.5",
                    "year": "73"
                },
                {
                    "name": "Ford Gran Torino",
                    "economy (mpg)": "14.5",
                    "cylinders": "8",
                    "displacement (cc)": "351",
                    "power (hp)": "152",
                    "weight (lb)": "4215",
                    "0-60 mph (s)": "12.8",
                    "year": "76"
                },
                {
                    "name": "Ford Gran Torino",
                    "economy (mpg)": "16",
                    "cylinders": "8",
                    "displacement (cc)": "302",
                    "power (hp)": "140",
                    "weight (lb)": "4141",
                    "0-60 mph (s)": "14",
                    "year": "74"
                },
                {
                    "name": "Ford Granada Ghia",
                    "economy (mpg)": "18",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "78",
                    "weight (lb)": "3574",
                    "0-60 mph (s)": "21",
                    "year": "76"
                },
                {
                    "name": "Ford Granada GL",
                    "economy (mpg)": "20.2",
                    "cylinders": "6",
                    "displacement (cc)": "200",
                    "power (hp)": "88",
                    "weight (lb)": "3060",
                    "0-60 mph (s)": "17.1",
                    "year": "81"
                },
                {
                    "name": "Ford Granada L",
                    "economy (mpg)": "22",
                    "cylinders": "6",
                    "displacement (cc)": "232",
                    "power (hp)": "112",
                    "weight (lb)": "2835",
                    "0-60 mph (s)": "14.7",
                    "year": "82"
                },
                {
                    "name": "Ford Granada",
                    "economy (mpg)": "18.5",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "98",
                    "weight (lb)": "3525",
                    "0-60 mph (s)": "19",
                    "year": "77"
                },
                {
                    "name": "Ford LTD Landau",
                    "economy (mpg)": "17.6",
                    "cylinders": "8",
                    "displacement (cc)": "302",
                    "power (hp)": "129",
                    "weight (lb)": "3725",
                    "0-60 mph (s)": "13.4",
                    "year": "79"
                },
                {
                    "name": "Ford LTD",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "351",
                    "power (hp)": "158",
                    "weight (lb)": "4363",
                    "0-60 mph (s)": "13",
                    "year": "73"
                },
                {
                    "name": "Ford LTD",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "351",
                    "power (hp)": "148",
                    "weight (lb)": "4657",
                    "0-60 mph (s)": "13.5",
                    "year": "75"
                },
                {
                    "name": "Ford Maverick",
                    "economy (mpg)": "15",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "72",
                    "weight (lb)": "3158",
                    "0-60 mph (s)": "19.5",
                    "year": "75"
                },
                {
                    "name": "Ford Maverick",
                    "economy (mpg)": "18",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "88",
                    "weight (lb)": "3021",
                    "0-60 mph (s)": "16.5",
                    "year": "73"
                },
                {
                    "name": "Ford Maverick",
                    "economy (mpg)": "21",
                    "cylinders": "6",
                    "displacement (cc)": "200",
                    "power (hp)": "",
                    "weight (lb)": "2875",
                    "0-60 mph (s)": "17",
                    "year": "74"
                },
                {
                    "name": "Ford Maverick",
                    "economy (mpg)": "21",
                    "cylinders": "6",
                    "displacement (cc)": "200",
                    "power (hp)": "85",
                    "weight (lb)": "2587",
                    "0-60 mph (s)": "16",
                    "year": "70"
                },
                {
                    "name": "Ford Maverick",
                    "economy (mpg)": "24",
                    "cylinders": "6",
                    "displacement (cc)": "200",
                    "power (hp)": "81",
                    "weight (lb)": "3012",
                    "0-60 mph (s)": "17.6",
                    "year": "76"
                },
                {
                    "name": "Ford Mustang Boss 302",
                    "economy (mpg)": "",
                    "cylinders": "8",
                    "displacement (cc)": "302",
                    "power (hp)": "140",
                    "weight (lb)": "3353",
                    "0-60 mph (s)": "8",
                    "year": "70"
                },
                {
                    "name": "Ford Mustang Cobra",
                    "economy (mpg)": "23.6",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "",
                    "weight (lb)": "2905",
                    "0-60 mph (s)": "14.3",
                    "year": "80"
                },
                {
                    "name": "Ford Mustang GL",
                    "economy (mpg)": "27",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "86",
                    "weight (lb)": "2790",
                    "0-60 mph (s)": "15.6",
                    "year": "82"
                },
                {
                    "name": "Ford Mustang II 2+2",
                    "economy (mpg)": "25.5",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "89",
                    "weight (lb)": "2755",
                    "0-60 mph (s)": "15.8",
                    "year": "77"
                },
                {
                    "name": "Ford Mustang II",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "302",
                    "power (hp)": "129",
                    "weight (lb)": "3169",
                    "0-60 mph (s)": "12",
                    "year": "75"
                },
                {
                    "name": "Ford Mustang",
                    "economy (mpg)": "18",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "88",
                    "weight (lb)": "3139",
                    "0-60 mph (s)": "14.5",
                    "year": "71"
                },
                {
                    "name": "Ford Pinto (Wagon)",
                    "economy (mpg)": "22",
                    "cylinders": "4",
                    "displacement (cc)": "122",
                    "power (hp)": "86",
                    "weight (lb)": "2395",
                    "0-60 mph (s)": "16",
                    "year": "72"
                },
                {
                    "name": "Ford Pinto Runabout",
                    "economy (mpg)": "21",
                    "cylinders": "4",
                    "displacement (cc)": "122",
                    "power (hp)": "86",
                    "weight (lb)": "2226",
                    "0-60 mph (s)": "16.5",
                    "year": "72"
                },
                {
                    "name": "Ford Pinto",
                    "economy (mpg)": "18",
                    "cylinders": "6",
                    "displacement (cc)": "171",
                    "power (hp)": "97",
                    "weight (lb)": "2984",
                    "0-60 mph (s)": "14.5",
                    "year": "75"
                },
                {
                    "name": "Ford Pinto",
                    "economy (mpg)": "19",
                    "cylinders": "4",
                    "displacement (cc)": "122",
                    "power (hp)": "85",
                    "weight (lb)": "2310",
                    "0-60 mph (s)": "18.5",
                    "year": "73"
                },
                {
                    "name": "Ford Pinto",
                    "economy (mpg)": "23",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "83",
                    "weight (lb)": "2639",
                    "0-60 mph (s)": "17",
                    "year": "75"
                },
                {
                    "name": "Ford Pinto",
                    "economy (mpg)": "25",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "",
                    "weight (lb)": "2046",
                    "0-60 mph (s)": "19",
                    "year": "71"
                },
                {
                    "name": "Ford Pinto",
                    "economy (mpg)": "26",
                    "cylinders": "4",
                    "displacement (cc)": "122",
                    "power (hp)": "80",
                    "weight (lb)": "2451",
                    "0-60 mph (s)": "16.5",
                    "year": "74"
                },
                {
                    "name": "Ford Pinto",
                    "economy (mpg)": "26.5",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "72",
                    "weight (lb)": "2565",
                    "0-60 mph (s)": "13.6",
                    "year": "76"
                },
                {
                    "name": "Ford Ranger",
                    "economy (mpg)": "28",
                    "cylinders": "4",
                    "displacement (cc)": "120",
                    "power (hp)": "79",
                    "weight (lb)": "2625",
                    "0-60 mph (s)": "18.6",
                    "year": "82"
                },
                {
                    "name": "Ford Thunderbird",
                    "economy (mpg)": "16",
                    "cylinders": "8",
                    "displacement (cc)": "351",
                    "power (hp)": "149",
                    "weight (lb)": "4335",
                    "0-60 mph (s)": "14.5",
                    "year": "77"
                },
                {
                    "name": "Ford Torino (Wagon)",
                    "economy (mpg)": "",
                    "cylinders": "8",
                    "displacement (cc)": "351",
                    "power (hp)": "153",
                    "weight (lb)": "4034",
                    "0-60 mph (s)": "11",
                    "year": "70"
                },
                {
                    "name": "Ford Torino 500",
                    "economy (mpg)": "19",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "88",
                    "weight (lb)": "3302",
                    "0-60 mph (s)": "15.5",
                    "year": "71"
                },
                {
                    "name": "Ford Torino",
                    "economy (mpg)": "17",
                    "cylinders": "8",
                    "displacement (cc)": "302",
                    "power (hp)": "140",
                    "weight (lb)": "3449",
                    "0-60 mph (s)": "10.5",
                    "year": "70"
                },
                {
                    "name": "Hi 1200D",
                    "economy (mpg)": "9",
                    "cylinders": "8",
                    "displacement (cc)": "304",
                    "power (hp)": "193",
                    "weight (lb)": "4732",
                    "0-60 mph (s)": "18.5",
                    "year": "70"
                },
                {
                    "name": "Honda Accord CVCC",
                    "economy (mpg)": "31.5",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "68",
                    "weight (lb)": "2045",
                    "0-60 mph (s)": "18.5",
                    "year": "77"
                },
                {
                    "name": "Honda Accord LX",
                    "economy (mpg)": "29.5",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "68",
                    "weight (lb)": "2135",
                    "0-60 mph (s)": "16.6",
                    "year": "78"
                },
                {
                    "name": "Honda Accord",
                    "economy (mpg)": "32.4",
                    "cylinders": "4",
                    "displacement (cc)": "107",
                    "power (hp)": "72",
                    "weight (lb)": "2290",
                    "0-60 mph (s)": "17",
                    "year": "80"
                },
                {
                    "name": "Honda Accord",
                    "economy (mpg)": "36",
                    "cylinders": "4",
                    "displacement (cc)": "107",
                    "power (hp)": "75",
                    "weight (lb)": "2205",
                    "0-60 mph (s)": "14.5",
                    "year": "82"
                },
                {
                    "name": "Honda Civic (Auto)",
                    "economy (mpg)": "32",
                    "cylinders": "4",
                    "displacement (cc)": "91",
                    "power (hp)": "67",
                    "weight (lb)": "1965",
                    "0-60 mph (s)": "15.7",
                    "year": "82"
                },
                {
                    "name": "Honda Civic 1300",
                    "economy (mpg)": "35.1",
                    "cylinders": "4",
                    "displacement (cc)": "81",
                    "power (hp)": "60",
                    "weight (lb)": "1760",
                    "0-60 mph (s)": "16.1",
                    "year": "81"
                },
                {
                    "name": "Honda Civic 1500 GL",
                    "economy (mpg)": "44.6",
                    "cylinders": "4",
                    "displacement (cc)": "91",
                    "power (hp)": "67",
                    "weight (lb)": "1850",
                    "0-60 mph (s)": "13.8",
                    "year": "80"
                },
                {
                    "name": "Honda Civic CVCC",
                    "economy (mpg)": "33",
                    "cylinders": "4",
                    "displacement (cc)": "91",
                    "power (hp)": "53",
                    "weight (lb)": "1795",
                    "0-60 mph (s)": "17.5",
                    "year": "75"
                },
                {
                    "name": "Honda Civic CVCC",
                    "economy (mpg)": "36.1",
                    "cylinders": "4",
                    "displacement (cc)": "91",
                    "power (hp)": "60",
                    "weight (lb)": "1800",
                    "0-60 mph (s)": "16.4",
                    "year": "78"
                },
                {
                    "name": "Honda Civic",
                    "economy (mpg)": "24",
                    "cylinders": "4",
                    "displacement (cc)": "120",
                    "power (hp)": "97",
                    "weight (lb)": "2489",
                    "0-60 mph (s)": "15",
                    "year": "74"
                },
                {
                    "name": "Honda Civic",
                    "economy (mpg)": "33",
                    "cylinders": "4",
                    "displacement (cc)": "91",
                    "power (hp)": "53",
                    "weight (lb)": "1795",
                    "0-60 mph (s)": "17.4",
                    "year": "76"
                },
                {
                    "name": "Honda Civic",
                    "economy (mpg)": "38",
                    "cylinders": "4",
                    "displacement (cc)": "91",
                    "power (hp)": "67",
                    "weight (lb)": "1965",
                    "0-60 mph (s)": "15",
                    "year": "82"
                },
                {
                    "name": "Honda Prelude",
                    "economy (mpg)": "33.7",
                    "cylinders": "4",
                    "displacement (cc)": "107",
                    "power (hp)": "75",
                    "weight (lb)": "2210",
                    "0-60 mph (s)": "14.4",
                    "year": "81"
                },
                {
                    "name": "Maxda GLC Deluxe",
                    "economy (mpg)": "34.1",
                    "cylinders": "4",
                    "displacement (cc)": "86",
                    "power (hp)": "65",
                    "weight (lb)": "1975",
                    "0-60 mph (s)": "15.2",
                    "year": "79"
                },
                {
                    "name": "Maxda RX-3",
                    "economy (mpg)": "18",
                    "cylinders": "3",
                    "displacement (cc)": "70",
                    "power (hp)": "90",
                    "weight (lb)": "2124",
                    "0-60 mph (s)": "13.5",
                    "year": "73"
                },
                {
                    "name": "Mazda 626",
                    "economy (mpg)": "31.3",
                    "cylinders": "4",
                    "displacement (cc)": "120",
                    "power (hp)": "75",
                    "weight (lb)": "2542",
                    "0-60 mph (s)": "17.5",
                    "year": "80"
                },
                {
                    "name": "Mazda 626",
                    "economy (mpg)": "31.6",
                    "cylinders": "4",
                    "displacement (cc)": "120",
                    "power (hp)": "74",
                    "weight (lb)": "2635",
                    "0-60 mph (s)": "18.3",
                    "year": "81"
                },
                {
                    "name": "Mazda GLC 4",
                    "economy (mpg)": "34.1",
                    "cylinders": "4",
                    "displacement (cc)": "91",
                    "power (hp)": "68",
                    "weight (lb)": "1985",
                    "0-60 mph (s)": "16",
                    "year": "81"
                },
                {
                    "name": "Mazda GLC Custom L",
                    "economy (mpg)": "37",
                    "cylinders": "4",
                    "displacement (cc)": "91",
                    "power (hp)": "68",
                    "weight (lb)": "2025",
                    "0-60 mph (s)": "18.2",
                    "year": "82"
                },
                {
                    "name": "Mazda GLC Custom",
                    "economy (mpg)": "31",
                    "cylinders": "4",
                    "displacement (cc)": "91",
                    "power (hp)": "68",
                    "weight (lb)": "1970",
                    "0-60 mph (s)": "17.6",
                    "year": "82"
                },
                {
                    "name": "Mazda GLC Deluxe",
                    "economy (mpg)": "32.8",
                    "cylinders": "4",
                    "displacement (cc)": "78",
                    "power (hp)": "52",
                    "weight (lb)": "1985",
                    "0-60 mph (s)": "19.4",
                    "year": "78"
                },
                {
                    "name": "Mazda GLC",
                    "economy (mpg)": "46.6",
                    "cylinders": "4",
                    "displacement (cc)": "86",
                    "power (hp)": "65",
                    "weight (lb)": "2110",
                    "0-60 mph (s)": "17.9",
                    "year": "80"
                },
                {
                    "name": "Mazda RX-2 Coupe",
                    "economy (mpg)": "19",
                    "cylinders": "3",
                    "displacement (cc)": "70",
                    "power (hp)": "97",
                    "weight (lb)": "2330",
                    "0-60 mph (s)": "13.5",
                    "year": "72"
                },
                {
                    "name": "Mazda RX-4",
                    "economy (mpg)": "21.5",
                    "cylinders": "3",
                    "displacement (cc)": "80",
                    "power (hp)": "110",
                    "weight (lb)": "2720",
                    "0-60 mph (s)": "13.5",
                    "year": "77"
                },
                {
                    "name": "Mazda RX-7 Gs",
                    "economy (mpg)": "23.7",
                    "cylinders": "3",
                    "displacement (cc)": "70",
                    "power (hp)": "100",
                    "weight (lb)": "2420",
                    "0-60 mph (s)": "12.5",
                    "year": "80"
                },
                {
                    "name": "Mercedes-Benz 240D",
                    "economy (mpg)": "30",
                    "cylinders": "4",
                    "displacement (cc)": "146",
                    "power (hp)": "67",
                    "weight (lb)": "3250",
                    "0-60 mph (s)": "21.8",
                    "year": "80"
                },
                {
                    "name": "Mercedes-Benz 280S",
                    "economy (mpg)": "16.5",
                    "cylinders": "6",
                    "displacement (cc)": "168",
                    "power (hp)": "120",
                    "weight (lb)": "3820",
                    "0-60 mph (s)": "16.7",
                    "year": "76"
                },
                {
                    "name": "Mercedes-Benz 300D",
                    "economy (mpg)": "25.4",
                    "cylinders": "5",
                    "displacement (cc)": "183",
                    "power (hp)": "77",
                    "weight (lb)": "3530",
                    "0-60 mph (s)": "20.1",
                    "year": "79"
                },
                {
                    "name": "Mercury Capri 2000",
                    "economy (mpg)": "23",
                    "cylinders": "4",
                    "displacement (cc)": "122",
                    "power (hp)": "86",
                    "weight (lb)": "2220",
                    "0-60 mph (s)": "14",
                    "year": "71"
                },
                {
                    "name": "Mercury Capri V6",
                    "economy (mpg)": "21",
                    "cylinders": "6",
                    "displacement (cc)": "155",
                    "power (hp)": "107",
                    "weight (lb)": "2472",
                    "0-60 mph (s)": "14",
                    "year": "73"
                },
                {
                    "name": "Mercury Cougar Brougham",
                    "economy (mpg)": "15",
                    "cylinders": "8",
                    "displacement (cc)": "302",
                    "power (hp)": "130",
                    "weight (lb)": "4295",
                    "0-60 mph (s)": "14.9",
                    "year": "77"
                },
                {
                    "name": "Mercury Grand Marquis",
                    "economy (mpg)": "16.5",
                    "cylinders": "8",
                    "displacement (cc)": "351",
                    "power (hp)": "138",
                    "weight (lb)": "3955",
                    "0-60 mph (s)": "13.2",
                    "year": "79"
                },
                {
                    "name": "Mercury Lynx L",
                    "economy (mpg)": "36",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "70",
                    "weight (lb)": "2125",
                    "0-60 mph (s)": "17.3",
                    "year": "82"
                },
                {
                    "name": "Mercury Marquis Brougham",
                    "economy (mpg)": "12",
                    "cylinders": "8",
                    "displacement (cc)": "429",
                    "power (hp)": "198",
                    "weight (lb)": "4952",
                    "0-60 mph (s)": "11.5",
                    "year": "73"
                },
                {
                    "name": "Mercury Marquis",
                    "economy (mpg)": "11",
                    "cylinders": "8",
                    "displacement (cc)": "429",
                    "power (hp)": "208",
                    "weight (lb)": "4633",
                    "0-60 mph (s)": "11",
                    "year": "72"
                },
                {
                    "name": "Mercury Monarch Ghia",
                    "economy (mpg)": "20.2",
                    "cylinders": "8",
                    "displacement (cc)": "302",
                    "power (hp)": "139",
                    "weight (lb)": "3570",
                    "0-60 mph (s)": "12.8",
                    "year": "78"
                },
                {
                    "name": "Mercury Monarch",
                    "economy (mpg)": "15",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "72",
                    "weight (lb)": "3432",
                    "0-60 mph (s)": "21",
                    "year": "75"
                },
                {
                    "name": "Mercury Zephyr 6",
                    "economy (mpg)": "19.8",
                    "cylinders": "6",
                    "displacement (cc)": "200",
                    "power (hp)": "85",
                    "weight (lb)": "2990",
                    "0-60 mph (s)": "18.2",
                    "year": "79"
                },
                {
                    "name": "Mercury Zephyr",
                    "economy (mpg)": "20.8",
                    "cylinders": "6",
                    "displacement (cc)": "200",
                    "power (hp)": "85",
                    "weight (lb)": "3070",
                    "0-60 mph (s)": "16.7",
                    "year": "78"
                },
                {
                    "name": "Nissan Stanza XE",
                    "economy (mpg)": "36",
                    "cylinders": "4",
                    "displacement (cc)": "120",
                    "power (hp)": "88",
                    "weight (lb)": "2160",
                    "0-60 mph (s)": "14.5",
                    "year": "82"
                },
                {
                    "name": "Oldsmobile Cutlass Ciera (Diesel)",
                    "economy (mpg)": "38",
                    "cylinders": "6",
                    "displacement (cc)": "262",
                    "power (hp)": "85",
                    "weight (lb)": "3015",
                    "0-60 mph (s)": "17",
                    "year": "82"
                },
                {
                    "name": "Oldsmobile Cutlass LS",
                    "economy (mpg)": "26.6",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "105",
                    "weight (lb)": "3725",
                    "0-60 mph (s)": "19",
                    "year": "81"
                },
                {
                    "name": "Oldsmobile Cutlass Salon Brougham",
                    "economy (mpg)": "19.9",
                    "cylinders": "8",
                    "displacement (cc)": "260",
                    "power (hp)": "110",
                    "weight (lb)": "3365",
                    "0-60 mph (s)": "15.5",
                    "year": "78"
                },
                {
                    "name": "Oldsmobile Cutlass Salon Brougham",
                    "economy (mpg)": "23.9",
                    "cylinders": "8",
                    "displacement (cc)": "260",
                    "power (hp)": "90",
                    "weight (lb)": "3420",
                    "0-60 mph (s)": "22.2",
                    "year": "79"
                },
                {
                    "name": "Oldsmobile Cutlass Supreme",
                    "economy (mpg)": "17",
                    "cylinders": "8",
                    "displacement (cc)": "260",
                    "power (hp)": "110",
                    "weight (lb)": "4060",
                    "0-60 mph (s)": "19",
                    "year": "77"
                },
                {
                    "name": "Oldsmobile Delta 88 Royale",
                    "economy (mpg)": "12",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "160",
                    "weight (lb)": "4456",
                    "0-60 mph (s)": "13.5",
                    "year": "72"
                },
                {
                    "name": "Oldsmobile Omega Brougham",
                    "economy (mpg)": "26.8",
                    "cylinders": "6",
                    "displacement (cc)": "173",
                    "power (hp)": "115",
                    "weight (lb)": "2700",
                    "0-60 mph (s)": "12.9",
                    "year": "79"
                },
                {
                    "name": "Oldsmobile Omega",
                    "economy (mpg)": "11",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "180",
                    "weight (lb)": "3664",
                    "0-60 mph (s)": "11",
                    "year": "73"
                },
                {
                    "name": "Oldsmobile Starfire SX",
                    "economy (mpg)": "23.8",
                    "cylinders": "4",
                    "displacement (cc)": "151",
                    "power (hp)": "85",
                    "weight (lb)": "2855",
                    "0-60 mph (s)": "17.6",
                    "year": "78"
                },
                {
                    "name": "Oldsmobile Vista Cruiser",
                    "economy (mpg)": "12",
                    "cylinders": "8",
                    "displacement (cc)": "350",
                    "power (hp)": "180",
                    "weight (lb)": "4499",
                    "0-60 mph (s)": "12.5",
                    "year": "73"
                },
                {
                    "name": "Opel 1900",
                    "economy (mpg)": "25",
                    "cylinders": "4",
                    "displacement (cc)": "116",
                    "power (hp)": "81",
                    "weight (lb)": "2220",
                    "0-60 mph (s)": "16.9",
                    "year": "76"
                },
                {
                    "name": "Opel 1900",
                    "economy (mpg)": "28",
                    "cylinders": "4",
                    "displacement (cc)": "116",
                    "power (hp)": "90",
                    "weight (lb)": "2123",
                    "0-60 mph (s)": "14",
                    "year": "71"
                },
                {
                    "name": "Opel Manta",
                    "economy (mpg)": "24",
                    "cylinders": "4",
                    "displacement (cc)": "116",
                    "power (hp)": "75",
                    "weight (lb)": "2158",
                    "0-60 mph (s)": "15.5",
                    "year": "73"
                },
                {
                    "name": "Opel Manta",
                    "economy (mpg)": "26",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "78",
                    "weight (lb)": "2300",
                    "0-60 mph (s)": "14.5",
                    "year": "74"
                },
                {
                    "name": "Peugeot 304",
                    "economy (mpg)": "30",
                    "cylinders": "4",
                    "displacement (cc)": "79",
                    "power (hp)": "70",
                    "weight (lb)": "2074",
                    "0-60 mph (s)": "19.5",
                    "year": "71"
                },
                {
                    "name": "Peugeot 504 (Wagon)",
                    "economy (mpg)": "21",
                    "cylinders": "4",
                    "displacement (cc)": "120",
                    "power (hp)": "87",
                    "weight (lb)": "2979",
                    "0-60 mph (s)": "19.5",
                    "year": "72"
                },
                {
                    "name": "Peugeot 504",
                    "economy (mpg)": "19",
                    "cylinders": "4",
                    "displacement (cc)": "120",
                    "power (hp)": "88",
                    "weight (lb)": "3270",
                    "0-60 mph (s)": "21.9",
                    "year": "76"
                },
                {
                    "name": "Peugeot 504",
                    "economy (mpg)": "23",
                    "cylinders": "4",
                    "displacement (cc)": "120",
                    "power (hp)": "88",
                    "weight (lb)": "2957",
                    "0-60 mph (s)": "17",
                    "year": "75"
                },
                {
                    "name": "Peugeot 504",
                    "economy (mpg)": "25",
                    "cylinders": "4",
                    "displacement (cc)": "110",
                    "power (hp)": "87",
                    "weight (lb)": "2672",
                    "0-60 mph (s)": "17.5",
                    "year": "70"
                },
                {
                    "name": "Peugeot 504",
                    "economy (mpg)": "27.2",
                    "cylinders": "4",
                    "displacement (cc)": "141",
                    "power (hp)": "71",
                    "weight (lb)": "3190",
                    "0-60 mph (s)": "24.8",
                    "year": "79"
                },
                {
                    "name": "Peugeot 505S Turbo Diesel",
                    "economy (mpg)": "28.1",
                    "cylinders": "4",
                    "displacement (cc)": "141",
                    "power (hp)": "80",
                    "weight (lb)": "3230",
                    "0-60 mph (s)": "20.4",
                    "year": "81"
                },
                {
                    "name": "Peugeot 604SL",
                    "economy (mpg)": "16.2",
                    "cylinders": "6",
                    "displacement (cc)": "163",
                    "power (hp)": "133",
                    "weight (lb)": "3410",
                    "0-60 mph (s)": "15.8",
                    "year": "78"
                },
                {
                    "name": "Plymouth Arrow GS",
                    "economy (mpg)": "25.5",
                    "cylinders": "4",
                    "displacement (cc)": "122",
                    "power (hp)": "96",
                    "weight (lb)": "2300",
                    "0-60 mph (s)": "15.5",
                    "year": "77"
                },
                {
                    "name": "Plymouth Barracuda 340",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "340",
                    "power (hp)": "160",
                    "weight (lb)": "3609",
                    "0-60 mph (s)": "8",
                    "year": "70"
                },
                {
                    "name": "Plymouth Champ",
                    "economy (mpg)": "39",
                    "cylinders": "4",
                    "displacement (cc)": "86",
                    "power (hp)": "64",
                    "weight (lb)": "1875",
                    "0-60 mph (s)": "16.4",
                    "year": "81"
                },
                {
                    "name": "Plymouth Cricket",
                    "economy (mpg)": "26",
                    "cylinders": "4",
                    "displacement (cc)": "91",
                    "power (hp)": "70",
                    "weight (lb)": "1955",
                    "0-60 mph (s)": "20.5",
                    "year": "71"
                },
                {
                    "name": "Plymouth Custom Suburb",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "360",
                    "power (hp)": "170",
                    "weight (lb)": "4654",
                    "0-60 mph (s)": "13",
                    "year": "73"
                },
                {
                    "name": "Plymouth Duster",
                    "economy (mpg)": "20",
                    "cylinders": "6",
                    "displacement (cc)": "198",
                    "power (hp)": "95",
                    "weight (lb)": "3102",
                    "0-60 mph (s)": "16.5",
                    "year": "74"
                },
                {
                    "name": "Plymouth Duster",
                    "economy (mpg)": "22",
                    "cylinders": "6",
                    "displacement (cc)": "198",
                    "power (hp)": "95",
                    "weight (lb)": "2833",
                    "0-60 mph (s)": "15.5",
                    "year": "70"
                },
                {
                    "name": "Plymouth Duster",
                    "economy (mpg)": "23",
                    "cylinders": "6",
                    "displacement (cc)": "198",
                    "power (hp)": "95",
                    "weight (lb)": "2904",
                    "0-60 mph (s)": "16",
                    "year": "73"
                },
                {
                    "name": "Plymouth Fury Gran Sedan",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "150",
                    "weight (lb)": "4237",
                    "0-60 mph (s)": "14.5",
                    "year": "73"
                },
                {
                    "name": "Plymouth Fury III",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "150",
                    "weight (lb)": "4096",
                    "0-60 mph (s)": "13",
                    "year": "71"
                },
                {
                    "name": "Plymouth Fury III",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "440",
                    "power (hp)": "215",
                    "weight (lb)": "4312",
                    "0-60 mph (s)": "8.5",
                    "year": "70"
                },
                {
                    "name": "Plymouth Fury III",
                    "economy (mpg)": "15",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "150",
                    "weight (lb)": "4135",
                    "0-60 mph (s)": "13.5",
                    "year": "72"
                },
                {
                    "name": "Plymouth Fury",
                    "economy (mpg)": "18",
                    "cylinders": "6",
                    "displacement (cc)": "225",
                    "power (hp)": "95",
                    "weight (lb)": "3785",
                    "0-60 mph (s)": "19",
                    "year": "75"
                },
                {
                    "name": "Plymouth Grand Fury",
                    "economy (mpg)": "16",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "150",
                    "weight (lb)": "4498",
                    "0-60 mph (s)": "14.5",
                    "year": "75"
                },
                {
                    "name": "Plymouth Horizon 4",
                    "economy (mpg)": "34.7",
                    "cylinders": "4",
                    "displacement (cc)": "105",
                    "power (hp)": "63",
                    "weight (lb)": "2215",
                    "0-60 mph (s)": "14.9",
                    "year": "81"
                },
                {
                    "name": "Plymouth Horizon Miser",
                    "economy (mpg)": "38",
                    "cylinders": "4",
                    "displacement (cc)": "105",
                    "power (hp)": "63",
                    "weight (lb)": "2125",
                    "0-60 mph (s)": "14.7",
                    "year": "82"
                },
                {
                    "name": "Plymouth Horizon TC3",
                    "economy (mpg)": "34.5",
                    "cylinders": "4",
                    "displacement (cc)": "105",
                    "power (hp)": "70",
                    "weight (lb)": "2150",
                    "0-60 mph (s)": "14.9",
                    "year": "79"
                },
                {
                    "name": "Plymouth Horizon",
                    "economy (mpg)": "34.2",
                    "cylinders": "4",
                    "displacement (cc)": "105",
                    "power (hp)": "70",
                    "weight (lb)": "2200",
                    "0-60 mph (s)": "13.2",
                    "year": "79"
                },
                {
                    "name": "Plymouth Reliant",
                    "economy (mpg)": "27.2",
                    "cylinders": "4",
                    "displacement (cc)": "135",
                    "power (hp)": "84",
                    "weight (lb)": "2490",
                    "0-60 mph (s)": "15.7",
                    "year": "81"
                },
                {
                    "name": "Plymouth Reliant",
                    "economy (mpg)": "30",
                    "cylinders": "4",
                    "displacement (cc)": "135",
                    "power (hp)": "84",
                    "weight (lb)": "2385",
                    "0-60 mph (s)": "12.9",
                    "year": "81"
                },
                {
                    "name": "Plymouth Sapporo",
                    "economy (mpg)": "23.2",
                    "cylinders": "4",
                    "displacement (cc)": "156",
                    "power (hp)": "105",
                    "weight (lb)": "2745",
                    "0-60 mph (s)": "16.7",
                    "year": "78"
                },
                {
                    "name": "Plymouth Satellite (Wagon)",
                    "economy (mpg)": "",
                    "cylinders": "8",
                    "displacement (cc)": "383",
                    "power (hp)": "175",
                    "weight (lb)": "4166",
                    "0-60 mph (s)": "10.5",
                    "year": "70"
                },
                {
                    "name": "Plymouth Satellite Custom (Wagon)",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "150",
                    "weight (lb)": "4077",
                    "0-60 mph (s)": "14",
                    "year": "72"
                },
                {
                    "name": "Plymouth Satellite Custom",
                    "economy (mpg)": "16",
                    "cylinders": "6",
                    "displacement (cc)": "225",
                    "power (hp)": "105",
                    "weight (lb)": "3439",
                    "0-60 mph (s)": "15.5",
                    "year": "71"
                },
                {
                    "name": "Plymouth Satellite Sebring",
                    "economy (mpg)": "18",
                    "cylinders": "6",
                    "displacement (cc)": "225",
                    "power (hp)": "105",
                    "weight (lb)": "3613",
                    "0-60 mph (s)": "16.5",
                    "year": "74"
                },
                {
                    "name": "Plymouth Satellite",
                    "economy (mpg)": "18",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "150",
                    "weight (lb)": "3436",
                    "0-60 mph (s)": "11",
                    "year": "70"
                },
                {
                    "name": "Plymouth Valiant Custom",
                    "economy (mpg)": "19",
                    "cylinders": "6",
                    "displacement (cc)": "225",
                    "power (hp)": "95",
                    "weight (lb)": "3264",
                    "0-60 mph (s)": "16",
                    "year": "75"
                },
                {
                    "name": "Plymouth Valiant",
                    "economy (mpg)": "18",
                    "cylinders": "6",
                    "displacement (cc)": "225",
                    "power (hp)": "105",
                    "weight (lb)": "3121",
                    "0-60 mph (s)": "16.5",
                    "year": "73"
                },
                {
                    "name": "Plymouth Valiant",
                    "economy (mpg)": "22",
                    "cylinders": "6",
                    "displacement (cc)": "225",
                    "power (hp)": "100",
                    "weight (lb)": "3233",
                    "0-60 mph (s)": "15.4",
                    "year": "76"
                },
                {
                    "name": "Plymouth Volare Custom",
                    "economy (mpg)": "19",
                    "cylinders": "6",
                    "displacement (cc)": "225",
                    "power (hp)": "100",
                    "weight (lb)": "3630",
                    "0-60 mph (s)": "17.7",
                    "year": "77"
                },
                {
                    "name": "Plymouth Volare Premier V8",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "318",
                    "power (hp)": "150",
                    "weight (lb)": "3940",
                    "0-60 mph (s)": "13.2",
                    "year": "76"
                },
                {
                    "name": "Plymouth Volare",
                    "economy (mpg)": "20.5",
                    "cylinders": "6",
                    "displacement (cc)": "225",
                    "power (hp)": "100",
                    "weight (lb)": "3430",
                    "0-60 mph (s)": "17.2",
                    "year": "78"
                },
                {
                    "name": "Pontiac Astro",
                    "economy (mpg)": "23",
                    "cylinders": "4",
                    "displacement (cc)": "140",
                    "power (hp)": "78",
                    "weight (lb)": "2592",
                    "0-60 mph (s)": "18.5",
                    "year": "75"
                },
                {
                    "name": "Pontiac Catalina Brougham",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "400",
                    "power (hp)": "175",
                    "weight (lb)": "4464",
                    "0-60 mph (s)": "11.5",
                    "year": "71"
                },
                {
                    "name": "Pontiac Catalina",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "400",
                    "power (hp)": "175",
                    "weight (lb)": "4385",
                    "0-60 mph (s)": "12",
                    "year": "72"
                },
                {
                    "name": "Pontiac Catalina",
                    "economy (mpg)": "14",
                    "cylinders": "8",
                    "displacement (cc)": "455",
                    "power (hp)": "225",
                    "weight (lb)": "4425",
                    "0-60 mph (s)": "10",
                    "year": "70"
                },
                {
                    "name": "Pontiac Catalina",
                    "economy (mpg)": "16",
                    "cylinders": "8",
                    "displacement (cc)": "400",
                    "power (hp)": "170",
                    "weight (lb)": "4668",
                    "0-60 mph (s)": "11.5",
                    "year": "75"
                },
                {
                    "name": "Pontiac Firebird",
                    "economy (mpg)": "19",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "100",
                    "weight (lb)": "3282",
                    "0-60 mph (s)": "15",
                    "year": "71"
                },
                {
                    "name": "Pontiac Grand Prix Lj",
                    "economy (mpg)": "16",
                    "cylinders": "8",
                    "displacement (cc)": "400",
                    "power (hp)": "180",
                    "weight (lb)": "4220",
                    "0-60 mph (s)": "11.1",
                    "year": "77"
                },
                {
                    "name": "Pontiac Grand Prix",
                    "economy (mpg)": "16",
                    "cylinders": "8",
                    "displacement (cc)": "400",
                    "power (hp)": "230",
                    "weight (lb)": "4278",
                    "0-60 mph (s)": "9.5",
                    "year": "73"
                },
                {
                    "name": "Pontiac J2000 Se Hatchback",
                    "economy (mpg)": "31",
                    "cylinders": "4",
                    "displacement (cc)": "112",
                    "power (hp)": "85",
                    "weight (lb)": "2575",
                    "0-60 mph (s)": "16.2",
                    "year": "82"
                },
                {
                    "name": "Pontiac Lemans V6",
                    "economy (mpg)": "21.5",
                    "cylinders": "6",
                    "displacement (cc)": "231",
                    "power (hp)": "115",
                    "weight (lb)": "3245",
                    "0-60 mph (s)": "15.4",
                    "year": "79"
                },
                {
                    "name": "Pontiac Phoenix LJ",
                    "economy (mpg)": "19.2",
                    "cylinders": "6",
                    "displacement (cc)": "231",
                    "power (hp)": "105",
                    "weight (lb)": "3535",
                    "0-60 mph (s)": "19.2",
                    "year": "78"
                },
                {
                    "name": "Pontiac Phoenix",
                    "economy (mpg)": "27",
                    "cylinders": "4",
                    "displacement (cc)": "151",
                    "power (hp)": "90",
                    "weight (lb)": "2735",
                    "0-60 mph (s)": "18",
                    "year": "82"
                },
                {
                    "name": "Pontiac Phoenix",
                    "economy (mpg)": "33.5",
                    "cylinders": "4",
                    "displacement (cc)": "151",
                    "power (hp)": "90",
                    "weight (lb)": "2556",
                    "0-60 mph (s)": "13.2",
                    "year": "79"
                },
                {
                    "name": "Pontiac Safari (Wagon)",
                    "economy (mpg)": "13",
                    "cylinders": "8",
                    "displacement (cc)": "400",
                    "power (hp)": "175",
                    "weight (lb)": "5140",
                    "0-60 mph (s)": "12",
                    "year": "71"
                },
                {
                    "name": "Pontiac Sunbird Coupe",
                    "economy (mpg)": "24.5",
                    "cylinders": "4",
                    "displacement (cc)": "151",
                    "power (hp)": "88",
                    "weight (lb)": "2740",
                    "0-60 mph (s)": "16",
                    "year": "77"
                },
                {
                    "name": "Pontiac Ventura Sj",
                    "economy (mpg)": "18.5",
                    "cylinders": "6",
                    "displacement (cc)": "250",
                    "power (hp)": "110",
                    "weight (lb)": "3645",
                    "0-60 mph (s)": "16.2",
                    "year": "76"
                },
                {
                    "name": "Renault 12 (Wagon)",
                    "economy (mpg)": "26",
                    "cylinders": "4",
                    "displacement (cc)": "96",
                    "power (hp)": "69",
                    "weight (lb)": "2189",
                    "0-60 mph (s)": "18",
                    "year": "72"
                },
                {
                    "name": "Renault 12TL",
                    "economy (mpg)": "27",
                    "cylinders": "4",
                    "displacement (cc)": "101",
                    "power (hp)": "83",
                    "weight (lb)": "2202",
                    "0-60 mph (s)": "15.3",
                    "year": "76"
                },
                {
                    "name": "Renault 18I",
                    "economy (mpg)": "34.5",
                    "cylinders": "4",
                    "displacement (cc)": "100",
                    "power (hp)": "",
                    "weight (lb)": "2320",
                    "0-60 mph (s)": "15.8",
                    "year": "81"
                },
                {
                    "name": "Renault 5 Gtl",
                    "economy (mpg)": "36",
                    "cylinders": "4",
                    "displacement (cc)": "79",
                    "power (hp)": "58",
                    "weight (lb)": "1825",
                    "0-60 mph (s)": "18.6",
                    "year": "77"
                },
                {
                    "name": "Renault Lecar Deluxe",
                    "economy (mpg)": "40.9",
                    "cylinders": "4",
                    "displacement (cc)": "85",
                    "power (hp)": "",
                    "weight (lb)": "1835",
                    "0-60 mph (s)": "17.3",
                    "year": "80"
                },
                {
                    "name": "Saab 900S",
                    "economy (mpg)": "",
                    "cylinders": "4",
                    "displacement (cc)": "121",
                    "power (hp)": "110",
                    "weight (lb)": "2800",
                    "0-60 mph (s)": "15.4",
                    "year": "81"
                },
                {
                    "name": "Saab 99E",
                    "economy (mpg)": "25",
                    "cylinders": "4",
                    "displacement (cc)": "104",
                    "power (hp)": "95",
                    "weight (lb)": "2375",
                    "0-60 mph (s)": "17.5",
                    "year": "70"
                },
                {
                    "name": "Saab 99GLE",
                    "economy (mpg)": "21.6",
                    "cylinders": "4",
                    "displacement (cc)": "121",
                    "power (hp)": "115",
                    "weight (lb)": "2795",
                    "0-60 mph (s)": "15.7",
                    "year": "78"
                },
                {
                    "name": "Saab 99LE",
                    "economy (mpg)": "24",
                    "cylinders": "4",
                    "displacement (cc)": "121",
                    "power (hp)": "110",
                    "weight (lb)": "2660",
                    "0-60 mph (s)": "14",
                    "year": "73"
                },
                {
                    "name": "Saab 99LE",
                    "economy (mpg)": "25",
                    "cylinders": "4",
                    "displacement (cc)": "121",
                    "power (hp)": "115",
                    "weight (lb)": "2671",
                    "0-60 mph (s)": "13.5",
                    "year": "75"
                },
                {
                    "name": "Subaru DL",
                    "economy (mpg)": "30",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "67",
                    "weight (lb)": "1985",
                    "0-60 mph (s)": "16.4",
                    "year": "77"
                },
                {
                    "name": "Subaru DL",
                    "economy (mpg)": "33.8",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "67",
                    "weight (lb)": "2145",
                    "0-60 mph (s)": "18",
                    "year": "80"
                },
                {
                    "name": "Subaru",
                    "economy (mpg)": "26",
                    "cylinders": "4",
                    "displacement (cc)": "108",
                    "power (hp)": "93",
                    "weight (lb)": "2391",
                    "0-60 mph (s)": "15.5",
                    "year": "74"
                },
                {
                    "name": "Subaru",
                    "economy (mpg)": "32.3",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "67",
                    "weight (lb)": "2065",
                    "0-60 mph (s)": "17.8",
                    "year": "81"
                },
                {
                    "name": "Toyota Carina",
                    "economy (mpg)": "20",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "88",
                    "weight (lb)": "2279",
                    "0-60 mph (s)": "19",
                    "year": "73"
                },
                {
                    "name": "Toyota Celica GT Liftback",
                    "economy (mpg)": "21.1",
                    "cylinders": "4",
                    "displacement (cc)": "134",
                    "power (hp)": "95",
                    "weight (lb)": "2515",
                    "0-60 mph (s)": "14.8",
                    "year": "78"
                },
                {
                    "name": "Toyota Celica GT",
                    "economy (mpg)": "32",
                    "cylinders": "4",
                    "displacement (cc)": "144",
                    "power (hp)": "96",
                    "weight (lb)": "2665",
                    "0-60 mph (s)": "13.9",
                    "year": "82"
                },
                {
                    "name": "Toyota Corolla 1200",
                    "economy (mpg)": "31",
                    "cylinders": "4",
                    "displacement (cc)": "71",
                    "power (hp)": "65",
                    "weight (lb)": "1773",
                    "0-60 mph (s)": "19",
                    "year": "71"
                },
                {
                    "name": "Toyota Corolla 1200",
                    "economy (mpg)": "32",
                    "cylinders": "4",
                    "displacement (cc)": "71",
                    "power (hp)": "65",
                    "weight (lb)": "1836",
                    "0-60 mph (s)": "21",
                    "year": "74"
                },
                {
                    "name": "Toyota Corolla 1600 (Wagon)",
                    "economy (mpg)": "27",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "88",
                    "weight (lb)": "2100",
                    "0-60 mph (s)": "16.5",
                    "year": "72"
                },
                {
                    "name": "Toyota Corolla Liftback",
                    "economy (mpg)": "26",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "75",
                    "weight (lb)": "2265",
                    "0-60 mph (s)": "18.2",
                    "year": "77"
                },
                {
                    "name": "Toyota Corolla Tercel",
                    "economy (mpg)": "38.1",
                    "cylinders": "4",
                    "displacement (cc)": "89",
                    "power (hp)": "60",
                    "weight (lb)": "1968",
                    "0-60 mph (s)": "18.8",
                    "year": "80"
                },
                {
                    "name": "Toyota Corolla",
                    "economy (mpg)": "28",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "75",
                    "weight (lb)": "2155",
                    "0-60 mph (s)": "16.4",
                    "year": "76"
                },
                {
                    "name": "Toyota Corolla",
                    "economy (mpg)": "29",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "75",
                    "weight (lb)": "2171",
                    "0-60 mph (s)": "16",
                    "year": "75"
                },
                {
                    "name": "Toyota Corolla",
                    "economy (mpg)": "32.2",
                    "cylinders": "4",
                    "displacement (cc)": "108",
                    "power (hp)": "75",
                    "weight (lb)": "2265",
                    "0-60 mph (s)": "15.2",
                    "year": "80"
                },
                {
                    "name": "Toyota Corolla",
                    "economy (mpg)": "32.4",
                    "cylinders": "4",
                    "displacement (cc)": "108",
                    "power (hp)": "75",
                    "weight (lb)": "2350",
                    "0-60 mph (s)": "16.8",
                    "year": "81"
                },
                {
                    "name": "Toyota Corolla",
                    "economy (mpg)": "34",
                    "cylinders": "4",
                    "displacement (cc)": "108",
                    "power (hp)": "70",
                    "weight (lb)": "2245",
                    "0-60 mph (s)": "16.9",
                    "year": "82"
                },
                {
                    "name": "Toyota Corona Hardtop",
                    "economy (mpg)": "24",
                    "cylinders": "4",
                    "displacement (cc)": "113",
                    "power (hp)": "95",
                    "weight (lb)": "2278",
                    "0-60 mph (s)": "15.5",
                    "year": "72"
                },
                {
                    "name": "Toyota Corona Liftback",
                    "economy (mpg)": "29.8",
                    "cylinders": "4",
                    "displacement (cc)": "134",
                    "power (hp)": "90",
                    "weight (lb)": "2711",
                    "0-60 mph (s)": "15.5",
                    "year": "80"
                },
                {
                    "name": "Toyota Corona Mark II",
                    "economy (mpg)": "24",
                    "cylinders": "4",
                    "displacement (cc)": "113",
                    "power (hp)": "95",
                    "weight (lb)": "2372",
                    "0-60 mph (s)": "15",
                    "year": "70"
                },
                {
                    "name": "Toyota Corona",
                    "economy (mpg)": "24",
                    "cylinders": "4",
                    "displacement (cc)": "134",
                    "power (hp)": "96",
                    "weight (lb)": "2702",
                    "0-60 mph (s)": "13.5",
                    "year": "75"
                },
                {
                    "name": "Toyota Corona",
                    "economy (mpg)": "25",
                    "cylinders": "4",
                    "displacement (cc)": "113",
                    "power (hp)": "95",
                    "weight (lb)": "2228",
                    "0-60 mph (s)": "14",
                    "year": "71"
                },
                {
                    "name": "Toyota Corona",
                    "economy (mpg)": "27.5",
                    "cylinders": "4",
                    "displacement (cc)": "134",
                    "power (hp)": "95",
                    "weight (lb)": "2560",
                    "0-60 mph (s)": "14.2",
                    "year": "78"
                },
                {
                    "name": "Toyota Corona",
                    "economy (mpg)": "31",
                    "cylinders": "4",
                    "displacement (cc)": "76",
                    "power (hp)": "52",
                    "weight (lb)": "1649",
                    "0-60 mph (s)": "16.5",
                    "year": "74"
                },
                {
                    "name": "Toyota Cressida",
                    "economy (mpg)": "25.4",
                    "cylinders": "6",
                    "displacement (cc)": "168",
                    "power (hp)": "116",
                    "weight (lb)": "2900",
                    "0-60 mph (s)": "12.6",
                    "year": "81"
                },
                {
                    "name": "Toyota Mark II",
                    "economy (mpg)": "19",
                    "cylinders": "6",
                    "displacement (cc)": "156",
                    "power (hp)": "108",
                    "weight (lb)": "2930",
                    "0-60 mph (s)": "15.5",
                    "year": "76"
                },
                {
                    "name": "Toyota Mark II",
                    "economy (mpg)": "20",
                    "cylinders": "6",
                    "displacement (cc)": "156",
                    "power (hp)": "122",
                    "weight (lb)": "2807",
                    "0-60 mph (s)": "13.5",
                    "year": "73"
                },
                {
                    "name": "Toyota Starlet",
                    "economy (mpg)": "39.1",
                    "cylinders": "4",
                    "displacement (cc)": "79",
                    "power (hp)": "58",
                    "weight (lb)": "1755",
                    "0-60 mph (s)": "16.9",
                    "year": "81"
                },
                {
                    "name": "Toyota Tercel",
                    "economy (mpg)": "37.7",
                    "cylinders": "4",
                    "displacement (cc)": "89",
                    "power (hp)": "62",
                    "weight (lb)": "2050",
                    "0-60 mph (s)": "17.3",
                    "year": "81"
                },
                {
                    "name": "Toyouta Corona Mark II (Wagon)",
                    "economy (mpg)": "23",
                    "cylinders": "4",
                    "displacement (cc)": "120",
                    "power (hp)": "97",
                    "weight (lb)": "2506",
                    "0-60 mph (s)": "14.5",
                    "year": "72"
                },
                {
                    "name": "Triumph TR7 Coupe",
                    "economy (mpg)": "35",
                    "cylinders": "4",
                    "displacement (cc)": "122",
                    "power (hp)": "88",
                    "weight (lb)": "2500",
                    "0-60 mph (s)": "15.1",
                    "year": "80"
                },
                {
                    "name": "Vokswagen Rabbit",
                    "economy (mpg)": "29.8",
                    "cylinders": "4",
                    "displacement (cc)": "89",
                    "power (hp)": "62",
                    "weight (lb)": "1845",
                    "0-60 mph (s)": "15.3",
                    "year": "80"
                },
                {
                    "name": "Volkswagen 1131 Deluxe Sedan",
                    "economy (mpg)": "26",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "46",
                    "weight (lb)": "1835",
                    "0-60 mph (s)": "20.5",
                    "year": "70"
                },
                {
                    "name": "Volkswagen 411 (Wagon)",
                    "economy (mpg)": "22",
                    "cylinders": "4",
                    "displacement (cc)": "121",
                    "power (hp)": "76",
                    "weight (lb)": "2511",
                    "0-60 mph (s)": "18",
                    "year": "72"
                },
                {
                    "name": "Volkswagen Dasher (Diesel)",
                    "economy (mpg)": "43.4",
                    "cylinders": "4",
                    "displacement (cc)": "90",
                    "power (hp)": "48",
                    "weight (lb)": "2335",
                    "0-60 mph (s)": "23.7",
                    "year": "80"
                },
                {
                    "name": "Volkswagen Dasher",
                    "economy (mpg)": "25",
                    "cylinders": "4",
                    "displacement (cc)": "90",
                    "power (hp)": "71",
                    "weight (lb)": "2223",
                    "0-60 mph (s)": "16.5",
                    "year": "75"
                },
                {
                    "name": "Volkswagen Dasher",
                    "economy (mpg)": "26",
                    "cylinders": "4",
                    "displacement (cc)": "79",
                    "power (hp)": "67",
                    "weight (lb)": "1963",
                    "0-60 mph (s)": "15.5",
                    "year": "74"
                },
                {
                    "name": "Volkswagen Dasher",
                    "economy (mpg)": "30.5",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "78",
                    "weight (lb)": "2190",
                    "0-60 mph (s)": "14.1",
                    "year": "77"
                },
                {
                    "name": "Volkswagen Jetta",
                    "economy (mpg)": "33",
                    "cylinders": "4",
                    "displacement (cc)": "105",
                    "power (hp)": "74",
                    "weight (lb)": "2190",
                    "0-60 mph (s)": "14.2",
                    "year": "81"
                },
                {
                    "name": "Volkswagen Model 111",
                    "economy (mpg)": "27",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "60",
                    "weight (lb)": "1834",
                    "0-60 mph (s)": "19",
                    "year": "71"
                },
                {
                    "name": "Volkswagen Pickup",
                    "economy (mpg)": "44",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "52",
                    "weight (lb)": "2130",
                    "0-60 mph (s)": "24.6",
                    "year": "82"
                },
                {
                    "name": "Volkswagen Rabbit C (Diesel)",
                    "economy (mpg)": "44.3",
                    "cylinders": "4",
                    "displacement (cc)": "90",
                    "power (hp)": "48",
                    "weight (lb)": "2085",
                    "0-60 mph (s)": "21.7",
                    "year": "80"
                },
                {
                    "name": "Volkswagen Rabbit Custom Diesel",
                    "economy (mpg)": "43.1",
                    "cylinders": "4",
                    "displacement (cc)": "90",
                    "power (hp)": "48",
                    "weight (lb)": "1985",
                    "0-60 mph (s)": "21.5",
                    "year": "78"
                },
                {
                    "name": "Volkswagen Rabbit Custom",
                    "economy (mpg)": "29",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "78",
                    "weight (lb)": "1940",
                    "0-60 mph (s)": "14.5",
                    "year": "77"
                },
                {
                    "name": "Volkswagen Rabbit Custom",
                    "economy (mpg)": "31.9",
                    "cylinders": "4",
                    "displacement (cc)": "89",
                    "power (hp)": "71",
                    "weight (lb)": "1925",
                    "0-60 mph (s)": "14",
                    "year": "79"
                },
                {
                    "name": "Volkswagen Rabbit L",
                    "economy (mpg)": "36",
                    "cylinders": "4",
                    "displacement (cc)": "105",
                    "power (hp)": "74",
                    "weight (lb)": "1980",
                    "0-60 mph (s)": "15.3",
                    "year": "82"
                },
                {
                    "name": "Volkswagen Rabbit",
                    "economy (mpg)": "29",
                    "cylinders": "4",
                    "displacement (cc)": "90",
                    "power (hp)": "70",
                    "weight (lb)": "1937",
                    "0-60 mph (s)": "14",
                    "year": "75"
                },
                {
                    "name": "Volkswagen Rabbit",
                    "economy (mpg)": "29",
                    "cylinders": "4",
                    "displacement (cc)": "90",
                    "power (hp)": "70",
                    "weight (lb)": "1937",
                    "0-60 mph (s)": "14.2",
                    "year": "76"
                },
                {
                    "name": "Volkswagen Rabbit",
                    "economy (mpg)": "29.5",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "71",
                    "weight (lb)": "1825",
                    "0-60 mph (s)": "12.2",
                    "year": "76"
                },
                {
                    "name": "Volkswagen Rabbit",
                    "economy (mpg)": "41.5",
                    "cylinders": "4",
                    "displacement (cc)": "98",
                    "power (hp)": "76",
                    "weight (lb)": "2144",
                    "0-60 mph (s)": "14.7",
                    "year": "80"
                },
                {
                    "name": "Volkswagen Scirocco",
                    "economy (mpg)": "31.5",
                    "cylinders": "4",
                    "displacement (cc)": "89",
                    "power (hp)": "71",
                    "weight (lb)": "1990",
                    "0-60 mph (s)": "14.9",
                    "year": "78"
                },
                {
                    "name": "Volkswagen Super Beetle 117",
                    "economy (mpg)": "",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "48",
                    "weight (lb)": "1978",
                    "0-60 mph (s)": "20",
                    "year": "71"
                },
                {
                    "name": "Volkswagen Super Beetle",
                    "economy (mpg)": "26",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "46",
                    "weight (lb)": "1950",
                    "0-60 mph (s)": "21",
                    "year": "73"
                },
                {
                    "name": "Volkswagen Type 3",
                    "economy (mpg)": "23",
                    "cylinders": "4",
                    "displacement (cc)": "97",
                    "power (hp)": "54",
                    "weight (lb)": "2254",
                    "0-60 mph (s)": "23.5",
                    "year": "72"
                },
                {
                    "name": "Volvo 144EA",
                    "economy (mpg)": "19",
                    "cylinders": "4",
                    "displacement (cc)": "121",
                    "power (hp)": "112",
                    "weight (lb)": "2868",
                    "0-60 mph (s)": "15.5",
                    "year": "73"
                },
                {
                    "name": "Volvo 145E (Wagon)",
                    "economy (mpg)": "18",
                    "cylinders": "4",
                    "displacement (cc)": "121",
                    "power (hp)": "112",
                    "weight (lb)": "2933",
                    "0-60 mph (s)": "14.5",
                    "year": "72"
                },
                {
                    "name": "Volvo 244DL",
                    "economy (mpg)": "22",
                    "cylinders": "4",
                    "displacement (cc)": "121",
                    "power (hp)": "98",
                    "weight (lb)": "2945",
                    "0-60 mph (s)": "14.5",
                    "year": "75"
                },
                {
                    "name": "Volvo 245",
                    "economy (mpg)": "20",
                    "cylinders": "4",
                    "displacement (cc)": "130",
                    "power (hp)": "102",
                    "weight (lb)": "3150",
                    "0-60 mph (s)": "15.7",
                    "year": "76"
                },
                {
                    "name": "Volvo 264GL",
                    "economy (mpg)": "17",
                    "cylinders": "6",
                    "displacement (cc)": "163",
                    "power (hp)": "125",
                    "weight (lb)": "3140",
                    "0-60 mph (s)": "13.6",
                    "year": "78"
                },
                {
                    "name": "Volvo Diesel",
                    "economy (mpg)": "30.7",
                    "cylinders": "6",
                    "displacement (cc)": "145",
                    "power (hp)": "76",
                    "weight (lb)": "3160",
                    "0-60 mph (s)": "19.6",
                    "year": "81"
                }
            ]
        }
    }])


                
'use strict';

angular.module('chart-components')

    .controller('pieChartCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.data = [
            {
                key: "One",
                y: 5
            },
            {
                key: "Two",
                y: 2
            },
            {
                key: "Three",
                y: 9
            },
            {
                key: "Four",
                y: 7
            },
            {
                key: "Five",
                y: 4
            },
            {
                key: "Six",
                y: 3
            },
            {
                key: "Seven",
                y: .5
            }
        ];
    }])
'use strict';

angular.module('chart-components')

    .controller('scatterChartCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'scatterChart',
                height: 450,
                color: d3.scale.category10().range(),
                scatter: {
                    onlyCircles: false
                },
                showDistX: true,
                showDistY: true,
              //tooltipContent: function(d) {
              //    return d.series && '<h3>' + d.series[0].key + '</h3>';
              //},
                duration: 350,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -5
                },
                zoom: {
                    //NOTE: All attributes below are optional
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: false,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        $scope.data = generateData(4,40);

        /* Random Data Generator (took from nvd3.org) */
        function generateData(groups, points) {
            var data = [],
                shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
                random = d3.random.normal();

            for (var i = 0; i < groups; i++) {
                data.push({
                    key: 'Group ' + i,
                    values: []
                });

                for (var j = 0; j < points; j++) {
                    data[i].values.push({
                        x: random()
                        , y: random()
                        , size: Math.random()
                        , shape: shapes[j % 6]
                    });
                }
            }
            return data;
        }
    }])
'use strict';

angular.module('chart-components')

    .controller('scatterPlusLineChartCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'scatterChart',
                height: 450,
                color: d3.scale.category10().range(),
                scatter: {
                    onlyCircles: false
                },
                showDistX: true,
                showDistY: true,
                //tooltipContent: function(d) {
                //    return d.series && '<h3>' + d.series[0].key + '</h3>';
                //},
                duration: 350,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -5
                },
                zoom: {
                    //NOTE: All attributes below are optional
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: true,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: false,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        $scope.data = generateData(4,40);

        /* Random Data Generator (took from nvd3.org) */
        function generateData(groups, points) { //# groups,# points per group
            var data = [],
                shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
                random = d3.random.normal();

            for (var i = 0; i < groups; i++) {
                data.push({
                    key: 'Group ' + i,
                    values: [],
                    slope: Math.random() - .01,
                    intercept: Math.random() - .5
                });

                for (var j = 0; j < points; j++) {
                    data[i].values.push({
                        x: random(),
                        y: random(),
                        size: Math.random(),
                        shape: shapes[j % 6]
                    });
                }
            }
            return data;
        }
    }])
'use strict';

angular.module('chart-components')

    .controller('sparklinePlusCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'sparklinePlus',
                height: 450,
                x: function(d, i){return i;},
                xTickFormat: function(d) {
                    return d3.time.format('%x')(new Date($scope.data[d].x))
                },
                duration: 250
            }
        };

        //$scope.data = sine();
        $scope.data = volatileChart(130.0, 0.02);
        //$scope.data = volatileChart(25.0, 0.09,30);

        /* Random Data Generator (took from nvd3.org) */
        function sine() {
            var sin = [];
            var now =+new Date();

            for (var i = 0; i < 100; i++) {
                sin.push({x: now + i * 1000 * 60 * 60 * 24, y: Math.sin(i/10)});
            }

            return sin;
        }

        function volatileChart(startPrice, volatility, numPoints) {
            var rval =  [];
            var now =+new Date();
            numPoints = numPoints || 100;
            for(var i = 1; i < numPoints; i++) {

                rval.push({x: now + i * 1000 * 60 * 60 * 24, y: startPrice});
                var rnd = Math.random();
                var changePct = 2 * volatility * rnd;
                if ( changePct > volatility) {
                    changePct -= (2*volatility);
                }
                startPrice = startPrice + startPrice * changePct;
            }
            return rval;
        }
    }])
'use strict';

angular.module('chart-components')

    .controller('stackedAreaChartCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'stackedAreaChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 40
                },
                x: function(d){return d[0];},
                y: function(d){return d[1];},
                useVoronoi: false,
                clipEdge: true,
                duration: 100,
                useInteractiveGuideline: true,
                xAxis: {
                    showMaxMin: false,
                    tickFormat: function(d) {
                        return d3.time.format('%x')(new Date(d))
                    }
                },
                yAxis: {
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    }
                },
                zoom: {
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        $scope.data = [
            {
                "key" : "North America" ,
                "values" : [ [ 1025409600000 , 23.041422681023] , [ 1028088000000 , 19.854291255832] , [ 1030766400000 , 21.02286281168] , [ 1033358400000 , 22.093608385173] , [ 1036040400000 , 25.108079299458] , [ 1038632400000 , 26.982389242348] , [ 1041310800000 , 19.828984957662] , [ 1043989200000 , 19.914055036294] , [ 1046408400000 , 19.436150539916] , [ 1049086800000 , 21.558650338602] , [ 1051675200000 , 24.395594061773] , [ 1054353600000 , 24.747089309384] , [ 1056945600000 , 23.491755498807] , [ 1059624000000 , 23.376634878164] , [ 1062302400000 , 24.581223154533] , [ 1064894400000 , 24.922476843538] , [ 1067576400000 , 27.357712939042] , [ 1070168400000 , 26.503020572593] , [ 1072846800000 , 26.658901244878] , [ 1075525200000 , 27.065704156445] , [ 1078030800000 , 28.735320452588] , [ 1080709200000 , 31.572277846319] , [ 1083297600000 , 30.932161503638] , [ 1085976000000 , 31.627029785554] , [ 1088568000000 , 28.728743674232] , [ 1091246400000 , 26.858365172675] , [ 1093924800000 , 27.279922830032] , [ 1096516800000 , 34.408301211324] , [ 1099195200000 , 34.794362930439] , [ 1101790800000 , 35.609978198951] , [ 1104469200000 , 33.574394968037] , [ 1107147600000 , 31.979405070598] , [ 1109566800000 , 31.19009040297] , [ 1112245200000 , 31.083933968994] , [ 1114833600000 , 29.668971113185] , [ 1117512000000 , 31.490638014379] , [ 1120104000000 , 31.818617451128] , [ 1122782400000 , 32.960314008183] , [ 1125460800000 , 31.313383196209] , [ 1128052800000 , 33.125486081852] , [ 1130734800000 , 32.791805509149] , [ 1133326800000 , 33.506038030366] , [ 1136005200000 , 26.96501697216] , [ 1138683600000 , 27.38478809681] , [ 1141102800000 , 27.371377218209] , [ 1143781200000 , 26.309915460827] , [ 1146369600000 , 26.425199957518] , [ 1149048000000 , 26.823411519396] , [ 1151640000000 , 23.850443591587] , [ 1154318400000 , 23.158355444054] , [ 1156996800000 , 22.998689393695] , [ 1159588800000 , 27.9771285113] , [ 1162270800000 , 29.073672469719] , [ 1164862800000 , 28.587640408904] , [ 1167541200000 , 22.788453687637] , [ 1170219600000 , 22.429199073597] , [ 1172638800000 , 22.324103271052] , [ 1175313600000 , 17.558388444187] , [ 1177905600000 , 16.769518096208] , [ 1180584000000 , 16.214738201301] , [ 1183176000000 , 18.729632971229] , [ 1185854400000 , 18.814523318847] , [ 1188532800000 , 19.789986451358] , [ 1191124800000 , 17.070049054933] , [ 1193803200000 , 16.121349575716] , [ 1196398800000 , 15.141659430091] , [ 1199077200000 , 17.175388025297] , [ 1201755600000 , 17.286592443522] , [ 1204261200000 , 16.323141626568] , [ 1206936000000 , 19.231263773952] , [ 1209528000000 , 18.446256391095] , [ 1212206400000 , 17.822632399764] , [ 1214798400000 , 15.53936647598] , [ 1217476800000 , 15.255131790217] , [ 1220155200000 , 15.660963922592] , [ 1222747200000 , 13.254482273698] , [ 1225425600000 , 11.920796202299] , [ 1228021200000 , 12.122809090924] , [ 1230699600000 , 15.691026271393] , [ 1233378000000 , 14.720881635107] , [ 1235797200000 , 15.387939360044] , [ 1238472000000 , 13.765436672228] , [ 1241064000000 , 14.631445864799] , [ 1243742400000 , 14.292446536221] , [ 1246334400000 , 16.170071367017] , [ 1249012800000 , 15.948135554337] , [ 1251691200000 , 16.612872685134] , [ 1254283200000 , 18.778338719091] , [ 1256961600000 , 16.756026065421] , [ 1259557200000 , 19.385804443146] , [ 1262235600000 , 22.950590240168] , [ 1264914000000 , 23.61159018141] , [ 1267333200000 , 25.708586989581] , [ 1270008000000 , 26.883915999885] , [ 1272600000000 , 25.893486687065] , [ 1275278400000 , 24.678914263176] , [ 1277870400000 , 25.937275793024] , [ 1280548800000 , 29.461381693838] , [ 1283227200000 , 27.357322961861] , [ 1285819200000 , 29.057235285673] , [ 1288497600000 , 28.549434189386] , [ 1291093200000 , 28.506352379724] , [ 1293771600000 , 29.449241421598] , [ 1296450000000 , 25.796838168807] , [ 1298869200000 , 28.740145449188] , [ 1301544000000 , 22.091744141872] , [ 1304136000000 , 25.07966254541] , [ 1306814400000 , 23.674906973064] , [ 1309406400000 , 23.418002742929] , [ 1312084800000 , 23.24364413887] , [ 1314763200000 , 31.591854066817] , [ 1317355200000 , 31.497112374114] , [ 1320033600000 , 26.67238082043] , [ 1322629200000 , 27.297080015495] , [ 1325307600000 , 20.174315530051] , [ 1327986000000 , 19.631084213898] , [ 1330491600000 , 20.366462219461] , [ 1333166400000 , 19.284784434185] , [ 1335758400000 , 19.157810257624]]
            },

            {
                "key" : "Africa" ,
                "values" : [ [ 1025409600000 , 7.9356392949025] , [ 1028088000000 , 7.4514668527298] , [ 1030766400000 , 7.9085410566608] , [ 1033358400000 , 5.8996782364764] , [ 1036040400000 , 6.0591869346923] , [ 1038632400000 , 5.9667815800451] , [ 1041310800000 , 8.65528925664] , [ 1043989200000 , 8.7690763386254] , [ 1046408400000 , 8.6386160387453] , [ 1049086800000 , 5.9895557449743] , [ 1051675200000 , 6.3840324338159] , [ 1054353600000 , 6.5196511461441] , [ 1056945600000 , 7.0738618553114] , [ 1059624000000 , 6.5745957367133] , [ 1062302400000 , 6.4658359184444] , [ 1064894400000 , 2.7622758754954] , [ 1067576400000 , 2.9794782986241] , [ 1070168400000 , 2.8735432712019] , [ 1072846800000 , 1.6344817513645] , [ 1075525200000 , 1.5869248754883] , [ 1078030800000 , 1.7172279157246] , [ 1080709200000 , 1.9649927409867] , [ 1083297600000 , 2.0261695079196] , [ 1085976000000 , 2.0541261923929] , [ 1088568000000 , 3.9466318927569] , [ 1091246400000 , 3.7826770946089] , [ 1093924800000 , 3.9543021004028] , [ 1096516800000 , 3.8309891064711] , [ 1099195200000 , 3.6340958946166] , [ 1101790800000 , 3.5289755762525] , [ 1104469200000 , 5.702378559857] , [ 1107147600000 , 5.6539569019223] , [ 1109566800000 , 5.5449506370392] , [ 1112245200000 , 4.7579993280677] , [ 1114833600000 , 4.4816139372906] , [ 1117512000000 , 4.5965558568606] , [ 1120104000000 , 4.3747066116976] , [ 1122782400000 , 4.4588822917087] , [ 1125460800000 , 4.4460351848286] , [ 1128052800000 , 3.7989113035136] , [ 1130734800000 , 3.7743883140088] , [ 1133326800000 , 3.7727852823828] , [ 1136005200000 , 7.2968111448895] , [ 1138683600000 , 7.2800122043237] , [ 1141102800000 , 7.1187787503354] , [ 1143781200000 , 8.351887016482] , [ 1146369600000 , 8.4156698763993] , [ 1149048000000 , 8.1673298604231] , [ 1151640000000 , 5.5132447126042] , [ 1154318400000 , 6.1152537710599] , [ 1156996800000 , 6.076765091942] , [ 1159588800000 , 4.6304473798646] , [ 1162270800000 , 4.6301068469402] , [ 1164862800000 , 4.3466656309389] , [ 1167541200000 , 6.830104897003] , [ 1170219600000 , 7.241633040029] , [ 1172638800000 , 7.1432372054153] , [ 1175313600000 , 10.608942063374] , [ 1177905600000 , 10.914964549494] , [ 1180584000000 , 10.933223880565] , [ 1183176000000 , 8.3457524851265] , [ 1185854400000 , 8.1078413081882] , [ 1188532800000 , 8.2697185922474] , [ 1191124800000 , 8.4742436475968] , [ 1193803200000 , 8.4994601179319] , [ 1196398800000 , 8.7387319683243] , [ 1199077200000 , 6.8829183612895] , [ 1201755600000 , 6.984133637885] , [ 1204261200000 , 7.0860136043287] , [ 1206936000000 , 4.3961787956053] , [ 1209528000000 , 3.8699674365231] , [ 1212206400000 , 3.6928925238305] , [ 1214798400000 , 6.7571718894253] , [ 1217476800000 , 6.4367313362344] , [ 1220155200000 , 6.4048441521454] , [ 1222747200000 , 5.4643833239669] , [ 1225425600000 , 5.3150786833374] , [ 1228021200000 , 5.3011272612576] , [ 1230699600000 , 4.1203601430809] , [ 1233378000000 , 4.0881783200525] , [ 1235797200000 , 4.1928665957189] , [ 1238472000000 , 7.0249415663205] , [ 1241064000000 , 7.006530880769] , [ 1243742400000 , 6.994835633224] , [ 1246334400000 , 6.1220222336254] , [ 1249012800000 , 6.1177436137653] , [ 1251691200000 , 6.1413396231981] , [ 1254283200000 , 4.8046006145874] , [ 1256961600000 , 4.6647600660544] , [ 1259557200000 , 4.544865006255] , [ 1262235600000 , 6.0488249316539] , [ 1264914000000 , 6.3188669540206] , [ 1267333200000 , 6.5873958262306] , [ 1270008000000 , 6.2281189839578] , [ 1272600000000 , 5.8948915746059] , [ 1275278400000 , 5.5967320482214] , [ 1277870400000 , 0.99784432084837] , [ 1280548800000 , 1.0950794175359] , [ 1283227200000 , 0.94479734407491] , [ 1285819200000 , 1.222093988688] , [ 1288497600000 , 1.335093106856] , [ 1291093200000 , 1.3302565104985] , [ 1293771600000 , 1.340824670897] , [ 1296450000000 , 0] , [ 1298869200000 , 0] , [ 1301544000000 , 0] , [ 1304136000000 , 0] , [ 1306814400000 , 0] , [ 1309406400000 , 0] , [ 1312084800000 , 0] , [ 1314763200000 , 0] , [ 1317355200000 , 4.4583692315] , [ 1320033600000 , 3.6493043348059] , [ 1322629200000 , 3.8610064091761] , [ 1325307600000 , 5.5144800685202] , [ 1327986000000 , 5.1750695220791] , [ 1330491600000 , 5.6710066952691] , [ 1333166400000 , 5.5611890039181] , [ 1335758400000 , 5.5979368839939]]
            },

            {
                "key" : "South America" ,
                "values" : [ [ 1025409600000 , 7.9149900245423] , [ 1028088000000 , 7.0899888751059] , [ 1030766400000 , 7.5996132380614] , [ 1033358400000 , 8.2741174301034] , [ 1036040400000 , 9.3564460833513] , [ 1038632400000 , 9.7066786059904] , [ 1041310800000 , 10.213363052343] , [ 1043989200000 , 10.285809585273] , [ 1046408400000 , 10.222053149228] , [ 1049086800000 , 8.6188592137975] , [ 1051675200000 , 9.3335447543566] , [ 1054353600000 , 8.9312402186628] , [ 1056945600000 , 8.1895089343658] , [ 1059624000000 , 8.260622135079] , [ 1062302400000 , 7.7700786851364] , [ 1064894400000 , 7.9907428771318] , [ 1067576400000 , 8.7769091865606] , [ 1070168400000 , 8.4855077060661] , [ 1072846800000 , 9.6277203033655] , [ 1075525200000 , 9.9685913452624] , [ 1078030800000 , 10.615085181759] , [ 1080709200000 , 9.2902488079646] , [ 1083297600000 , 8.8610439830061] , [ 1085976000000 , 9.1075344931229] , [ 1088568000000 , 9.9156737639203] , [ 1091246400000 , 9.7826003238782] , [ 1093924800000 , 10.55403610555] , [ 1096516800000 , 10.926900264097] , [ 1099195200000 , 10.903144818736] , [ 1101790800000 , 10.862890389067] , [ 1104469200000 , 10.64604998964] , [ 1107147600000 , 10.042790814087] , [ 1109566800000 , 9.7173391591038] , [ 1112245200000 , 9.6122415755443] , [ 1114833600000 , 9.4337921146562] , [ 1117512000000 , 9.814827171183] , [ 1120104000000 , 12.059260396788] , [ 1122782400000 , 12.139649903873] , [ 1125460800000 , 12.281290663822] , [ 1128052800000 , 8.8037085409056] , [ 1130734800000 , 8.6300618239176] , [ 1133326800000 , 9.1225708491432] , [ 1136005200000 , 12.988124170836] , [ 1138683600000 , 13.356778764353] , [ 1141102800000 , 13.611196863271] , [ 1143781200000 , 6.8959030061189] , [ 1146369600000 , 6.9939633271353] , [ 1149048000000 , 6.7241510257676] , [ 1151640000000 , 5.5611293669517] , [ 1154318400000 , 5.6086488714041] , [ 1156996800000 , 5.4962849907033] , [ 1159588800000 , 6.9193153169278] , [ 1162270800000 , 7.0016334389778] , [ 1164862800000 , 6.7865422443273] , [ 1167541200000 , 9.0006454225383] , [ 1170219600000 , 9.2233916171431] , [ 1172638800000 , 8.8929316009479] , [ 1175313600000 , 10.345937520404] , [ 1177905600000 , 10.075914677026] , [ 1180584000000 , 10.089006188111] , [ 1183176000000 , 10.598330295008] , [ 1185854400000 , 9.9689546533009] , [ 1188532800000 , 9.7740580198146] , [ 1191124800000 , 10.558483060626] , [ 1193803200000 , 9.9314651823603] , [ 1196398800000 , 9.3997715873769] , [ 1199077200000 , 8.4086493387262] , [ 1201755600000 , 8.9698309085926] , [ 1204261200000 , 8.2778357995396] , [ 1206936000000 , 8.8585045600123] , [ 1209528000000 , 8.7013756413322] , [ 1212206400000 , 7.7933605469443] , [ 1214798400000 , 7.0236183483064] , [ 1217476800000 , 6.9873088186829] , [ 1220155200000 , 6.8031713070097] , [ 1222747200000 , 6.6869531315723] , [ 1225425600000 , 6.138256993963] , [ 1228021200000 , 5.6434994016354] , [ 1230699600000 , 5.495220262512] , [ 1233378000000 , 4.6885326869846] , [ 1235797200000 , 4.4524349883438] , [ 1238472000000 , 5.6766520778185] , [ 1241064000000 , 5.7675774480752] , [ 1243742400000 , 5.7882863168337] , [ 1246334400000 , 7.2666010034924] , [ 1249012800000 , 7.5191821322261] , [ 1251691200000 , 7.849651451445] , [ 1254283200000 , 10.383992037985] , [ 1256961600000 , 9.0653691861818] , [ 1259557200000 , 9.6705248324159] , [ 1262235600000 , 10.856380561349] , [ 1264914000000 , 11.27452370892] , [ 1267333200000 , 11.754156529088] , [ 1270008000000 , 8.2870811422455] , [ 1272600000000 , 8.0210264360699] , [ 1275278400000 , 7.5375074474865] , [ 1277870400000 , 8.3419527338039] , [ 1280548800000 , 9.4197471818443] , [ 1283227200000 , 8.7321733185797] , [ 1285819200000 , 9.6627062648126] , [ 1288497600000 , 10.187962234548] , [ 1291093200000 , 9.8144201733476] , [ 1293771600000 , 10.275723361712] , [ 1296450000000 , 16.796066079353] , [ 1298869200000 , 17.543254984075] , [ 1301544000000 , 16.673660675083] , [ 1304136000000 , 17.963944353609] , [ 1306814400000 , 16.63774086721] , [ 1309406400000 , 15.84857094609] , [ 1312084800000 , 14.767303362181] , [ 1314763200000 , 24.778452182433] , [ 1317355200000 , 18.370353229999] , [ 1320033600000 , 15.253137429099] , [ 1322629200000 , 14.989600840649] , [ 1325307600000 , 16.052539160125] , [ 1327986000000 , 16.424390322793] , [ 1330491600000 , 17.884020741104] , [ 1333166400000 , 18.372698836036] , [ 1335758400000 , 18.315881576096]]
            },

            {
                "key" : "Asia" ,
                "values" : [ [ 1025409600000 , 13.153938631352] , [ 1028088000000 , 12.456410521864] , [ 1030766400000 , 12.537048663919] , [ 1033358400000 , 13.947386398309] , [ 1036040400000 , 14.421680682568] , [ 1038632400000 , 14.143238262286] , [ 1041310800000 , 12.229635347478] , [ 1043989200000 , 12.508479916948] , [ 1046408400000 , 12.155368409526] , [ 1049086800000 , 13.335455563994] , [ 1051675200000 , 12.888210138167] , [ 1054353600000 , 12.842092790511] , [ 1056945600000 , 12.513816474199] , [ 1059624000000 , 12.21453674494] , [ 1062302400000 , 11.750848343935] , [ 1064894400000 , 10.526579636787] , [ 1067576400000 , 10.873596086087] , [ 1070168400000 , 11.019967131519] , [ 1072846800000 , 11.235789380602] , [ 1075525200000 , 11.859910850657] , [ 1078030800000 , 12.531031616536] , [ 1080709200000 , 11.360451067019] , [ 1083297600000 , 11.456244780202] , [ 1085976000000 , 11.436991407309] , [ 1088568000000 , 11.638595744327] , [ 1091246400000 , 11.190418301469] , [ 1093924800000 , 11.835608007589] , [ 1096516800000 , 11.540980244475] , [ 1099195200000 , 10.958762325687] , [ 1101790800000 , 10.885791159509] , [ 1104469200000 , 13.605810720109] , [ 1107147600000 , 13.128978067437] , [ 1109566800000 , 13.119012086882] , [ 1112245200000 , 13.003706129783] , [ 1114833600000 , 13.326996807689] , [ 1117512000000 , 13.547947991743] , [ 1120104000000 , 12.807959646616] , [ 1122782400000 , 12.931763821068] , [ 1125460800000 , 12.795359993008] , [ 1128052800000 , 9.6998935538319] , [ 1130734800000 , 9.3473740089131] , [ 1133326800000 , 9.36902067716] , [ 1136005200000 , 14.258619539875] , [ 1138683600000 , 14.21241095603] , [ 1141102800000 , 13.973193618249] , [ 1143781200000 , 15.218233920664] , [ 1146369600000 , 14.382109727451] , [ 1149048000000 , 13.894310878491] , [ 1151640000000 , 15.593086090031] , [ 1154318400000 , 16.244839695189] , [ 1156996800000 , 16.017088850647] , [ 1159588800000 , 14.183951830057] , [ 1162270800000 , 14.148523245696] , [ 1164862800000 , 13.424326059971] , [ 1167541200000 , 12.974450435754] , [ 1170219600000 , 13.232470418021] , [ 1172638800000 , 13.318762655574] , [ 1175313600000 , 15.961407746104] , [ 1177905600000 , 16.287714639805] , [ 1180584000000 , 16.24659058389] , [ 1183176000000 , 17.564505594808] , [ 1185854400000 , 17.872725373164] , [ 1188532800000 , 18.018998508756] , [ 1191124800000 , 15.584518016602] , [ 1193803200000 , 15.480850647182] , [ 1196398800000 , 15.699120036985] , [ 1199077200000 , 19.184281817226] , [ 1201755600000 , 19.691226605205] , [ 1204261200000 , 18.982314051293] , [ 1206936000000 , 18.707820309008] , [ 1209528000000 , 17.459630929759] , [ 1212206400000 , 16.500616076782] , [ 1214798400000 , 18.086324003978] , [ 1217476800000 , 18.929464156259] , [ 1220155200000 , 18.233728682084] , [ 1222747200000 , 16.315776297325] , [ 1225425600000 , 14.632892190251] , [ 1228021200000 , 14.667835024479] , [ 1230699600000 , 13.946993947309] , [ 1233378000000 , 14.394304684398] , [ 1235797200000 , 13.724462792967] , [ 1238472000000 , 10.930879035807] , [ 1241064000000 , 9.8339915513708] , [ 1243742400000 , 10.053858541872] , [ 1246334400000 , 11.786998438286] , [ 1249012800000 , 11.780994901769] , [ 1251691200000 , 11.305889670277] , [ 1254283200000 , 10.918452290083] , [ 1256961600000 , 9.6811395055706] , [ 1259557200000 , 10.971529744038] , [ 1262235600000 , 13.330210480209] , [ 1264914000000 , 14.592637568961] , [ 1267333200000 , 14.605329141157] , [ 1270008000000 , 13.936853794037] , [ 1272600000000 , 12.189480759072] , [ 1275278400000 , 11.676151385046] , [ 1277870400000 , 13.058852800018] , [ 1280548800000 , 13.62891543203] , [ 1283227200000 , 13.811107569918] , [ 1285819200000 , 13.786494560786] , [ 1288497600000 , 14.045162857531] , [ 1291093200000 , 13.697412447286] , [ 1293771600000 , 13.677681376221] , [ 1296450000000 , 19.96151186453] , [ 1298869200000 , 21.049198298156] , [ 1301544000000 , 22.687631094009] , [ 1304136000000 , 25.469010617433] , [ 1306814400000 , 24.88379943712] , [ 1309406400000 , 24.203843814249] , [ 1312084800000 , 22.138760964036] , [ 1314763200000 , 16.034636966228] , [ 1317355200000 , 15.394958944555] , [ 1320033600000 , 12.62564246197] , [ 1322629200000 , 12.973735699739] , [ 1325307600000 , 15.78601833615] , [ 1327986000000 , 15.227368020134] , [ 1330491600000 , 15.899752650733] , [ 1333166400000 , 15.661317319168] , [ 1335758400000 , 15.359891177281]]
            } ,

            {
                "key" : "Europe" ,
                "values" : [ [ 1025409600000 , 9.3433263069351] , [ 1028088000000 , 8.4583069475546] , [ 1030766400000 , 8.0342398154196] , [ 1033358400000 , 8.1538966876572] , [ 1036040400000 , 10.743604786849] , [ 1038632400000 , 12.349366155851] , [ 1041310800000 , 10.742682503899] , [ 1043989200000 , 11.360983869935] , [ 1046408400000 , 11.441336039535] , [ 1049086800000 , 10.897508791837] , [ 1051675200000 , 11.469101547709] , [ 1054353600000 , 12.086311476742] , [ 1056945600000 , 8.0697180773504] , [ 1059624000000 , 8.2004392233445] , [ 1062302400000 , 8.4566434900643] , [ 1064894400000 , 7.9565760979059] , [ 1067576400000 , 9.3764619255827] , [ 1070168400000 , 9.0747664160538] , [ 1072846800000 , 10.508939004673] , [ 1075525200000 , 10.69936754483] , [ 1078030800000 , 10.681562399145] , [ 1080709200000 , 13.184786109406] , [ 1083297600000 , 12.668213052351] , [ 1085976000000 , 13.430509403986] , [ 1088568000000 , 12.393086349213] , [ 1091246400000 , 11.942374044842] , [ 1093924800000 , 12.062227685742] , [ 1096516800000 , 11.969974363623] , [ 1099195200000 , 12.14374574055] , [ 1101790800000 , 12.69422821995] , [ 1104469200000 , 9.1235211044692] , [ 1107147600000 , 8.758211757584] , [ 1109566800000 , 8.8072309258443] , [ 1112245200000 , 11.687595946835] , [ 1114833600000 , 11.079723082664] , [ 1117512000000 , 12.049712896076] , [ 1120104000000 , 10.725319428684] , [ 1122782400000 , 10.844849996286] , [ 1125460800000 , 10.833535488461] , [ 1128052800000 , 17.180932407865] , [ 1130734800000 , 15.894764896516] , [ 1133326800000 , 16.412751299498] , [ 1136005200000 , 12.573569093402] , [ 1138683600000 , 13.242301508051] , [ 1141102800000 , 12.863536342041] , [ 1143781200000 , 21.034044171629] , [ 1146369600000 , 21.419084618802] , [ 1149048000000 , 21.142678863692] , [ 1151640000000 , 26.56848967753] , [ 1154318400000 , 24.839144939906] , [ 1156996800000 , 25.456187462166] , [ 1159588800000 , 26.350164502825] , [ 1162270800000 , 26.478333205189] , [ 1164862800000 , 26.425979547846] , [ 1167541200000 , 28.191461582256] , [ 1170219600000 , 28.930307448808] , [ 1172638800000 , 29.521413891117] , [ 1175313600000 , 28.188285966466] , [ 1177905600000 , 27.704619625831] , [ 1180584000000 , 27.49086242483] , [ 1183176000000 , 28.770679721286] , [ 1185854400000 , 29.06048067145] , [ 1188532800000 , 28.240998844973] , [ 1191124800000 , 33.004893194128] , [ 1193803200000 , 34.075180359928] , [ 1196398800000 , 32.548560664834] , [ 1199077200000 , 30.629727432729] , [ 1201755600000 , 28.642858788159] , [ 1204261200000 , 27.973575227843] , [ 1206936000000 , 27.393351882726] , [ 1209528000000 , 28.476095288522] , [ 1212206400000 , 29.29667866426] , [ 1214798400000 , 29.222333802896] , [ 1217476800000 , 28.092966093842] , [ 1220155200000 , 28.107159262922] , [ 1222747200000 , 25.482974832099] , [ 1225425600000 , 21.208115993834] , [ 1228021200000 , 20.295043095268] , [ 1230699600000 , 15.925754618402] , [ 1233378000000 , 17.162864628346] , [ 1235797200000 , 17.084345773174] , [ 1238472000000 , 22.24600710228] , [ 1241064000000 , 24.530543998508] , [ 1243742400000 , 25.084184918241] , [ 1246334400000 , 16.606166527359] , [ 1249012800000 , 17.239620011628] , [ 1251691200000 , 17.336739127379] , [ 1254283200000 , 25.478492475754] , [ 1256961600000 , 23.017152085244] , [ 1259557200000 , 25.617745423684] , [ 1262235600000 , 24.061133998641] , [ 1264914000000 , 23.223933318646] , [ 1267333200000 , 24.425887263936] , [ 1270008000000 , 35.501471156693] , [ 1272600000000 , 33.775013878675] , [ 1275278400000 , 30.417993630285] , [ 1277870400000 , 30.023598978467] , [ 1280548800000 , 33.327519522436] , [ 1283227200000 , 31.963388450372] , [ 1285819200000 , 30.49896723209] , [ 1288497600000 , 32.403696817913] , [ 1291093200000 , 31.47736071922] , [ 1293771600000 , 31.53259666241] , [ 1296450000000 , 41.760282761548] , [ 1298869200000 , 45.605771243237] , [ 1301544000000 , 39.986557966215] , [ 1304136000000 , 43.84633051005] , [ 1306814400000 , 39.857316881858] , [ 1309406400000 , 37.675127768207] , [ 1312084800000 , 35.775077970313] , [ 1314763200000 , 48.631009702578] , [ 1317355200000 , 42.830831754505] , [ 1320033600000 , 35.611502589362] , [ 1322629200000 , 35.320136981738] , [ 1325307600000 , 31.564136901516] , [ 1327986000000 , 32.074407502433] , [ 1330491600000 , 35.053013769977] , [ 1333166400000 , 33.873085184128] , [ 1335758400000 , 32.321039427046]]
            } ,

            {
                "key" : "Australia" ,
                "values" : [ [ 1025409600000 , 5.1162447683392] , [ 1028088000000 , 4.2022848306513] , [ 1030766400000 , 4.3543715758736] , [ 1033358400000 , 5.4641223667245] , [ 1036040400000 , 6.0041275884577] , [ 1038632400000 , 6.6050520064486] , [ 1041310800000 , 5.0154059912793] , [ 1043989200000 , 5.1835708554647] , [ 1046408400000 , 5.1142682006164] , [ 1049086800000 , 5.0271381717695] , [ 1051675200000 , 5.3437782653456] , [ 1054353600000 , 5.2105844515767] , [ 1056945600000 , 6.552565997799] , [ 1059624000000 , 6.9873363581831] , [ 1062302400000 , 7.010986789097] , [ 1064894400000 , 4.4254242025515] , [ 1067576400000 , 4.9613848042174] , [ 1070168400000 , 4.8854920484764] , [ 1072846800000 , 4.0441111794228] , [ 1075525200000 , 4.0219596813179] , [ 1078030800000 , 4.3065749225355] , [ 1080709200000 , 3.9148434915404] , [ 1083297600000 , 3.8659430654512] , [ 1085976000000 , 3.9572824600686] , [ 1088568000000 , 4.7372190641522] , [ 1091246400000 , 4.6871476374455] , [ 1093924800000 , 5.0398702564196] , [ 1096516800000 , 5.5221787544964] , [ 1099195200000 , 5.424646299798] , [ 1101790800000 , 5.9240223067349] , [ 1104469200000 , 5.9936860983601] , [ 1107147600000 , 5.8499523215019] , [ 1109566800000 , 6.4149040329325] , [ 1112245200000 , 6.4547895561969] , [ 1114833600000 , 5.9385382611161] , [ 1117512000000 , 6.0486751030592] , [ 1120104000000 , 5.23108613838] , [ 1122782400000 , 5.5857797121029] , [ 1125460800000 , 5.3454665096987] , [ 1128052800000 , 5.0439154120119] , [ 1130734800000 , 5.054634702913] , [ 1133326800000 , 5.3819451380848] , [ 1136005200000 , 5.2638869269803] , [ 1138683600000 , 5.5806167415681] , [ 1141102800000 , 5.4539047069985] , [ 1143781200000 , 7.6728842432362] , [ 1146369600000 , 7.719946716654] , [ 1149048000000 , 8.0144619912942] , [ 1151640000000 , 7.942223133434] , [ 1154318400000 , 8.3998279827444] , [ 1156996800000 , 8.532324572605] , [ 1159588800000 , 4.7324285199763] , [ 1162270800000 , 4.7402397487697] , [ 1164862800000 , 4.9042069355168] , [ 1167541200000 , 5.9583963430882] , [ 1170219600000 , 6.3693899239171] , [ 1172638800000 , 6.261153903813] , [ 1175313600000 , 5.3443942184584] , [ 1177905600000 , 5.4932111235361] , [ 1180584000000 , 5.5747393101109] , [ 1183176000000 , 5.3833633060013] , [ 1185854400000 , 5.5125898831832] , [ 1188532800000 , 5.8116112661327] , [ 1191124800000 , 4.3962296939996] , [ 1193803200000 , 4.6967663605521] , [ 1196398800000 , 4.7963004350914] , [ 1199077200000 , 4.1817985183351] , [ 1201755600000 , 4.3797643870182] , [ 1204261200000 , 4.6966642197965] , [ 1206936000000 , 4.3609995132565] , [ 1209528000000 , 4.4736290996496] , [ 1212206400000 , 4.3749762738128] , [ 1214798400000 , 3.3274661194507] , [ 1217476800000 , 3.0316184691337] , [ 1220155200000 , 2.5718140204728] , [ 1222747200000 , 2.7034994044603] , [ 1225425600000 , 2.2033786591364] , [ 1228021200000 , 1.9850621240805] , [ 1230699600000 , 0] , [ 1233378000000 , 0] , [ 1235797200000 , 0] , [ 1238472000000 , 0] , [ 1241064000000 , 0] , [ 1243742400000 , 0] , [ 1246334400000 , 0] , [ 1249012800000 , 0] , [ 1251691200000 , 0] , [ 1254283200000 , 0.44495950017788] , [ 1256961600000 , 0.33945469262483] , [ 1259557200000 , 0.38348269455195] , [ 1262235600000 , 0] , [ 1264914000000 , 0] , [ 1267333200000 , 0] , [ 1270008000000 , 0] , [ 1272600000000 , 0] , [ 1275278400000 , 0] , [ 1277870400000 , 0] , [ 1280548800000 , 0] , [ 1283227200000 , 0] , [ 1285819200000 , 0] , [ 1288497600000 , 0] , [ 1291093200000 , 0] , [ 1293771600000 , 0] , [ 1296450000000 , 0.52216435716176] , [ 1298869200000 , 0.59275786698454] , [ 1301544000000 , 0] , [ 1304136000000 , 0] , [ 1306814400000 , 0] , [ 1309406400000 , 0] , [ 1312084800000 , 0] , [ 1314763200000 , 0] , [ 1317355200000 , 0] , [ 1320033600000 , 0] , [ 1322629200000 , 0] , [ 1325307600000 , 0] , [ 1327986000000 , 0] , [ 1330491600000 , 0] , [ 1333166400000 , 0] , [ 1335758400000 , 0]]
            } ,

            {
                "key" : "Antarctica" ,
                "values" : [ [ 1025409600000 , 1.3503144674343] , [ 1028088000000 , 1.2232741112434] , [ 1030766400000 , 1.3930470790784] , [ 1033358400000 , 1.2631275030593] , [ 1036040400000 , 1.5842699103708] , [ 1038632400000 , 1.9546996043116] , [ 1041310800000 , 0.8504048300986] , [ 1043989200000 , 0.85340686311353] , [ 1046408400000 , 0.843061357391] , [ 1049086800000 , 2.119846992476] , [ 1051675200000 , 2.5285382124858] , [ 1054353600000 , 2.5056570712835] , [ 1056945600000 , 2.5212789901005] , [ 1059624000000 , 2.6192011642534] , [ 1062302400000 , 2.5382187823805] , [ 1064894400000 , 2.3393223047168] , [ 1067576400000 , 2.491219888698] , [ 1070168400000 , 2.497555874906] , [ 1072846800000 , 1.734018115546] , [ 1075525200000 , 1.9307268299646] , [ 1078030800000 , 2.2261679836799] , [ 1080709200000 , 1.7608893704206] , [ 1083297600000 , 1.6242690616808] , [ 1085976000000 , 1.7161663801295] , [ 1088568000000 , 1.7183554537038] , [ 1091246400000 , 1.7179780759145] , [ 1093924800000 , 1.7314274801784] , [ 1096516800000 , 1.2596883356752] , [ 1099195200000 , 1.381177053009] , [ 1101790800000 , 1.4408819615814] , [ 1104469200000 , 3.4743581836444] , [ 1107147600000 , 3.3603749903192] , [ 1109566800000 , 3.5350883257893] , [ 1112245200000 , 3.0949644237828] , [ 1114833600000 , 3.0796455899995] , [ 1117512000000 , 3.3441247640644] , [ 1120104000000 , 4.0947643978168] , [ 1122782400000 , 4.4072631274052] , [ 1125460800000 , 4.4870979780825] , [ 1128052800000 , 4.8404549457934] , [ 1130734800000 , 4.8293016233697] , [ 1133326800000 , 5.2238093263952] , [ 1136005200000 , 3.382306337815] , [ 1138683600000 , 3.7056975170243] , [ 1141102800000 , 3.7561118692318] , [ 1143781200000 , 2.861913700854] , [ 1146369600000 , 2.9933744103381] , [ 1149048000000 , 2.7127537218463] , [ 1151640000000 , 3.1195497076283] , [ 1154318400000 , 3.4066964004508] , [ 1156996800000 , 3.3754571113569] , [ 1159588800000 , 2.2965579982924] , [ 1162270800000 , 2.4486818633018] , [ 1164862800000 , 2.4002308848517] , [ 1167541200000 , 1.9649579750349] , [ 1170219600000 , 1.9385263638056] , [ 1172638800000 , 1.9128975336387] , [ 1175313600000 , 2.3412869836298] , [ 1177905600000 , 2.4337870351445] , [ 1180584000000 , 2.62179703171] , [ 1183176000000 , 3.2642864957929] , [ 1185854400000 , 3.3200396223709] , [ 1188532800000 , 3.3934212707572] , [ 1191124800000 , 4.2822327088179] , [ 1193803200000 , 4.1474964228541] , [ 1196398800000 , 4.1477082879801] , [ 1199077200000 , 5.2947122916128] , [ 1201755600000 , 5.2919843508028] , [ 1204261200000 , 5.198978305031] , [ 1206936000000 , 3.5603057673513] , [ 1209528000000 , 3.3009087690692] , [ 1212206400000 , 3.1784852603792] , [ 1214798400000 , 4.5889503538868] , [ 1217476800000 , 4.401779617494] , [ 1220155200000 , 4.2208301828278] , [ 1222747200000 , 3.89396671475] , [ 1225425600000 , 3.0423832241354] , [ 1228021200000 , 3.135520611578] , [ 1230699600000 , 1.9631418164089] , [ 1233378000000 , 1.8963543874958] , [ 1235797200000 , 1.8266636017025] , [ 1238472000000 , 0.93136635895188] , [ 1241064000000 , 0.92737801918888] , [ 1243742400000 , 0.97591889805002] , [ 1246334400000 , 2.6841193805515] , [ 1249012800000 , 2.5664341140531] , [ 1251691200000 , 2.3887523699873] , [ 1254283200000 , 1.1737801663681] , [ 1256961600000 , 1.0953582317281] , [ 1259557200000 , 1.2495674976653] , [ 1262235600000 , 0.36607452464754] , [ 1264914000000 , 0.3548719047291] , [ 1267333200000 , 0.36769242398939] , [ 1270008000000 , 0] , [ 1272600000000 , 0] , [ 1275278400000 , 0] , [ 1277870400000 , 0] , [ 1280548800000 , 0] , [ 1283227200000 , 0] , [ 1285819200000 , 0.85450741275337] , [ 1288497600000 , 0.91360317921637] , [ 1291093200000 , 0.89647678692269] , [ 1293771600000 , 0.87800687192639] , [ 1296450000000 , 0] , [ 1298869200000 , 0] , [ 1301544000000 , 0.43668720882994] , [ 1304136000000 , 0.4756523602692] , [ 1306814400000 , 0.46947368328469] , [ 1309406400000 , 0.45138896152316] , [ 1312084800000 , 0.43828726648117] , [ 1314763200000 , 2.0820861395316] , [ 1317355200000 , 0.9364411075395] , [ 1320033600000 , 0.60583907839773] , [ 1322629200000 , 0.61096950747437] , [ 1325307600000 , 0] , [ 1327986000000 , 0] , [ 1330491600000 , 0] , [ 1333166400000 , 0] , [ 1335758400000 , 0]]
            }

        ]
    }])
'use strict';

angular.module('chart-components')

    .controller('sunburstChartCtrl', ["$scope", function($scope){

        $scope.options = {
            chart: {
                type: 'sunburstChart',
                height: 450,
                color: d3.scale.category20c(),
                duration: 250
            }
        };

        $scope.data = [{
            "name": "flare",
            "children": [
                {
                    "name": "analytics",
                    "children": [
                        {
                            "name": "cluster",
                            "children": [
                                {"name": "AgglomerativeCluster", "size": 3938},
                                {"name": "CommunityStructure", "size": 3812},
                                {"name": "HierarchicalCluster", "size": 6714},
                                {"name": "MergeEdge", "size": 743}
                            ]
                        },
                        {
                            "name": "graph",
                            "children": [
                                {"name": "BetweennessCentrality", "size": 3534},
                                {"name": "LinkDistance", "size": 5731},
                                {"name": "MaxFlowMinCut", "size": 7840},
                                {"name": "ShortestPaths", "size": 5914},
                                {"name": "SpanningTree", "size": 3416}
                            ]
                        },
                        {
                            "name": "optimization",
                            "children": [
                                {"name": "AspectRatioBanker", "size": 7074}
                            ]
                        }
                    ]
                },
                {
                    "name": "animate",
                    "children": [
                        {"name": "Easing", "size": 17010},
                        {"name": "FunctionSequence", "size": 5842},
                        {
                            "name": "interpolate",
                            "children": [
                                {"name": "ArrayInterpolator", "size": 1983},
                                {"name": "ColorInterpolator", "size": 2047},
                                {"name": "DateInterpolator", "size": 1375},
                                {"name": "Interpolator", "size": 8746},
                                {"name": "MatrixInterpolator", "size": 2202},
                                {"name": "NumberInterpolator", "size": 1382},
                                {"name": "ObjectInterpolator", "size": 1629},
                                {"name": "PointInterpolator", "size": 1675},
                                {"name": "RectangleInterpolator", "size": 2042}
                            ]
                        },
                        {"name": "ISchedulable", "size": 1041},
                        {"name": "Parallel", "size": 5176},
                        {"name": "Pause", "size": 449},
                        {"name": "Scheduler", "size": 5593},
                        {"name": "Sequence", "size": 5534},
                        {"name": "Transition", "size": 9201},
                        {"name": "Transitioner", "size": 19975},
                        {"name": "TransitionEvent", "size": 1116},
                        {"name": "Tween", "size": 6006}
                    ]
                },
                {
                    "name": "data",
                    "children": [
                        {
                            "name": "converters",
                            "children": [
                                {"name": "Converters", "size": 721},
                                {"name": "DelimitedTextConverter", "size": 4294},
                                {"name": "GraphMLConverter", "size": 9800},
                                {"name": "IDataConverter", "size": 1314},
                                {"name": "JSONConverter", "size": 2220}
                            ]
                        },
                        {"name": "DataField", "size": 1759},
                        {"name": "DataSchema", "size": 2165},
                        {"name": "DataSet", "size": 586},
                        {"name": "DataSource", "size": 3331},
                        {"name": "DataTable", "size": 772},
                        {"name": "DataUtil", "size": 3322}
                    ]
                },
                {
                    "name": "display",
                    "children": [
                        {"name": "DirtySprite", "size": 8833},
                        {"name": "LineSprite", "size": 1732},
                        {"name": "RectSprite", "size": 3623},
                        {"name": "TextSprite", "size": 10066}
                    ]
                },
                {
                    "name": "flex",
                    "children": [
                        {"name": "FlareVis", "size": 4116}
                    ]
                },
                {
                    "name": "physics",
                    "children": [
                        {"name": "DragForce", "size": 1082},
                        {"name": "GravityForce", "size": 1336},
                        {"name": "IForce", "size": 319},
                        {"name": "NBodyForce", "size": 10498},
                        {"name": "Particle", "size": 2822},
                        {"name": "Simulation", "size": 9983},
                        {"name": "Spring", "size": 2213},
                        {"name": "SpringForce", "size": 1681}
                    ]
                },
                {
                    "name": "query",
                    "children": [
                        {"name": "AggregateExpression", "size": 1616},
                        {"name": "And", "size": 1027},
                        {"name": "Arithmetic", "size": 3891},
                        {"name": "Average", "size": 891},
                        {"name": "BinaryExpression", "size": 2893},
                        {"name": "Comparison", "size": 5103},
                        {"name": "CompositeExpression", "size": 3677},
                        {"name": "Count", "size": 781},
                        {"name": "DateUtil", "size": 4141},
                        {"name": "Distinct", "size": 933},
                        {"name": "Expression", "size": 5130},
                        {"name": "ExpressionIterator", "size": 3617},
                        {"name": "Fn", "size": 3240},
                        {"name": "If", "size": 2732},
                        {"name": "IsA", "size": 2039},
                        {"name": "Literal", "size": 1214},
                        {"name": "Match", "size": 3748},
                        {"name": "Maximum", "size": 843},
                        {
                            "name": "methods",
                            "children": [
                                {"name": "add", "size": 593},
                                {"name": "and", "size": 330},
                                {"name": "average", "size": 287},
                                {"name": "count", "size": 277},
                                {"name": "distinct", "size": 292},
                                {"name": "div", "size": 595},
                                {"name": "eq", "size": 594},
                                {"name": "fn", "size": 460},
                                {"name": "gt", "size": 603},
                                {"name": "gte", "size": 625},
                                {"name": "iff", "size": 748},
                                {"name": "isa", "size": 461},
                                {"name": "lt", "size": 597},
                                {"name": "lte", "size": 619},
                                {"name": "max", "size": 283},
                                {"name": "min", "size": 283},
                                {"name": "mod", "size": 591},
                                {"name": "mul", "size": 603},
                                {"name": "neq", "size": 599},
                                {"name": "not", "size": 386},
                                {"name": "or", "size": 323},
                                {"name": "orderby", "size": 307},
                                {"name": "range", "size": 772},
                                {"name": "select", "size": 296},
                                {"name": "stddev", "size": 363},
                                {"name": "sub", "size": 600},
                                {"name": "sum", "size": 280},
                                {"name": "update", "size": 307},
                                {"name": "variance", "size": 335},
                                {"name": "where", "size": 299},
                                {"name": "xor", "size": 354},
                                {"name": "_", "size": 264}
                            ]
                        },
                        {"name": "Minimum", "size": 843},
                        {"name": "Not", "size": 1554},
                        {"name": "Or", "size": 970},
                        {"name": "Query", "size": 13896},
                        {"name": "Range", "size": 1594},
                        {"name": "StringUtil", "size": 4130},
                        {"name": "Sum", "size": 791},
                        {"name": "Variable", "size": 1124},
                        {"name": "Variance", "size": 1876},
                        {"name": "Xor", "size": 1101}
                    ]
                },
                {
                    "name": "scale",
                    "children": [
                        {"name": "IScaleMap", "size": 2105},
                        {"name": "LinearScale", "size": 1316},
                        {"name": "LogScale", "size": 3151},
                        {"name": "OrdinalScale", "size": 3770},
                        {"name": "QuantileScale", "size": 2435},
                        {"name": "QuantitativeScale", "size": 4839},
                        {"name": "RootScale", "size": 1756},
                        {"name": "Scale", "size": 4268},
                        {"name": "ScaleType", "size": 1821},
                        {"name": "TimeScale", "size": 5833}
                    ]
                },
                {
                    "name": "util",
                    "children": [
                        {"name": "Arrays", "size": 8258},
                        {"name": "Colors", "size": 10001},
                        {"name": "Dates", "size": 8217},
                        {"name": "Displays", "size": 12555},
                        {"name": "Filter", "size": 2324},
                        {"name": "Geometry", "size": 10993},
                        {
                            "name": "heap",
                            "children": [
                                {"name": "FibonacciHeap", "size": 9354},
                                {"name": "HeapNode", "size": 1233}
                            ]
                        },
                        {"name": "IEvaluable", "size": 335},
                        {"name": "IPredicate", "size": 383},
                        {"name": "IValueProxy", "size": 874},
                        {
                            "name": "math",
                            "children": [
                                {"name": "DenseMatrix", "size": 3165},
                                {"name": "IMatrix", "size": 2815},
                                {"name": "SparseMatrix", "size": 3366}
                            ]
                        },
                        {"name": "Maths", "size": 17705},
                        {"name": "Orientation", "size": 1486},
                        {
                            "name": "palette",
                            "children": [
                                {"name": "ColorPalette", "size": 6367},
                                {"name": "Palette", "size": 1229},
                                {"name": "ShapePalette", "size": 2059},
                                {"name": "SizePalette", "size": 2291}
                            ]
                        },
                        {"name": "Property", "size": 5559},
                        {"name": "Shapes", "size": 19118},
                        {"name": "Sort", "size": 6887},
                        {"name": "Stats", "size": 6557},
                        {"name": "Strings", "size": 22026}
                    ]
                },
                {
                    "name": "vis",
                    "children": [
                        {
                            "name": "axis",
                            "children": [
                                {"name": "Axes", "size": 1302},
                                {"name": "Axis", "size": 24593},
                                {"name": "AxisGridLine", "size": 652},
                                {"name": "AxisLabel", "size": 636},
                                {"name": "CartesianAxes", "size": 6703}
                            ]
                        },
                        {
                            "name": "controls",
                            "children": [
                                {"name": "AnchorControl", "size": 2138},
                                {"name": "ClickControl", "size": 3824},
                                {"name": "Control", "size": 1353},
                                {"name": "ControlList", "size": 4665},
                                {"name": "DragControl", "size": 2649},
                                {"name": "ExpandControl", "size": 2832},
                                {"name": "HoverControl", "size": 4896},
                                {"name": "IControl", "size": 763},
                                {"name": "PanZoomControl", "size": 5222},
                                {"name": "SelectionControl", "size": 7862},
                                {"name": "TooltipControl", "size": 8435}
                            ]
                        },
                        {
                            "name": "data",
                            "children": [
                                {"name": "Data", "size": 20544},
                                {"name": "DataList", "size": 19788},
                                {"name": "DataSprite", "size": 10349},
                                {"name": "EdgeSprite", "size": 3301},
                                {"name": "NodeSprite", "size": 19382},
                                {
                                    "name": "render",
                                    "children": [
                                        {"name": "ArrowType", "size": 698},
                                        {"name": "EdgeRenderer", "size": 5569},
                                        {"name": "IRenderer", "size": 353},
                                        {"name": "ShapeRenderer", "size": 2247}
                                    ]
                                },
                                {"name": "ScaleBinding", "size": 11275},
                                {"name": "Tree", "size": 7147},
                                {"name": "TreeBuilder", "size": 9930}
                            ]
                        },
                        {
                            "name": "events",
                            "children": [
                                {"name": "DataEvent", "size": 2313},
                                {"name": "SelectionEvent", "size": 1880},
                                {"name": "TooltipEvent", "size": 1701},
                                {"name": "VisualizationEvent", "size": 1117}
                            ]
                        },
                        {
                            "name": "legend",
                            "children": [
                                {"name": "Legend", "size": 20859},
                                {"name": "LegendItem", "size": 4614},
                                {"name": "LegendRange", "size": 10530}
                            ]
                        },
                        {
                            "name": "operator",
                            "children": [
                                {
                                    "name": "distortion",
                                    "children": [
                                        {"name": "BifocalDistortion", "size": 4461},
                                        {"name": "Distortion", "size": 6314},
                                        {"name": "FisheyeDistortion", "size": 3444}
                                    ]
                                },
                                {
                                    "name": "encoder",
                                    "children": [
                                        {"name": "ColorEncoder", "size": 3179},
                                        {"name": "Encoder", "size": 4060},
                                        {"name": "PropertyEncoder", "size": 4138},
                                        {"name": "ShapeEncoder", "size": 1690},
                                        {"name": "SizeEncoder", "size": 1830}
                                    ]
                                },
                                {
                                    "name": "filter",
                                    "children": [
                                        {"name": "FisheyeTreeFilter", "size": 5219},
                                        {"name": "GraphDistanceFilter", "size": 3165},
                                        {"name": "VisibilityFilter", "size": 3509}
                                    ]
                                },
                                {"name": "IOperator", "size": 1286},
                                {
                                    "name": "label",
                                    "children": [
                                        {"name": "Labeler", "size": 9956},
                                        {"name": "RadialLabeler", "size": 3899},
                                        {"name": "StackedAreaLabeler", "size": 3202}
                                    ]
                                },
                                {
                                    "name": "layout",
                                    "children": [
                                        {"name": "AxisLayout", "size": 6725},
                                        {"name": "BundledEdgeRouter", "size": 3727},
                                        {"name": "CircleLayout", "size": 9317},
                                        {"name": "CirclePackingLayout", "size": 12003},
                                        {"name": "DendrogramLayout", "size": 4853},
                                        {"name": "ForceDirectedLayout", "size": 8411},
                                        {"name": "IcicleTreeLayout", "size": 4864},
                                        {"name": "IndentedTreeLayout", "size": 3174},
                                        {"name": "Layout", "size": 7881},
                                        {"name": "NodeLinkTreeLayout", "size": 12870},
                                        {"name": "PieLayout", "size": 2728},
                                        {"name": "RadialTreeLayout", "size": 12348},
                                        {"name": "RandomLayout", "size": 870},
                                        {"name": "StackedAreaLayout", "size": 9121},
                                        {"name": "TreeMapLayout", "size": 9191}
                                    ]
                                },
                                {"name": "Operator", "size": 2490},
                                {"name": "OperatorList", "size": 5248},
                                {"name": "OperatorSequence", "size": 4190},
                                {"name": "OperatorSwitch", "size": 2581},
                                {"name": "SortOperator", "size": 2023}
                            ]
                        },
                        {"name": "Visualization", "size": 16540}
                    ]
                }
            ]
        }];
    }])
'use strict';

angular.module('chart-components')

	.directive('donutChart', function(){

		return {
			restrict: 'E',
			scope: {
				settings: '=',
				widgetHandleToChild: '='
			},
			templateUrl: 'shared/public/modules/chart-components/views/donut-chart.chart-components.directive.view.html',
			controller: ["$scope", "$timeout", "$http", "CoreFunctions", function($scope, $timeout,$http, CoreFunctions){
				if(!$scope.settings || !$scope.settings.referencedFeatureName || !$scope.settings.referencedPropertyName){
					console.error('Donut chart cannot be configured. Invalid settings', $scope.settings);
					return;
				}
		        
		        $http.get($scope.settings.referencedFeatureName).then(function(response) {
			        $scope.data = [];
			        if(response && response.data && response.data.length){
			        	var keyValues = {};
			        	response.data.forEach(function(val){
			        		var specificPropertyValue = val[CoreFunctions.getPropertyColumnName($scope.settings.referencedPropertyName)];
			        		if(keyValues[specificPropertyValue]){
			        			keyValues[specificPropertyValue] = keyValues[specificPropertyValue] + 1;
			        		} else {
			        			keyValues[specificPropertyValue] = 1;
			        		}

			        	});
			        	var data = [];
		        		for(var key in keyValues){
		        			data.push({key: key, y: keyValues[key]});
		        		}
		        		$scope.data = data;
			        }
			    }, function(error){
			    	console.error('Donut chart data could not be retrieved', error);
			    	 $scope.data = [];
			    });

		        $scope.options = {
		            chart: {
		                type: 'pieChart',
		                x: function(d){return d.key;},
		                y: function(d){return d.y;},
		                donut: true,
		                showLabels: true,
		                duration: 500,
		                labelThreshold: 0.01,
		                labelSunbeamLayout: true,
		                legend: {
		                    margin: {
		                        top: 5,
		                        right: 35,
		                        bottom: 5,
		                        left: 0
		                    }
		                }
		            }
		        };

				$scope.updateLayout = function(){
					$timeout(function(){
						if ($scope.api && $scope.api.update) {
							$scope.api.update();
						}
					},200);
				};

				$scope.events = {
					resize: function(e, scope){
						$scope.updateLayout();
					}
				};

				$scope.widgetHandleToChild.updateLayout = $scope.updateLayout;

				$scope.config = { visible: false };

				//make chart visible after grid have been created
				$timeout(function(){
					$scope.config.visible = true;
				}, 200);
	    	}]
		};
	});

'use strict';

angular.module('chart-components')

    .directive('historicalBarChart', function () {
        return {
            restrict: 'E',
            
            scope: {
                settings: '=',
                widgetHandleToChild: '='
            },
            templateUrl: 'shared/public/modules/chart-components/views/historical-bar-chart.chart-components.directive.view.html',
            controller: ["$scope", "$timeout", "$http", "CoreFunctions", function($scope, $timeout, $http, CoreFunctions){
                if(!$scope.settings || !$scope.settings.referencedFeatureName || !$scope.settings.referencedPropertyName){
                    console.error('Historicalß bar chart cannot be configured. Invalid settings', $scope.settings);
                    return;
                }
                
                $http.get($scope.settings.referencedFeatureName).then(function(response) {
                    if(response && response.data && response.data.length){
                        var data = [];
                        response.data.forEach(function(val){
                            var specificPropertyValue = Number(val[CoreFunctions.getPropertyColumnName($scope.settings.referencedPropertyName)]);
                            data.push([new Date(val.created),specificPropertyValue]);
                        });

                        $scope.data = [{
                            "key" : $scope.settings.referencedPropertyName,
                            "bar": true,
                            "values" : data
                        }];
                    }
                }, function(error){
                    console.error('Historical bar chart data could not be retrieved', error);
                     $scope.data = [];
                });


                $scope.options = {
                    chart: {
                        type: 'historicalBarChart',
                        margin : {
                            top: 20,
                            right: 90,
                            bottom: 125,
                            left: 50
                        },
                        x: function(d){return d[0];},
                        y: function(d){return d[1];},
                        showValues: true,
                        valueFormat: function(d){
                            return d3.format(',.1f')(d);
                        },
                        duration: 100,
                        xAxis: {
                            axisLabel: '',
                            tickFormat: function(d) {
                                return d3.time.format('%c')(new Date(d))
                            },
                            rotateLabels: 30,
                            showMaxMin: false
                        },
                        yAxis: {
                            axisLabel: $scope.settings.referencedPropertyName,
                            axisLabelDistance: -10,
                            tickFormat: function(d){
                                return d3.format(',.1f')(d);
                            }
                        },
                        tooltip: {
                            keyFormatter: function(d) {
                                return d3.time.format('%c')(new Date(d));
                            }
                        },
                        zoom: {
                            enabled: true,
                            scaleExtent: [1, 10],
                            useFixedDomain: false,
                            useNiceScale: false,
                            horizontalOff: false,
                            verticalOff: true,
                            unzoomEventType: 'dblclick.zoom'
                        }
                    }
                };

                $scope.updateLayout = function(){
                    $timeout(function(){
                        if ($scope.api && $scope.api.update) {
                            $scope.api.update();
                        }
                    },200);
                };

                $scope.events = {
                    resize: function(e, scope){
                        $scope.updateLayout();
                    }
                };

                $scope.widgetHandleToChild.updateLayout = $scope.updateLayout;

                $scope.config = { visible: false };

                //make chart visible after grid have been created
                $timeout(function(){
                    $scope.config.visible = true;
                }, 200);
            }]
        };
    });
'use strict';

//http://codepen.io/danielemoraschi/pen/qFmol#0
angular.module('chart-components')
    .directive('horzPercentBarChart', function () {
        return {
            restrict: 'E',
            
            scope: {
                settings: '=',
                widgetHandleToChild: '='
            },

            controller: ["$scope", "$timeout", "$http", "CoreFunctions", function($scope, $timeout, $http, CoreFunctions){
                if(!$scope.settings || !$scope.settings.referencedFeatureName || !$scope.settings.referencedPropertyName){
                    console.error('Horizontal percent bar chart cannot be configured. Invalid settings', $scope.settings);
                    return;
                }
                
                $http.get($scope.settings.referencedFeatureName).then(function(response) {
                    $scope.data = [];
                    var total = 0;
                    if(response && response.data && response.data.length){
                        var keyValues = {};
                        response.data.forEach(function(val){
                            var specificPropertyValue = val[CoreFunctions.getPropertyColumnName($scope.settings.referencedPropertyName)];
                            if(keyValues[specificPropertyValue]){
                                keyValues[specificPropertyValue] = keyValues[specificPropertyValue] + 1;
                            } else {
                                keyValues[specificPropertyValue] = 1;
                            }
                            total++;
                        });
                        var data = [];
                        for(var key in keyValues){
                            data.push({key: key, percent: Math.round(keyValues[key]*100/total)});
                        }
                        $scope.data = data;
                    }
                }, function(error){
                    console.error('Horizontal percent bar chart data could not be retrieved', error);
                     $scope.data = [];
                });

                $scope.updateLayout = function(){
                    $timeout(function(){
                        // if ($scope.api && $scope.api.update) {
                        //     $scope.api.update();
                        // }
                        //TODO: WRITE FUNCTION TO UPDATE CHART IF IT IS NOT UPDATING BY ITSELF
                    },200);
                };

                $scope.events = {
                    resize: function(e, scope){
                        $scope.updateLayout();
                    }
                };

                $scope.widgetHandleToChild.updateLayout = $scope.updateLayout;

                $scope.config = { visible: false };

                //make chart visible after grid have been created
                $timeout(function(){
                    $scope.config.visible = true;
                }, 200);
            }],

            link: function (scope, element, attrs) {
                scope.$watch('data', function(data) {
                    if(!data){
                        return;
                    }
                    var chart = d3.select(element[0])
                        .append("div").attr("class", "horz-percent-bar-chart")
                        .selectAll('div')
                        .data(data).enter()
                        .append("div")
                        .transition().ease("elastic")
                        .style("width", function(d) { return d.percent + "%"; })
                        .text(function(d) { return d.key + ' ' + d.percent + "%"; });
                });
            }
        };
    });
'use strict';

angular.module('chart-components')

    .directive('lineChart', function(){
        return {
            restrict: 'E',
            scope: {
                settings: '=',
                widgetHandleToChild: '='
            },
            templateUrl: 'shared/public/modules/chart-components/views/pie-chart.chart-components.directive.view.html',
            controller: ["$scope", "$timeout", "$http", "CoreFunctions", function($scope, $timeout,$http, CoreFunctions) {
                if(!$scope.settings || !$scope.settings.referencedFeatureName || !$scope.settings.referencedPropertyName){
                    console.error('Line chart cannot be configured. Invalid settings', $scope.settings);
                    return;
                }
                
                $http.get($scope.settings.referencedFeatureName).then(function(response) {
                    if(response && response.data && response.data.length){
                        var data = [];
                        response.data.forEach(function(val){
                            var y = Number(val[CoreFunctions.getPropertyColumnName($scope.settings.referencedPropertyName)]); //TODO: remove number parsing when right data type is selected
                            var x = new Date(val.created);
                            var entry = {x: x, y: y};
                            data.push(entry);
                        });
                        
                        $scope.data = [{
                            values: data,      //values - represents the array of {x,y} data points
                            key: $scope.settings.referencedPropertyName, //key  - the name of the series.
                            color: '#ff7f0e'  //color - optional: choose your own line color.
                        }];
                    }  
                }, function(error){
                    console.error('Line chart data could not be retrieved', error);
                     $scope.data = null;
                });
                
                var format = d3.time.format("%Y-%m-%d");
                $scope.options = {
                    chart: {
                        type: 'lineChart',
                        margin : {
                            top: 20,
                            right: 40,
                            bottom: 40,
                            left: 55
                        },
                        x: function(d){ return d.x; },
                        y: function(d){ return d.y; },
                        useInteractiveGuideline: true,
                        dispatch: {
                            stateChange: function(e){ console.log("stateChange"); },
                            changeState: function(e){ console.log("changeState"); },
                            tooltipShow: function(e){ console.log("tooltipShow"); },
                            tooltipHide: function(e){ console.log("tooltipHide"); }
                        },
                        xAxis: {
                            axisLabel: 'Date',
                            tickFormat: function(date) { return format(new Date(date)) } 
                        },
                        yAxis: {
                            axisLabel: $scope.settings.referencedPropertyName,
                            
                            axisLabelDistance: -10
                        },
                        callback: function(chart){
                            
                        }
                    }
                };

                $scope.updateLayout = function(){
                    $timeout(function(){
                        if ($scope.api && $scope.api.update) {
                            $scope.api.update();
                        }
                    },200);
                };

                $scope.events = {
                    resize: function(e, scope){
                        $scope.updateLayout();
                    }
                };

                $scope.widgetHandleToChild.updateLayout = $scope.updateLayout;

                $scope.config = { visible: false };

                //make chart visible after grid have been created
                $timeout(function(){
                    $scope.config.visible = true;
                }, 200);

            }]
        };
    });
'use strict';

angular.module('chart-components')

	.directive('pieChart', function(){

		return {
			restrict: 'E',
			scope: {
				settings: '=',
				widgetHandleToChild: '='
			},
			templateUrl: 'shared/public/modules/chart-components/views/pie-chart.chart-components.directive.view.html',
			controller: ["$scope", "$timeout", "$http", "CoreFunctions", function($scope, $timeout, $http, CoreFunctions){
				if(!$scope.settings || !$scope.settings.referencedFeatureName || !$scope.settings.referencedPropertyName){
					console.error('Pie chart cannot be configured. Invalid settings', $scope.settings);
					return;
				}
		        
		        $http.get($scope.settings.referencedFeatureName).then(function(response) {
			        $scope.data = [];
			        if(response && response.data && response.data.length){
			        	var keyValues = {};
			        	response.data.forEach(function(val){
			        		var specificPropertyValue = val[CoreFunctions.getPropertyColumnName($scope.settings.referencedPropertyName)];
			        		if(keyValues[specificPropertyValue]){
			        			keyValues[specificPropertyValue] = keyValues[specificPropertyValue] + 1;
			        		} else {
			        			keyValues[specificPropertyValue] = 1;
			        		}

			        	});
			        	var data = [];
		        		for(var key in keyValues){
		        			data.push({key: key, y: keyValues[key]});
		        		}
		        		$scope.data = data;
			        }
			    }, function(error){
			    	console.error('Pie chart data could not be retrieved', error);
			    	 $scope.data = [];
			    });

		        $scope.options = {
		            chart: {
		                type: 'pieChart',
		                x: function(d){return d.key;},
		                y: function(d){return d.y;},
		                showLabels: true,
		                duration: 500,
		                labelThreshold: 0.01,
		                labelSunbeamLayout: true,
		                legend: {
		                    margin: {
		                        top: 5,
		                        right: 35,
		                        bottom: 5,
		                        left: 0
		                    }
		                }
		            }
		        };

				$scope.updateLayout = function(){
					$timeout(function(){
						if ($scope.api && $scope.api.update) {
							$scope.api.update();
						}
					},200);
				};

				$scope.events = {
					resize: function(e, scope){
						$scope.updateLayout();
					}
				};

				$scope.widgetHandleToChild.updateLayout = $scope.updateLayout;

				$scope.config = { visible: false };

				//make chart visible after grid have been created
				$timeout(function(){
					$scope.config.visible = true;
				}, 200);
	    	}]
		};
	});

'use strict';

angular.module('chart-components')

	.directive('stackedAreaChart', function(){

		return {
			restrict: 'E',
			scope: {
				settings: '=',
				widgetHandleToChild: '='
			},
			templateUrl: 'shared/public/modules/chart-components/views/stacked-area-chart.chart-components.directive.view.html',
			controller: ["$scope", "$timeout", "$http", "CoreFunctions", function($scope, $timeout, $http, CoreFunctions){
				if(!$scope.settings || !$scope.settings.referencedFeatureName || !$scope.settings.propertyNames){
					console.error('Stacked area chart cannot be configured. Invalid settings', $scope.settings);
					return;
				}
		        var properties = $scope.settings.propertyNames.split(',');
		        var chartData = [];
		        properties.forEach(function(property){
		        	chartData.push({ values: [], key: property})
		        });
		        $http.get($scope.settings.referencedFeatureName).then(function(response) {
                    if(response && response.data && response.data.length){
                        
                        response.data.forEach(function(val){
                        	chartData.forEach(function(entry){
	                            var y = Number(val[CoreFunctions.getPropertyColumnName(entry.key)]); //TODO: remove number parsing when right data type is selected
	                            var x = new Date(val.created);
	                            entry.values.push([x,y]);
                        	});

                        });
                        
                        $scope.data = chartData;
			        }
			    }, function(error){
			    	console.error('Stacked area chart data could not be retrieved', error);
			    	 $scope.data = [];
			    });

		        $scope.options = {
		            chart: {
		                type: 'stackedAreaChart',
				        margin : {
		                    top: 20,
		                    right: 20,
		                    bottom: 30,
		                    left: 40
		                },
		                x: function(d){return d[0];},
		                y: function(d){return d[1];},
		                useVoronoi: false,
		                clipEdge: true,
		                duration: 100,
		                useInteractiveGuideline: true,
		                xAxis: {
		                    showMaxMin: false,
		                    tickFormat: function(d) {
		                        return d3.time.format('%x')(new Date(d))
		                    }
		                },
		                yAxis: {
		                    tickFormat: function(d){
		                        return d3.format(',.2f')(d);
		                    }
		                },
		                zoom: {
		                    enabled: true,
		                    scaleExtent: [1, 10],
		                    useFixedDomain: false,
		                    useNiceScale: false,
		                    horizontalOff: false,
		                    verticalOff: true,
		                    unzoomEventType: 'dblclick.zoom'
		                }
		            }
		        };

				$scope.updateLayout = function(){
					$timeout(function(){
						if ($scope.api && $scope.api.update) {
							$scope.api.update();
						}
					},200);
				};

				$scope.events = {
					resize: function(e, scope){
						$scope.updateLayout();
					}
				};

				$scope.widgetHandleToChild.updateLayout = $scope.updateLayout;

				$scope.config = { visible: false };

				//make chart visible after grid have been created
				$timeout(function(){
					$scope.config.visible = true;
				}, 200);
	    	}]
		};
	});

'use strict';

angular.module('dashboard-components').controller('CustomWidgetCtrl', ['$scope', '$modal',
    function($scope, $modal) {

      $scope.remove = function(widget) {
        $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
      };

      $scope.openSettings = function(widget) {
        $modal.open({
          scope: $scope,
          templateUrl: 'shared/public/modules/dashboard-components/views/widget-settings.client.view.html',
          controller: 'WidgetSettingsCtrl',
          resolve: {
            widget: function() {
              return widget;
            }
          }
        });
      };

    }
  ]);
'use strict';

angular.module('dashboard-components').controller('WidgetSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$modalInstance', 'widget', 'generator',
    function($scope, $timeout, $rootScope, $modalInstance, widget, generator) {
      $scope.widget = widget;
      $scope.widgetTypes = Object.keys(generator);

      $scope.form = {
        name: widget.name,
        sizeX: widget.sizeX,
        sizeY: widget.sizeY,
        col: widget.col,
        row: widget.row,
        type: widget.type
      };

      $scope.sizeOptions = [{
        id: '1',
        name: '1'
      }, {
        id: '2',
        name: '2'
      }, {
        id: '3',
        name: '3'
      }, {
        id: '4',
        name: '4'
      }];

      $scope.dismiss = function() {
        $modalInstance.dismiss();
      };

      $scope.remove = function() {
        $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
        $modalInstance.close();
      };

      $scope.submit = function() {
        angular.extend(widget, $scope.form);

        //update with new options and data
        if (widget.type) {
          widget.chart.options = generator[widget.type].options();
          widget.chart.data = generator[widget.type].data();
        }
        $modalInstance.close(widget);

        //update new chart
        $timeout(function(){
          widget.chart.api.update();
        },600)
      };

    }
  ]);
'use strict';

angular.module('dashboard-components').directive('exampleDashboard', function(){ return {

  templateUrl: 'shared/public/modules/dashboard-components/views/example-dashboard.client.view.html',
  controller: ["$scope", "$timeout", "generator", function($scope, $timeout, generator) {
      $scope.gridsterOptions = {
        margins: [20, 20],
        columns: 4,
        //mobileBreakPoint: 1000,
        mobileModeEnabled: false,
        draggable: {
          handle: 'h3'
        },
        resizable: {
          enabled: true,
          handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],

          // optional callback fired when resize is started
          start: function(event, $element, widget) {},

          // optional callback fired when item is resized,
          resize: function(event, $element, widget) {
            if (widget.chart.api) widget.chart.api.update();
          },

          // optional callback fired when item is finished resizing
          stop: function(event, $element, widget) {
            $timeout(function(){
              if (widget.chart.api) widget.chart.api.update();
            },400)
          }
        }
      };
      //console.log(generator)
      $scope.dashboard = {
        widgets: [{
          col: 0,
          row: 0,
          sizeY: 1,
          sizeX: 2,
          name: "Line Chart Widget",
          type: 'lineChart',
          chart: {
            options: generator.lineChart.options(),
            data: generator.lineChart.data(),
            api: {}
          }
        }, {
          col: 2,
          row: 0,
          sizeY: 1,
          sizeX: 1,
          name: "Pie Chart Widget",
          type: 'pieChart',
          chart: {
            options: generator.pieChart.options(),
            data: generator.pieChart.data(),
            api: {}
          }
        }, {
          col: 3,
          row: 0,
          sizeY: 1,
          sizeX: 1,
          name: "Box Plot Widget",
          type: 'boxPlotChart',
          chart: {
            options: generator.boxPlotChart.options(),
            data: generator.boxPlotChart.data(),
            api: {}
          }
        }, {
          col: 0,
          row: 1,
          sizeY: 1,
          sizeX: 2,
          name: "Discrete Bar Chart Widget",
          type: 'discreteBarChart',
          chart: {
            options: generator.discreteBarChart.options(),
            data: generator.discreteBarChart.data(),
            api: {}
          }
        }, {
          col: 2,
          row: 1,
          sizeY: 1,
          sizeX: 2,
          name: "Stacked Area Chart Widget",
          type: 'stackedAreaChart',
          chart: {
            options: generator.stackedAreaChart.options(),
            data: generator.stackedAreaChart.data(),
            api: {}
          }
        }]
      };

      // widget events
      $scope.events = {
        resize: function(e, scope){
          $timeout(function(){
            if (scope.api && scope.api.update) scope.api.update();
          },200)
        }
      };

      $scope.config = { visible: false };

      //make chart visible after grid have been created
      $timeout(function(){
        $scope.config.visible = true;
      }, 200);

      //subscribe widget on window resize event
      angular.element(window).on('resize', function(e){
        $scope.$broadcast('resize');
      });

      // grid manipulation
      $scope.clear = function() {
        $scope.dashboard.widgets = [];
      };

      $scope.addWidget = function() {
        $scope.dashboard.widgets.push({
          name: "New Widget",
          sizeX: 1,
          sizeY: 1
        });
      };
    }]
  

};})

'use strict';

angular.module('dashboard-components')
  .filter('object2Array', function() {
    return function(input) {
      var out = [];
      for (var i in input) {
        out.push(input[i]);
      }
      return out;
    }
  });
'use strict';

angular.module('dashboard-components').factory('generator', function (){
    return {
      lineChart: {
        options: function(){
          return {
            chart: {
              type: 'lineChart',
              margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
              },
              x: function(d){ return d.x; },
              y: function(d){ return d.y; },
              useInteractiveGuideline: true,
              xAxis: {
                axisLabel: 'Time (ms)'
              },
              yAxis: {
                axisLabel: 'Voltage (v)',
                tickFormat: function(d){
                  return d3.format('.02f')(d);
                },
                axisLabelDistance: -10
              }
            }
          }
        },
        data: lineChartData
      },
      cumulativeLineChart: {
        options: function(){
          return {
            chart: {
              type: 'cumulativeLineChart',
              margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 65
              },
              x: function(d){ return d[0]; },
              y: function(d){ return d[1]/100; },
              average: function(d) { return d.mean/100; },
              color: d3.scale.category10().range(),
              transitionDuration: 300,
              clipVoronoi: false,
              xAxis: {
                axisLabel: 'X Axis',
                tickFormat: function(d) {
                  return d3.time.format('%m/%d/%y')(new Date(d))
                },
                showMaxMin: false
              },

              yAxis: {
                axisLabel: 'Y Axis',
                tickFormat: function(d){
                  return d3.format(',.1%')(d);
                },
                axisLabelDistance: 0
              }
            }
          }
        },
        data: cumulativeChartData
      },
      stackedAreaChart: {
        options: function(){
          return {
            chart: {
              type: 'stackedAreaChart',
              margin : {
                top: 20,
                right: 20,
                bottom: 20,
                left: 44
              },
              x: function(d){return d[0];},
              y: function(d){return d[1];},
              useVoronoi: false,
              clipEdge: true,
              transitionDuration: 500,
              useInteractiveGuideline: true,
              xAxis: {
                showMaxMin: false,
                tickFormat: function(d) {
                  return d3.time.format('%x')(new Date(d))
                }
              },
              yAxis: {
                tickFormat: function(d){
                  return d3.format(',.2f')(d);
                }
              }
            }
          }
        },
        data: stackedAreaChartData
      },
      discreteBarChart: {
        options: function(){
          return {
            chart: {
              type: 'discreteBarChart',
              margin : {
                top: 10,
                right: 20,
                bottom: 35,
                left: 55
              },
              x: function(d){return d.label;},
              y: function(d){return d.value;},
              showValues: true,
              valueFormat: function(d){
                return d3.format(',.4f')(d);
              },
              transitionDuration: 500,
              xAxis: {
                axisLabel: 'X Axis',
                axisLabelDistance: -8
              },
              yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: -10
              }
            }
          }
        },
        data: discreteBarChartData
      },
      pieChart: {
        options: function(){
          return {
            chart: {
              type: 'pieChart',
              margin: {
                top: 0,
                right: 0,
                bottom: 30,
                left: 0
              },
              x: function(d){return d.key;},
              y: function(d){return d.y;},
              showLabels: true,
              labelSunbeamLayout: true,
              donutLabelsOutside: true,
              donutRatio: 0.3,
              donut: true,
              transitionDuration: 500,
              labelThreshold: 0.02,
              legend: {
                margin: {
                  top: 5,
                  right: 35,
                  bottom: 0,
                  left: 0
                }
              }
            }
          }
        },
        data: pieChartData
      },
      boxPlotChart: {
        options: function(){
          return {
            chart: {
              type: 'boxPlotChart',
              margin : {
                top: 20,
                right: 20,
                bottom: 20,
                left: 40
              },
              color:['darkblue', 'darkorange', 'green', 'darkred', 'darkviolet'],
              x: function(d){return d.label;},
              //y: function(d){return d.values.Q3;},
              maxBoxWidth: 55,
              yDomain: [0, 500]
            }
          }
        },
        data: boxPlotChartData
      }
    };

    /*Random Data Generator */
    function lineChartData (){
      var sin = [],sin2 = [],
        cos = [];

      //Data is represented as an array of {x,y} pairs.
      for (var i = 0; i < 100; i++) {
        sin.push({x: i, y: Math.sin(i/10)});
        sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
        cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
      }

      //Line chart data should be sent as an array of series objects.
      return [
        {
          values: sin,      //values - represents the array of {x,y} data points
          key: 'Sine Wave', //key  - the name of the series.
          color: '#ff7f0e'  //color - optional: choose your own line color.
        },
        {
          values: cos,
          key: 'Cosine Wave',
          color: '#2ca02c'
        },
        {
          values: sin2,
          key: 'Another sine wave',
          color: '#7777ff',
          area: true      //area - set to true if you want this line to turn into a filled area chart.
        }
      ];
    }
    function cumulativeChartData (){
      return [
        {
          key: "Long",
          values: [ [ 1083297600000 , -2.974623048543] , [ 1085976000000 , -1.7740300785979] , [ 1088568000000 , 4.4681318138177] , [ 1091246400000 , 7.0242541001353] , [ 1093924800000 , 7.5709603667586] , [ 1096516800000 , 20.612245065736] , [ 1099195200000 , 21.698065237316] , [ 1101790800000 , 40.501189458018] , [ 1104469200000 , 50.464679413194] , [ 1107147600000 , 48.917421973355] , [ 1109566800000 , 63.750936549160] , [ 1112245200000 , 59.072499126460] , [ 1114833600000 , 43.373158880492] , [ 1117512000000 , 54.490918947556] , [ 1120104000000 , 56.661178852079] , [ 1122782400000 , 73.450103545496] , [ 1125460800000 , 71.714526354907] , [ 1128052800000 , 85.221664349607] , [ 1130734800000 , 77.769261392481] , [ 1133326800000 , 95.966528716500] , [ 1136005200000 , 107.59132116397] , [ 1138683600000 , 127.25740096723] , [ 1141102800000 , 122.13917498830] , [ 1143781200000 , 126.53657279774] , [ 1146369600000 , 132.39300992970] , [ 1149048000000 , 120.11238242904] , [ 1151640000000 , 118.41408917750] , [ 1154318400000 , 107.92918924621] , [ 1156996800000 , 110.28057249569] , [ 1159588800000 , 117.20485334692] , [ 1162270800000 , 141.33556756948] , [ 1164862800000 , 159.59452727893] , [ 1167541200000 , 167.09801853304] , [ 1170219600000 , 185.46849659215] , [ 1172638800000 , 184.82474099990] , [ 1175313600000 , 195.63155213887] , [ 1177905600000 , 207.40597044171] , [ 1180584000000 , 230.55966698196] , [ 1183176000000 , 239.55649035292] , [ 1185854400000 , 241.35915085208] , [ 1188532800000 , 239.89428956243] , [ 1191124800000 , 260.47781917715] , [ 1193803200000 , 276.39457482225] , [ 1196398800000 , 258.66530682672] , [ 1199077200000 , 250.98846121893] , [ 1201755600000 , 226.89902618127] , [ 1204261200000 , 227.29009273807] , [ 1206936000000 , 218.66476654350] , [ 1209528000000 , 232.46605902918] , [ 1212206400000 , 253.25667081117] , [ 1214798400000 , 235.82505363925] , [ 1217476800000 , 229.70112774254] , [ 1220155200000 , 225.18472705952] , [ 1222747200000 , 189.13661746552] , [ 1225425600000 , 149.46533007301] , [ 1228021200000 , 131.00340772114] , [ 1230699600000 , 135.18341728866] , [ 1233378000000 , 109.15296887173] , [ 1235797200000 , 84.614772549760] , [ 1238472000000 , 100.60810015326] , [ 1241064000000 , 141.50134895610] , [ 1243742400000 , 142.50405083675] , [ 1246334400000 , 139.81192372672] , [ 1249012800000 , 177.78205544583] , [ 1251691200000 , 194.73691933074] , [ 1254283200000 , 209.00838460225] , [ 1256961600000 , 198.19855877420] , [ 1259557200000 , 222.37102417812] , [ 1262235600000 , 234.24581081250] , [ 1264914000000 , 228.26087689346] , [ 1267333200000 , 248.81895126250] , [ 1270008000000 , 270.57301075186] , [ 1272600000000 , 292.64604322550] , [ 1275278400000 , 265.94088520518] , [ 1277870400000 , 237.82887467569] , [ 1280548800000 , 265.55973314204] , [ 1283227200000 , 248.30877330928] , [ 1285819200000 , 278.14870066912] , [ 1288497600000 , 292.69260960288] , [ 1291093200000 , 300.84263809599] , [ 1293771600000 , 326.17253914628] , [ 1296450000000 , 337.69335966505] , [ 1298869200000 , 339.73260965121] , [ 1301544000000 , 346.87865120765] , [ 1304136000000 , 347.92991526628] , [ 1306814400000 , 342.04627502669] , [ 1309406400000 , 333.45386231233] , [ 1312084800000 , 323.15034181243] , [ 1314763200000 , 295.66126882331] , [ 1317355200000 , 251.48014579253] , [ 1320033600000 , 295.15424257905] , [ 1322629200000 , 294.54766764397] , [ 1325307600000 , 295.72906119051] , [ 1327986000000 , 325.73351347613] , [ 1330491600000 , 340.16106061186] , [ 1333166400000 , 345.15514071490] , [ 1335758400000 , 337.10259395679] , [ 1338436800000 , 318.68216333837] , [ 1341028800000 , 317.03683945246] , [ 1343707200000 , 318.53549659997] , [ 1346385600000 , 332.85381464104] , [ 1348977600000 , 337.36534373477] , [ 1351656000000 , 350.27872156161] , [ 1354251600000 , 349.45128876100]],
          mean: 250
        },
        {
          key: "Short",
          values: [ [ 1083297600000 , -0.77078283705125] , [ 1085976000000 , -1.8356366650335] , [ 1088568000000 , -5.3121322073127] , [ 1091246400000 , -4.9320975829662] , [ 1093924800000 , -3.9835408823225] , [ 1096516800000 , -6.8694685316805] , [ 1099195200000 , -8.4854877428545] , [ 1101790800000 , -15.933627197384] , [ 1104469200000 , -15.920980069544] , [ 1107147600000 , -12.478685045651] , [ 1109566800000 , -17.297761889305] , [ 1112245200000 , -15.247129891020] , [ 1114833600000 , -11.336459046839] , [ 1117512000000 , -13.298990907415] , [ 1120104000000 , -16.360027000056] , [ 1122782400000 , -18.527929522030] , [ 1125460800000 , -22.176516738685] , [ 1128052800000 , -23.309665368330] , [ 1130734800000 , -21.629973409748] , [ 1133326800000 , -24.186429093486] , [ 1136005200000 , -29.116707312531] , [ 1138683600000 , -37.188037874864] , [ 1141102800000 , -34.689264821198] , [ 1143781200000 , -39.505932105359] , [ 1146369600000 , -45.339572492759] , [ 1149048000000 , -43.849353192764] , [ 1151640000000 , -45.418353922571] , [ 1154318400000 , -44.579281059919] , [ 1156996800000 , -44.027098363370] , [ 1159588800000 , -41.261306759439] , [ 1162270800000 , -47.446018534027] , [ 1164862800000 , -53.413782948909] , [ 1167541200000 , -50.700723647419] , [ 1170219600000 , -56.374090913296] , [ 1172638800000 , -61.754245220322] , [ 1175313600000 , -66.246241587629] , [ 1177905600000 , -75.351650899999] , [ 1180584000000 , -81.699058262032] , [ 1183176000000 , -82.487023368081] , [ 1185854400000 , -86.230055113277] , [ 1188532800000 , -84.746914818507] , [ 1191124800000 , -100.77134971977] , [ 1193803200000 , -109.95435565947] , [ 1196398800000 , -99.605672965057] , [ 1199077200000 , -99.607249394382] , [ 1201755600000 , -94.874614950188] , [ 1204261200000 , -105.35899063105] , [ 1206936000000 , -106.01931193802] , [ 1209528000000 , -110.28883571771] , [ 1212206400000 , -119.60256203030] , [ 1214798400000 , -115.62201315802] , [ 1217476800000 , -106.63824185202] , [ 1220155200000 , -99.848746318951] , [ 1222747200000 , -85.631219602987] , [ 1225425600000 , -63.547909262067] , [ 1228021200000 , -59.753275364457] , [ 1230699600000 , -63.874977883542] , [ 1233378000000 , -56.865697387488] , [ 1235797200000 , -54.285579501988] , [ 1238472000000 , -56.474659581885] , [ 1241064000000 , -63.847137745644] , [ 1243742400000 , -68.754247867325] , [ 1246334400000 , -69.474257009155] , [ 1249012800000 , -75.084828197067] , [ 1251691200000 , -77.101028237237] , [ 1254283200000 , -80.454866854387] , [ 1256961600000 , -78.984349952220] , [ 1259557200000 , -83.041230807854] , [ 1262235600000 , -84.529748348935] , [ 1264914000000 , -83.837470195508] , [ 1267333200000 , -87.174487671969] , [ 1270008000000 , -90.342293007487] , [ 1272600000000 , -93.550928464991] , [ 1275278400000 , -85.833102140765] , [ 1277870400000 , -79.326501831592] , [ 1280548800000 , -87.986196903537] , [ 1283227200000 , -85.397862121771] , [ 1285819200000 , -94.738167050020] , [ 1288497600000 , -98.661952897151] , [ 1291093200000 , -99.609665952708] , [ 1293771600000 , -103.57099836183] , [ 1296450000000 , -104.04353411322] , [ 1298869200000 , -108.21382792587] , [ 1301544000000 , -108.74006900920] , [ 1304136000000 , -112.07766650960] , [ 1306814400000 , -109.63328199118] , [ 1309406400000 , -106.53578966772] , [ 1312084800000 , -103.16480871469] , [ 1314763200000 , -95.945078001828] , [ 1317355200000 , -81.226687340874] , [ 1320033600000 , -90.782206596168] , [ 1322629200000 , -89.484445370113] , [ 1325307600000 , -88.514723135326] , [ 1327986000000 , -93.381292724320] , [ 1330491600000 , -97.529705609172] , [ 1333166400000 , -99.520481439189] , [ 1335758400000 , -99.430184898669] , [ 1338436800000 , -93.349934521973] , [ 1341028800000 , -95.858475286491] , [ 1343707200000 , -95.522755836605] , [ 1346385600000 , -98.503848862036] , [ 1348977600000 , -101.49415251896] , [ 1351656000000 , -101.50099325672] , [ 1354251600000 , -99.487094927489]],
          mean: -60
        },
        {
          key: "Gross",
          mean: 125,
          values: [ [ 1083297600000 , -3.7454058855943] , [ 1085976000000 , -3.6096667436314] , [ 1088568000000 , -0.8440003934950] , [ 1091246400000 , 2.0921565171691] , [ 1093924800000 , 3.5874194844361] , [ 1096516800000 , 13.742776534056] , [ 1099195200000 , 13.212577494462] , [ 1101790800000 , 24.567562260634] , [ 1104469200000 , 34.543699343650] , [ 1107147600000 , 36.438736927704] , [ 1109566800000 , 46.453174659855] , [ 1112245200000 , 43.825369235440] , [ 1114833600000 , 32.036699833653] , [ 1117512000000 , 41.191928040141] , [ 1120104000000 , 40.301151852023] , [ 1122782400000 , 54.922174023466] , [ 1125460800000 , 49.538009616222] , [ 1128052800000 , 61.911998981277] , [ 1130734800000 , 56.139287982733] , [ 1133326800000 , 71.780099623014] , [ 1136005200000 , 78.474613851439] , [ 1138683600000 , 90.069363092366] , [ 1141102800000 , 87.449910167102] , [ 1143781200000 , 87.030640692381] , [ 1146369600000 , 87.053437436941] , [ 1149048000000 , 76.263029236276] , [ 1151640000000 , 72.995735254929] , [ 1154318400000 , 63.349908186291] , [ 1156996800000 , 66.253474132320] , [ 1159588800000 , 75.943546587481] , [ 1162270800000 , 93.889549035453] , [ 1164862800000 , 106.18074433002] , [ 1167541200000 , 116.39729488562] , [ 1170219600000 , 129.09440567885] , [ 1172638800000 , 123.07049577958] , [ 1175313600000 , 129.38531055124] , [ 1177905600000 , 132.05431954171] , [ 1180584000000 , 148.86060871993] , [ 1183176000000 , 157.06946698484] , [ 1185854400000 , 155.12909573880] , [ 1188532800000 , 155.14737474392] , [ 1191124800000 , 159.70646945738] , [ 1193803200000 , 166.44021916278] , [ 1196398800000 , 159.05963386166] , [ 1199077200000 , 151.38121182455] , [ 1201755600000 , 132.02441123108] , [ 1204261200000 , 121.93110210702] , [ 1206936000000 , 112.64545460548] , [ 1209528000000 , 122.17722331147] , [ 1212206400000 , 133.65410878087] , [ 1214798400000 , 120.20304048123] , [ 1217476800000 , 123.06288589052] , [ 1220155200000 , 125.33598074057] , [ 1222747200000 , 103.50539786253] , [ 1225425600000 , 85.917420810943] , [ 1228021200000 , 71.250132356683] , [ 1230699600000 , 71.308439405118] , [ 1233378000000 , 52.287271484242] , [ 1235797200000 , 30.329193047772] , [ 1238472000000 , 44.133440571375] , [ 1241064000000 , 77.654211210456] , [ 1243742400000 , 73.749802969425] , [ 1246334400000 , 70.337666717565] , [ 1249012800000 , 102.69722724876] , [ 1251691200000 , 117.63589109350] , [ 1254283200000 , 128.55351774786] , [ 1256961600000 , 119.21420882198] , [ 1259557200000 , 139.32979337027] , [ 1262235600000 , 149.71606246357] , [ 1264914000000 , 144.42340669795] , [ 1267333200000 , 161.64446359053] , [ 1270008000000 , 180.23071774437] , [ 1272600000000 , 199.09511476051] , [ 1275278400000 , 180.10778306442] , [ 1277870400000 , 158.50237284410] , [ 1280548800000 , 177.57353623850] , [ 1283227200000 , 162.91091118751] , [ 1285819200000 , 183.41053361910] , [ 1288497600000 , 194.03065670573] , [ 1291093200000 , 201.23297214328] , [ 1293771600000 , 222.60154078445] , [ 1296450000000 , 233.35556801977] , [ 1298869200000 , 231.22452435045] , [ 1301544000000 , 237.84432503045] , [ 1304136000000 , 235.55799131184] , [ 1306814400000 , 232.11873570751] , [ 1309406400000 , 226.62381538123] , [ 1312084800000 , 219.34811113539] , [ 1314763200000 , 198.69242285581] , [ 1317355200000 , 168.90235629066] , [ 1320033600000 , 202.64725756733] , [ 1322629200000 , 203.05389378105] , [ 1325307600000 , 204.85986680865] , [ 1327986000000 , 229.77085616585] , [ 1330491600000 , 239.65202435959] , [ 1333166400000 , 242.33012622734] , [ 1335758400000 , 234.11773262149] , [ 1338436800000 , 221.47846307887] , [ 1341028800000 , 216.98308827912] , [ 1343707200000 , 218.37781386755] , [ 1346385600000 , 229.39368622736] , [ 1348977600000 , 230.54656412916] , [ 1351656000000 , 243.06087025523] , [ 1354251600000 , 244.24733578385]]
        },
        {
          key: "S&P 1500",
          values: [ [ 1083297600000 , -1.7798428181819] , [ 1085976000000 , -0.36883324836999] , [ 1088568000000 , 1.7312581046040] , [ 1091246400000 , -1.8356125950460] , [ 1093924800000 , -1.5396564170877] , [ 1096516800000 , -0.16867791409247] , [ 1099195200000 , 1.3754263993413] , [ 1101790800000 , 5.8171640898041] , [ 1104469200000 , 9.4350145241608] , [ 1107147600000 , 6.7649081510160] , [ 1109566800000 , 9.1568499314776] , [ 1112245200000 , 7.2485090994419] , [ 1114833600000 , 4.8762222306595] , [ 1117512000000 , 8.5992339354652] , [ 1120104000000 , 9.0896517982086] , [ 1122782400000 , 13.394644048577] , [ 1125460800000 , 12.311842010760] , [ 1128052800000 , 13.221003650717] , [ 1130734800000 , 11.218481009206] , [ 1133326800000 , 15.565352598445] , [ 1136005200000 , 15.623703865926] , [ 1138683600000 , 19.275255326383] , [ 1141102800000 , 19.432433717836] , [ 1143781200000 , 21.232881244655] , [ 1146369600000 , 22.798299192958] , [ 1149048000000 , 19.006125095476] , [ 1151640000000 , 19.151889158536] , [ 1154318400000 , 19.340022855452] , [ 1156996800000 , 22.027934841859] , [ 1159588800000 , 24.903300681329] , [ 1162270800000 , 29.146492833877] , [ 1164862800000 , 31.781626082589] , [ 1167541200000 , 33.358770738428] , [ 1170219600000 , 35.622684613497] , [ 1172638800000 , 33.332821711366] , [ 1175313600000 , 34.878748635832] , [ 1177905600000 , 40.582332613844] , [ 1180584000000 , 45.719535502920] , [ 1183176000000 , 43.239344722386] , [ 1185854400000 , 38.550955100342] , [ 1188532800000 , 40.585368816283] , [ 1191124800000 , 45.601374057981] , [ 1193803200000 , 48.051404337892] , [ 1196398800000 , 41.582581696032] , [ 1199077200000 , 40.650580792748] , [ 1201755600000 , 32.252222066493] , [ 1204261200000 , 28.106390258553] , [ 1206936000000 , 27.532698196687] , [ 1209528000000 , 33.986390463852] , [ 1212206400000 , 36.302660526438] , [ 1214798400000 , 25.015574480172] , [ 1217476800000 , 23.989494069029] , [ 1220155200000 , 25.934351445531] , [ 1222747200000 , 14.627592011699] , [ 1225425600000 , -5.2249403809749] , [ 1228021200000 , -12.330933408050] , [ 1230699600000 , -11.000291508188] , [ 1233378000000 , -18.563864948088] , [ 1235797200000 , -27.213097001687] , [ 1238472000000 , -20.834133840523] , [ 1241064000000 , -12.717886701719] , [ 1243742400000 , -8.1644613083526] , [ 1246334400000 , -7.9108408918201] , [ 1249012800000 , -0.77002391591209] , [ 1251691200000 , 2.8243816569672] , [ 1254283200000 , 6.8761411421070] , [ 1256961600000 , 4.5060912230294] , [ 1259557200000 , 10.487179794349] , [ 1262235600000 , 13.251375597594] , [ 1264914000000 , 9.2207594803415] , [ 1267333200000 , 12.836276936538] , [ 1270008000000 , 19.816793904978] , [ 1272600000000 , 22.156787167211] , [ 1275278400000 , 12.518039090576] , [ 1277870400000 , 6.4253587440854] , [ 1280548800000 , 13.847372028409] , [ 1283227200000 , 8.5454736090364] , [ 1285819200000 , 18.542801953304] , [ 1288497600000 , 23.037064683183] , [ 1291093200000 , 23.517422401888] , [ 1293771600000 , 31.804723416068] , [ 1296450000000 , 34.778247386072] , [ 1298869200000 , 39.584883855230] , [ 1301544000000 , 40.080647664875] , [ 1304136000000 , 44.180050667889] , [ 1306814400000 , 42.533535927221] , [ 1309406400000 , 40.105374449011] , [ 1312084800000 , 37.014659267156] , [ 1314763200000 , 29.263745084262] , [ 1317355200000 , 19.637463417584] , [ 1320033600000 , 33.157645345770] , [ 1322629200000 , 32.895053150988] , [ 1325307600000 , 34.111544824647] , [ 1327986000000 , 40.453985817473] , [ 1330491600000 , 46.435700783313] , [ 1333166400000 , 51.062385488671] , [ 1335758400000 , 50.130448220658] , [ 1338436800000 , 41.035476682018] , [ 1341028800000 , 46.591932296457] , [ 1343707200000 , 48.349391180634] , [ 1346385600000 , 51.913011286919] , [ 1348977600000 , 55.747238313752] , [ 1351656000000 , 52.991824077209] , [ 1354251600000 , 49.556311883284]]
        }
      ];
    }
    function stackedAreaChartData (){
      return [
        {
          "key" : "North America" ,
          "values" : [ [ 1025409600000 , 23.041422681023] , [ 1028088000000 , 19.854291255832] , [ 1030766400000 , 21.02286281168] , [ 1033358400000 , 22.093608385173] , [ 1036040400000 , 25.108079299458] , [ 1038632400000 , 26.982389242348] , [ 1041310800000 , 19.828984957662] , [ 1043989200000 , 19.914055036294] , [ 1046408400000 , 19.436150539916] , [ 1049086800000 , 21.558650338602] , [ 1051675200000 , 24.395594061773] , [ 1054353600000 , 24.747089309384] , [ 1056945600000 , 23.491755498807] , [ 1059624000000 , 23.376634878164] , [ 1062302400000 , 24.581223154533] , [ 1064894400000 , 24.922476843538] , [ 1067576400000 , 27.357712939042] , [ 1070168400000 , 26.503020572593] , [ 1072846800000 , 26.658901244878] , [ 1075525200000 , 27.065704156445] , [ 1078030800000 , 28.735320452588] , [ 1080709200000 , 31.572277846319] , [ 1083297600000 , 30.932161503638] , [ 1085976000000 , 31.627029785554] , [ 1088568000000 , 28.728743674232] , [ 1091246400000 , 26.858365172675] , [ 1093924800000 , 27.279922830032] , [ 1096516800000 , 34.408301211324] , [ 1099195200000 , 34.794362930439] , [ 1101790800000 , 35.609978198951] , [ 1104469200000 , 33.574394968037] , [ 1107147600000 , 31.979405070598] , [ 1109566800000 , 31.19009040297] , [ 1112245200000 , 31.083933968994] , [ 1114833600000 , 29.668971113185] , [ 1117512000000 , 31.490638014379] , [ 1120104000000 , 31.818617451128] , [ 1122782400000 , 32.960314008183] , [ 1125460800000 , 31.313383196209] , [ 1128052800000 , 33.125486081852] , [ 1130734800000 , 32.791805509149] , [ 1133326800000 , 33.506038030366] , [ 1136005200000 , 26.96501697216] , [ 1138683600000 , 27.38478809681] , [ 1141102800000 , 27.371377218209] , [ 1143781200000 , 26.309915460827] , [ 1146369600000 , 26.425199957518] , [ 1149048000000 , 26.823411519396] , [ 1151640000000 , 23.850443591587] , [ 1154318400000 , 23.158355444054] , [ 1156996800000 , 22.998689393695] , [ 1159588800000 , 27.9771285113] , [ 1162270800000 , 29.073672469719] , [ 1164862800000 , 28.587640408904] , [ 1167541200000 , 22.788453687637] , [ 1170219600000 , 22.429199073597] , [ 1172638800000 , 22.324103271052] , [ 1175313600000 , 17.558388444187] , [ 1177905600000 , 16.769518096208] , [ 1180584000000 , 16.214738201301] , [ 1183176000000 , 18.729632971229] , [ 1185854400000 , 18.814523318847] , [ 1188532800000 , 19.789986451358] , [ 1191124800000 , 17.070049054933] , [ 1193803200000 , 16.121349575716] , [ 1196398800000 , 15.141659430091] , [ 1199077200000 , 17.175388025297] , [ 1201755600000 , 17.286592443522] , [ 1204261200000 , 16.323141626568] , [ 1206936000000 , 19.231263773952] , [ 1209528000000 , 18.446256391095] , [ 1212206400000 , 17.822632399764] , [ 1214798400000 , 15.53936647598] , [ 1217476800000 , 15.255131790217] , [ 1220155200000 , 15.660963922592] , [ 1222747200000 , 13.254482273698] , [ 1225425600000 , 11.920796202299] , [ 1228021200000 , 12.122809090924] , [ 1230699600000 , 15.691026271393] , [ 1233378000000 , 14.720881635107] , [ 1235797200000 , 15.387939360044] , [ 1238472000000 , 13.765436672228] , [ 1241064000000 , 14.631445864799] , [ 1243742400000 , 14.292446536221] , [ 1246334400000 , 16.170071367017] , [ 1249012800000 , 15.948135554337] , [ 1251691200000 , 16.612872685134] , [ 1254283200000 , 18.778338719091] , [ 1256961600000 , 16.756026065421] , [ 1259557200000 , 19.385804443146] , [ 1262235600000 , 22.950590240168] , [ 1264914000000 , 23.61159018141] , [ 1267333200000 , 25.708586989581] , [ 1270008000000 , 26.883915999885] , [ 1272600000000 , 25.893486687065] , [ 1275278400000 , 24.678914263176] , [ 1277870400000 , 25.937275793024] , [ 1280548800000 , 29.461381693838] , [ 1283227200000 , 27.357322961861] , [ 1285819200000 , 29.057235285673] , [ 1288497600000 , 28.549434189386] , [ 1291093200000 , 28.506352379724] , [ 1293771600000 , 29.449241421598] , [ 1296450000000 , 25.796838168807] , [ 1298869200000 , 28.740145449188] , [ 1301544000000 , 22.091744141872] , [ 1304136000000 , 25.07966254541] , [ 1306814400000 , 23.674906973064] , [ 1309406400000 , 23.418002742929] , [ 1312084800000 , 23.24364413887] , [ 1314763200000 , 31.591854066817] , [ 1317355200000 , 31.497112374114] , [ 1320033600000 , 26.67238082043] , [ 1322629200000 , 27.297080015495] , [ 1325307600000 , 20.174315530051] , [ 1327986000000 , 19.631084213898] , [ 1330491600000 , 20.366462219461] , [ 1333166400000 , 19.284784434185] , [ 1335758400000 , 19.157810257624]]
        },
        {
          "key" : "Africa" ,
          "values" : [ [ 1025409600000 , 7.9356392949025] , [ 1028088000000 , 7.4514668527298] , [ 1030766400000 , 7.9085410566608] , [ 1033358400000 , 5.8996782364764] , [ 1036040400000 , 6.0591869346923] , [ 1038632400000 , 5.9667815800451] , [ 1041310800000 , 8.65528925664] , [ 1043989200000 , 8.7690763386254] , [ 1046408400000 , 8.6386160387453] , [ 1049086800000 , 5.9895557449743] , [ 1051675200000 , 6.3840324338159] , [ 1054353600000 , 6.5196511461441] , [ 1056945600000 , 7.0738618553114] , [ 1059624000000 , 6.5745957367133] , [ 1062302400000 , 6.4658359184444] , [ 1064894400000 , 2.7622758754954] , [ 1067576400000 , 2.9794782986241] , [ 1070168400000 , 2.8735432712019] , [ 1072846800000 , 1.6344817513645] , [ 1075525200000 , 1.5869248754883] , [ 1078030800000 , 1.7172279157246] , [ 1080709200000 , 1.9649927409867] , [ 1083297600000 , 2.0261695079196] , [ 1085976000000 , 2.0541261923929] , [ 1088568000000 , 3.9466318927569] , [ 1091246400000 , 3.7826770946089] , [ 1093924800000 , 3.9543021004028] , [ 1096516800000 , 3.8309891064711] , [ 1099195200000 , 3.6340958946166] , [ 1101790800000 , 3.5289755762525] , [ 1104469200000 , 5.702378559857] , [ 1107147600000 , 5.6539569019223] , [ 1109566800000 , 5.5449506370392] , [ 1112245200000 , 4.7579993280677] , [ 1114833600000 , 4.4816139372906] , [ 1117512000000 , 4.5965558568606] , [ 1120104000000 , 4.3747066116976] , [ 1122782400000 , 4.4588822917087] , [ 1125460800000 , 4.4460351848286] , [ 1128052800000 , 3.7989113035136] , [ 1130734800000 , 3.7743883140088] , [ 1133326800000 , 3.7727852823828] , [ 1136005200000 , 7.2968111448895] , [ 1138683600000 , 7.2800122043237] , [ 1141102800000 , 7.1187787503354] , [ 1143781200000 , 8.351887016482] , [ 1146369600000 , 8.4156698763993] , [ 1149048000000 , 8.1673298604231] , [ 1151640000000 , 5.5132447126042] , [ 1154318400000 , 6.1152537710599] , [ 1156996800000 , 6.076765091942] , [ 1159588800000 , 4.6304473798646] , [ 1162270800000 , 4.6301068469402] , [ 1164862800000 , 4.3466656309389] , [ 1167541200000 , 6.830104897003] , [ 1170219600000 , 7.241633040029] , [ 1172638800000 , 7.1432372054153] , [ 1175313600000 , 10.608942063374] , [ 1177905600000 , 10.914964549494] , [ 1180584000000 , 10.933223880565] , [ 1183176000000 , 8.3457524851265] , [ 1185854400000 , 8.1078413081882] , [ 1188532800000 , 8.2697185922474] , [ 1191124800000 , 8.4742436475968] , [ 1193803200000 , 8.4994601179319] , [ 1196398800000 , 8.7387319683243] , [ 1199077200000 , 6.8829183612895] , [ 1201755600000 , 6.984133637885] , [ 1204261200000 , 7.0860136043287] , [ 1206936000000 , 4.3961787956053] , [ 1209528000000 , 3.8699674365231] , [ 1212206400000 , 3.6928925238305] , [ 1214798400000 , 6.7571718894253] , [ 1217476800000 , 6.4367313362344] , [ 1220155200000 , 6.4048441521454] , [ 1222747200000 , 5.4643833239669] , [ 1225425600000 , 5.3150786833374] , [ 1228021200000 , 5.3011272612576] , [ 1230699600000 , 4.1203601430809] , [ 1233378000000 , 4.0881783200525] , [ 1235797200000 , 4.1928665957189] , [ 1238472000000 , 7.0249415663205] , [ 1241064000000 , 7.006530880769] , [ 1243742400000 , 6.994835633224] , [ 1246334400000 , 6.1220222336254] , [ 1249012800000 , 6.1177436137653] , [ 1251691200000 , 6.1413396231981] , [ 1254283200000 , 4.8046006145874] , [ 1256961600000 , 4.6647600660544] , [ 1259557200000 , 4.544865006255] , [ 1262235600000 , 6.0488249316539] , [ 1264914000000 , 6.3188669540206] , [ 1267333200000 , 6.5873958262306] , [ 1270008000000 , 6.2281189839578] , [ 1272600000000 , 5.8948915746059] , [ 1275278400000 , 5.5967320482214] , [ 1277870400000 , 0.99784432084837] , [ 1280548800000 , 1.0950794175359] , [ 1283227200000 , 0.94479734407491] , [ 1285819200000 , 1.222093988688] , [ 1288497600000 , 1.335093106856] , [ 1291093200000 , 1.3302565104985] , [ 1293771600000 , 1.340824670897] , [ 1296450000000 , 0] , [ 1298869200000 , 0] , [ 1301544000000 , 0] , [ 1304136000000 , 0] , [ 1306814400000 , 0] , [ 1309406400000 , 0] , [ 1312084800000 , 0] , [ 1314763200000 , 0] , [ 1317355200000 , 4.4583692315] , [ 1320033600000 , 3.6493043348059] , [ 1322629200000 , 3.8610064091761] , [ 1325307600000 , 5.5144800685202] , [ 1327986000000 , 5.1750695220791] , [ 1330491600000 , 5.6710066952691] , [ 1333166400000 , 5.5611890039181] , [ 1335758400000 , 5.5979368839939]]
        },
        {
          "key" : "South America" ,
          "values" : [ [ 1025409600000 , 7.9149900245423] , [ 1028088000000 , 7.0899888751059] , [ 1030766400000 , 7.5996132380614] , [ 1033358400000 , 8.2741174301034] , [ 1036040400000 , 9.3564460833513] , [ 1038632400000 , 9.7066786059904] , [ 1041310800000 , 10.213363052343] , [ 1043989200000 , 10.285809585273] , [ 1046408400000 , 10.222053149228] , [ 1049086800000 , 8.6188592137975] , [ 1051675200000 , 9.3335447543566] , [ 1054353600000 , 8.9312402186628] , [ 1056945600000 , 8.1895089343658] , [ 1059624000000 , 8.260622135079] , [ 1062302400000 , 7.7700786851364] , [ 1064894400000 , 7.9907428771318] , [ 1067576400000 , 8.7769091865606] , [ 1070168400000 , 8.4855077060661] , [ 1072846800000 , 9.6277203033655] , [ 1075525200000 , 9.9685913452624] , [ 1078030800000 , 10.615085181759] , [ 1080709200000 , 9.2902488079646] , [ 1083297600000 , 8.8610439830061] , [ 1085976000000 , 9.1075344931229] , [ 1088568000000 , 9.9156737639203] , [ 1091246400000 , 9.7826003238782] , [ 1093924800000 , 10.55403610555] , [ 1096516800000 , 10.926900264097] , [ 1099195200000 , 10.903144818736] , [ 1101790800000 , 10.862890389067] , [ 1104469200000 , 10.64604998964] , [ 1107147600000 , 10.042790814087] , [ 1109566800000 , 9.7173391591038] , [ 1112245200000 , 9.6122415755443] , [ 1114833600000 , 9.4337921146562] , [ 1117512000000 , 9.814827171183] , [ 1120104000000 , 12.059260396788] , [ 1122782400000 , 12.139649903873] , [ 1125460800000 , 12.281290663822] , [ 1128052800000 , 8.8037085409056] , [ 1130734800000 , 8.6300618239176] , [ 1133326800000 , 9.1225708491432] , [ 1136005200000 , 12.988124170836] , [ 1138683600000 , 13.356778764353] , [ 1141102800000 , 13.611196863271] , [ 1143781200000 , 6.8959030061189] , [ 1146369600000 , 6.9939633271353] , [ 1149048000000 , 6.7241510257676] , [ 1151640000000 , 5.5611293669517] , [ 1154318400000 , 5.6086488714041] , [ 1156996800000 , 5.4962849907033] , [ 1159588800000 , 6.9193153169278] , [ 1162270800000 , 7.0016334389778] , [ 1164862800000 , 6.7865422443273] , [ 1167541200000 , 9.0006454225383] , [ 1170219600000 , 9.2233916171431] , [ 1172638800000 , 8.8929316009479] , [ 1175313600000 , 10.345937520404] , [ 1177905600000 , 10.075914677026] , [ 1180584000000 , 10.089006188111] , [ 1183176000000 , 10.598330295008] , [ 1185854400000 , 9.9689546533009] , [ 1188532800000 , 9.7740580198146] , [ 1191124800000 , 10.558483060626] , [ 1193803200000 , 9.9314651823603] , [ 1196398800000 , 9.3997715873769] , [ 1199077200000 , 8.4086493387262] , [ 1201755600000 , 8.9698309085926] , [ 1204261200000 , 8.2778357995396] , [ 1206936000000 , 8.8585045600123] , [ 1209528000000 , 8.7013756413322] , [ 1212206400000 , 7.7933605469443] , [ 1214798400000 , 7.0236183483064] , [ 1217476800000 , 6.9873088186829] , [ 1220155200000 , 6.8031713070097] , [ 1222747200000 , 6.6869531315723] , [ 1225425600000 , 6.138256993963] , [ 1228021200000 , 5.6434994016354] , [ 1230699600000 , 5.495220262512] , [ 1233378000000 , 4.6885326869846] , [ 1235797200000 , 4.4524349883438] , [ 1238472000000 , 5.6766520778185] , [ 1241064000000 , 5.7675774480752] , [ 1243742400000 , 5.7882863168337] , [ 1246334400000 , 7.2666010034924] , [ 1249012800000 , 7.5191821322261] , [ 1251691200000 , 7.849651451445] , [ 1254283200000 , 10.383992037985] , [ 1256961600000 , 9.0653691861818] , [ 1259557200000 , 9.6705248324159] , [ 1262235600000 , 10.856380561349] , [ 1264914000000 , 11.27452370892] , [ 1267333200000 , 11.754156529088] , [ 1270008000000 , 8.2870811422455] , [ 1272600000000 , 8.0210264360699] , [ 1275278400000 , 7.5375074474865] , [ 1277870400000 , 8.3419527338039] , [ 1280548800000 , 9.4197471818443] , [ 1283227200000 , 8.7321733185797] , [ 1285819200000 , 9.6627062648126] , [ 1288497600000 , 10.187962234548] , [ 1291093200000 , 9.8144201733476] , [ 1293771600000 , 10.275723361712] , [ 1296450000000 , 16.796066079353] , [ 1298869200000 , 17.543254984075] , [ 1301544000000 , 16.673660675083] , [ 1304136000000 , 17.963944353609] , [ 1306814400000 , 16.63774086721] , [ 1309406400000 , 15.84857094609] , [ 1312084800000 , 14.767303362181] , [ 1314763200000 , 24.778452182433] , [ 1317355200000 , 18.370353229999] , [ 1320033600000 , 15.253137429099] , [ 1322629200000 , 14.989600840649] , [ 1325307600000 , 16.052539160125] , [ 1327986000000 , 16.424390322793] , [ 1330491600000 , 17.884020741104] , [ 1333166400000 , 18.372698836036] , [ 1335758400000 , 18.315881576096]]
        },
        {
          "key" : "Asia" ,
          "values" : [ [ 1025409600000 , 13.153938631352] , [ 1028088000000 , 12.456410521864] , [ 1030766400000 , 12.537048663919] , [ 1033358400000 , 13.947386398309] , [ 1036040400000 , 14.421680682568] , [ 1038632400000 , 14.143238262286] , [ 1041310800000 , 12.229635347478] , [ 1043989200000 , 12.508479916948] , [ 1046408400000 , 12.155368409526] , [ 1049086800000 , 13.335455563994] , [ 1051675200000 , 12.888210138167] , [ 1054353600000 , 12.842092790511] , [ 1056945600000 , 12.513816474199] , [ 1059624000000 , 12.21453674494] , [ 1062302400000 , 11.750848343935] , [ 1064894400000 , 10.526579636787] , [ 1067576400000 , 10.873596086087] , [ 1070168400000 , 11.019967131519] , [ 1072846800000 , 11.235789380602] , [ 1075525200000 , 11.859910850657] , [ 1078030800000 , 12.531031616536] , [ 1080709200000 , 11.360451067019] , [ 1083297600000 , 11.456244780202] , [ 1085976000000 , 11.436991407309] , [ 1088568000000 , 11.638595744327] , [ 1091246400000 , 11.190418301469] , [ 1093924800000 , 11.835608007589] , [ 1096516800000 , 11.540980244475] , [ 1099195200000 , 10.958762325687] , [ 1101790800000 , 10.885791159509] , [ 1104469200000 , 13.605810720109] , [ 1107147600000 , 13.128978067437] , [ 1109566800000 , 13.119012086882] , [ 1112245200000 , 13.003706129783] , [ 1114833600000 , 13.326996807689] , [ 1117512000000 , 13.547947991743] , [ 1120104000000 , 12.807959646616] , [ 1122782400000 , 12.931763821068] , [ 1125460800000 , 12.795359993008] , [ 1128052800000 , 9.6998935538319] , [ 1130734800000 , 9.3473740089131] , [ 1133326800000 , 9.36902067716] , [ 1136005200000 , 14.258619539875] , [ 1138683600000 , 14.21241095603] , [ 1141102800000 , 13.973193618249] , [ 1143781200000 , 15.218233920664] , [ 1146369600000 , 14.382109727451] , [ 1149048000000 , 13.894310878491] , [ 1151640000000 , 15.593086090031] , [ 1154318400000 , 16.244839695189] , [ 1156996800000 , 16.017088850647] , [ 1159588800000 , 14.183951830057] , [ 1162270800000 , 14.148523245696] , [ 1164862800000 , 13.424326059971] , [ 1167541200000 , 12.974450435754] , [ 1170219600000 , 13.232470418021] , [ 1172638800000 , 13.318762655574] , [ 1175313600000 , 15.961407746104] , [ 1177905600000 , 16.287714639805] , [ 1180584000000 , 16.24659058389] , [ 1183176000000 , 17.564505594808] , [ 1185854400000 , 17.872725373164] , [ 1188532800000 , 18.018998508756] , [ 1191124800000 , 15.584518016602] , [ 1193803200000 , 15.480850647182] , [ 1196398800000 , 15.699120036985] , [ 1199077200000 , 19.184281817226] , [ 1201755600000 , 19.691226605205] , [ 1204261200000 , 18.982314051293] , [ 1206936000000 , 18.707820309008] , [ 1209528000000 , 17.459630929759] , [ 1212206400000 , 16.500616076782] , [ 1214798400000 , 18.086324003978] , [ 1217476800000 , 18.929464156259] , [ 1220155200000 , 18.233728682084] , [ 1222747200000 , 16.315776297325] , [ 1225425600000 , 14.632892190251] , [ 1228021200000 , 14.667835024479] , [ 1230699600000 , 13.946993947309] , [ 1233378000000 , 14.394304684398] , [ 1235797200000 , 13.724462792967] , [ 1238472000000 , 10.930879035807] , [ 1241064000000 , 9.8339915513708] , [ 1243742400000 , 10.053858541872] , [ 1246334400000 , 11.786998438286] , [ 1249012800000 , 11.780994901769] , [ 1251691200000 , 11.305889670277] , [ 1254283200000 , 10.918452290083] , [ 1256961600000 , 9.6811395055706] , [ 1259557200000 , 10.971529744038] , [ 1262235600000 , 13.330210480209] , [ 1264914000000 , 14.592637568961] , [ 1267333200000 , 14.605329141157] , [ 1270008000000 , 13.936853794037] , [ 1272600000000 , 12.189480759072] , [ 1275278400000 , 11.676151385046] , [ 1277870400000 , 13.058852800018] , [ 1280548800000 , 13.62891543203] , [ 1283227200000 , 13.811107569918] , [ 1285819200000 , 13.786494560786] , [ 1288497600000 , 14.045162857531] , [ 1291093200000 , 13.697412447286] , [ 1293771600000 , 13.677681376221] , [ 1296450000000 , 19.96151186453] , [ 1298869200000 , 21.049198298156] , [ 1301544000000 , 22.687631094009] , [ 1304136000000 , 25.469010617433] , [ 1306814400000 , 24.88379943712] , [ 1309406400000 , 24.203843814249] , [ 1312084800000 , 22.138760964036] , [ 1314763200000 , 16.034636966228] , [ 1317355200000 , 15.394958944555] , [ 1320033600000 , 12.62564246197] , [ 1322629200000 , 12.973735699739] , [ 1325307600000 , 15.78601833615] , [ 1327986000000 , 15.227368020134] , [ 1330491600000 , 15.899752650733] , [ 1333166400000 , 15.661317319168] , [ 1335758400000 , 15.359891177281]]
        } ,
        {
          "key" : "Europe" ,
          "values" : [ [ 1025409600000 , 9.3433263069351] , [ 1028088000000 , 8.4583069475546] , [ 1030766400000 , 8.0342398154196] , [ 1033358400000 , 8.1538966876572] , [ 1036040400000 , 10.743604786849] , [ 1038632400000 , 12.349366155851] , [ 1041310800000 , 10.742682503899] , [ 1043989200000 , 11.360983869935] , [ 1046408400000 , 11.441336039535] , [ 1049086800000 , 10.897508791837] , [ 1051675200000 , 11.469101547709] , [ 1054353600000 , 12.086311476742] , [ 1056945600000 , 8.0697180773504] , [ 1059624000000 , 8.2004392233445] , [ 1062302400000 , 8.4566434900643] , [ 1064894400000 , 7.9565760979059] , [ 1067576400000 , 9.3764619255827] , [ 1070168400000 , 9.0747664160538] , [ 1072846800000 , 10.508939004673] , [ 1075525200000 , 10.69936754483] , [ 1078030800000 , 10.681562399145] , [ 1080709200000 , 13.184786109406] , [ 1083297600000 , 12.668213052351] , [ 1085976000000 , 13.430509403986] , [ 1088568000000 , 12.393086349213] , [ 1091246400000 , 11.942374044842] , [ 1093924800000 , 12.062227685742] , [ 1096516800000 , 11.969974363623] , [ 1099195200000 , 12.14374574055] , [ 1101790800000 , 12.69422821995] , [ 1104469200000 , 9.1235211044692] , [ 1107147600000 , 8.758211757584] , [ 1109566800000 , 8.8072309258443] , [ 1112245200000 , 11.687595946835] , [ 1114833600000 , 11.079723082664] , [ 1117512000000 , 12.049712896076] , [ 1120104000000 , 10.725319428684] , [ 1122782400000 , 10.844849996286] , [ 1125460800000 , 10.833535488461] , [ 1128052800000 , 17.180932407865] , [ 1130734800000 , 15.894764896516] , [ 1133326800000 , 16.412751299498] , [ 1136005200000 , 12.573569093402] , [ 1138683600000 , 13.242301508051] , [ 1141102800000 , 12.863536342041] , [ 1143781200000 , 21.034044171629] , [ 1146369600000 , 21.419084618802] , [ 1149048000000 , 21.142678863692] , [ 1151640000000 , 26.56848967753] , [ 1154318400000 , 24.839144939906] , [ 1156996800000 , 25.456187462166] , [ 1159588800000 , 26.350164502825] , [ 1162270800000 , 26.478333205189] , [ 1164862800000 , 26.425979547846] , [ 1167541200000 , 28.191461582256] , [ 1170219600000 , 28.930307448808] , [ 1172638800000 , 29.521413891117] , [ 1175313600000 , 28.188285966466] , [ 1177905600000 , 27.704619625831] , [ 1180584000000 , 27.49086242483] , [ 1183176000000 , 28.770679721286] , [ 1185854400000 , 29.06048067145] , [ 1188532800000 , 28.240998844973] , [ 1191124800000 , 33.004893194128] , [ 1193803200000 , 34.075180359928] , [ 1196398800000 , 32.548560664834] , [ 1199077200000 , 30.629727432729] , [ 1201755600000 , 28.642858788159] , [ 1204261200000 , 27.973575227843] , [ 1206936000000 , 27.393351882726] , [ 1209528000000 , 28.476095288522] , [ 1212206400000 , 29.29667866426] , [ 1214798400000 , 29.222333802896] , [ 1217476800000 , 28.092966093842] , [ 1220155200000 , 28.107159262922] , [ 1222747200000 , 25.482974832099] , [ 1225425600000 , 21.208115993834] , [ 1228021200000 , 20.295043095268] , [ 1230699600000 , 15.925754618402] , [ 1233378000000 , 17.162864628346] , [ 1235797200000 , 17.084345773174] , [ 1238472000000 , 22.24600710228] , [ 1241064000000 , 24.530543998508] , [ 1243742400000 , 25.084184918241] , [ 1246334400000 , 16.606166527359] , [ 1249012800000 , 17.239620011628] , [ 1251691200000 , 17.336739127379] , [ 1254283200000 , 25.478492475754] , [ 1256961600000 , 23.017152085244] , [ 1259557200000 , 25.617745423684] , [ 1262235600000 , 24.061133998641] , [ 1264914000000 , 23.223933318646] , [ 1267333200000 , 24.425887263936] , [ 1270008000000 , 35.501471156693] , [ 1272600000000 , 33.775013878675] , [ 1275278400000 , 30.417993630285] , [ 1277870400000 , 30.023598978467] , [ 1280548800000 , 33.327519522436] , [ 1283227200000 , 31.963388450372] , [ 1285819200000 , 30.49896723209] , [ 1288497600000 , 32.403696817913] , [ 1291093200000 , 31.47736071922] , [ 1293771600000 , 31.53259666241] , [ 1296450000000 , 41.760282761548] , [ 1298869200000 , 45.605771243237] , [ 1301544000000 , 39.986557966215] , [ 1304136000000 , 43.84633051005] , [ 1306814400000 , 39.857316881858] , [ 1309406400000 , 37.675127768207] , [ 1312084800000 , 35.775077970313] , [ 1314763200000 , 48.631009702578] , [ 1317355200000 , 42.830831754505] , [ 1320033600000 , 35.611502589362] , [ 1322629200000 , 35.320136981738] , [ 1325307600000 , 31.564136901516] , [ 1327986000000 , 32.074407502433] , [ 1330491600000 , 35.053013769977] , [ 1333166400000 , 33.873085184128] , [ 1335758400000 , 32.321039427046]]
        } ,
        {
          "key" : "Australia" ,
          "values" : [ [ 1025409600000 , 5.1162447683392] , [ 1028088000000 , 4.2022848306513] , [ 1030766400000 , 4.3543715758736] , [ 1033358400000 , 5.4641223667245] , [ 1036040400000 , 6.0041275884577] , [ 1038632400000 , 6.6050520064486] , [ 1041310800000 , 5.0154059912793] , [ 1043989200000 , 5.1835708554647] , [ 1046408400000 , 5.1142682006164] , [ 1049086800000 , 5.0271381717695] , [ 1051675200000 , 5.3437782653456] , [ 1054353600000 , 5.2105844515767] , [ 1056945600000 , 6.552565997799] , [ 1059624000000 , 6.9873363581831] , [ 1062302400000 , 7.010986789097] , [ 1064894400000 , 4.4254242025515] , [ 1067576400000 , 4.9613848042174] , [ 1070168400000 , 4.8854920484764] , [ 1072846800000 , 4.0441111794228] , [ 1075525200000 , 4.0219596813179] , [ 1078030800000 , 4.3065749225355] , [ 1080709200000 , 3.9148434915404] , [ 1083297600000 , 3.8659430654512] , [ 1085976000000 , 3.9572824600686] , [ 1088568000000 , 4.7372190641522] , [ 1091246400000 , 4.6871476374455] , [ 1093924800000 , 5.0398702564196] , [ 1096516800000 , 5.5221787544964] , [ 1099195200000 , 5.424646299798] , [ 1101790800000 , 5.9240223067349] , [ 1104469200000 , 5.9936860983601] , [ 1107147600000 , 5.8499523215019] , [ 1109566800000 , 6.4149040329325] , [ 1112245200000 , 6.4547895561969] , [ 1114833600000 , 5.9385382611161] , [ 1117512000000 , 6.0486751030592] , [ 1120104000000 , 5.23108613838] , [ 1122782400000 , 5.5857797121029] , [ 1125460800000 , 5.3454665096987] , [ 1128052800000 , 5.0439154120119] , [ 1130734800000 , 5.054634702913] , [ 1133326800000 , 5.3819451380848] , [ 1136005200000 , 5.2638869269803] , [ 1138683600000 , 5.5806167415681] , [ 1141102800000 , 5.4539047069985] , [ 1143781200000 , 7.6728842432362] , [ 1146369600000 , 7.719946716654] , [ 1149048000000 , 8.0144619912942] , [ 1151640000000 , 7.942223133434] , [ 1154318400000 , 8.3998279827444] , [ 1156996800000 , 8.532324572605] , [ 1159588800000 , 4.7324285199763] , [ 1162270800000 , 4.7402397487697] , [ 1164862800000 , 4.9042069355168] , [ 1167541200000 , 5.9583963430882] , [ 1170219600000 , 6.3693899239171] , [ 1172638800000 , 6.261153903813] , [ 1175313600000 , 5.3443942184584] , [ 1177905600000 , 5.4932111235361] , [ 1180584000000 , 5.5747393101109] , [ 1183176000000 , 5.3833633060013] , [ 1185854400000 , 5.5125898831832] , [ 1188532800000 , 5.8116112661327] , [ 1191124800000 , 4.3962296939996] , [ 1193803200000 , 4.6967663605521] , [ 1196398800000 , 4.7963004350914] , [ 1199077200000 , 4.1817985183351] , [ 1201755600000 , 4.3797643870182] , [ 1204261200000 , 4.6966642197965] , [ 1206936000000 , 4.3609995132565] , [ 1209528000000 , 4.4736290996496] , [ 1212206400000 , 4.3749762738128] , [ 1214798400000 , 3.3274661194507] , [ 1217476800000 , 3.0316184691337] , [ 1220155200000 , 2.5718140204728] , [ 1222747200000 , 2.7034994044603] , [ 1225425600000 , 2.2033786591364] , [ 1228021200000 , 1.9850621240805] , [ 1230699600000 , 0] , [ 1233378000000 , 0] , [ 1235797200000 , 0] , [ 1238472000000 , 0] , [ 1241064000000 , 0] , [ 1243742400000 , 0] , [ 1246334400000 , 0] , [ 1249012800000 , 0] , [ 1251691200000 , 0] , [ 1254283200000 , 0.44495950017788] , [ 1256961600000 , 0.33945469262483] , [ 1259557200000 , 0.38348269455195] , [ 1262235600000 , 0] , [ 1264914000000 , 0] , [ 1267333200000 , 0] , [ 1270008000000 , 0] , [ 1272600000000 , 0] , [ 1275278400000 , 0] , [ 1277870400000 , 0] , [ 1280548800000 , 0] , [ 1283227200000 , 0] , [ 1285819200000 , 0] , [ 1288497600000 , 0] , [ 1291093200000 , 0] , [ 1293771600000 , 0] , [ 1296450000000 , 0.52216435716176] , [ 1298869200000 , 0.59275786698454] , [ 1301544000000 , 0] , [ 1304136000000 , 0] , [ 1306814400000 , 0] , [ 1309406400000 , 0] , [ 1312084800000 , 0] , [ 1314763200000 , 0] , [ 1317355200000 , 0] , [ 1320033600000 , 0] , [ 1322629200000 , 0] , [ 1325307600000 , 0] , [ 1327986000000 , 0] , [ 1330491600000 , 0] , [ 1333166400000 , 0] , [ 1335758400000 , 0]]
        } ,
        {
          "key" : "Antarctica" ,
          "values" : [ [ 1025409600000 , 1.3503144674343] , [ 1028088000000 , 1.2232741112434] , [ 1030766400000 , 1.3930470790784] , [ 1033358400000 , 1.2631275030593] , [ 1036040400000 , 1.5842699103708] , [ 1038632400000 , 1.9546996043116] , [ 1041310800000 , 0.8504048300986] , [ 1043989200000 , 0.85340686311353] , [ 1046408400000 , 0.843061357391] , [ 1049086800000 , 2.119846992476] , [ 1051675200000 , 2.5285382124858] , [ 1054353600000 , 2.5056570712835] , [ 1056945600000 , 2.5212789901005] , [ 1059624000000 , 2.6192011642534] , [ 1062302400000 , 2.5382187823805] , [ 1064894400000 , 2.3393223047168] , [ 1067576400000 , 2.491219888698] , [ 1070168400000 , 2.497555874906] , [ 1072846800000 , 1.734018115546] , [ 1075525200000 , 1.9307268299646] , [ 1078030800000 , 2.2261679836799] , [ 1080709200000 , 1.7608893704206] , [ 1083297600000 , 1.6242690616808] , [ 1085976000000 , 1.7161663801295] , [ 1088568000000 , 1.7183554537038] , [ 1091246400000 , 1.7179780759145] , [ 1093924800000 , 1.7314274801784] , [ 1096516800000 , 1.2596883356752] , [ 1099195200000 , 1.381177053009] , [ 1101790800000 , 1.4408819615814] , [ 1104469200000 , 3.4743581836444] , [ 1107147600000 , 3.3603749903192] , [ 1109566800000 , 3.5350883257893] , [ 1112245200000 , 3.0949644237828] , [ 1114833600000 , 3.0796455899995] , [ 1117512000000 , 3.3441247640644] , [ 1120104000000 , 4.0947643978168] , [ 1122782400000 , 4.4072631274052] , [ 1125460800000 , 4.4870979780825] , [ 1128052800000 , 4.8404549457934] , [ 1130734800000 , 4.8293016233697] , [ 1133326800000 , 5.2238093263952] , [ 1136005200000 , 3.382306337815] , [ 1138683600000 , 3.7056975170243] , [ 1141102800000 , 3.7561118692318] , [ 1143781200000 , 2.861913700854] , [ 1146369600000 , 2.9933744103381] , [ 1149048000000 , 2.7127537218463] , [ 1151640000000 , 3.1195497076283] , [ 1154318400000 , 3.4066964004508] , [ 1156996800000 , 3.3754571113569] , [ 1159588800000 , 2.2965579982924] , [ 1162270800000 , 2.4486818633018] , [ 1164862800000 , 2.4002308848517] , [ 1167541200000 , 1.9649579750349] , [ 1170219600000 , 1.9385263638056] , [ 1172638800000 , 1.9128975336387] , [ 1175313600000 , 2.3412869836298] , [ 1177905600000 , 2.4337870351445] , [ 1180584000000 , 2.62179703171] , [ 1183176000000 , 3.2642864957929] , [ 1185854400000 , 3.3200396223709] , [ 1188532800000 , 3.3934212707572] , [ 1191124800000 , 4.2822327088179] , [ 1193803200000 , 4.1474964228541] , [ 1196398800000 , 4.1477082879801] , [ 1199077200000 , 5.2947122916128] , [ 1201755600000 , 5.2919843508028] , [ 1204261200000 , 5.198978305031] , [ 1206936000000 , 3.5603057673513] , [ 1209528000000 , 3.3009087690692] , [ 1212206400000 , 3.1784852603792] , [ 1214798400000 , 4.5889503538868] , [ 1217476800000 , 4.401779617494] , [ 1220155200000 , 4.2208301828278] , [ 1222747200000 , 3.89396671475] , [ 1225425600000 , 3.0423832241354] , [ 1228021200000 , 3.135520611578] , [ 1230699600000 , 1.9631418164089] , [ 1233378000000 , 1.8963543874958] , [ 1235797200000 , 1.8266636017025] , [ 1238472000000 , 0.93136635895188] , [ 1241064000000 , 0.92737801918888] , [ 1243742400000 , 0.97591889805002] , [ 1246334400000 , 2.6841193805515] , [ 1249012800000 , 2.5664341140531] , [ 1251691200000 , 2.3887523699873] , [ 1254283200000 , 1.1737801663681] , [ 1256961600000 , 1.0953582317281] , [ 1259557200000 , 1.2495674976653] , [ 1262235600000 , 0.36607452464754] , [ 1264914000000 , 0.3548719047291] , [ 1267333200000 , 0.36769242398939] , [ 1270008000000 , 0] , [ 1272600000000 , 0] , [ 1275278400000 , 0] , [ 1277870400000 , 0] , [ 1280548800000 , 0] , [ 1283227200000 , 0] , [ 1285819200000 , 0.85450741275337] , [ 1288497600000 , 0.91360317921637] , [ 1291093200000 , 0.89647678692269] , [ 1293771600000 , 0.87800687192639] , [ 1296450000000 , 0] , [ 1298869200000 , 0] , [ 1301544000000 , 0.43668720882994] , [ 1304136000000 , 0.4756523602692] , [ 1306814400000 , 0.46947368328469] , [ 1309406400000 , 0.45138896152316] , [ 1312084800000 , 0.43828726648117] , [ 1314763200000 , 2.0820861395316] , [ 1317355200000 , 0.9364411075395] , [ 1320033600000 , 0.60583907839773] , [ 1322629200000 , 0.61096950747437] , [ 1325307600000 , 0] , [ 1327986000000 , 0] , [ 1330491600000 , 0] , [ 1333166400000 , 0] , [ 1335758400000 , 0]]
        }
      ];
    }
    function discreteBarChartData (){
      return [
        {
          key: "Cumulative Return",
          values: [
            {
              "label" : "A" ,
              "value" : -29.765957771107
            } ,
            {
              "label" : "B" ,
              "value" : 0
            } ,
            {
              "label" : "C" ,
              "value" : 32.807804682612
            } ,
            {
              "label" : "D" ,
              "value" : 196.45946739256
            } ,
            {
              "label" : "E" ,
              "value" : 0.19434030906893
            } ,
            {
              "label" : "F" ,
              "value" : -98.079782601442
            } ,
            {
              "label" : "G" ,
              "value" : -13.925743130903
            } ,
            {
              "label" : "H" ,
              "value" : -5.1387322875705
            }
          ]
        }
      ];
    }
    function pieChartData (){
      return [
        {
          key: "One",
          y: 5
        },
        {
          key: "Two",
          y: 2
        },
        {
          key: "Three",
          y: 9
        },
        {
          key: "Four",
          y: 7
        },
        {
          key: "Five",
          y: 4
        },
        {
          key: "Six",
          y: 3
        },
        {
          key: "Seven",
          y: .5
        }
      ];
    }
    function boxPlotChartData (){
      return [
        {
          label: "A",
          values: {
            Q1: 180,
            Q2: 200,
            Q3: 250,
            whisker_low: 115,
            whisker_high: 400,
            outliers: [50, 100, 425]
          }
        },
        {
          label: "B",
          values: {
            Q1: 300,
            Q2: 350,
            Q3: 400,
            whisker_low: 225,
            whisker_high: 425,
            outliers: [175, 450, 480]
          }
        },
        {
          label: "C",
          values: {
            Q1: 100,
            Q2: 200,
            Q3: 300,
            whisker_low: 25,
            whisker_high: 400,
            outliers: [450, 475]
          }
        },
        {
          label: "D",
          values: {
            Q1: 75,
            Q2: 100,
            Q3: 125,
            whisker_low: 50,
            whisker_high: 300,
            outliers: [450]
          }
        },
        {
          label: "E",
          values: {
            Q1: 325,
            Q2: 400,
            Q3: 425,
            whisker_low: 225,
            whisker_high: 475,
            outliers: [50, 100, 200]
          }
        }
      ];
    }
  });
'use strict';

// Configuring the new module
angular.module('dashboard').run(['Menus',
	function(Menus) {
		// Add as a sub menu item to features top bar menu items
		Menus.addSubMenuItem('topbar', 'item', 'Dashboards', 'dashboard');
	}
]);

'use strict';

//Setting up route
angular.module('dashboard').config(['$stateProvider',
	function($stateProvider) {
		// Dashboards state routing
		$stateProvider.
		state('listDashboard', {
			url: '/dashboard',
			templateUrl: 'shared/public/modules/dashboard/views/list-dashboard.client.view.html'
		}).
		state('createDashboard', {
			url: '/dashboard/create',
			templateUrl: 'shared/public/modules/dashboard/views/create-dashboard.client.view.html'
		}).
		state('viewDashboard', {
			url: '/dashboard/:dashboardId',
			templateUrl: 'shared/public/modules/dashboard/views/view-dashboard.client.view.html'
		}).
		state('editDashboard', {
			url: '/dashboard/:dashboardId/edit',
			templateUrl: 'shared/public/modules/dashboard/views/edit-dashboard.client.view.html'
		});
	}
]);
'use strict';

// Dashboards controller
angular.module('dashboard').controller('DashboardController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication', 'Dashboard',
	function($rootScope, $scope, $stateParams, $location, Authentication, Dashboard) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		// Create new Dashboard
		$scope.create = function() {
			// Create new Dashboard object
			var dashboard = new Dashboard ({
					
				
					name: this.name,
				
					content: this.content,
				
			});

			// Redirect after save
			dashboard.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/dashboard/' + response._id);

				// Clear form fields
				
				$scope.name = '';
				
				$scope.content = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Dashboard
		$scope.remove = function(dashboard) {
			if ( dashboard ) { 
				dashboard.$remove();

				for (var i in $scope.dashboard) {
					if ($scope.dashboard [i] === dashboard) {
						$scope.dashboard.splice(i, 1);
					}
				}
			} else {
				$scope.dashboard.$remove(function() {
					$location.path($scope.parentRouteUrl + '/dashboard');
				});
			}
		};

		// Update existing Dashboard
		$scope.update = function() {
			var dashboard = $scope.dashboard;

			dashboard.$update(function() {
				$location.path($scope.parentRouteUrl + '/dashboard/' + dashboard._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Dashboards
		$scope.find = function() {
			$scope.dashboard = Dashboard.query();
		};

		// Find existing Dashboard
		$scope.findOne = function() {
			$scope.dashboard = Dashboard.get({ 
				dashboardId: $stateParams.dashboardId
			});
		};
	}
]);
'use strict';

angular.module('dashboard')

	.directive('bsgSetWidgetInfo', function(){

		return {
			restrict: 'E',
			templateUrl: 'shared/public/modules/dashboard/views/bsg-set-widget-info.dashboard.directive.view.html',
			controller: ["$scope", function($scope) {
				$scope.widgetHeading = $scope.widgetHeading || '';
				$scope.widgetSubHeading = $scope.widgetSubHeading || '';

				$scope.dismiss = function() {
					$scope.$uibModalInstance.dismiss();
				};

				$scope.submit = function() {
					$scope.setWidgetInfo($scope.widgetHeading, $scope.widgetSubHeading);					
					$scope.$uibModalInstance.close($scope.widget);
				};
		    }]
		};
	});

'use strict';

angular.module('dashboard')

	.directive('dashboardContainer', function(){

		return {
			restrict: 'E',
			scope: {

			},
			templateUrl: 'shared/public/modules/dashboard/views/dashboard-container.dashboard.directive.view.html',
			controller: ["$scope", "$timeout", "$stateParams", "Dashboard", "$rootScope", "Authentication", "$location", function($scope, $timeout, $stateParams, Dashboard, $rootScope, Authentication, $location){
				$scope.authentication = Authentication;
				// Update existing Dashboard
				$scope.update = function() {
					var dashboard = $scope.dashboard;
					dashboard.content = angular.toJson($scope.content);
					dashboard.$update(function() {
						console.log('Dashboard updated', dashboard);
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				};

				// Find existing Dashboard
				$scope.findOne = function() {
					$rootScope.displayExpandedView = true;
					Dashboard.get({ 
						dashboardId: $stateParams.dashboardId
					}, function(response){
						$scope.dashboard = response;
						if(!$scope.dashboard.content || !$scope.dashboard.content.length){
							$scope.content = { widgets: []};
						} else {
							$scope.content = angular.fromJson($scope.dashboard.content);
						}
					}, function(error){
						console.error('The following error occured while trying to get the dashboard', error);
					});
				};

				  // grid manipulation
			    $scope.clear = function() {
			        $scope.content.widgets = [];
			        $scope.update();
			    };

			    $scope.addWidget = function() {
			        $scope.content.widgets.push({
			          name: "New Widget",
			          sizeX: 1,
			          sizeY: 1
			        });
			        $scope.update();
			    };

				// Remove existing Dashboard
				$scope.removeDashboard = function(dashboard) {
					if ( dashboard ) { 
						dashboard.$remove();

						for (var i in $scope.dashboard) {
							if ($scope.dashboard [i] === dashboard) {
								$scope.dashboard.splice(i, 1);
							}
						}
					} else {
						$scope.dashboard.$remove(function() {
							$location.path('/dashboard');
						});
					}
				};

				$scope.removeWidget = function(widget) {
			        $scope.content.widgets.splice($scope.content.widgets.indexOf(widget), 1);
			        $scope.update();
			    };

			    $scope.gridsterOptions = {
			        margins: [10, 10],
			        columns: 4,
			        mobileBreakPoint: 1000,
			        mobileModeEnabled: true,
			        draggable: {
			         	handle: 'h3', // optional selector for resize handle
						start: function(event, $element, widget) {}, // optional callback fired when drag is started,
						drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
						
						stop: function(event, $element, widget) { // optional callback fired when item is finished dragging
							$scope.updateWidgetOnDashboardLayoutChange(widget);
						} 
			        },
			        resizable: {
			          enabled: true,
			          handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],

			          // optional callback fired when resize is started
			          start: function(event, $element, widget) {},

			          // optional callback fired when item is resized,
			          resize: function(event, $element, widget) {
			          },

			          // optional callback fired when item is finished resizing
			          stop: function(event, $element, widget) {
						$scope.updateWidgetOnDashboardLayoutChange(widget);
			          }
			        }
				};

				$scope.updateWidgetOnDashboardLayoutChange = function(widget){
		            $timeout(function(){
		            	widget.justGotResized = true;
						$scope.update();
		            },400);
				};
			}]
		};
	});
'use strict';

angular.module('dashboard')

	.directive('dashboardWidgetSettings', function(){

		return {
			restrict: 'E',
			templateUrl: 'shared/public/modules/dashboard/views/dashboard-widget-settings.dashboard.directive.view.html',
			controller: ["$scope", function($scope) {

				$scope.form = {
					name: $scope.widget.name,
					sizeX: $scope.widget.sizeX,
					sizeY: $scope.widget.sizeY,
					col: $scope.widget.col,
					row: $scope.widget.row,
					type: $scope.widget.type
				};
				
				$scope.dismiss = function() {
					$scope.$uibModalInstance.dismiss();
				};

				$scope.removeCallFromSettings = function() {
					$scope.remove(); //call parent widget remove function
					$scope.$uibModalInstance.close();
				};

				$scope.submit = function() {
					$scope.updateWidget($scope.form);					
					$scope.$uibModalInstance.close($scope.widget);
				};
		    }]
		};
	});

'use strict';

angular.module('dashboard')

	.directive('dashboardWidget', function(){

		return {
			restrict: 'E',
			scope: {
				widget: '=',
				dashboardId: '@',
				onRemove: '&',
				onUpdate: '&'
			},
			templateUrl: 'shared/public/modules/dashboard/views/dashboard-widget.dashboard.directive.view.html',
			controller: ["$scope", "Authentication", "$uibModal", "SelectItemAndProperty", function($scope, Authentication, $uibModal, SelectItemAndProperty){
				
				$scope.handleToChild = {};

				$scope.authentication = Authentication;
				
				$scope.getDirectiveValues = function(){
					return {
						directiveName: $scope.widget.directiveName, 
						directiveAttributes: [
							{name: 'settings', value: 'widget'}, 
							{name: 'widget-handle-to-child', value: 'handleToChild'}
						]
					};
				};
				
				$scope.directiveValues = $scope.getDirectiveValues();
				
				$scope.remove = function(widget) {
			        if($scope.onRemove){
			        	$scope.onRemove()(widget);
			        } else {
			        	console.errror('On remove function not provided');
			        }
			    };

			    $scope.updateWidget = function(newSettings){
			    	angular.extend($scope.widget, newSettings);
			    	//TODO update the widget display when the graph changes
			    	//Right now the graph is not changed on this update. This is for renaming widget for now.
			    	if($scope.onUpdate){
			    		$scope.onUpdate()();
			    	} else {
			    		console.error('onUpdate handler not provided');
			    	}
			    };

			    $scope.setWidgetContentType = function(widgetContentType) {
			    	if(!widgetContentType || !widgetContentType.id){
			    		console.error('No widget content type selected');
			    		return;
			    	}

					$scope.widget.directiveName = widgetContentType.id;
					$scope.widget.widgetContentType = widgetContentType;

					var propertySelectionType = widgetContentType.multipleProperties? 'multiple' : 'single';
			    	
			    	//select a feature
					SelectItemAndProperty.selectItemAndProperty(propertySelectionType).then(function(result){

						if(!result.referencedFeatureName){
							alert('Cannot save. Required attribute referencedFeatureName missing');
							return;
						}
						
					    if(propertySelectionType === 'single'){
						    if(!result.referencedPropertyName){
								alert('Cannot save. Required attribute referencedPropertyName missing');
								return;
							}
						} else {
							if(!result.propertyNames){
								alert('Cannot save. Required attribute referencedPropertyName missing');
								return;
							}
						}
						
						console.log('Successfully got back the selection', result);

						angular.extend($scope.widget, result);

						$scope.directiveValues = $scope.getDirectiveValues();
						$scope.$broadcast('directive-values-changed', $scope.directiveValues);
						if($scope.onUpdate){
				    		$scope.onUpdate()();
				    	} else {
				    		console.error('onUpdate handler not provided');
				    	}
					})
					.catch(function(error){
						console.error(error);
					});
			    };

			    $scope.setWidgetInfo = function(widgetHeading, widgetSubHeading) {

					$scope.widget.widgetHeading = widgetHeading;
					$scope.widget.widgetSubHeading = widgetSubHeading;
					
					if($scope.onUpdate){
			    		$scope.onUpdate()();
			    	} else {
			    		console.error('onUpdate handler not provided');
			    	}					
			    };

			    $scope.openSettings = function(widget) {
			        $uibModal.open({
						scope: $scope,
						templateUrl: 'shared/public/modules/dashboard/views/wrapper-dashboard-widget-settings.dashboard.directive.view.html',
						controller: function($scope, $uibModalInstance){
							$scope.$uibModalInstance = $uibModalInstance;
						}
			        });
			    };

			    $scope.openWidgetContentSelector = function(widget) {
			        $uibModal.open({
						scope: $scope,
						templateUrl: 'shared/public/modules/dashboard/views/wrapper-select-widget-content.dashboard.directive.view.html',
						controller: function($scope, $uibModalInstance){
							$scope.$uibModalInstance = $uibModalInstance;
							$scope.widgetContentType = $scope.widget.widgetContentType;
						},
						size: 'lg'
			        });
			    };

			    $scope.openWidgetInfoEditor = function(widget) {
			        $uibModal.open({
						scope: $scope,
						templateUrl: 'shared/public/modules/dashboard/views/wrapper-set-widget-info.dashboard.directive.view.html',
						controller: function($scope, $uibModalInstance){
							$scope.$uibModalInstance = $uibModalInstance;
							$scope.widgetHeading = $scope.widget.widgetHeading;
							$scope.widgetSubHeading = $scope.widget.widgetSubHeading;
						},
						size: 'lg'
			        });
			    };

			    //subscribe widget on window resize event
				angular.element(window).on('resize', function(e){
					$scope.broadcastWidgetResizeEvent();
				});

				$scope.broadcastWidgetResizeEvent = function(){
					if($scope.handleToChild.updateLayout){
						$scope.handleToChild.updateLayout();
					} else {
						console.error('Cannot update widget contents. Handle to update layout function missing');
					}
				};

				$scope.widget.justGotResized = false;
				$scope.$watch('widget.justGotResized', function(val){
					if($scope.widget.justGotResized){
						console.log('widget.justGotResized');
						$scope.broadcastWidgetResizeEvent();
						$scope.widget.justGotResized = false;
					}
				});
			}]
		};
	});
'use strict';

angular.module('dashboard')

	.directive('selectWidgetContent', function(){

		return {
			restrict: 'E',
			templateUrl: 'shared/public/modules/dashboard/views/select-widget-content.dashboard.directive.view.html',
			controller: ["$scope", function($scope) {
				$scope.widgetContentType = $scope.widgetContentType || {};

				$scope.availableWidgetContentTypes = [{
					id: 'pie-chart',
					imageUrl: 'shared/public/modules/chart-components/img/pie.png'
				},{
					id: 'horz-percent-bar-chart',
					imageUrl: 'shared/public/modules/chart-components/img/horz-percent-bar-chart.png'
				},{
					id: 'line-chart',
					imageUrl: 'shared/public/modules/chart-components/img/line.png'
				},{
					id: 'historical-bar-chart',
					imageUrl: 'shared/public/modules/chart-components/img/historical-bar-chart.png'
				},{
					id: 'donut-chart',
					imageUrl: 'shared/public/modules/chart-components/img/donut.png'
				},
				{
					id: 'stacked-area-chart',
					multipleProperties: true,
					imageUrl: 'shared/public/modules/chart-components/img/stacked-area-chart.png'
				},
				{
					id: 'bsg-ui-grid',
					multipleProperties: true,
					imageUrl: 'shared/public/modules/bsg-ui-grid-components/img/ui-grid.png'
				}];

				$scope.dismiss = function() {
					$scope.$uibModalInstance.dismiss();
				};

				$scope.submit = function() {
					if(!$scope.widgetContentType || !$scope.widgetContentType.id){
						alert('Please select a widget content type');
						return;
					}
					$scope.setWidgetContentType($scope.widgetContentType);					
					$scope.$uibModalInstance.close();
				};
		    }]
		};
	});

'use strict';

//Dashboards service used to communicate Dashboards REST endpoints
angular.module('dashboard').factory('Dashboard', ['$resource',
	function($resource) {
		return $resource('dashboard/:dashboardId', 
		{ 
			dashboardId: '@_id'
		}, 
		{
			search: {
				url: '/dashboard/search/',
				method: 'GET',
				isArray: true
			},
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('itemroles').config(['$stateProvider',
	function($stateProvider) {
		// Itemroles state routing
		$stateProvider.
		state('listItemroles', {
			url: '/itemroles',
			templateUrl: 'shared/public/modules/itemroles/views/list-itemroles.client.view.html'
		}).
		state('createItemroles', {
			url: '/itemroles/create',
			templateUrl: 'shared/public/modules/itemroles/views/create-itemroles.client.view.html'
		}).
		state('viewItemroles', {
			url: '/itemroles/:itemrolesId',
			templateUrl: 'shared/public/modules/itemroles/views/view-itemroles.client.view.html'
		}).
		state('editItemroles', {
			url: '/itemroles/:itemrolesId/edit',
			templateUrl: 'shared/public/modules/itemroles/views/edit-itemroles.client.view.html'
		});
	}
]);
'use strict';

// Itemroles controller
angular.module('itemroles').controller('ItemrolesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Itemroles',
	function($scope, $stateParams, $location, Authentication, Itemroles) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		$scope.onSuccessfulUploadInCreateMode = function(propertyName, fileName, fileKey) {
			$scope[propertyName] = fileName;
			$scope[propertyName + "_fileKey"] = fileKey;
		};

		$scope.onSuccessfulUploadInEditMode = function(propertyName, fileName, fileKey) {
			$scope.itemroles[propertyName] = fileName;
			$scope.itemroles[propertyName + "_fileKey"] = fileKey;
		};

		// Create new Itemrole
		$scope.create = function() {
			// Create new Itemrole object
			var itemroles = new Itemroles ({
					
				
					parentId: this.parentId,	
				
					accesstype: this.accesstype,	
				
					role: this.role,	
				
			});

			// Redirect after save
			itemroles.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/itemroles/' + response._id);

				// Clear form fields
				
				$scope.parentId = '';
				
				$scope.accesstype = '';
				
				$scope.role = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Itemrole
		$scope.remove = function(itemroles) {
			if ( itemroles ) { 
				itemroles.$remove();

				for (var i in $scope.itemroles) {
					if ($scope.itemroles [i] === itemroles) {
						$scope.itemroles.splice(i, 1);
					}
				}
			} else {
				$scope.itemroles.$remove(function() {
					$location.path($scope.parentRouteUrl + '/itemroles');
				});
			}
		};

		// Update existing Itemrole
		$scope.update = function() {
			var itemroles = $scope.itemroles;

			itemroles.$update(function() {
				$location.path($scope.parentRouteUrl + '/itemroles/' + itemroles._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Itemroles
		$scope.find = function() {
			$scope.itemroles = Itemroles.query();
		};

		// Find existing Itemrole
		$scope.findOne = function() {
			$scope.itemroles = Itemroles.get({ 
				itemrolesId: $stateParams.itemrolesId
			});
		};
	}
]);
'use strict';

//Itemroles service used to communicate Itemroles REST endpoints
angular.module('itemroles').factory('Itemroles', ['$resource',
	function($resource) {
		return $resource('itemroles/:itemrolesId', 
		{ 
			itemrolesId: '@_id'
		}, 
		{
			'query': {
				method:'GET', 
				isArray:true, 
				cache: true //will use the query method for web application authorization only. we will cache this. getByAccessType will not be cached and used in the admin screen
			},
			search: {
				url: '/itemroles/search/',
				method: 'GET',
				isArray: true
			},
			getByAccessType: {
				url: '/itemroles/getbyaccesstype',
				method: 'GET',
				params:{
					parentId:'@parentId',
					accesstype: '@accesstype'
				},
				isArray: true
			},
			deleteItemRole: {
				url: '/itemroles/deleteitemrole',
				method: 'POST',
				params:{
					parentId:'@parentId',
					accesstype: '@accesstype',
					role: '@role'
				}
			},
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

angular.module('lookupfromproperty')

	.directive('lookupFromProperty', function(){

		return {
			restrict: 'E',
			scope: {
				searchService: '@searchService',
				matchPropertyName: '@matchPropertyName',
				bindingModel: '@bindingModel'
			},
			controller: ["$scope", "$resource", "$injector", function ($scope, $resource, $injector){
	            if(!$scope.matchPropertyName){
	            	console.error('Invalid configuration: required attribute match-property-name is missing for the lookup-from-property directive');
	            	return;
	            }
	            if(!$scope.searchService){
	            	console.error('Invalid configuration: required attribute search-service is missing for the lookup-from-property directive');
	            	return;
	            }
				var service = $injector.get($scope.searchService);


		    	$scope.search = function (searchValue) {
			        return service.search({
			           		searchKeys: $scope.matchPropertyName,
			           		searchValue: searchValue
			            }).$promise.then(function(data){
			                return data;
			            
			            }, function(error){
			                console.error('The following error occured while calling the search service' + $scope.searchService + ': ');
			                console.error(error);
			           });
		        };

		        $scope.typeaheadOnSelect = function($item, $model, $label){
		        	var bindingModel = $scope.bindingModel;
		        	if(!bindingModel){
		        		console.error('Binding model not assigned');
		        		return;
		        	}
		        	
		        	//The binding model can be in the format topLevel.oneLevelLower....propertyName
		        	var bindingModelArray = bindingModel.split('.');
		        	var reference = $scope.$parent;
		        	for(var ctr = 0; ctr < bindingModelArray.length; ctr++){

		        		var objOrProperty = bindingModelArray[ctr];

		        		var last = ctr === bindingModelArray.length -1;
		        		if(!last){
		        			//get handle to a child level object
		        			reference = reference[objOrProperty];		        			
		        		} else {
		        			//assign the value to the property
		        			reference[objOrProperty] = $model;
		        		}
		        	}
		        };
		    }],
			link: function(scope, element, attrs){

			},
			templateUrl: 'shared/public/modules/lookupfromproperty/views/lookupfromproperty.client.view.html'
		};
});
'use strict';

//Setting up route
angular.module('roles').config(['$stateProvider',
	function($stateProvider) {
		// Roles state routing
		$stateProvider.
		state('listRoles', {
			url: '/roles',
			templateUrl: 'shared/public/modules/roles/views/list-roles.client.view.html'
		}).
		state('createRole', {
			url: '/roles/create',
			templateUrl: 'shared/public/modules/roles/views/create-role.client.view.html'
		}).
		state('viewRole', {
			url: '/roles/:roleId',
			templateUrl: 'shared/public/modules/roles/views/view-role.client.view.html'
		}).
		state('editRole', {
			url: '/roles/:roleId/edit',
			templateUrl: 'shared/public/modules/roles/views/edit-role.client.view.html'
		});
	}
]);
'use strict';

// Roles controller
angular.module('roles').controller('RolesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Roles',
	function($scope, $stateParams, $location, Authentication, Roles) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		// Create new Role
		$scope.create = function() {
			// Create new Role object
			var role = new Roles ({
					
				
					name: this.name,
				
			});

			// Redirect after save
			role.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/roles/' + response._id);

				// Clear form fields
				
				$scope.name = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Role
		$scope.remove = function(role) {
			if ( role ) { 
				role.$remove();

				for (var i in $scope.roles) {
					if ($scope.roles [i] === role) {
						$scope.roles.splice(i, 1);
					}
				}
			} else {
				$scope.role.$remove(function() {
					$location.path($scope.parentRouteUrl + '/roles');
				});
			}
		};

		// Update existing Role
		$scope.update = function() {
			var role = $scope.role;

			role.$update(function() {
				$location.path($scope.parentRouteUrl + '/roles/' + role._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Roles
		$scope.find = function() {
			$scope.roles = Roles.query();
		};

		// Find existing Role
		$scope.findOne = function() {
			$scope.role = Roles.get({ 
				roleId: $stateParams.roleId
			});
		};
	}
]);
'use strict';

//Roles service used to communicate Roles REST endpoints
angular.module('roles').factory('Roles', ['$resource',
	function($resource) {
		return $resource('roles/:roleId', 
		{ 
			roleId: '@_id'
		}, 
		{
			update: {
				method: 'PUT'
			},					
			buildRoleStatus: {
				url: 'build-role-status',
				method: 'GET'
			}
		});
	}
]);
'use strict';

angular.module('selectforeignkeyref')

	.directive('selectForeignKeyRef', function(){

		return {
			restrict: 'E',
			scope: {
				searchService: '@searchService',
				matchPropertyNames: '@matchPropertyNames',
				bindingModel: '@bindingModel'
			},
			controller: ["$scope", "$resource", "$injector", "CoreFunctions", function ($scope, $resource, $injector, CoreFunctions){
	            if(!$scope.matchPropertyNames){
	            	console.error('Invalid configuration: required attribute match-property-names is missing for the select-foreign-key-ref directive');
	            	return;
	            }
	            if(!$scope.searchService){
	            	console.error('Invalid configuration: required attribute search-service is missing for the select-foreign-key-ref directive');
	            	return;
	            }
				var service = $injector.get($scope.searchService);


		    	$scope.search = function (searchValue) {
			        return service.search({
			           		searchKeys: CoreFunctions.getPropertyColumnNames($scope.matchPropertyNames),
			           		searchValue: searchValue
			            }).$promise.then(function(data){

			            	if(data && data.length > 0){
			            		var matchPropertyNamesArray = $scope.matchPropertyNames.split(',');
			            		data.forEach(function(row){
			            			var displayValues = matchPropertyNamesArray.map(function(matchPropertyName){
			            				return matchPropertyName + ': ' + row[CoreFunctions.getPropertyColumnName(matchPropertyName)];
			            			});
			            			row._select_foreign_key_ref_display = displayValues.join(' ');
			            		});
			            	}

			                return data;
			            
			            }, function(error){
			                console.error('The following error occured while calling the search service' + $scope.searchService + ': ');
			                console.error(error);
			           });
		        };

		        $scope.typeaheadOnSelect = function($item, $model, $label){
		        	var bindingModel = $scope.bindingModel;
		        	if(!bindingModel){
		        		console.error('Binding model not assigned');
		        		return;
		        	}
		        	
		        	//The binding model can be in the format topLevel.oneLevelLower....propertyName
		        	var bindingModelArray = bindingModel.split('.');
		        	var reference = $scope.$parent;
		        	for(var ctr = 0; ctr < bindingModelArray.length; ctr++){

		        		var objOrProperty = bindingModelArray[ctr];

		        		var last = ctr === bindingModelArray.length -1;
		        		if(!last){
		        			//get handle to a child level object
		        			reference = reference[objOrProperty];		        			
		        		} else {
		        			//assign the value to the property
		        			reference[objOrProperty] = $item;
		        		}
		        	}
		        };
		    }],
			link: function(scope, element, attrs){

			},
			templateUrl: 'shared/public/modules/selectforeignkeyref/views/select-foreign-key-ref.client.view.html'
		};
});
angular.module('shared-components').directive('bsgAddNewWithName', function(){

	return {
		restrict: 'E',
		scope: {
			serviceName: '@',
			onSuccessfulAdd: '&'
		},
		templateUrl: 'shared/public/modules/shared-components/views/bsg-add-new-with-name.directive.view.html',
		controller: ["$scope", "$injector", function($scope, $injector){
			if(!$scope.serviceName) {
				$scope.createNewError = 'Cannot add. Cannot identify the service to call.';
				return;	
			}

			$scope.serviceHandle = $injector.get($scope.serviceName);

			$scope.createNew = function(){
				$scope.createNewError = '';
				
				if(!$scope.newName){
					$scope.createNewError = 'Cannot add. Name missing.';
					return;
				}

				if(!$scope.serviceHandle) {
					$scope.createNewError = 'Cannot add. Cannot identify the service to call.';
					return;					
				}

				var newObject = new $scope.serviceHandle ({
						name: $scope.newName
				});

				newObject.$save(function(response) {
					$scope.newName = '';
					if($scope.onSuccessfulAdd){
						$scope.onSuccessfulAdd()(response);
					}
				}, function(errorResponse) {
					console.error(errorResponse.data.message);
					$scope.createNewError = errorResponse.data.message;
				});
			};

			$scope.clearError = function(){
				$scope.createNewError = '';
			};
		}]
	}
});

angular.module('shared-components').directive('bsgChildItemDisplay', ["Authorization", function(Authorization){

	return {
		restrict: 'E',
		scope: {
			url: '@',
			name: '@',
			itemTypeId: '@'
		},
		templateUrl: 'shared/public/modules/shared-components/views/bsg-child-item-display.directive.view.html',
		link: function(scope){
			Authorization.checkAccess(scope.itemTypeId, 'read')
				.then(function(result){
					scope.hasAccess = true;
				});
		}
	}
}]);

'use strict';

angular.module('shared-components').directive('bsgFileDownload', function () {

    return {
        restrict: 'E',
        scope: {
            fileKey: '@',
            fileName: '@'
        },
        templateUrl: 'shared/public/modules/shared-components/views/bsg-file-download.shared-components.directive.view.html'
    };
});

'use strict';
//https://github.com/danialfarid/ng-file-upload/wiki/Direct-S3-upload-and-Node-signing-example

angular.module('shared-components').directive('bsgFileUpload', function () {

    return {
        restrict: 'E',
        scope: {
            onSuccessfulUpload: '&',
            propertyName: '@'
        },
        templateUrl: 'shared/public/modules/shared-components/views/bsg-file-upload.shared-components.directive.view.html',
        controller: ["$scope", "$http", "Upload", function($scope, $http, Upload){
            $scope.onFileSelect = function(files) {
                if(!$scope.onSuccessfulUpload){
                    console.error('Cannot upload file. onSuccessfulUpload handler missing');
                    return;
                }
                if (files && files.length > 0) {
                    var filename = files[0].name;
                    var type = files[0].type;
                    var query = {
                        filename: filename,
                        type : type
                    };
                    $http.post('/get-s3-upload-url', query)
                        .success(function(result) {

                            Upload.upload({
                                url: result.url, //s3Url
                                transformRequest: function(data, headersGetter) {
                                    var headers = headersGetter();
                                    delete headers.Authorization;
                                    return data;
                                },
                                fields: result.fields, //credentials
                                method: 'POST',
                                file: files[0]
                            }).progress(function(evt) {
                                console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
                            }).success(function(data, status, headers, config) {
                                // file is uploaded successfully
                                console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
                                $scope.onSuccessfulUpload()($scope.propertyName, filename, result.fields.key);
                            }).error(function(err) {
                                console.error('Error occured while uploading the file', err);
                            });
                        })
                        .error(function(data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            console.error('Error occured during the metadata setup before uploading the file');
                        });
                }
            };
        }]
    };
});
'use strict';

angular.module('shared-components').directive('bsgImageViewer', ["$http", function ($http) {

    return {
        restrict: 'E',
        scope: {
            fileKey: '@',
            fileName: '@',
            width: '@'
        },
        templateUrl: 'shared/public/modules/shared-components/views/bsg-image-viewer.shared-components.directive.view.html',

        link: function(scope, element, attrs){
        	scope.$watch('fileKey', function(val){
        		if(!val) return;
	        	$http.get('/get-signed-url-for-image',{
	        		params: {fileKey: scope.fileKey, width: scope.width}
	        	}).success(function(result){
	        		scope.url = scope.width && result.resizedUrl? result.resizedUrl : result.url;
                    scope.fullSizeUrl = result.url;
	            })
	            .error(function(error) {
	                console.error('Error occured during the metadata setup for viewing the image file', error);
	            });
	        });
        }
    };
}]);
'use strict';

angular.module('shared-components').directive('bsgSelectMultipleById', ["$injector", function($injector){
	return {
		restrict: 'E',
		templateUrl: 'shared/public/modules/shared-components/views/bsg-select-multiple-by-id.directive.view.html',
		scope: {
			title: '@',
			serviceName: '@',
			displayProperties: '@',
			allowAdd: '@',
			onSelect: '&',
			onUnselect: '&',
			currentSelection: '='
		},
		controller: ["$scope", function($scope){

			$scope.addToList = function(newObject) {
				$scope.list.unshift(newObject);
			};

			$scope.onChangeCheckStatus = function(id){
				var checkedState = $scope.checkedState[id];

				if(checkedState && $scope.onSelect){
					$scope.onSelect()(id);
				} else if(!checkedState && $scope.onUnselect){
					$scope.onUnselect()(id);
				}
			};
		}],
		link: function(scope){

			if(!scope.serviceName) {
				scope.selectMultipleByNameError = 'Unable to initialize bsgSelectMultipleByName. Cannot identify the service to call.';
				return;	
			}

			scope.serviceHandle = $injector.get(scope.serviceName);

			if(!scope.serviceHandle) {
				scope.selectMultipleByNameError = 'Unable to initialize bsgSelectMultipleByName. Cannot identify the service to call.';
				return;					
			}
			scope.checkedState = {};
			scope.list = scope.serviceHandle.query();

			if(scope.displayProperties && scope.displayProperties.length){
				scope.displayPropertyArray = scope.displayProperties.split(',');				
			}

			//the below code executes on first time load to update the status of the prior selections
			scope.$watch('currentSelection.items', function(selectedItemIds){
				if(selectedItemIds && selectedItemIds.length){
					selectedItemIds.forEach(function(selectedItemId){
						scope.checkedState[selectedItemId] = true;
					});
				}
			});
		}
	};
}]);
'use strict';

angular.module('shared-components').directive('bsgSelectMultipleByName', ["$injector", function($injector){
	return {
		restrict: 'E',
		templateUrl: 'shared/public/modules/shared-components/views/bsg-select-multiple-by-name.directive.view.html',
		scope: {
			title: '@',
			serviceName: '@',
			onSelect: '&',
			onUnselect: '&',
			currentSelection: '='
		},
		controller: ["$scope", function($scope){
			$scope.addToList = function(newObject) {
				$scope.list.unshift(newObject);
			};

			$scope.onChangeCheckStatus = function(name){
				var checkedState = $scope.checkedState[name];

				if(checkedState && $scope.onSelect){
					$scope.onSelect()(name);
				} else if(!checkedState && $scope.onUnselect){
					$scope.onUnselect()(name);
				}
			};
		}],
		link: function(scope){

			if(!scope.serviceName) {
				scope.selectMultipleByNameError = 'Unable to initialize bsgSelectMultipleByName. Cannot identify the service to call.';
				return;	
			}

			scope.serviceHandle = $injector.get(scope.serviceName);

			if(!scope.serviceHandle) {
				scope.selectMultipleByNameError = 'Unable to initialize bsgSelectMultipleByName. Cannot identify the service to call.';
				return;					
			}
			scope.checkedState = {};
			scope.list = scope.serviceHandle.query();

			scope.$watch('currentSelection.items', function(selectedRoles){
				if(selectedRoles && selectedRoles.length){
					selectedRoles.forEach(function(roleName){
						scope.checkedState[roleName] = true;
					})
				}
			});
		}

	};
}]);
'use strict';

angular.module('shared-components').directive('compileDirective', ["$compile", "CoreFunctions", function ($compile, CoreFunctions) {

    return {
        restrict: 'E',

        link: function (scope, element, attrs) {

            function compileDirective(directiveValues){
                if(!directiveValues){
                    return;
                }

                if (!directiveValues.directiveName) {
                    console.error('Cannot compile directive. Directive name is missing');
                    return;
                }

                var directiveAttributes = directiveValues.directiveAttributes;
                if(directiveAttributes && directiveAttributes.length){
                    directiveAttributes.forEach(function(entry){
                        directiveAttributes.push(entry.name + '=' + '"' + entry.value + '"');
                    });
                }
                directiveAttributes = directiveAttributes.join(' ');

                var directiveHtml = CoreFunctions.getFormattedString('<{0} {1}></{0}>', directiveValues.directiveName, directiveAttributes);

                var el = $compile(directiveHtml)(scope);

                element.empty();
                element.append(el);
            }

            compileDirective(scope.directiveValues);
            
            scope.$on('directive-values-changed', function(event, directiveValues){
                compileDirective(directiveValues);
            });
        }
    };
}]);
'use strict';

/*
* http://codepen.io/estrepitos/pen/JAtKr
*/
angular.module('shared-components').directive('sharedComponentsDelete', function(){

	return {
		restrict: 'E',
		scope: {
			onDeleteHandler: '&',
			deleteItem: '='
		},
		replace: true,
		templateUrl: 'shared/public/modules/shared-components/views/shared-components.delete.directive.view.html',
		controller: ["$scope", "$timeout", function($scope, $timeout){

			$scope.onDeleteClick = function($event){
				$scope.clickedOnDeleteButton = true;
				$event.preventDefault();
				$scope.trackingYesOrNo = true;

				//close the dialog if user waits too long to say yes or no
				$timeout(function(){
					if($scope.trackingYesOrNo){
						$scope.trackingYesOrNo = false;
						$scope.clickedOnDeleteButton = false;
					}
				}, 2000);
			};

			$scope.onCancel = function($event){
				$scope.clickedOnDeleteButton = false;
				$event.preventDefault();
				$event.stopPropagation();
				$scope.trackingYesOrNo = false;
			};

			$scope.onConfirm = function($event){
				$scope.loading = true;
				$event.stopPropagation();
				$event.preventDefault();
				$scope.trackingYesOrNo = false;
				if($scope.onDeleteHandler){
					$scope.onDeleteHandler({itemToDelete: $scope.deleteItem});
				}
			};
		}],
		link: function(scope, element, attrs){

			// 	.click(function(){
			// 	if(!$(this).hasClass('selected')){
			// 		$(this).addClass('selected');
			// 		var owner = $(this);
					
			// 		$(this).find('.cancel').unbind('click').bind('click',function(){
			// 			owner.removeClass('selected');
			// 			return false;
			// 		})
					
			// 		$(this).find('.confirm').unbind('click').bind('click',function(){
			// 			$(this).parent().addClass('loading');
			// 			var parent = $(this).parent();
						
			// 			//ajax to delete
						
			// 			setTimeout(function(){ //On success
			// 				parent.addClass('deleted');
			// 				setTimeout(function(){
			// 					owner.fadeOut(600);
								
			// 					//remove item deleted
								
			// 					setTimeout(function(){
			// 						owner.find('.deleted').removeClass('loading').removeClass('deleted');
			// 						owner.removeClass('selected');
			// 						owner.show();
			// 					},1000)	
			// 				},1000)
			// 			},1000)
						
			// 			return false;
			// 		})
			// 	}		
			// 	return false;
			// });
		  
		  
		  // setTimeout(function(){
		  //   $('.delete').addClass('selected');
		  //   setTimeout(function(){
		  //      $('.deleteBox').addClass('loading'); 
		  //   	setTimeout(function(){
		  //       $('.deleteBox').addClass('deleted');
		  //       setTimeout(function(){
		  //         $('.delete').fadeOut(600,function(){
		            
		  //            $('.deleted').removeClass('loading').removeClass('deleted'); 
				// 			$('.delete').removeClass('selected');
		  //           setTimeout(function(){
		  //             $('.delete').show();
		  //           },500)
							
		            
		  //         });
		 
		          
		          
		  //       },500)
		        
		  //     },1000)
		  //   },1000)
		  // },500);    
		}
	};
});
'use strict';

angular.module('shared-components').directive('thumbnailSelector', function () {

    return {
        restrict: 'E',
        scope: {
            availableThumbnails: '=',
            selectedThumbnail: '='
        },
        templateUrl: 'shared/public/modules/shared-components/views/thumbnail-selector.shared-components.directive.view.html',
        controller: ["$scope", function($scope){
            $scope.selectThumbnail = function(thumbnail){
                $scope.selectedThumbnail = thumbnail;
            }
        }]
    };
});
'use strict';

angular.module('shared-components').factory('CoreFunctions', function() {
    return {
        getFormattedString: function(format){
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function(match, number) { 
                return typeof args[number] != 'undefined'
                    ? args[number] 
                    : match
                ;
            });
        },

        getPropertyColumnName: function(propertyLabel){
            if(!propertyLabel) {
                return propertyLabel;
            }

            return propertyLabel.toLowerCase().trim().replace(/ /g, '');
        },

        getPropertyColumnNames: function(propertyLabels){
            if(!propertyLabels || !propertyLabels.length){
                return propertyLabels;
            }

            return propertyLabels
                .split(',')
                .map(function(item){ return this.getPropertyColumnName(item);}.bind(this))
                .join(',');
        }
    };
});
angular.module('shared-item').directive('itemListVisual', function(){

	return {
		restrict: 'E',
		scope: {
			allowAdd: '@',			
			itemIdToGrayOut: '@',
			startAtNodeId: '@',
			itemSelectionHandler: '&'
		},

		controller: ["$scope", "$uibModal", "$window", "$stateParams", function($scope, $uibModal, $window, $stateParams){
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
		}],

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
'use strict';

angular.module('shared-item').directive('selectMultipleProperties', function() {
    return {
        restrict: 'E',

        templateUrl: 'shared/public/modules/shared-item/views/selectmultipleproperties.client.view.html',

        controller: ['$scope', function ($scope) {

            $scope.propertyFlags = {};

            $scope.selectUnselectProperty = function(property){
                if(property.type === 'foreignkeyref' || property.type === 'lookupfromprop'){
                    console.log('Cannot select a property of type ' + property.type);
                    return;
                }
                $scope.propertyFlags[property.name] = !$scope.propertyFlags[property.name];
                console.log($scope.propertyFlags);
                $scope.selectedProperties = getSelectedPropertiesArray().join(', ');
            };

            $scope.ok = function () {

                var selectedProperties = getSelectedPropertiesArray();

                if(selectedProperties.length <= 0){
                  alert('Please select one or more properties');
                  return;
                }

                $scope.$uibModalInstance.close(selectedProperties.join(','));
            };

            $scope.cancel = function () {
                $scope.$uibModalInstance.dismiss('cancel');
            };

            function getSelectedPropertiesArray(){
                var selectedProperties = [];
                for(var propertyFlag in $scope.propertyFlags){
                    if($scope.propertyFlags[propertyFlag]){
                      selectedProperties.push(propertyFlag);
                    }
                }
                return selectedProperties;
            }
        }],

        link: function(scope, element, attrs) {


        }
    };
});
'use strict';

angular.module('shared-item').directive('selectSingleProperty', function() {
    return {
        restrict: 'E',

        templateUrl: 'shared/public/modules/shared-item/views/selectsingleproperty.client.view.html',

        controller: ['$scope', function ($scope) {
            $scope.selectProperty = function(property){
                if(property.type === 'foreignkeyref' || property.type === 'lookupfromprop'){
                    console.log('Cannot select a property of type ' + property.type);
                    return;
                }
                $scope.selectedItem = property;
            };

            $scope.ok = function () {

                var selectedItem = $scope.selectedItem;
                if(!selectedItem || !selectedItem.name){
                  alert('Please select a property');
                  return;
                }

                $scope.$uibModalInstance.close(selectedItem);
            };

            $scope.cancel = function () {
                $scope.$uibModalInstance.dismiss('cancel');
            };
        }],

        link: function(scope, element, attrs) {


        }
    };
});
'use strict';

//Items service used to communicate Items REST endpoints
angular.module('shared-item').factory('Items', ['$resource',
	function($resource) {
		return $resource('items/:itemId', 
		{ 
			itemId: '@_id'
		}, 
		{
			update: {
				method: 'PUT'
			},
			queryForParentId: {
				method: 'GET',
				isArray: true,
				params: { parentId: '@parentId' }
			},
			getAllProperties: {
				url: 'build-get-all-properties',
				method: 'GET',
				isArray: true
			},
			getAllItemsAndProps: {
				url: 'get-all-items-and-props',
				method: 'GET',
				isArray: true
			}
		});
	}
]);
'use strict';

angular.module('shared-item').factory('SelectItemAndProperty', ['$q', '$uibModal',
	function($q, $uibModal) {
		return {

			selectItemAndProperty: function(singleOrMultipleProperties){
				var asyncDeferred = $q.defer();
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'shared/public/modules/shared-item/views/wrapper-selectitem.client.view.html',
					controller: function($scope, $uibModalInstance){
						$scope.$uibModalInstance = $uibModalInstance;
					},
					size: 'lg'
			    });

			    modalInstance.result.then(function (selected) {

			    	if(singleOrMultipleProperties === 'single'){
			    		this.processSingleProperty(selected, asyncDeferred);
			    	} else {
			    		this.processMultipleProperties(selected, asyncDeferred);
			    	}

				}.bind(this), function () {
					asyncDeferred.reject('choose item dialog dismissed');
				});
			    return asyncDeferred.promise;
			},

			processSingleProperty: function(selected, asyncDeferred){
				this.getSingleProperty(selected.item)
					.then(function(property){
						
						var result = {
							referencedFeatureName: selected.item.name,
							referencedPropertyName: property.name,
							refId: property._id,
							refDescription: selected.description + '/' + property.name
						};			      	
						asyncDeferred.resolve(result);
					},function (error) {
						asyncDeferred.reject(error);
					});
			},

			getSingleProperty: function(item){
				var asyncDeferred = $q.defer();
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'shared/public/modules/shared-item/views/wrapper-selectsingleproperty.client.view.html',
					controller: function($scope, $uibModalInstance){
						$scope.$uibModalInstance = $uibModalInstance;
						$scope.item = item;
					},
					size: 'lg'
			    });

			    modalInstance.result.then(function (selected) {
			      asyncDeferred.resolve(selected);
			    }, function () {
			      asyncDeferred.reject('choose single property dialog dismissed');
			    });

			    return asyncDeferred.promise;
			},

			processMultipleProperties: function(selected, asyncDeferred){
				this.getMultipleProperties(selected.item)
					.then(function(properties){
						
						var result = {
							referencedFeatureName: selected.item.name,
							referencedFeatureId: selected.item._id,
							propertyNames: properties,
							refDescription: selected.description
						};			      	
						asyncDeferred.resolve(result);
					},function (error) {
						asyncDeferred.reject(error);
					});
			},

			getMultipleProperties: function(item){
				var asyncDeferred = $q.defer();
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'shared/public/modules/shared-item/views/wrapper-selectmultipleproperties.client.view.html',
					controller: function($scope, $uibModalInstance){
						$scope.$uibModalInstance = $uibModalInstance;
						$scope.item = item;
					},
					size: 'lg'
			    });

			    modalInstance.result.then(function (selected) {
			      asyncDeferred.resolve(selected);
			    }, function () {
			      asyncDeferred.reject('choose multiple properties dialog dismissed');
			    });

			    return asyncDeferred.promise;
			}
		}
	}
]);
'use strict';

//Features service used to communicate Features REST endpoints
angular.module('shared-user').factory('SharedUser', ['$resource',
	function($resource) {
		return $resource('/users', 
		{ 
			
		}, 
		{
			
		});
	}
]);
'use strict';

angular.module('sharedsecurity')

	.directive('bsgUserUnauthorized', function(){
		return {
			restrict: 'E',
			templateUrl: 'shared/public/modules/sharedsecurity/views/bsg-user-unauthorized.directive.view.html',
			scope: {
				unauthorized: '='
			},
		}
	});
'use strict';

angular.module('sharedsecurity').factory('Authorization', ["$q", "GetUserRoles", "Itemroles", "Authentication", function($q, GetUserRoles, Itemroles, Authentication) {
	
	function getAuthorizationType(roleList, accessType){
		var authorizationTypes = [
			'everyone',
			'allloggedinusers',
			'onlycreator',
			'creatorandroles',
			'roles'
		];
		
		if(roleList && roleList.length){
			for(var ctr = 0; ctr < authorizationTypes.length; ctr++){
				var authorizationType = authorizationTypes[ctr];
				if(roleList.indexOf(authorizationType) >= 0){
					return authorizationType;
				}
			}
		}

		return getDefaultAuthorizationType(accessType);
	};


	function getDefaultAuthorizationType(accessType){
		switch(accessType){
			case 'read': 
				return 'everyone';
			case 'create': 
				return 'allloggedinusers';
			case 'edit': 
				return 'creatorandroles';
			case 'delete': 
				return 'creatorandroles';
			case 'manageaccess': 
				return 'creatorandroles';
		}
	};

	return {

		/*
		* Three possible scenarios
		* 1. Resolved with string value hasAccess
		* 2. Resolved with string value hasAccessIfUserCreatedIt
		* 3. Rejected
		*/
		checkAccess: function(featureId, accessType){
			var asyncDeferred = $q.defer();

			//get the roles for the feature id
			Itemroles.query()
				.$promise.then(function(allRoles){
					
					var results = allRoles
						.filter(function(item){ return item.parentId === featureId && item.accesstype === accessType;})
						.map(function(item){
							return item.role;
						});

					var authorizationType = getAuthorizationType(results, accessType);

					//if everyone, return true
					if(authorizationType === 'everyone'){
						asyncDeferred.resolve('hasAccess');
						return;
					}

					//If the above does not apply, then the user has to be logged in
					if(!Authentication || !Authentication.user){
						asyncDeferred.reject('User not authenticated');
						return;
					}

					//if allloggedinusers, return true if user is authenticated
					if(authorizationType === 'allloggedinusers'){
						asyncDeferred.resolve('hasAccess');
						return;
					}

					if(authorizationType === 'onlycreator'){
						asyncDeferred.resolve('hasAccessIfUserCreatedIt');
						return;
					}

					//if creatorandroles or roles
					if(authorizationType === 'creatorandroles' || authorizationType === 'roles'){
						//get the user role list
						GetUserRoles.get().$promise
							.then(function(userRoles){
								
								//check if any feature role matches the user role
								var foundMatchingRole = false;
								for(var ctr = 0; ctr < results.length; ctr++){
									var roleToCheck = results[ctr];
									foundMatchingRole = userRoles[roleToCheck];
									if(foundMatchingRole){
										asyncDeferred.resolve('hasAccess');
										break;
									}
								}
								
								//match not found
								if(!foundMatchingRole){
									//if roles, return false
									if(authorizationType === 'roles'){
										asyncDeferred.reject('User does not have access');
									} else {
										//creatorandroles
										asyncDeferred.resolve('hasAccessIfUserCreatedIt');
										return;
									}
								}
							})
							.catch(function(err){
								asyncDeferred.reject(err);
							});

					} else {
						asyncDeferred.reject('The list of roles for this feature is invalid.');
					}
				})
				.catch(function(err){
					asyncDeferred.reject(err);
				});

			return asyncDeferred.promise;
		}
	};
}]);
'use strict';

angular.module('sharedsecurity').factory('GetUserRoles', ['$resource',
	function($resource) {
		return $resource('get-user-roles',
			{},
	        {
	        	'get': { 
	        		method:'GET', 
	        		cache: true //cache the roles
	        	}
	        });
	}
]);
'use strict';

//Setting up route
angular.module('user-group-roles').config(['$stateProvider',
	function($stateProvider) {
		// User group roles state routing
		$stateProvider.
		state('listUserGroupRoles', {
			url: '/user-groups/:userGroupId/user-group-roles',
			templateUrl: 'shared/public/modules/user-group-roles/views/list-user-group-roles.client.view.html'
		}).
		state('createUserGroupRole', {
			url: '/user-groups/:userGroupId/user-group-roles/create',
			templateUrl: 'shared/public/modules/user-group-roles/views/create-user-group-role.client.view.html'
		}).
		state('viewUserGroupRole', {
			url: '/user-groups/:userGroupId/user-group-roles/:userGroupRoleId',
			templateUrl: 'shared/public/modules/user-group-roles/views/view-user-group-role.client.view.html'
		}).
		state('editUserGroupRole', {
			url: '/user-groups/:userGroupId/user-group-roles/:userGroupRoleId/edit',
			templateUrl: 'shared/public/modules/user-group-roles/views/edit-user-group-role.client.view.html'
		});
	}
]);
'use strict';

// User group roles controller
angular.module('user-group-roles').controller('UserGroupRolesController', ['$scope', '$stateParams', '$location', 'Authentication', 'UserGroupRoles',
	function($scope, $stateParams, $location, Authentication, UserGroupRoles) {
		$scope.authentication = Authentication;
		$scope.parentId = $stateParams.userGroupId;
		$scope.parentRouteUrl = '/user-groups/' + $stateParams.userGroupId + '';

		// Create new User group role
		$scope.create = function() {
			// Create new User group role object
			var userGroupRole = new UserGroupRoles ({
					parentId: $scope.parentId,
				
					roleId: this.roleId,
				
			});

			// Redirect after save
			userGroupRole.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/user-group-roles/' + response._id);

				// Clear form fields
				
				$scope.roleId = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing User group role
		$scope.remove = function(userGroupRole) {
			if ( userGroupRole ) { 
				userGroupRole.$remove();

				for (var i in $scope.userGroupRoles) {
					if ($scope.userGroupRoles [i] === userGroupRole) {
						$scope.userGroupRoles.splice(i, 1);
					}
				}
			} else {
				$scope.userGroupRole.$remove(function() {
					$location.path($scope.parentRouteUrl + '/user-group-roles');
				});
			}
		};

		// Update existing User group role
		$scope.update = function() {
			var userGroupRole = $scope.userGroupRole;

			userGroupRole.$update(function() {
				$location.path($scope.parentRouteUrl + '/user-group-roles/' + userGroupRole._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of User group roles
		$scope.find = function() {
			$scope.userGroupRoles = UserGroupRoles.queryForParentId({parentId: $scope.parentId});
		};

		// Find existing User group role
		$scope.findOne = function() {
			$scope.userGroupRole = UserGroupRoles.get({ 
				userGroupRoleId: $stateParams.userGroupRoleId
			});
		};
	}
]);
'use strict';

//User group roles service used to communicate User group roles REST endpoints
angular.module('user-group-roles').factory('UserGroupRoles', ['$resource',
	function($resource) {
		return $resource('user-group-roles/:userGroupRoleId', 
		{ 
			userGroupRoleId: '@_id'
		}, 
		{
			update: {
				method: 'PUT'
			},
			queryForParentId: {
				method: 'GET',
				isArray: true,
				params: { parentId: '@parentId' }
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('user-group-users').config(['$stateProvider',
	function($stateProvider) {
		// User group users state routing
		$stateProvider.
		state('listUserGroupUsers', {
			url: '/user-groups/:userGroupId/user-group-users',
			templateUrl: 'shared/public/modules/user-group-users/views/list-user-group-users.client.view.html'
		}).
		state('createUserGroupUser', {
			url: '/user-groups/:userGroupId/user-group-users/create',
			templateUrl: 'shared/public/modules/user-group-users/views/create-user-group-user.client.view.html'
		}).
		state('viewUserGroupUser', {
			url: '/user-groups/:userGroupId/user-group-users/:userGroupUserId',
			templateUrl: 'shared/public/modules/user-group-users/views/view-user-group-user.client.view.html'
		}).
		state('editUserGroupUser', {
			url: '/user-groups/:userGroupId/user-group-users/:userGroupUserId/edit',
			templateUrl: 'shared/public/modules/user-group-users/views/edit-user-group-user.client.view.html'
		});
	}
]);
'use strict';

// User group users controller
angular.module('user-group-users').controller('UserGroupUsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'UserGroupUsers',
	function($scope, $stateParams, $location, Authentication, UserGroupUsers) {
		$scope.authentication = Authentication;
		$scope.parentId = $stateParams.userGroupId;
		$scope.parentRouteUrl = '/user-groups/' + $stateParams.userGroupId + '';

		// Create new User group user
		$scope.create = function() {
			// Create new User group user object
			var userGroupUser = new UserGroupUsers ({
					parentId: $scope.parentId,
				
					userId: this.userId,
				
			});

			// Redirect after save
			userGroupUser.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/user-group-users/' + response._id);

				// Clear form fields
				
				$scope.userId = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing User group user
		$scope.remove = function(userGroupUser) {
			if ( userGroupUser ) { 
				userGroupUser.$remove();

				for (var i in $scope.userGroupUsers) {
					if ($scope.userGroupUsers [i] === userGroupUser) {
						$scope.userGroupUsers.splice(i, 1);
					}
				}
			} else {
				$scope.userGroupUser.$remove(function() {
					$location.path($scope.parentRouteUrl + '/user-group-users');
				});
			}
		};

		// Update existing User group user
		$scope.update = function() {
			var userGroupUser = $scope.userGroupUser;

			userGroupUser.$update(function() {
				$location.path($scope.parentRouteUrl + '/user-group-users/' + userGroupUser._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of User group users
		$scope.find = function() {
			$scope.userGroupUsers = UserGroupUsers.queryForParentId({parentId: $scope.parentId});
		};

		// Find existing User group user
		$scope.findOne = function() {
			$scope.userGroupUser = UserGroupUsers.get({ 
				userGroupUserId: $stateParams.userGroupUserId
			});
		};
	}
]);
'use strict';

//User group users service used to communicate User group users REST endpoints
angular.module('user-group-users').factory('UserGroupUsers', ['$resource',
	function($resource) {
		return $resource('user-group-users/:userGroupUserId', 
		{ 
			userGroupUserId: '@_id'
		}, 
		{
			update: {
				method: 'PUT'
			},
			queryForParentId: {
				method: 'GET',
				isArray: true,
				params: { parentId: '@parentId' }
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('user-groups').config(['$stateProvider',
	function($stateProvider) {
		// User groups state routing
		$stateProvider.
		state('listUserGroups', {
			url: '/user-groups',
			templateUrl: 'shared/public/modules/user-groups/views/list-user-groups.client.view.html'
		}).
		state('createUserGroup', {
			url: '/user-groups/create',
			templateUrl: 'shared/public/modules/user-groups/views/create-user-group.client.view.html'
		}).
		state('viewUserGroup', {
			url: '/user-groups/:userGroupId',
			templateUrl: 'shared/public/modules/user-groups/views/view-user-group.client.view.html'
		}).
		state('editUserGroup', {
			url: '/user-groups/:userGroupId/edit',
			templateUrl: 'shared/public/modules/user-groups/views/edit-user-group.client.view.html'
		});
	}
]);
'use strict';

// User groups controller
angular.module('user-groups').controller('UserGroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'UserGroups', 'UserGroupUsers', 'UserGroupRoles',
	function($scope, $stateParams, $location, Authentication, UserGroups, UserGroupUsers, UserGroupRoles) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		$scope.userGroupUsers = { items: ''};
		$scope.userGroupRoles = { items: ''};

		// Create new User group
		$scope.create = function() {
			// Create new User group object
			var userGroup = new UserGroups ({
					
				
					name: this.name,
				
			});

			// Redirect after save
			userGroup.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/user-groups/' + response._id);

				// Clear form fields
				
				$scope.name = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing User group
		$scope.remove = function(userGroup) {
			if ( userGroup ) { 
				userGroup.$remove().then(function(response){

				for (var i in $scope.userGroups) {
					if ($scope.userGroups [i] === userGroup) {
						$scope.userGroups.splice(i, 1);
					}
				}
			})
				.catch(function(error){
					$scope.error = error.data.message;
					console.log('Could not delete user group ', error.data.message);
				});
			} else {
				$scope.userGroup.$remove(function() {
					$location.path($scope.parentRouteUrl + '/user-groups');
				},function(error){
					$scope.error = error.data.message;
					console.log('Could not delete user group ', error.data.message);
				});
			}
		};

		// Update existing User group
		$scope.update = function() {
			var userGroup = $scope.userGroup;

			userGroup.$update(function() {
				$location.path($scope.parentRouteUrl + '/user-groups/' + userGroup._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of User groups
		$scope.find = function() {
			$scope.userGroups = UserGroups.query();
		};

		$scope.addToList = function(newObject) {
			$scope.userGroups.unshift(newObject);
		};

		// Find existing User group
		$scope.findOne = function() {
			$scope.userGroup = UserGroups.get({ 
				userGroupId: $stateParams.userGroupId
			});

			UserGroupUsers.queryForParentId({parentId: $stateParams.userGroupId}).$promise.then(function(results){
				$scope.userGroupUsers.items = results.map(function(item){ return item.userId._id;});
				$scope.userGroupUsers.objectList = results; //this list can be used to easily delete this entry
			})
			.catch(function(errorResponse){
				$scope.error = errorResponse.data.message
				console.error('Could not get user group users ', $scope.error);
			});

			UserGroupRoles.queryForParentId({parentId: $stateParams.userGroupId}).$promise.then(function(results){
				$scope.userGroupRoles.items = results.map(function(item){ return item.roleId._id;});
				$scope.userGroupRoles.objectList = results; //this list can be used to easily delete this entry
			})
			.catch(function(errorResponse){
				$scope.error = errorResponse.data.message
				console.error('Could not get user group users ', $scope.error);
			});
		};

		// Create new User group user
		$scope.addUser = function(userId) {
			
			// Create new User group user object
			var userGroupUser = new UserGroupUsers ({
				parentId: $scope.userGroup._id,
				userId: userId,
			});

			userGroupUser.$save(function(response) {
				$scope.userGroupUsers.objectList.push(response);
				console.log('User successfully added');				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;;
				console.error('Could not add UserGroupUser ', $scope.error);
			});
		};

		// Remove existing User group user
		$scope.removeUser = function(userId) {
			
			var matchedEntries = $scope.userGroupUsers.objectList.filter(function(item){
				return item.userId._id === userId || item.userId === userId;
			});

			if(matchedEntries && matchedEntries.length){
				var matchedEntry = matchedEntries[0];
				matchedEntry.$remove();
				$scope.userGroupUsers.objectList.splice($scope.userGroupUsers.objectList.indexOf(matchedEntry), 1);
			} else {
				$scope.error = 'UserGroupUser entry could not found';;
				console.error('Could not remove UserGroupUser ', $scope.error);
			}
		};

		// Create new User group role
		$scope.addRole = function(roleId) {
			
			// Create new User group user object
			var userGroupRole = new UserGroupRoles ({
				parentId: $scope.userGroup._id,
				roleId: roleId,
			});

			userGroupRole.$save(function(response) {
				$scope.userGroupRoles.objectList.push(response);
				console.log('Role successfully added');				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;;
				console.error('Could not add UserGroupRole ', $scope.error);
			});
		};

		// Remove existing User group role
		$scope.removeRole = function(roleId) {
			
			var matchedEntries = $scope.userGroupRoles.objectList.filter(function(item){
				return item.roleId._id === roleId || item.roleId === roleId;
			});

			if(matchedEntries && matchedEntries.length){
				var matchedEntry = matchedEntries[0];
				matchedEntry.$remove();
				$scope.userGroupRoles.objectList.splice($scope.userGroupRoles.objectList.indexOf(matchedEntry), 1);
			} else {
				$scope.error = 'UserGroupRole entry could not found';;
				console.error('Could not remove UserGroupRole ', $scope.error);
			}
		};
	}
]);
'use strict';

//User groups service used to communicate User groups REST endpoints
angular.module('user-groups').factory('UserGroups', ['$resource',
	function($resource) {
		return $resource('user-groups/:userGroupId', 
		{ 
			userGroupId: '@_id'
		}, 
		{
			update: {
				method: 'PUT'
			}
		});
	}
]);
/*
 * vk-typeahead
 * 

 * Version: 1.0.0
 * License: MIT
 */

angular.module("vk", ["vk.tpls", "vk.typeahead"]);
angular.module("vk.tpls", ["template/typeahead/typeahead-match.html","template/typeahead/typeahead-popup.html"]);

angular.module('vk.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$vkPosition', ['$document', '$window', function($document, $window) {
    function getStyle(el, cssprop) {
      if (el.currentStyle) { //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, 'position') || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function(element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    };

    return {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function(element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function(element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
        };
      },

      /**
       * Provides coordinates for the targetEl in relation to hostEl
       */
      positionElements: function(hostEl, targetEl, positionStr, appendToBody) {
        var positionStrParts = positionStr.split('-');
        var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

        var hostElPos,
          targetElWidth,
          targetElHeight,
          targetElPos;

        hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

        targetElWidth = targetEl.prop('offsetWidth');
        targetElHeight = targetEl.prop('offsetHeight');

        var shiftWidth = {
          center: function() {
            return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
          },
          left: function() {
            return hostElPos.left;
          },
          right: function() {
            return hostElPos.left + hostElPos.width;
          }
        };

        var shiftHeight = {
          center: function() {
            return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
          },
          top: function() {
            return hostElPos.top;
          },
          bottom: function() {
            return hostElPos.top + hostElPos.height;
          }
        };

        switch (pos0) {
          case 'right':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: shiftWidth[pos0]()
            };
            break;
          case 'left':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: hostElPos.left - targetElWidth
            };
            break;
          case 'bottom':
            targetElPos = {
              top: shiftHeight[pos0](),
              left: shiftWidth[pos1]()
            };
            break;
          default:
            targetElPos = {
              top: hostElPos.top - targetElHeight,
              left: shiftWidth[pos1]()
            };
            break;
        }

        return targetElPos;
      }
    };
  }]);

/* Deprecated position below */

angular.module('vk.position')

.value('$positionSuppressWarning', false)

.service('$position', ['$log', '$positionSuppressWarning', '$vkPosition', function($log, $positionSuppressWarning, $vkPosition) {
  if (!$positionSuppressWarning) {
    $log.warn('$position is now deprecated. Use $vkPosition instead.');
  }

  angular.extend(this, $vkPosition);
}]);

angular.module('vk.typeahead', ['vk.position'])

/**
 * A helper service that can parse typeahead's syntax (string provided by users)
 * Extracted to a separate service for ease of unit testing
 */
  .factory('vkTypeaheadParser', ['$parse', function($parse) {
    //                      00000111000000000000022200000000000000003333333333333330000000000044000
    var TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
    return {
      parse: function(input) {
        var match = input.match(TYPEAHEAD_REGEXP);
        if (!match) {
          throw new Error(
            'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
              ' but got "' + input + '".');
        }

        return {
          itemName: match[3],
          source: $parse(match[4]),
          viewMapper: $parse(match[2] || match[1]),
          modelMapper: $parse(match[1])
        };
      }
    };
  }])

  .directive('vkTypeahead', ['$compile', '$parse', '$q', '$timeout', '$document', '$window', '$rootScope', '$vkPosition', 'vkTypeaheadParser',
    function($compile, $parse, $q, $timeout, $document, $window, $rootScope, $position, typeaheadParser) {
    var HOT_KEYS = [9, 13, 27, 38, 40];
    var eventDebounceTime = 200;

    return {
      require: ['ngModel', '^?ngModelOptions'],
      link: function(originalScope, element, attrs, ctrls) {
        var modelCtrl = ctrls[0];
        var ngModelOptions = ctrls[1];
        //SUPPORTED ATTRIBUTES (OPTIONS)

        //minimal no of characters that needs to be entered before typeahead kicks-in
        var minLength = originalScope.$eval(attrs.typeaheadMinLength);
        if (!minLength && minLength !== 0) {
          minLength = 1;
        }

        //minimal wait time after last character typed before typeahead kicks-in
        var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

        //should it restrict model values to the ones selected from the popup only?
        var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

        //binding to a variable that indicates if matches are being retrieved asynchronously
        var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

        //a callback executed when a match is selected
        var onSelectCallback = $parse(attrs.typeaheadOnSelect);

        //should it select highlighted popup value when losing focus?
        var isSelectOnBlur = angular.isDefined(attrs.typeaheadSelectOnBlur) ? originalScope.$eval(attrs.typeaheadSelectOnBlur) : false;

        //binding to a variable that indicates if there were no results after the query is completed
        var isNoResultsSetter = $parse(attrs.typeaheadNoResults).assign || angular.noop;

        var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

        var appendToBody =  attrs.typeaheadAppendToBody ? originalScope.$eval(attrs.typeaheadAppendToBody) : false;

        var appendToElementId =  attrs.typeaheadAppendToElementId || false;

        var focusFirst = originalScope.$eval(attrs.typeaheadFocusFirst) !== false;

        //If input matches an item of the list exactly, select it automatically
        var selectOnExact = attrs.typeaheadSelectOnExact ? originalScope.$eval(attrs.typeaheadSelectOnExact) : false;

        //INTERNAL VARIABLES

        //model setter executed upon match selection
        var parsedModel = $parse(attrs.ngModel);
        var invokeModelSetter = $parse(attrs.ngModel + '($$$p)');
        var $setModelValue = function(scope, newValue) {
          if (angular.isFunction(parsedModel(originalScope)) &&
            ngModelOptions && ngModelOptions.$options && ngModelOptions.$options.getterSetter) {
            return invokeModelSetter(scope, {$$$p: newValue});
          } else {
            return parsedModel.assign(scope, newValue);
          }
        };

        //expressions used by typeahead
        var parserResult = typeaheadParser.parse(attrs.vkTypeahead);

        var hasFocus;

        //Used to avoid bug in iOS webview where iOS keyboard does not fire
        //mousedown & mouseup events
        //Issue #3699
        var selected;

        //create a child scope for the typeahead directive so we are not polluting original scope
        //with typeahead-specific data (matches, query etc.)
        var scope = originalScope.$new();
        var offDestroy = originalScope.$on('$destroy', function() {
			    scope.$destroy();
        });
        scope.$on('$destroy', offDestroy);

        // WAI-ARIA
        var popupId = 'typeahead-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
        element.attr({
          'aria-autocomplete': 'list',
          'aria-expanded': false,
          'aria-owns': popupId
        });

        //pop-up element used to display matches
        var popUpEl = angular.element('<div vk-typeahead-popup></div>');
        popUpEl.attr({
          id: popupId,
          matches: 'matches',
          active: 'activeIdx',
          select: 'select(activeIdx)',
          'move-in-progress': 'moveInProgress',
          query: 'query',
          position: 'position'
        });
        //custom item template
        if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
          popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);

        }

        if (angular.isDefined(attrs.typeaheadPopupTemplateUrl)) {
          popUpEl.attr('popup-template-url', attrs.typeaheadPopupTemplateUrl);
        }

        if (angular.isDefined(attrs.matchPropertyName)) {
          popUpEl.attr('match-property-name', attrs.matchPropertyName);
        }

        var resetMatches = function() {
          scope.matches = [];
          scope.activeIdx = -1;
          element.attr('aria-expanded', false);
        };

        var getMatchId = function(index) {
          return popupId + '-option-' + index;
        };

        // Indicate that the specified match is the active (pre-selected) item in the list owned by this typeahead.
        // This attribute is added or removed automatically when the `activeIdx` changes.
        scope.$watch('activeIdx', function(index) {
          if (index < 0) {
            element.removeAttr('aria-activedescendant');
          } else {
            element.attr('aria-activedescendant', getMatchId(index));
          }
        });

        var inputIsExactMatch = function(inputValue, index) {
          if (scope.matches.length > index && inputValue) {
            return inputValue.toUpperCase() === scope.matches[index].label.toUpperCase();
          }

          return false;
        };

        var getMatchesAsync = function(inputValue) {
          var locals = {$viewValue: inputValue};
          isLoadingSetter(originalScope, true);
          isNoResultsSetter(originalScope, false);
          $q.when(parserResult.source(originalScope, locals)).then(function(matches) {
            //it might happen that several async queries were in progress if a user were typing fast
            //but we are interested only in responses that correspond to the current view value
            var onCurrentRequest = (inputValue === modelCtrl.$viewValue);
            if (onCurrentRequest && hasFocus) {
              if (matches && matches.length > 0) {
                scope.activeIdx = focusFirst ? 0 : -1;
                isNoResultsSetter(originalScope, false);
                scope.matches.length = 0;

                //transform labels
                for (var i = 0; i < matches.length; i++) {
                  locals[parserResult.itemName] = matches[i];
                  scope.matches.push({
                    id: getMatchId(i),
                    label: parserResult.viewMapper(scope, locals),
                    model: matches[i]
                  });
                }

                scope.query = inputValue;
                //position pop-up with matches - we need to re-calculate its position each time we are opening a window
                //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
                //due to other elements being rendered
                recalculatePosition();

                element.attr('aria-expanded', true);

                //Select the single remaining option if user input matches
                if (selectOnExact && scope.matches.length === 1 && inputIsExactMatch(inputValue, 0)) {
                  scope.select(0);
                }
              } else {
                resetMatches();
                isNoResultsSetter(originalScope, true);
              }
            }
            if (onCurrentRequest) {
              isLoadingSetter(originalScope, false);
            }
          }, function() {
            resetMatches();
            isLoadingSetter(originalScope, false);
            isNoResultsSetter(originalScope, true);
          });
        };

        // bind events only if appendToBody params exist - performance feature
        if (appendToBody) {
          angular.element($window).bind('resize', fireRecalculating);
          $document.find('body').bind('scroll', fireRecalculating);
        }

        // Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
        var timeoutEventPromise;

        // Default progress type
        scope.moveInProgress = false;

        function fireRecalculating() {
          if (!scope.moveInProgress) {
            scope.moveInProgress = true;
            scope.$digest();
          }

          // Cancel previous timeout
          if (timeoutEventPromise) {
            $timeout.cancel(timeoutEventPromise);
          }

          // Debounced executing recalculate after events fired
          timeoutEventPromise = $timeout(function() {
            // if popup is visible
            if (scope.matches.length) {
              recalculatePosition();
            }

            scope.moveInProgress = false;
          }, eventDebounceTime);
        }

        // recalculate actual position and set new values to scope
        // after digest loop is popup in right position
        function recalculatePosition() {
          scope.position = appendToBody ? $position.offset(element) : $position.position(element);
          scope.position.top += element.prop('offsetHeight');
        }

        resetMatches();

        //we need to propagate user's query so we can higlight matches
        scope.query = undefined;

        //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
        var timeoutPromise;

        var scheduleSearchWithTimeout = function(inputValue) {
          timeoutPromise = $timeout(function() {
            getMatchesAsync(inputValue);
          }, waitTime);
        };

        var cancelPreviousTimeout = function() {
          if (timeoutPromise) {
            $timeout.cancel(timeoutPromise);
          }
        };

        //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
        //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
        modelCtrl.$parsers.unshift(function(inputValue) {
          hasFocus = true;

          if (minLength === 0 || inputValue && inputValue.length >= minLength) {
            if (waitTime > 0) {
              cancelPreviousTimeout();
              scheduleSearchWithTimeout(inputValue);
            } else {
              getMatchesAsync(inputValue);
            }
          } else {
            isLoadingSetter(originalScope, false);
            cancelPreviousTimeout();
            resetMatches();
          }

          if (isEditable) {
            return inputValue;
          } else {
            if (!inputValue) {
              // Reset in case user had typed something previously.
              modelCtrl.$setValidity('editable', true);
              return null;
            } else {
              modelCtrl.$setValidity('editable', false);
              return undefined;
            }
          }
        });

        modelCtrl.$formatters.push(function(modelValue) {
          var candidateViewValue, emptyViewValue;
          var locals = {};

          // The validity may be set to false via $parsers (see above) if
          // the model is restricted to selected values. If the model
          // is set manually it is considered to be valid.
          if (!isEditable) {
            modelCtrl.$setValidity('editable', true);
          }

          if (inputFormatter) {
            locals.$model = modelValue;
            return inputFormatter(originalScope, locals);
          } else {
            //it might happen that we don't have enough info to properly render input value
            //we need to check for this situation and simply return model value if we can't apply custom formatting
            locals[parserResult.itemName] = modelValue;
            candidateViewValue = parserResult.viewMapper(originalScope, locals);
            locals[parserResult.itemName] = undefined;
            emptyViewValue = parserResult.viewMapper(originalScope, locals);

            return candidateViewValue !== emptyViewValue ? candidateViewValue : modelValue;
          }
        });

        scope.select = function(activeIdx) {
          //called from within the $digest() cycle
          var locals = {};
          var model, item;

          selected = true;
          locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
          model = parserResult.modelMapper(originalScope, locals);
          $setModelValue(originalScope, model);
          modelCtrl.$setValidity('editable', true);
          modelCtrl.$setValidity('parse', true);

          onSelectCallback(originalScope, {
            $item: item,
            $model: model,
            $label: parserResult.viewMapper(originalScope, locals)
          });

          resetMatches();

          //return focus to the input element if a match was selected via a mouse click event
          // use timeout to avoid $rootScope:inprog error
          if (scope.$eval(attrs.typeaheadFocusOnSelect) !== false) {
            $timeout(function() { element[0].focus(); }, 0, false);
          }
        };

        //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
        element.bind('keydown', function(evt) {
          //typeahead is open and an "interesting" key was pressed
          if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
            return;
          }

          // if there's nothing selected (i.e. focusFirst) and enter or tab is hit, clear the results
          if (scope.activeIdx === -1 && (evt.which === 9 || evt.which === 13)) {
            resetMatches();
            scope.$digest();
            return;
          }

          evt.preventDefault();

          if (evt.which === 40) {
            scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
            scope.$digest();
          } else if (evt.which === 38) {
            scope.activeIdx = (scope.activeIdx > 0 ? scope.activeIdx : scope.matches.length) - 1;
            scope.$digest();
          } else if (evt.which === 13 || evt.which === 9) {
            scope.$apply(function () {
              scope.select(scope.activeIdx);
            });
          } else if (evt.which === 27) {
            evt.stopPropagation();

            resetMatches();
            scope.$digest();
          }
        });

        element.bind('blur', function() {
          if (isSelectOnBlur && scope.matches.length && scope.activeIdx !== -1 && !selected) {
            selected = true;
            scope.$apply(function() {
              scope.select(scope.activeIdx);
            });
          }
          hasFocus = false;
          selected = false;
        });

        // Keep reference to click handler to unbind it.
        var dismissClickHandler = function(evt) {
          // Issue #3973
          // Firefox treats right click as a click on document
          if (element[0] !== evt.target && evt.which !== 3 && scope.matches.length !== 0) {
            resetMatches();
            if (!$rootScope.$$phase) {
              scope.$digest();
            }
          }
        };

        $document.bind('click', dismissClickHandler);

        originalScope.$on('$destroy', function() {
          $document.unbind('click', dismissClickHandler);
          if (appendToBody || appendToElementId) {
            $popup.remove();
          }
          // Prevent jQuery cache memory leak
          popUpEl.remove();
        });

        var $popup = $compile(popUpEl)(scope);

        if (appendToBody) {
          $document.find('body').append($popup);
        } else if (appendToElementId !== false) {
          angular.element($document[0].getElementById(appendToElementId)).append($popup);
        } else {
          element.after($popup);
        }
      }
    };

  }])

  .directive('vkTypeaheadPopup', function() {
    return {
      scope: {
        matches: '=',
        query: '=',
        active: '=',
        position: '&',
        moveInProgress: '=',
        select: '&'
      },
      replace: true,
      templateUrl: function(element, attrs) {
        return attrs.popupTemplateUrl || 'template/typeahead/typeahead-popup.html';
      },
      link: function(scope, element, attrs) {
        scope.templateUrl = attrs.templateUrl;
        scope.matchPropertyName = attrs.matchPropertyName;

        scope.isOpen = function() {
          return scope.matches.length > 0;
        };

        scope.isActive = function(matchIdx) {
          return scope.active == matchIdx;
        };

        scope.selectActive = function(matchIdx) {
          scope.active = matchIdx;
        };

        scope.selectMatch = function(activeIdx) {
          scope.select({activeIdx:activeIdx});
        };
      }
    };
  })

  .directive('vkTypeaheadMatch', ['$templateRequest', '$compile', '$parse', function($templateRequest, $compile, $parse) {
    return {
      scope: {
        index: '=',
        match: '=',
        query: '='
      },
      link:function(scope, element, attrs) {
        var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
        scope.matchPropertyName = attrs.matchPropertyName;
        $templateRequest(tplUrl).then(function(tplContent) {
          $compile(tplContent.trim())(scope, function(clonedElement) {
            element.replaceWith(clonedElement);
          });
        });
      }
    };
  }])

  .filter('vkTypeaheadHighlight', ['$sce', '$injector', '$log', function($sce, $injector, $log) {
    var isSanitizePresent;
    isSanitizePresent = $injector.has('$sanitize');

    function escapeRegexp(queryToEscape) {
      // Regex: capture the whole query string and replace it with the string that will be used to match
      // the results, for example if the capture is "a" the result will be \a
      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    function containsHtml(matchItem) {
      return /<.*>/g.test(matchItem);
    }

    return function(matchItem, query) {
      if (!isSanitizePresent && containsHtml(matchItem)) {
        $log.warn('Unsafe use of typeahead please use ngSanitize'); // Warn the user about the danger
      }
      matchItem = query? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem; // Replaces the capture string with a the same string inside of a "strong" tag
      if (!isSanitizePresent) {
        matchItem = $sce.trustAsHtml(matchItem); // If $sanitize is not present we pack the string in a $sce object for the ng-bind-html directive
      }
      return matchItem;
    };
  }]);

angular.module("template/typeahead/typeahead-match.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/typeahead/typeahead-match.html",
    "<a href tabindex=\"-1\" ng-bind-html=\"match.label | vkTypeaheadHighlight:query\" match-property-name=\"matchPropertyName\"></a>\n" +
    "");
}]);

angular.module("template/typeahead/typeahead-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/typeahead/typeahead-popup.html",
    "<div  class=\"list-group dropdown-menu\" ng-show=\"isOpen() && !moveInProgress\" ng-style=\"{top: position().top+'px', left: position().left+'px'}\" style=\"width: 100%; display: block;\" role=\"listbox\" aria-hidden=\"{{!isOpen()}}\">\n" +
    "    <a class=\"list-group-item\" ng-repeat=\"match in matches track by $index\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\" role=\"option\" id=\"{{::match.id}}\">\n" +
    "        <div vk-typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\" match-property-name=\"{{matchPropertyName}}\"></div>\n" +
    "    </a>\n" +
    "</div>\n" +
    "");
}]);
!angular.$$csp() && angular.element(document).find('head').prepend('<style type="text/css">.ng-animate.item:not(.left):not(.right){-webkit-transition:0s ease-in-out left;transition:0s ease-in-out left}</style>');