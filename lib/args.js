"use strict";

const fs = require('fs');
const path = require('path');
const program = require('commander');

const cwd = process.cwd();

function parse (argv) {
	program._name = 'mochelec'
	program
		.version(require('../package').version)
		.usage('[options] [files]')
		.option('-C, --no-colors', 'force disabling of colors')
		.option('-R, --reporter <name>', 'specify the reporter to use', 'spec')
		.option('-S, --sort', 'sort test files')
		.option('-b, --bail', 'bail after first test failure')
		.option('-g, --grep <pattern>', 'only run tests matching <pattern>')
		.option('-f, --fgrep <string>', 'only run tests containing <string>')
		.option('-i, --invert', 'inverts --grep and --fgrep matches')
		.option('-r, --require <name>', 'require the given module', modules, [])
		.option('-s, --slow <ms>', '"slow" test threshold in milliseconds [75]')
		.option('-t, --timeout <ms>', 'set test-case timeout in milliseconds [2000]')
		.option('-u, --ui <name>', 'specify user-interface (bdd|tdd|exports)', 'bdd')
		.option('--check-leaks', 'check for global variable leaks')
		.option('--compilers <ext>:<module>,...', 'use the given module(s) to compile files', list, [])
		.option('--debug', 'enable Electron debugger on port [5858]; for --renderer tests show window and dev-tools')
		.option('--debug-brk', 'like --debug but pauses the script on the first line')
		.option('--globals <names>', 'allow the given comma-delimited global [names]', list, [])
		.option('--inline-diffs', 'display actual/expected differences inline within each string')
		.option('--interfaces', 'display available interfaces')
		.option('--no-timeouts', 'disables timeouts')
		.option('--opts <path>', 'specify opts path', 'test/mocha.opts')
		.option('--recursive', 'include sub directories')
		.option('--renderer', 'run tests in renderer process')
		.option('--preload <name>', 'preload the given script in renderer process', modules, [])
		.option('--require-main <name>', 'load the given script in main process before executing tests', modules, [])
		.option('--hook <name>', 'load the given script and call it with the Mocha instance', modules, [])

	module.paths.push(cwd, path.join(cwd, 'node_modules'));

	program.parse(argv);
	let args = JSON.parse(JSON.stringify(program));
	args.files = args.args;

	if (args.debugBrk) {
		args.debug = true;
	}

	// delete unused
	;['commands', 'options', '_execs', '_args', '_name', '_events', '_usage', '_version', '_eventsCount', 'args'].forEach(function (key) {
		delete args[key];
	});

	return args;
}

function list(str) {
	return str.split(/ *, */);
}

function modules(mod, memo) {
	let abs = fs.existsSync(mod) || fs.existsSync(mod + '.js');
	if (abs) mod = path.resolve(mod);
	memo.push(mod);
	return memo;
}

module.exports = {
	parse,
};
