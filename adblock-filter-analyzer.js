// Copyright https://www.RedDragonWebDesign.com/
// Permission required to use or copy code. All rights reserved.

"use strict";

import { AdBlockSyntaxBlock }  from './AdBlockSyntaxBlock.js';
import { Cursor }  from './Cursor.js';

// This line not optional. Content loads top to bottom. Need to wait until DOM is fully loaded.
window.addEventListener('DOMContentLoaded', (e) => {
	let json = document.getElementById('json');
	let richText = document.getElementById('rich-text');
	let clear = document.getElementById('clear');
	let lineCount = document.getElementById('line-count');
	
	// load filter test into textarea, to be our default text
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', 'tests/test-good-filters.txt', false);
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
		lineCount.innerHTML = block.getLineCount();
		richText.focus(); // blinks the cursor
	});
	
	// When pasting into rich text editor, force plain text. Do not allow rich text or HTML. For example, the default copy/paste from VS Code is rich text. Foreign formatting messes up our syntax highlighting.
	richText.addEventListener("paste", function(e) {
		// cancel paste
		e.preventDefault();
		// get text representation of clipboard
		var text = (e.originalEvent || e).clipboardData.getData('text/plain');
		// fix #5 rich test paste, tab is not rendering correctly
		text = text.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
		// fix #33 Ctrl-A then paste sometimes messes up the last line, puts a space
		text = text.replace(/\r\n/g, "<br>");
		text = text.replace(/\n/g, "<br>");
		// insert text manually
		document.execCommand("insertHTML", false, text);
		richText.focus(); // shows the cursor
	});
	
	clear.addEventListener('click', function(e) {
		richText.innerHTML = "";
		lineCount.innerHTML = 0;
	});
	
	richText.dispatchEvent(new Event('input', { bubbles: true }));
});