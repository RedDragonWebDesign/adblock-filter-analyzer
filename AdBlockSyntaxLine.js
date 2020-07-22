// Copyright https://www.RedDragonWebDesign.com/
// Permission required to use or copy code. All rights reserved.

"use strict";

import { optionsWithoutEquals, optionsWithEquals } from './FunctionLists/options.js';
import { uboScriptlets } from './FunctionLists/uboScriptlets.js';
import { abpSnippets } from './FunctionLists/abpSnippets.js';
import { abpExtendedSelectors } from './FunctionLists/abpExtendedSelectors.js';

export class AdBlockSyntaxLine {
	string = "";
	toParse = "";
	syntax = {
		'whitespaceFront': '',
		'uboPreParsingDirective': '', // !#
		'agHint': '', // !+
		'comment': '', // !
		'hosts': '',
		'domain': '',
		'exception': '', // @@
		'domainRegEx': '', // /regex/
		'exceptionRegEx': '', // @@/regex/
		'option': '', // $
		'selector': '', // ##
		'selectorException': '', // #@#
		'htmlFilter': '', // ##^
		'htmlFilterException': '', // #@#^
		'abpExtendedSelector': '', // #?#
		'uboScriptlet': '', // ##+js()
		'uboScriptletException': '', // #@#+js()
		'abpSnippet': '', // #$#
		'agJSRule': '', // #%#
		'agJSException': '', // #@%#
		'agExtendedSelector': '', // #?#
		'agExtendedSelectorException': '', // #@?#
		'agStyling': '', // #$#
		'agStylingException': '', // #@$#
		'agAdvancedStyling': '', // #$?#
		'agAdvancedStylingException': '', // #@$?#
		// actionOperator type stuff must be on the bottom, to make sure _checkForMismatch rebuilds the string in the correct order
		'actionOperator': '', // :style() :remove()
		'agActionOperator': '', // { }
		'whitespaceBack': '',
	};
	// Below is used in a RegEx that isolates the domain from the selector. If you add a selector-ish symbol to the list above, you MUST add it here too
	allSelectorsRegEx = /\$|##|#@#|##\^|#@#\^|#\?#|##\+js\(|#@#\+js\(|#\$#|#%#|#@%#|#\?#|#@\?#|#\$#|#@\$#|#\$\?#|#@\$\?#/;
	allSelectorsExceptOptionRegEx = /##|#@#|##\^|#@#\^|#\?#|##\+js\(|#@#\+js\(|#\$#|#%#|#@%#|#\?#|#@\?#|#\$#|#@\$#|#\$\?#|#@\$\?#/;
	// all selectors except $ and ##. Those two had too many false positives
	allSelectorsExceptTwoRegEx = /#@#|##\^|#@#\^|#\?#|##\+js\(|#@#\+js\(|#\$#|#%#|#@%#|#\?#|#@\?#|#\$#|#@\$#|#\$\?#|#@\$\?#/;
	isValid = "not sure";
	errorHint = "";
	
	constructor(s) {
		this.string = s;
		this.toParse = this.string;
		
		try {
			this._categorizeSyntax();
			// TODO: this.genericOrSpecific(); // https://help.eyeo.com/en/adblockplus/how-to-write-filters#generic-specific
		} catch(e) {
			// only catch what we want, let actual errors throw to console
			if ( e === true || e === false || e === "not sure" ) {
				this.isValid = e;
			} else {
				throw e;
			}
		}
		
		// Print rare filters to the console, so we can add them to our test lists.
		if (
			this.syntax['htmlFilterException'] ||
			this.syntax['exceptionRegEx'] ||
			this.syntax['agJSRule'] ||
			this.syntax['agJSException'] ||
			this.syntax['agExtendedSelectorException'] ||
			this.syntax['agStylingException'] ||
			this.syntax['agAdvancedStylingException']
		) {
			console.log(this.string);
		}
		
		if ( this.isValid !== true ) {
			try {
				this._lookForErrors();
			} catch(e) {
				// only catch what we want, let actual errors throw to console
				if ( e === true || e === false || e === "not sure" ) {
					this.isValid = e;
				} else {
					throw e;
				}
			}
		}
		
		if ( this.isValid !== true ) {
			try {
				this._validateEachCategory();
			} catch(e) {
				// only catch what we want, let actual errors throw to console
				if ( e === true || e === false || e === "not sure" ) {
					this.isValid = e;
				} else {
					throw e;
				}
			}
		}
		
		this._lookForMismatch();
	}
	
