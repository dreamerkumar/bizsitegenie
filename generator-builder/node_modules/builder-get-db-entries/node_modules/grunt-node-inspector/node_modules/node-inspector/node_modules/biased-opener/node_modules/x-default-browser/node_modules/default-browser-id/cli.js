#!/usr/bin/env node
'use strict';
var pkg = require('./package.json');
var defaultBrowserId = require('./');
var argv = process.argv.slice(2);

function help() {
	console.log([
		'',
		'  ' + pkg.description,
		'',
		'  Example',
		'    default-browser-id',
		'    com.apple.Safari'
	].join('\n'));
}

if (argv.indexOf('--help') !== -1) {
	help();
	return;
}

if (argv.indexOf('--version') !== -1) {
	console.log(pkg.version);
	return;
}

defaultBrowserId(function (err, id) {
	if (err) {
		throw err;
	}

	console.log(id);
});
