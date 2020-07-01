// Copyright https://www.RedDragonWebDesign.com/
// Permission required to use or copy code. All rights reserved.

"use strict";

class AdBlockSyntaxBlock {
	string = "";
	json = "";
	richText = "";
	countTrue = 0;
	countFalse = 0
	countNotSure = 0;
	countComments = 0;
	countMismatches = 0;
	
	parseString(s) {
		this.parse(s);
	}
	
	parseRichText(richText) {
		let s = richText;
		// remove spans
		s = s.replace(/<span class=\".*?\">/g, "");
		s = s.replace(/<\/span>/g, "");
		// convert <br /> to \n
		s = s.replace(/<br>/g, "\n");
		this.parse(s);
	}
	
	parse(s) {
		this.string = s;
		let lines = s.split("\n");
		for ( let lineString of lines) {
			if ( lineString !== '' ) {
				let line = new AdBlockSyntaxLine(lineString);
				this.json += line.getJSON() + "\n\n";
				this.richText += line.getRichText();
			
				// increment the true/false counters
				this.incrementCounters(line);
			}
			this.richText += "<br />";
		}
		
		this.json = this.countTrue + " valid, "
			+ this.countNotSure + " unsure, "
			+ this.countFalse + " invalid, "
			+ this.countComments + " comments, "
			+ this.countMismatches + " mismatches"
			+ "\n\n"
			+ this.json;
	}
	
	incrementCounters(line) {
		if ( line.syntax['comment'] ) {
			this.countComments++;
		} else {
			switch( line.isValid ) {
				case true:
					this.countTrue++;
					break;
				case false:
					this.countFalse++;
					break;
				case "not sure":
					this.countNotSure++;
					break;
				case "mismatch":
					this.countMismatches++;
					break;
			}
		}
	}
}

class AdBlockSyntaxLine {
	string = "";
	toParse = "";
	syntax = {};
	isValid = "not sure";
	errorHint = "";
	
	constructor(s) {
		this.string = s;
		this.setVars();
		
		try {
			this.categorizeSyntax();
			this.splitCommas();
			this.validateEachCategory();
			// TODO: this.genericOrSpecific(); // https://help.eyeo.com/en/adblockplus/how-to-write-filters#generic-specific
		} catch(e) {
			this.isValid = e;
		}
		
		this.checkForMismatch();
	}
	
	checkForMismatch() {
		let lineString = "";
		for ( let key in this.syntax ) {
			lineString += this.syntax[key];
		}
		
		if ( lineString !== this.string ) {
			this.isValid = "mismatch";
		}
	}
	
	setVars() {
		this.toParse = this.string;
		this.syntax = {
			'uboPreParsingDirective': '',
			'agHint': '', // AdGuard Hint (similar to UBO pre-parsing directive)
			'comment': '',
			'exception': '',
			'exceptionRegEx': '',
			'domainRegEx': '',
			'domain': '',
			'option': '',
			'selectorException': '',
			'selector': '',
			'abpExtendedSelector': '',
			'actionOperator': '',
			'uboScriptlet': '',
			'uboScriptletException': '',
			'abpSnippet': '',
		};
	}
	
