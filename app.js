"use strict";

const util = require('util');
const fs = require('fs-extra');
const path = require('path');
const args = require('./lib/args');
const mocha = require('./lib/mocha');
const mochaOptions = require('mocha/bin/options');

const debug = require('debug')('mochelec');

const { app, ipcMain: ipc, BrowserWindow } = require('electron');

process.on('uncaughtException', (err) => {
	console.error(err);
	console.error(err.stack);
	app.exit(1);
});

// load mocha.opts into process.argv
mochaOptions();

let opts = args.parse(process.argv);
debug('opts: %o', opts);

let tmpdir = fs.mkdtempSync(path.join(app.getPath('temp'), 'mochelec'));
debug('tmp: %s', tmpdir);
app.setPath('userData', tmpdir);

app.on('quit', () => {
	debug('quit');
	fs.removeSync(tmpdir);
});

// do not quit if tests open and close windows
app.on('window-all-closed', () => {});

app.on('ready', () => {
	debug('ready');
	if (opts.requireMain.length === 1) {
		debug('requireMain: %o', opts.requireMain[0]);
		require(opts.requireMain[0]);
	}

	if (!opts.renderer) {
		runMain();
	} else {
		runRenderer();
	}
});

function runMain() {
	debug('run in main');
	mocha.run(opts, count => app.exit(count));
}

function runRenderer() {
	debug('run in renderer');
	let win = new BrowserWindow({
		width: 800, height: 600,
		show: false,
		//focusable: opts.debug,
		webPreferences: { webSecurity: false },
	});

	win.on('ready-to-show', () => {
		debug('ready-to-show');
		if (opts.debug) {
			win.show();
			win.webContents.openDevTools();
			win.webContents.on('devtools-opened', () => {
				// debugger is not immediatly ready
				setTimeout(() => {
					debug('mocha-start');
					win.webContents.send('mocha-start', opts);
				}, 250);
			});
		} else {
			debug('mocha-start');
			win.webContents.send('mocha-start', opts);
		}
	});

	win.loadURL(`file://${__dirname}/renderer/index.html`);

	ipc.on('mocha-done', (event, count) => {
		debug('mocha-done');
		win.webContents.once('destroyed', () => app.exit(count));
		win.close();
		win = null;
	});
	ipc.on('mocha-error', (event, err) => {
		let msg = util.format('\nError encountered in %s: %s\n%s',
			path.relative(process.cwd(), err.filename), err.message, err.stack);
		process.stderr.write(msg);
		app.exit(1);
	});
	ipc.on('error', (event, err) => {
		let msg = util.format('\nError: %s\n', err);
		process.stderr.write(msg)
		app.exit(1);
	});
}
