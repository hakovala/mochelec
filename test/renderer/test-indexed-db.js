"use strict";

const assert = require('assert');

describe('indexedDB', () => {
	it('does not fail when removing temp dir', () => {
		const db = window.indexedDB.open('Foo', 3);
		assert.ok(db != null);
	});
});