	_lookForErrors() {
		// no spaces in domains or domain regex
		if ( this.syntax['domainRegEx'] && this.syntax['domainRegEx'].search(/ /g) !== -1 ) {
			this.errorHint = "no spaces allowed in domains, exceptions, domainRegEx, or exceptionRegEx";
			throw false;
		}
		if ( this.syntax['domain'] && this.syntax['domain'].search(/ /g) !== -1 ) {
			this.errorHint = "no spaces allowed in domains, exceptions, domainRegEx, or exceptionRegEx";
			throw false;
		}
		if ( this.syntax['exceptionRegEx'] && this.syntax['exceptionRegEx'].search(/ /g) !== -1 ) {
			this.errorHint = "no spaces allowed in domains, exceptions, domainRegEx, or exceptionRegEx";
			throw false;
		}
		if ( this.syntax['exception'] && this.syntax['exception'].search(/ /g) !== -1 ) {
			this.errorHint = "no spaces allowed in domains, exceptions, domainRegEx, or exceptionRegEx";
			throw false;
		}
		
		// Delete regex. Regex is allowed to contain our special chars. When we do our searches, we don't want to get false positives.
		// Trim, to prevent whitespace issues.
		let s = this.string
			.trim()
			.replace(/^\/.*?[^\\]\//g, '')
			.replace(/^@@\/.*?[^\\]\//g, '@@');
		
		// look for double selectors $ #@# ## ##^ #@#^ #?# ##+js( #@#+js( #$# #$?# #%# #@%#
		// had to take out $, too many false positives, it's used in CSS and +js()
		// had to take out ## to fix a false positive
		let count = this._countRegExMatches(s, this.allSelectorsExceptTwoRegEx);
		if ( count > 1 ) {
			this.errorHint = "selector-ish syntax $ #@# ## ##^ #@#^ #?# ##+js( #@#+js( #$# is only allowed once per filter";
			throw false;
		}
		
		// look for double actionOperators
		count = this._countRegExMatches(s, /:style\(|:remove\(/);
		if ( count > 1 ) {
			this.errorHint = "actionOperators :style() :remove() are only allowed once per filter";
			throw false;
		}
		
		// actionOperators must be paired with a domain
		let domainPresent = (
			this.syntax['domain'] ||
			this.syntax['exception'] ||
			this.syntax['domainRegEx'] ||
			this.syntax['exceptionRegEx']
		);
		if ( this.syntax['actionOperator'] && ! domainPresent ) {
			this.errorHint = "actionOperators :style() :remove() must be used with a URL";
			throw false;
		}
		
		// actionOperators not allowed to be paired with ##+js( #@#+js( #$# $ #%# #@%#
		// TODO: probably also need to ban pairing with #@#|##|##^|#@#^|#?#| but so far :style() passes ubo validator, :remove() fails
		let bannedSyntaxPresent = (
			this.syntax['uboScriptlet'] ||
			this.syntax['uboScriptletException'] ||
			this.syntax['abpSnippet'] ||
			this.syntax['agJSRule'] ||
			this.syntax['agJSException'] ||
			this.syntax['option']
		);
		let countActionOperators = this._countRegExMatches(s, /:style\(|:remove\(/);
		if ( bannedSyntaxPresent && countActionOperators ) {
			this.errorHint = "actionOperators :style() :remove() cannot be used with ##+js( #@#+js( #$# $";
			throw false;
		}
		
		// @@exceptions may not contain any selectors except options
		count = this._countRegExMatches(s, this.allSelectorsExceptOptionRegEx);
		let exception = ( this.syntax['exception'] || this.syntax['exceptionRegEx'] );
		if ( exception && count ) {
			this.errorHint = "@@ statements may not contain selector-ish syntax $ #@# ## ##^ #@#^ #?# ##+js( #@#+js( #$# or action operators :style() :remove()"
			throw false;
		}
		
		// ##+js() #@#+js() :style() :remove() must end in )
		let needsEndParenthesis = (
			this.syntax['uboScriptlet'] ||
			this.syntax['uboScriptletException'] ||
			this.syntax['actionOperator']
		);
		if ( needsEndParenthesis && ! s.endsWith(')') ) {
			this.errorHint = "##+js() #@#+js() :style() :remove() must end in )"
			throw false;
		}
	}
	
	/** Takes the values in the this.syntax array and builds them into a string. Then makes sure that string matches the input string. If these don't match, this is a pretty sure sign there's a bug. */
	_lookForMismatch() {
		let lineString = "";
		for ( let key in this.syntax ) {
			lineString += this.syntax[key];
		}
		
		if ( lineString !== this.string ) {
			this.isValid = "mismatch";
		}
	}
	
	/** dice syntax string up into categories: comment !, exception @@, domain, option $, selectorException #@#, selector ##, abpExtendedSelector #?#, actionoperator :style(), abpSnippet #$#, etc. */
	_categorizeSyntax() {
		this._lookForWhitespace();
		this._lookForComments();
		this._lookForHosts();
		this._lookForDomains();
		// lookForActionOperators needs to come before lookForSelectors, even though actionOperators appear after selectors in the string.
		this._lookForActionOperators();
		this._lookForSelectors();
	}
	
	_lookForWhitespace() {
		// TODO: refactor using .trimLeft() and .trimRight()
		let trimmed = this.toParse.trim();
		if ( this.toParse !== trimmed ) {
			let strPos = this.toParse.indexOf(trimmed);
			this.syntax['whitespaceFront'] = this.toParse.slice(0, strPos);
			
			let whitespaceFrontLength = this.syntax['whitespaceFront'].length;
			let trimmedLength = trimmed.length;
			this.syntax['whitespaceBack'] = this.toParse.slice(whitespaceFrontLength + trimmedLength);
			
			this.toParse = trimmed;
		}
	}
	
	_lookForHosts() {
		// hosts file syntax - usually starts in 127.0.0.1 or 0.0.0.0
		if ( this.toParse.startsWith('127.0.0.1') || this.toParse.startsWith('0.0.0.0') ) {
			this.syntax['hosts'] = this.toParse;
			throw "not sure";
		}
	}
		
	_lookForComments() {
		// uboPreParsingDirective !#
		if ( this.toParse.search(/!#[a-zA-Z0-9]/) !== -1 ) {
			this.syntax['uboPreParsingDirective'] = this.toParse;
			throw "not sure";
		}
		
		// agHint !+
		if ( this.toParse.startsWith('!+') ) {
			this.syntax['agHint'] = this.toParse;
			throw "not sure";
		}
		
		// comment ! [
		if ( this.string.startsWith('!') || this.string.startsWith('[') ) {
			this.syntax['comment'] = this.toParse;
			throw true;
		}
		
		// comment # (but not ## or ### or #@#+js(
		if (
			this.string.startsWith('#') &&
			! this.string.startsWith('##') &&
			! this.string.startsWith('###') &&
			! this.string.startsWith('#@#+js')
		) {
			this.syntax['comment'] = this.toParse;
			throw true;
		}
	}
	
	_lookForDomains() {
		// exception @@
		if ( this.string.startsWith('@@') ) {
			this.syntax['exception'] = '@@';
			this.toParse = this.toParse.slice(2);
		}
		
		// domainRegEx /regex/
		let hasRegEx = (this.toParse.search(/^\/.*?[^\\]\//) !== -1);
		let nonRegEx = this.toParse.replace(/^\/.*?[^\\]\//, '');
		let hasSelector = (nonRegEx.search(this.allSelectorsRegEx) !== -1);
		let startsWithSelector = (nonRegEx.search(this.allSelectorsRegEx) === 0);
		let hasNothingElse = (nonRegEx.length === 0);
		if ( hasRegEx && (startsWithSelector || hasNothingElse) ) {
			let regEx = this.toParse.slice(0, this.toParse.length - nonRegEx.length);
			this.syntax['domainRegEx'] = regEx;
			this.toParse = nonRegEx;
		
			if ( this.syntax['exception'] ) {
				this.syntax['exception'] = '';
				this.syntax['exceptionRegEx'] = '@@' + this.syntax['domainRegEx'];
				this.syntax['domainRegEx'] = '';
			}
			
			return;
		}
		
		// domain
		// parse until $ #@# ## #?# #$# #$?# #%# #@%#
		// str.search returns first position, when searching from left to right (good)
		let matchPos = this.toParse.search(this.allSelectorsRegEx);
		// if no categories after the domain
		if ( matchPos === -1 ) {
			this.syntax['domain'] = this.toParse;
			this.toParse = '';
		} else {
			this.syntax['domain'] = this.toParse.slice(0, matchPos);
			this.toParse = this.toParse.slice(matchPos);
		}
		
		// if domain starts and ends in /, and it wasn't caught in the RegEx code above, it's probably a badly formed RegEx. Assign it to RegEx, and _lookForErrors will throw an error for it later.
		if ( this.syntax['domain'].startsWith('/') && this.syntax['domain'].endsWith('/') ) {
			if ( this.syntax['exception'] ) {
				this.syntax['exception'] = '';
				this.syntax['exceptionRegEx'] = '@@' + this.syntax['domain'];
				this.syntax['domain'] = '';
			} else {
				this.syntax['domainRegEx'] = this.syntax['domain'];
				this.syntax['domain'] = '';
			}
			return;
		}
		
		// exception @@ must have a domain
		if ( this.syntax['exception'] && ! this.syntax['domain'] ) {
			this.errorHint = "exception @@ must have a domain";
			throw false;
		}
		
		// exception @@
		if ( this.syntax['exception'] ) {
			this.syntax['exception'] += this.syntax['domain'];
			this.syntax['domain'] = "";
		}
	}
	
	_stringContains(string, array, addSpaceAfter = false) {
		for ( let value of array ) {
			if ( addSpaceAfter ) {
				value += " ";
			}
			if ( string.indexOf(value) !== -1 ) {
				return true;
			}
		}
		return false;
	}
	
	_lookForSelectors() {
		// option $ (example: image)
		if ( this.toParse.startsWith('$') ) {
			this.syntax['option'] = this.toParse;
			// OK to have nothing before it
			// Nothing allowed after it
			throw "not sure";
		}
		
		// abpSnippet #$#
		// agStyling #$#
		if ( this.toParse.startsWith('#$#') ) {
			if ( this.toParse.startsWith('#$#.') || this.toParse.startsWith('#$##') ) {
				this.syntax['agStyling'] = this.toParse;
				return;
			} else if ( this._stringContains(this.toParse, abpSnippets, true) ) {
				this.syntax['abpSnippet'] = this.toParse;
				// Nothing allowed after it
				throw "not sure";
			} else {
				this.syntax['agStyling'] = this.toParse;
				return;
			}
		}
		
		// uboScriptlet ##+js(
		if ( this.toParse.startsWith('##+js(') ) {
			this.syntax['uboScriptlet'] = this.toParse;
			
			// per ublock documentation, example.com##+js() when js() is empty is an error
			if ( this.syntax['uboScriptlet'] === "##+js()" ) {
				this.errorHint = "per ublock documentation, example.com##+js() when js() is empty is an error";
				throw false;
			}
			
			// Nothing allowed after it
			throw "not sure";
		}
		
		// uboScriptletException #@#+js(
		if ( this.toParse.startsWith('#@#+js(') ) {
			this.syntax['uboScriptletException'] = this.toParse;
			// Nothing allowed after it
			throw "not sure";
		}
		
		// agJSRule #%#
		if ( this.toParse.startsWith('#%#') ) {
			this.syntax['agJSRule'] = this.toParse;
			// Nothing allowed after it
			throw "not sure";
		}
		
		// agJSException #@%#
		if ( this.toParse.startsWith('#@%#') ) {
			this.syntax['agJSException'] = this.toParse;
			// Nothing allowed after it
			throw "not sure";
		}
		
		// htmlFilter ##^
		if ( this.toParse.startsWith('##^') ) {
			this.syntax['htmlFilter'] = this.toParse;
			return;
		}
		
		// htmlFilterException #@#^
		if ( this.toParse.startsWith('#@#^') ) {
			this.syntax['htmlFilterException'] = this.toParse;
			return;
		}
		
		// selector ##
		if ( this.toParse.startsWith('##') ) {
			this.syntax['selector'] = this.toParse;
			return;
		}
		
		// selectorException #@#
		if ( this.toParse.startsWith('#@#') ) {
			this.syntax['selectorException'] = this.toParse;
			return;
		}
		
		// abpExtendedSelector #?#
		// agExtendedSelector #?#
		if ( this.toParse.startsWith('#?#') ) {
			if ( this._stringContains(this.toParse, abpExtendedSelectors) ) {
				this.syntax['abpExtendedSelector'] = this.toParse;
				return;
			} else {
				this.syntax['agExtendedSelector'] = this.toParse;
				return;
			}
		}
		
		// agAdvancedStyling #$?#
		if ( this.toParse.startsWith('#$?#') ) {
			this.syntax['agAdvancedStyling'] = this.toParse;
			return;
		}
		
		// agAdvancedStylingException #@$?#
		if ( this.toParse.startsWith('#@$?#') ) {
			this.syntax['agAdvancedStylingException'] = this.toParse;
			return;
		}
		
		// agExtendedSelectorException #@?#
		if ( this.toParse.startsWith('#@?#') ) {
			this.syntax['agExtendedSelectorException'] = this.toParse;
			return;
		}
		
		// agStylingException #@$#
		if ( this.toParse.startsWith('#@$#') ) {
			this.syntax['agStylingException'] = this.toParse;
			return;
		}
	}
	
	_lookForActionOperators() {
		let matchPos;
		
		matchPos = this.toParse.search(/(:style\(|:remove\().*\)$/);
		if ( matchPos !== -1 ) {
			this.syntax['actionOperator'] = this.toParse.slice(matchPos);
			this.toParse = this.toParse.slice(0, matchPos);
			return;
		}
		
		matchPos = this.toParse.search(/\{.*\}$/);
		if ( matchPos !== -1 ) {
			this.syntax['agActionOperator'] = this.toParse.slice(matchPos);
			this.toParse = this.toParse.slice(0, matchPos);
			return;
		}
	}
	
	_validateRegEx(trimmed) {
		try {
			let regEx = new RegExp(trimmed);
		} catch {
			this.errorHint = "invalid RegEx";
			throw false;
		}
	}
	
	_validateOption(trimmed) {
		let optionsArray = trimmed.split(',');
		for ( let value of optionsArray ) {
			// if there's a ~ at the beginning, strip it out
			if ( value.search(/^~/) !== -1 ) {
				value = value.slice(1);
			}
			
			// check if our string contains =
			let hasEquals = /^(.*?)=.*$/.exec(value);
			
			if ( hasEquals ) {
				// isolate the keyword to the left of equals
				value = hasEquals[1];
				
				// check optionsWithEquals list
				if ( ! optionsWithEquals.includes(value) ) {
					this.errorHint = 'Option "' + value + '" is not in the list of allowed optionsWithEquals. Hint: Options are case sensitive and should have no spaces.';
					throw false;
				}
			} else {
				// check optionsWithoutEquals list
				if ( ! optionsWithoutEquals.includes(value) ) {
					this.errorHint = 'option "' + value + '" is not in the list of allowed optionsWithoutEquals. Hint: Options are case sensitive and should have no spaces.';
					throw false;
				}
			}
			
			// TODO: RegEx checks on these...
				// 'csp', // = [a-z\-:' ]
				// 'denyallow', // = [a-z.|]
				// 'domain', // = [~|a-z.]
				// 'redirect', // = [a-z0-9\-.]
				// 'rewrite', // = [a-z\-:]
				// 'sitekey', // = [a-z]
		}
	}
	
	_validateABPSnippet(trimmed) {
		let snippetsArray = trimmed.split(';');
		for ( let value of snippetsArray ) {
			// if there's whitespace at the beginning, strip it out
			let match = /^(\s+)/.exec(value);
			if ( match ) {
				value = value.slice(match[1].length);
			}
		
			// delete everything except function name
			let strPos = value.search(" ");
			if ( strPos !== -1 ) {
				value = value.slice(0, strPos);
			}

			// check whitelist
			if ( ! abpSnippets.includes(value) ) {
				this.errorHint = '"' + value + '" is not in the list of allowed abpSnippets';
				throw false;
			}
		}
	}
	
	/** validate the syntax within each category */
	_validateEachCategory() {
		let trimmed;
		
		// domainRegEx /regex/
		if ( this.syntax['domainRegEx'] ) {
			trimmed = this.syntax['domainRegEx'].slice(1).slice(0, length - 1);
			this._validateRegEx(trimmed);
		}
		
		// exceptionRegEx @@/regex/
		if ( this.syntax['exceptionRegEx'] ) {
			trimmed = this.syntax['exceptionRegEx'].slice(3).slice(0, length - 1);
			this._validateRegEx(trimmed);
		}
		
		// option $
		if ( this.syntax['option'] ) {
			trimmed = this.syntax['option'].slice(1);
			this._validateOption(trimmed);
		}
		
		// uboScriptlet ##+js()
		if ( this.syntax['uboScriptlet'] ) {
			trimmed = this.syntax['uboScriptlet'].slice(6).slice(0, length - 1);
			this._validateUBOScriptlet(trimmed);
		}
		
		// uboScriptletException #@#+js()
		if ( this.syntax['uboScriptletException'] ) {
			trimmed = this.syntax['uboScriptletException'].slice(7).slice(0, length - 1);
			this._validateUBOScriptlet(trimmed);
		}
		
		// abpSnippet #$#
		if ( this.syntax['abpSnippet'] ) {
			trimmed = this.syntax['abpSnippet'].slice(3);
			this._validateABPSnippet(trimmed);
		}		
		
		// TODO: More. CSS selectors, CSS properties, etc.
	}
	
	_validateUBOScriptlet(trimmed) {
		// empty ##+js() is allowed
		if ( ! trimmed ) return;
		
		// delete everything except function name
		let strPos = trimmed.search(",");
		if ( strPos !== -1 ) {
			trimmed = trimmed.slice(0, strPos);
		}
		
		// if present, delete .js from end of function name
		strPos = trimmed.search(/\.js$/);
		if ( strPos !== -1 ) {
			trimmed = trimmed.slice(0, strPos);
		}
		
		if ( ! uboScriptlets.includes(trimmed) ) {
			// I assume the scriptlet names are case sensitive, but I am not sure.
			// ubo validator does not validate function names. Need to do thorough testing.
			this.errorHint = 'uboScriptlet "' + trimmed + '" is not in the list of allowed uboScriptlets';
			throw false;
		}
	}
	
	/** Gets a string with a JSON representation of the syntax categories. Also prints isValid and errorHint. */
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
	
	/** Gets a string of the filter syntax, with HTML <span>s wrapped around each category of syntax. These <span>s will be used to highlight the text the correct color in the richTextBox. */
	getRichText() {
		let richText = "";
		let classes = "";
		for ( let key in this.syntax ) {
			classes = key;
			if ( ! this.isValid || this.isValid === "mismatch" ) {
				classes += " error";
			}
			if ( this.syntax[key] ) {
				let s = this.syntax[key];
				s = this._escapeHTML(s);
				s = s.replace(/ /g, "&nbsp;");
				richText += '<span class="' + classes + '">' + s + '</span>';
			}
		}
		return richText;
	}
	
	_countRegExMatches(str, regExPattern) {
		regExPattern = new RegExp(regExPattern, "g");
		return ((str || '').match(regExPattern) || []).length;
	}

	_escapeHTML(unsafe) {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
}