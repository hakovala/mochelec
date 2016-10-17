"use strict";

require('./console');
const mocha = require('../lib/mocha');
const { ipcRenderer: ipc } = require('electron');

const debug = require('debug')('mochelec:renderer');

debug('loaded');

// expose mocha
window.mocha = require('mocha');

window.onerror = function(message, filename, lineno, colno, err) {
	ipc.send('mocha-error', {
		message,
		filename,
		err,
		stack: err.stack,
	});
};

function loadScript(url) {
	return new Promise((resolve, reject) => {
		debug('loading: %s', url);

		let script = document.createElement('script');
		script.onerror = () => { 
			reject(new Error('Failed to load: ' + url)); 
		};
		script.onload = () => {
			resolve();
		};

		document.head.appendChild(script);
		script.src = url;
	});
}

ipc.on('mocha-start', (events, args) => {
	debug('mocha-start: %o', args);

	//args.preload.forEach(addScript);
	Promise.all(args.preload.map(loadScript))
		.then(() => {
			debug('all loaded');
			mocha.run(args, (failureCount) => {
				debug('mocha-done: %d', failureCount);
				ipc.send('mocha-done', failureCount);
			});
		})
		.catch((err) => {
			debug(err);
			ipc.send('error', err.message);
		});
});
