'use strict';

/**
 * Module dependencies.
 */
exports.builder = function(req, res) {
	res.render('builder', {
		user: req.user || null,
		request: req
	});
};