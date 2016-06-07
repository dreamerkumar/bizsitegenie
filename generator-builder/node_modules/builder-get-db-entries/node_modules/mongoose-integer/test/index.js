/* jshint node: true, mocha: true */
'use strict';

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongoose-integer');
mongoose.connection.on('error', function() {
	throw new Error('Unable to connect to database.');
});

describe('Mongoose Integer', function() {
	require('./tests/validation')();
	require('./tests/message')();
});
