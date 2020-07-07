// Copyright https://www.RedDragonWebDesign.com/
// Permission required to use or copy code. All rights reserved.

"use strict";

import { AdBlockSyntaxBlock }  from './AdBlockSyntaxBlock.js';
import { Cursor }  from './Cursor.js';

// TODO: figure out how to move this into its own file and import/export it. Currently, adding "export" to the beginning of it generates an error.
Object.assign(String.prototype, {
	/** @description "Testing 123".left(4) = "Test" */
	left(length) {
		return this.slice(0, length);
	},
	
	/** @description "Testing 123".right(3) = "123" */
	right(length) {
		return this.substr(this.length - length);
	},
	
	/** take a string, and chop off the amount of text on the right specified, leaving the text on the left */
	chopRight(length) {
		return this.slice(0, this.length - length);
	},
	
	chopMiddle(start, length) {
		return this.substr(0, start) + this.substr(length + 1);
	}
});

// This line not optional. Content loads top to bottom. Need to wait until DOM is fully loaded.
window.addEventListener('DOMContentLoaded', (e) => {
	let json = document.getElementById('json');
	let richText = document.getElementById('rich-text');
	
	// load filter test into textarea, to be our default text
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', 'test-good-filters.txt', false);
	xmlhttp.send();
	let text = xmlhttp.responseText;
	richText.innerHTML = text;
	
	richText.addEventListener('input', function(e) {
		// In theory, we should need some escapeHTML's and unescapeHTML's around here. In actual testing, anything being written into the <textarea> by JS didn't need to be escaped.
		let offset = Cursor.getCurrentCursorPosition(richText);
		let block = new AdBlockSyntaxBlock();
		block.parseRichText(richText.innerHTML);
		json.value = block.getJSON();
		richText.innerHTML = block.getRichText();
		Cursor.setCurrentCursorPosition(offset, richText);
		richText.focus(); // blinks the cursor
	});
	
	// When pasting into rich text editor, force plain text. Do not allow rich text or HTML. For example, the default copy/paste from VS Code is rich text. Foreign formatting messes up our syntax highlighting.
	richText.addEventListener("paste", function(e) {
		// cancel paste
		e.preventDefault();
		// get text representation of clipboard
		var text = (e.originalEvent || e).clipboardData.getData('text/plain');
		// insert text manually
		document.execCommand("insertHTML", false, text);
		richText.focus(); // shows the cursor
	});
	
	richText.dispatchEvent(new Event('input', { bubbles: true }));
});