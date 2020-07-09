// Copyright https://www.RedDragonWebDesign.com/
// Permission required to use or copy code. All rights reserved.

"use strict";

import { Helper } from './Helper.js';
import { optionsWithoutEquals, optionsWithEquals } from './FunctionLists/options.js';
import { uboScriptlets } from './FunctionLists/uboScriptlets.js';

export class AdBlockSyntaxLine {
	string = "";
	toParse = "";
	// TODO: refactor this to have sub arrays, such as "code", "isValid", "tooltipText", etc.
	syntax = {
		'whitespaceFront': '',
		'uboPreParsingDirective': '', // !#
		'agHint': '', // !+
		'comment': '', // !
		'exception': '', // @@
		'exceptionRegEx': '', // @@/regex/
		'domainRegEx': '', // /regex/
		'domain': '',
		'option': '', // $
		'selectorException': '', // #@#
		'selector': '', // ##
		'htmlFilter': '', // ##^
		'htmlFilterException': '', // #@#^
		'abpExtendedSelector': '', // #?#
		'uboScriptlet': '', // ##+js()
		'uboScriptletException': '', // #@#+js()
		'abpSnippet': '', // #$#
		'agCSSInjectionSelector': '', // #$?#
		'agJSRule': '', // #%#
		'agJSException': '', // #@%#
		// actionOperator type stuff must be on the bottom of this array, to make sure _checkForMismatch rebuilds the string in the correct order
		'actionOperator': '', // :style() :remove()
		'agCSSInjectionCSS': '', // { }
		'whitespaceBack': '',
	};
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
		let count = Helper.countRegExMatches(s, /\#@#|##|##\^|#@#\^|#\?#|##\+js\(|#@#\+js\(|#\$#|#\$\?#|#%#|#@%#/);
		if ( count > 1 ) {
			this.errorHint = "selector-ish syntax $ #@# ## ##^ #@#^ #?# ##+js( #@#+js( #$# is only allowed once per filter";
			throw false;
		}
		
		// look for double actionOperators
		count = Helper.countRegExMatches(s, /:style\(|:remove\(/);
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
		let countActionOperators = Helper.countRegExMatches(s, /:style\(|:remove\(/);
		if ( bannedSyntaxPresent && countActionOperators ) {
			this.errorHint = "actionOperators :style() :remove() cannot be used with ##+js( #@#+js( #$# $";
			throw false;
		}
		
		// @@exceptions may not contain any selectors except options
		count = Helper.countRegExMatches(s, /\#@#|##|##\^|#@#\^|#\?#|##\+js\(|#@#\+js\(|#\$#|:style\(|:remove\(|#\$\?#|#%#|#@%#|\{.*\}/);
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
		this._lookForDomains();
		// lookForActionOperators needs to come before lookForSelectors, even though actionOperators appear after selectors in the string.
		this._lookForActionOperators();
		this._lookForSelectors();
	}
	
	_lookForWhitespace() {
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
		
	_lookForComments() {	
		// uboPreParsingDirective !#
		if ( this.toParse.search(/!#[a-zA-Z0-9]/) !== -1 ) {
			this.syntax['uboPreParsingDirective'] = this.string;
			throw "not sure";
		}
		
		// agHint !+
		if ( this.toParse.startsWith('!+') ) {
			this.syntax['agHint'] = this.string;
			throw "not sure";
		}
		
		// comment ! [
		if ( this.string.startsWith('!') || this.string.startsWith('[') ) {
			this.syntax['comment'] = this.string;
			throw true;
		}
	}
	
	_lookForDomains() {
		let regEx, hasRegEx, noRegEx, hasSelector, hasNothingElse;
		
		// domainRegEx /regex/
		hasRegEx = (this.toParse.search(/^\/.*?[^\\]\//) !== -1);
		noRegEx = this.toParse.replace(/^\/.*?[^\\]\//, '');
		hasSelector = (noRegEx.search(/^\$|#@#|##|##\^|#@#\^|#\?#|##\+js\(|#@#\+js\(|#\$#|#\$\?#|#%#|#@%#/) !== -1);
		hasNothingElse = (noRegEx.length === 0);
		if ( hasRegEx && (hasSelector || hasNothingElse) ) {
			regEx = this.toParse.slice(0, this.toParse.length - noRegEx.length);
			this.syntax['domainRegEx'] = regEx;
			this.toParse = noRegEx;
			return;
		}
		
		// exceptionRegEx @@/regex/
		hasRegEx = (this.toParse.search(/^@@\/.*?[^\\]\//) !== -1);
		noRegEx = this.toParse.replace(/^@@\/.*?[^\\]\//, '');
		hasSelector = (noRegEx.search(/^\$|#@#|##|##\^|#@#\^|#\?#|##\+js\(|#@#\+js\(|#\$#|#\$\?#|#%#|#@%#/) !== -1);
		hasNothingElse = (noRegEx.length === 0);
		if ( hasRegEx && (hasSelector || hasNothingElse) ) {
			regEx = this.toParse.slice(0, this.toParse.length - noRegEx.length);
			this.syntax['exceptionRegEx'] = regEx;
			this.toParse = noRegEx;
			return;
		}
		
		// exception @@
		let domainException = false;
		if ( this.string.startsWith('@@') ) {
			domainException = true;
		}
		
		// domain
		// parse until $ #@# ## #?# #$# #$?# #%# #@%#
		// str.search returns first position, when searching from left to right (good)
		let matchPos = this.toParse.search(/#@#|##|#\?#|#\$#|\$|#\$\?#|#%#|#@%#/);
		// if no categories after the domain
		if ( matchPos === -1 ) {
			this.syntax['domain'] = this.toParse;
			this.toParse = '';
		} else {
			this.syntax['domain'] = this.toParse.slice(0, matchPos);
			this.toParse = this.toParse.slice(matchPos);
		}
		
		// exception @@ must have a domain
		if ( domainException && ! this.syntax['domain'] ) {
			this.errorHint = "exception @@ must have a domain";
			throw false;
		}
		
		// exception @@
		if ( domainException ) {
			this.syntax['exception'] = this.syntax['domain'];
			this.syntax['domain'] = "";
		}
	}
	
	_lookForSelectors() {
		// option $ (example: image)
		if ( this.toParse.startsWith('$') ) {
			this.syntax['option'] = this.toParse;
			// OK to have nothing before it
			// Nothing allowed after it
			throw "not sure";
		}
		
		// abpSnippet #$# (example: log hello world!)
		if ( this.toParse.startsWith('#$#') ) {
			this.syntax['abpSnippet'] = this.toParse;
			// Nothing allowed after it
			throw "not sure";
		}
		
		// uboScriptletException #@#+js(
		if ( this.toParse.startsWith('#@#+js(') ) {
			this.syntax['uboScriptletException'] = this.toParse;
			// Nothing allowed after it
			throw "not sure";
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
		
		// selectorException #@#
		if ( this.toParse.startsWith('#@#') ) {
			this.syntax['selectorException'] = this.toParse;
			return;
		}
		
		// selector ##
		if ( this.toParse.startsWith('##') ) {
			this.syntax['selector'] = this.toParse;
			return;
		}
		
		// abpExtendedSelector #?#
		if ( this.toParse.startsWith('#?#') ) {
			this.syntax['abpExtendedSelector'] = this.toParse;
			return;
		}
		
		// agCSSInjectionSelector #$?#
		if ( this.toParse.startsWith('#$?#') ) {
			this.syntax['agCSSInjectionSelector'] = this.toParse;
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
			this.syntax['agCSSInjectionCSS'] = this.toParse.slice(matchPos);
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
			let hasEquals = /^(.*)=.*$/.exec(value);
			
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
		
		// uboPreParsingDirective !#
		// agHint !+
		// exception @@
		// domain
		// selectorException #@#
		// selector ##
		// htmlFilter ##^
		// htmlFilterException #@#^
		// abpExtendedSelector #?#
		// abpSnippet #$#
		// actionOperator :style() :remove()		
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
			console.log(this.string + " || Invalid js() || " + trimmed);
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
				s = Helper.escapeHTML(s);
				s = s.replace(/ /g, "&nbsp;");
				richText += '<span class="' + classes + '">' + s + '</span>';
			}
		}
		return richText;
	}
}