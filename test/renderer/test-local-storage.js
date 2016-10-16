"use strict";

const assert = require('assert');

describe('localStorage', () => {
	it('can be accessed', () => {
		window.localStorage.setItem('foo', 'bar');
		assert.equal(window.localStorage.getItem('foo'), 'bar');
	});
});

