"use strict";

const assert = require('assert');
const { remote } = require('electron');

describe('mocha.opts', () => {
	it('--require modules are loaded', () => {
		assert.equal(true, window.required);
	});
	it('--preload modules are loaded', () => {
		assert.equal(true, window.preloaded);
	});
	it('--require-main modules are loaded in main process', () => {
		assert.equal(true, remote.getGlobal('requiredMain'));
	});
});
