"use strict";

const { remote } = require('electron');
const remoteConsole = remote.require('console');

console.log = function() {
	remoteConsole.log.apply(remoteConsole, arguments);
};

console.dir = function() {
	remoteConsole.dir.apply(remoteConsole, arguments);
};

Object.defineProperty(process, 'stdout', {
	value: remote.process.stdout
});
