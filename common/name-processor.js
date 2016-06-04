'use strict';

exports.getSimpleName = function(propertyLabel){
	if(!propertyLabel) {
		return propertyLabel;
	}

	return propertyLabel.toLowerCase().trim().replace(/ /g, '');

};

