"use strict";

const assert = require('assert');

describe('mocha-electron', () => {
	it('main process by default', () => {
		assert.strictEqual(process.type, 'browser');
	});
});