	/** dice syntax string up into the 9 categories: comment !, exception @@, domain, option $, selectorException #@#, selector ##, abpExtendedSelector #?#, actionoperator :style(), and abpSnippet #$# */
	categorizeSyntax() {
		// uboPreParsingDirective !#
		let nextTwo = this.toParse.slice(0, 2);
		if ( nextTwo == "!#" ) {
			this.syntax['uboPreParsingDirective'] = this.string;
			return;
		}
		
		// agHint !+
		nextTwo = this.toParse.slice(0, 2);
		if ( nextTwo == "!+" ) {
			this.syntax['agHint'] = this.string;
			return;
		}
		
		// comment !
		if ( this.string[0] == '!' ) {
			this.syntax['comment'] = this.string;
			throw true;
		}
		
		// exception @@
		let domainException = false;
		if ( this.string[0] == '@' && this.string[1] == '@' ) {
			domainException = true;
			if ( this.toParse.search(/#@#|##|#\?#|:style\(|:remove\(|#\$#/) !== -1 ) {
				this.errorHint = "@@ statements may not contain #@# ## #?# :style() :remove() #$#"
				throw false;
			}
		}
		
		// domain
		// parse until $ #@# ## #?# #$#
		// str.search returns first position, when searching from left to right (good)
		let matchPos = this.toParse.search(/#@#|##|#\?#|#\$#|\$/);
		// if no categories after the domain
		if ( matchPos === -1 ) {
			this.syntax['domain'] = this.toParse;
			this.toParse = '';
		} else {
			this.syntax['domain'] = this.toParse.slice(0, matchPos);
			this.toParse = this.toParse.slice(matchPos);
		}
		
		if ( this.syntax['domain'] && this.syntax['domain'].search(/ /) !== -1 ) {
			this.errorHint = "no spaces allowed in domain name";
			throw false;
		}
		
		if ( domainException && ! this.syntax['domain'] ) {
			this.errorHint = "exception @@ must have a domain";
			throw false;
		}
		
		// exception @@
		if ( domainException ) {
			this.syntax['exception'] = this.syntax['domain'];
			this.syntax['domain'] = "";
		}
		
		// regex special case: /blahblah$/
		// need to handle this carefully because of the $ sign, also used to indicate option
		if ( Helper.left(this.toParse, 2) == "$/" ) {
			this.syntax['domain'] += "$/";
			this.toParse = this.toParse.slice(2);
		}
		
		// domainRegEx /domain/
		if (
			this.syntax['domain'] &&
			Helper.left(this.syntax['domain'], 1) == "/" &&
			Helper.right(this.syntax['domain'], 1) == "/"
		) {
			this.syntax['domainRegEx'] = this.syntax['domain'];
			this.syntax['domain'] = "";
		}
		
		// exceptionRegEx @@/domain/
		if ( this.syntax['exception'] && Helper.left(this.syntax['exception'], 3) == "@@/" && Helper.right(this.syntax['exception'], 1) == "/" ) {
			this.syntax['exceptionRegEx'] = this.syntax['exception'];
			this.syntax['exception'] = "";
		}
		
		// option $ (example: image)
		if ( this.toParse[0] == '$' ) {
			this.syntax['option'] = this.toParse;
			// OK to have nothing before it
			// Nothing allowed after it
			return;
		}
		
		// abpSnippet #$# (example: log hello world!)
		let nextThree = this.toParse.slice(0, 3);
		if ( nextThree == "#$#" ) {
			this.syntax['abpSnippet'] = this.toParse;
			// Nothing allowed after it
			return;
		}
		
		// uboScriptletException #@#+js(
		let nextSeven = Helper.left(this.toParse, 7);
		if ( nextSeven == "#@#+js(" ) {
			this.syntax['uboScriptletException'] = this.toParse;
			// Nothing allowed after it
			return;
		}
		
		// uboScriptlet ##+js(
		let nextSix = Helper.left(this.toParse, 6);
		if ( nextSix == "##+js(" ) {
			this.syntax['uboScriptlet'] = this.toParse;
			// Nothing allowed after it
			return;
		}
		
		// selectorException #@#
		nextThree = this.toParse.slice(0, 3);
		if ( nextThree == "#@#" ) {
			this.syntax['selectorException'] = this.toParse;
			// OK to have domain before it
		}
		
		// selector ##
		nextTwo = this.toParse.slice(0, 2);
		if ( nextTwo == "##" ) {
			// parse until :style() or :remove() encountered
			matchPos = this.toParse.search(/:style\(|:remove\(/);
			
			// if no action operators
			if ( matchPos === -1 ) {
				this.syntax['selector'] = this.toParse;
				return;
			} else {
				this.syntax['selector'] = this.toParse.slice(0, matchPos);
				this.toParse = this.toParse.slice(matchPos);
				this.syntax['actionOperator'] = this.toParse;
				
				let matches = Helper.countRegExMatches(this.toParse, /:style\(|:remove\(/);
				if ( matches > 1 ) {
					this.errorHint = "Can't have action operators :style() :remove() more than once.";
					throw false;
				}
			}
		}
		
		// abpExtendedSelector #?#
		nextThree = this.toParse.slice(0, 3);
		if ( nextThree == "#?#" ) {
			// parse until :style() or :remove() encountered
			matchPos = this.toParse.search(/:style\(|:remove\(/);
			
			// if no action operators
			if ( matchPos === -1 ) {
				this.syntax['abpExtendedSelector'] = this.toParse;
				return;
			} else {
				this.syntax['abpExtendedSelector'] = this.toParse.slice(0, matchPos);
				this.toParse = this.toParse.slice(matchPos);
				this.syntax['actionOperator'] = this.toParse;
				
				let matches = Helper.countRegExMatches(this.toParse, /:style\(|:remove\(/);
				if ( matches > 1 ) {
					this.errorHint = "Can't have action operators :style() :remove() more than once.";
					throw false;
				}
			}
		}
	}
	
	/** split commas */
	splitCommas() {
		// domain - split by commas
		// option - split by commas
		// selector - split by commas
		// abpExtendedSelector - split by commas
		// selectorException - split by commas
		// abpSnippet - split by )+js( for top level, commas for second level
		// actionoperator - split by SEMICOLONS
	}
	
	/** now, do validation on each individual category */
	validateEachCategory() {
		// note: selector syntax is definitely case sensitive. URL's might be too
		
		// domain regex probably has to be all or nothing. can't mix in te/s/t because / can also be part of the URL
		
		// make sure that "cosmetic filters" in CSS selectors doesn't make filter invalid.
		// Examples of "cosmetic filters":
		// :has(...), :has-text(...), :if(...), :if-not(...), :matches-css(...), :matches-css-before(...), :matches-css-after(...), :min-text-length(n), :not(...), :nth-ancestor(n), :upward(arg), :watch-attr(...), :xpath(...)
		
		// make sure that "html filters" in CSS selectors doesn't make filter invalid.
		// html filters take the form ##^stuff
		// Example: example.com##^script:has-text(7c9e3a5d51cdacfc)
		
		// uboScriptlet ##+js(
		// must have domain, except for certain exceptions: #@#+js()
		// are multiple allowed? Not sure. uBlock validator says yes. I can't find any double examples in filter lists though
	}
	
	getJSON() {
		let s = "";
		s += "Filter = " + this.string + "\n";
		s += "Valid? = " + this.isValid + "\n";
		if ( this.errorHint ) {
			s += "Error Hint = " + this.errorHint + "\n";
		}
		s += JSON.stringify(this.syntax);
		// add enters after commas
		s = s.replace(/",/g, '",\n');
		return s;
	}
	
	getRichText() {
		let richText = "";
		let classes = "";
		for ( let key in this.syntax ) {
			classes = key;
			if ( ! this.isValid || this.isValid === "mismatch" ) {
				classes += " error";
			}
			if ( this.syntax[key] ) {
				richText += '<span class="' + classes + '">' + this.syntax[key] + '</span>';
			}
		}
		return richText;
	}
}
// module.exports = analyze;

/*
class AdBlock {
	static isValid(inputString) {
		stack = [];
		closingStack = []; // Punctuation that we need to see by the end of the line for syntax to be valid. Closing parentheses actionoperator things like ) ] }
		
		
		
		return true;
	}
}
*/

class Helper {
	static left(string, length) {
		return string.slice(0, length);
	}
	
	static right(string, length) {
		return string.substr(string.length - length)
	}
	
	static countRegExMatches(str, regExPattern) {
		regExPattern = new RegExp(regExPattern, "g");
		return ((str || '').match(regExPattern) || []).length;
	}

	static escapeHTML(unsafe) {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
	
	static unescapeHTML(input) {
		return input
			.replace("&amp;", /&/g)
			.replace("&lt;", /</g)
			.replace("&gt;", />/g)
			.replace("&quot;", /"/g)
			.replace("&#039;", /'/g);
	}
	
	static getCurrentRange() {
		var sel = window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			return sel.getRangeAt(0);
		}
	}
	
	static restoreSelection(selectedRange, element) {
		var selection = window.getSelection();
		if (selectedRange) {
			// selectedRange.selectNodeContents(element);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(selectedRange);
		}
	}
}

// This line not optional. Content loads top to bottom. Need to wait until DOM is fully loaded.
window.addEventListener('DOMContentLoaded', (e) => {
	let input = document.getElementById('input');
	let analyze = document.getElementById('analyze');
	let json = document.getElementById('json');
	let richText = document.getElementById('rich-text');
	
	// load filter tests into textarea, to be our defaults
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', 'test-good-filters.txt', false);
	xmlhttp.send();
	let text = xmlhttp.responseText + "\n\n";
	
	/*
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', 'test-bad-filters.txt', false);
	xmlhttp.send();
	text += xmlhttp.responseText;
	*/
	
	input.value = text;
	
	analyze.addEventListener('click', function(e) {
		// In theory, we should need some escapeHTML's and unescapeHTML's around here. In actual testing, anything being written into the <textarea> by JS didn't need to be escaped.
		let block = new AdBlockSyntaxBlock();
		block.parseString(input.value);
		json.value = block.json;
		richText.innerHTML = block.richText;
	});
	
	richText.addEventListener('input', function(e) {
		let selectedRange = Helper.getCurrentRange();
		let block = new AdBlockSyntaxBlock();
		block.parseRichText(richText.innerHTML);
		json.value = block.json;
		richText.innerHTML = block.richText;
		Helper.restoreSelection(selectedRange, richText);
	});
	
	// When pasting into rich text editor, force plain text. Do not allow rich text or HTML. For example, the default copy/paste from VS Code is rich text. The formatting overrides our syntax highlighting.
	richText.addEventListener("paste", function(e) {
		// cancel paste
		e.preventDefault();
		// get text representation of clipboard
		var text = (e.originalEvent || e).clipboardData.getData('text/plain');
		// insert text manually
		document.execCommand("insertHTML", false, text);
	});
	
	analyze.click();
});