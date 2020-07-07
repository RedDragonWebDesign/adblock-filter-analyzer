// Copyright https://www.RedDragonWebDesign.com/
// Permission required to use or copy code. All rights reserved.

"use strict";

import { Helper } from './Helper.js';

export class AdBlockSyntaxLine {
	string = "";
	toParse = "";
	// TODO: refactor this to have sub arrays, such as "code", "isValid", "tooltipText", etc.
	syntax = {
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
		'actionOperator': '', // :style() :remove()
	};
	isValid = "not sure";
	errorHint = "";
	
	constructor(s) {
		this.string = s;
		this.toParse = this.string;
		
		try {
			this._categorizeSyntax();
			this._splitCommas();
			this._validateEachCategory();
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
		let s = this.string;
		s = s.replace(/^\/.*?[^\\]\//g, '');
		s = s.replace(/^@@\/.*?[^\\]\//g, '@@');
		
		// look for double selectors $ #@# ## ##^ #@#^ #?# ##+js( #@#+js( #$#
		// had to take out $, too many false positives, it's used in CSS and +js()
		let count = Helper.countRegExMatches(s, /\#@#|##|##\^|#@#\^|#\?#|##\+js\(|#@#\+js\(|#\$#/);
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
		
		// actionOperators not allowed to be paired with ##+js( #@#+js( #$# $
		// TODO: probably also need to ban pairing with #@#|##|##^|#@#^|#?#| but so far :style() passes ubo validator, :remove() fails
		let bannedSyntaxPresent = (
			this.syntax['uboScriptlet'] ||
			this.syntax['uboScriptletException'] ||
			this.syntax['abpSnippet'] ||
			this.syntax['option']
		);
		let countActionOperators = Helper.countRegExMatches(s, /:style\(|:remove\(/);
		if ( bannedSyntaxPresent && countActionOperators ) {
			this.errorHint = "actionOperators :style() :remove() cannot be used with ##+js( #@#+js( #$# $";
			throw false;
		}
		
		// @@exceptions may not contain any selectors except options
		count = Helper.countRegExMatches(s, /\#@#|##|##\^|#@#\^|#\?#|##\+js\(|#@#\+js\(|#\$#|:style\(|:remove\(/);
		let exception = ( this.syntax['exception'] || this.syntax['exceptionRegEx'] );
		if ( exception && count ) {
			this.errorHint = "@@ statements may not contain selector-ish syntax $ #@# ## ##^ #@#^ #?# ##+js( #@#+js( #$# or action operators :style() :remove()"
			throw false;
		}
		
		// ##+js() #@#+js() :style() :remove() must end in )
		let lastChar = s.right(1);
		let shouldEndInParenthesis = ( this.syntax['uboScriptlet'] ||  this.syntax['uboScriptletException'] ||  this.syntax['actionOperator'] );
		if ( shouldEndInParenthesis && lastChar !== ')' ) {
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
		this._lookForComments();
		this._lookForDomains();
		// lookForActionOperators needs to come before lookForSelectors, even though actionOperators appear after selectors in the string.
		this._lookForActionOperators();
		this._lookForSelectors();
	}
		
	_lookForComments() {	
		// uboPreParsingDirective !#
		if ( this.toParse.left(2) === "!#" ) {
			this.syntax['uboPreParsingDirective'] = this.string;
			throw "not sure";
		}
		
		// agHint !+
		if ( this.toParse.left(2) === "!+" ) {
			this.syntax['agHint'] = this.string;
			throw "not sure";
		}
		
		// comment ! [
		if ( this.string.left(1) === '!' || this.string.left(1) === '[' ) {
			this.syntax['comment'] = this.string;
			throw true;
		}
	}
	
	_lookForDomains() {
		// domainRegEx /regex/
		let matchPos = this.toParse.search(/^\/.*?[^\\]\//);
		let regExLookingStringFound = (matchPos !== -1);
		let toParse = this.toParse.replace(/^\/.*?[^\\]\//, '');
		let regEx = this.toParse.left(this.toParse.length - toParse.length);
		let selectorAfterRegEx = (toParse.search(/^(\$|#@#|##|##\^|#@#\^|#\?#|##\+js\(|#@#\+js\(|#\$#)/) !== -1);
		let nothingAfterRegEx = (toParse.length === 0);
		if ( regExLookingStringFound && (selectorAfterRegEx || nothingAfterRegEx) ) {
			this.syntax['domainRegEx'] = regEx;
			this.toParse = toParse;
			return;
		}
		
		// exceptionRegEx @@/regex/
		matchPos = this.toParse.search(/^@@\/.*?[^\\]\//);
		regExLookingStringFound = (matchPos !== -1);
		toParse = this.toParse.replace(/^@@\/.*?[^\\]\//, '');
		regEx = this.toParse.left(this.toParse.length - toParse.length);
		selectorAfterRegEx = (toParse.search(/^(\$|#@#|##|##\^|#@#\^|#\?#|##\+js\(|#@#\+js\(|#\$#)/) !== -1);
		nothingAfterRegEx = (toParse.length === 0);
		if ( regExLookingStringFound && (selectorAfterRegEx || nothingAfterRegEx) ) {
			this.syntax['domainRegEx'] = regEx;
			this.toParse = toParse;
			return;
		}
		
		// exception @@
		let domainException = false;
		if ( this.string.left(2) === '@@' ) {
			domainException = true;
		}
		
		// domain
		// parse until $ #@# ## #?# #$#
		// str.search returns first position, when searching from left to right (good)
		matchPos = this.toParse.search(/#@#|##|#\?#|#\$#|\$/);
		// if no categories after the domain
		if ( matchPos === -1 ) {
			this.syntax['domain'] = this.toParse;
			this.toParse = '';
		} else {
			this.syntax['domain'] = this.toParse.left(matchPos);
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
		if ( this.toParse.left(1) === '$' ) {
			this.syntax['option'] = this.toParse;
			// OK to have nothing before it
			// Nothing allowed after it
			throw "not sure";
		}
		
		// abpSnippet #$# (example: log hello world!)
		if ( this.toParse.left(3) === "#$#" ) {
			this.syntax['abpSnippet'] = this.toParse;
			// Nothing allowed after it
			throw "not sure";
		}
		
		// uboScriptletException #@#+js(
		if ( this.toParse.left(7) === "#@#+js(" ) {
			this.syntax['uboScriptletException'] = this.toParse;
			// Nothing allowed after it
			throw "not sure";
		}
		
		// uboScriptlet ##+js(
		if ( this.toParse.left(6) === "##+js(" ) {
			this.syntax['uboScriptlet'] = this.toParse;
			
			// per ublock documentation, example.com##+js() when js() is empty is an error
			if ( this.syntax['uboScriptlet'] === "##+js()" ) {
				this.errorHint = "per ublock documentation, example.com##+js() when js() is empty is an error";
				throw false;
			}
			
			// Nothing allowed after it
			throw "not sure";
		}
		
		// htmlFilter ##^
		if ( this.toParse.left(3) === "##^" ) {
			this.syntax['htmlFilter'] = this.toParse;
			return;
		}
		
		// htmlFilterException #@#^
		if ( this.toParse.left(4) === "#@#^" ) {
			this.syntax['htmlFilterException'] = this.toParse;
			return;
		}
		
		// selectorException #@#
		if ( this.toParse.left(3) === "#@#" ) {
			this.syntax['selectorException'] = this.toParse;
			return;
		}
		
		// selector ##
		if ( this.toParse.left(2) === "##" ) {
			this.syntax['selector'] = this.toParse;
			return;
		}
		
		// abpExtendedSelector #?#
		if ( this.toParse.left(3) === "#?#" ) {
			this.syntax['abpExtendedSelector'] = this.toParse;
			return;
		}
	}
	
	_lookForActionOperators() {
		let matchPos = this.toParse.search(/(:style\(|:remove\().*\)$/);
		if ( matchPos !== -1 ) {
			this.syntax['actionOperator'] = this.toParse.slice(matchPos);
			this.toParse = this.toParse.left(matchPos);
		}
	}
	
	/** split commas */
	_splitCommas() {
		// domain - split by commas
		// option - split by commas
		// selector - split by commas
		// abpExtendedSelector - split by commas
		// selectorException - split by commas
		// uboScriptlet - split by commas for second level
		// abpSnippet - split by semicolon
		// actionoperator - split by SEMICOLONS
	}
	
	/** now, do validation on each individual category */
	_validateEachCategory() {
		// note: selector syntax is definitely case sensitive. URL's might be too
		
		// domain regex probably has to be all or nothing. can't mix in te/s/t because / can also be part of the URL
		
		// make sure that "cosmetic filters" in CSS selectors doesn't make filter invalid.
		// Examples of "cosmetic filters":
		// :has(...), :has-text(...), :if(...), :if-not(...), :matches-css(...), :matches-css-before(...), :matches-css-after(...), :min-text-length(n), :not(...), :nth-ancestor(n), :upward(arg), :watch-attr(...), :xpath(...)
		
		// uboScriptlet ##+js(
		// must have domain, except for certain exceptions: #@#+js()
		// are multiple allowed? Not sure. uBlock validator says yes. I can't find any double examples in filter lists though
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