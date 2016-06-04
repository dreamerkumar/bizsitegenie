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