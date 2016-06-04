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