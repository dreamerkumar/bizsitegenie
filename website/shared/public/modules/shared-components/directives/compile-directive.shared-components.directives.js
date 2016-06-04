'use strict';

angular.module('shared-components').directive('compileDirective', function ($compile, CoreFunctions) {

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
});