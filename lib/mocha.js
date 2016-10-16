"use strict";

const Mocha = require('mocha');
const path = require('path');

const debug = require('debug')('mocha-electron');

function create(args) {
	debug('mocha args: %o', args);

	let utils = Mocha.utils;
	let mocha = new Mocha();

	mocha.reporter(args.reporter);
	mocha.ui(args.ui);

	if (args.inlineDiffs) mocha.useInlineDiffs(true);
	if (args.slow) mocha.suite.slow(args.slow);
	if (!args.timeout) mocha.enableTimeouts(false);
	if (args.timeout) mocha.suite.timeout(args.timeout);
	if (args.grep) mocha.grep(new RegExp(args.grep));
	if (args.fgrep) mocha.grep(args.fgrep);
	if (args.invert) mocha.invert();
	if (args.checkLeaks) mocha.checkLeaks();

	mocha.globals(args.globals);
	mocha.useColors(args.colors);

	let files = [];
	let extensions = ['js'];

	args.files.forEach((file) => {
		files = files.concat(utils.lookupFiles(file, extensions, args.recursive));
	});

	args.compilers.forEach((c) => {
		let compiler = c.split(':');
		let ext = compiler[0];
		let mod = compiler[1];

		if (mod[0] === '.') {
			mod = path.join(process.cwd(), mod);
		}
		require(mod);
	});

	args.require.forEach((mod) => {
		require(mod);
	});

	files = files.map((file) => {
		return path.resolve(file);
	});

	if (args.sort) {
		files.sort();
	}

	mocha.files = files;

	return mocha;
}

function run(args, cb) {
	let mocha = create(args);
	mocha.run(cb);
}

module.exports = {
	create,
	run,
};
