// package manager = Yarn
// testing framework = Jest

// TODO: change #$# to ##+js(  )   Also, it must be paired with a domain name
// TODO: there's more "action operators" than just :style()

class AdBlockSyntaxBlock {
	string = "";
	json = "";
	html = "";
	countTrue = 0;
	countFalse = 0
	countNotSure = 0;
	
	constructor(s) {
		this.string = s;
		let lines = s.split("\n");
		for ( let lineString of lines) {
			if ( lineString !== '' ) {
				let line = new AdBlockSyntaxLine(lineString);
				this.json += line.getJSON() + "\n\n";
				this.html += line.getHTML() + "\n\n";
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
				}
			}
		}
		
		this.json = "isValid Counts: " + this.countTrue + " true, " + this.countNotSure + " not sure, " + this.countFalse + " false" + "\n\n" + this.json;
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
		} catch(e) {
			this.isValid = e;
			return;
		}
		
		return;
	}
	
	setVars() {
		this.toParse = this.string;
		this.syntax = {
			'uboPreParsingDirective': '',
			'agHint': '',
			'comment': '',
			'exception': '',
			'domain': '',
			'option': '',
			'selectorException': '',
			'selector': '',
			'abpExtendedSelector': '',
			'actionOperator': '',
			'uboScriptlet': '',
			'abpSnippet': '',
		};
	}
	
	/** dice syntax string up into the 9 categories: comment !, exception @@, domain, option $, selectorException #@#, selector ##, abpExtendedSelector #?#, actionoperator :style(), and abpSnippet #$# */
	categorizeSyntax() {
		// uboPreParsingDirective !#
		let nextTwo = this.toParse.slice(0, 2);
		if ( nextTwo == "!#" ) {
			this.syntax['uboPreParsingDirective'] = this.string;
			throw true;
		}
		
		// agHint !+
		nextTwo = this.toParse.slice(0, 2);
		if ( nextTwo == "!+" ) {
			this.syntax['agHint'] = this.string;
			throw true;
		}
		
		// comment !
		if ( this.string[0] == '!' ) {
			this.syntax['comment'] = this.string;
			throw true;
		}
		
		// exception @@
		if ( this.string[0] == '@' && this.string[1] == '@' ) {
			this.syntax['exception'] = '@@';
			this.toParse = this.string.slice(2, this.string.length);
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
		
		if ( this.syntax['exception'] && ! this.syntax['domain'] ) {
			this.errorHint = "exception @@ must have a domain";
			throw false;
		} 
		
		// option $ (example: image)
		if ( this.toParse[0] == '$' ) {
			this.syntax['option'] = this.toParse;
			// OK to have nothing before it
			// Nothing allowed after it
			return;
		}
		
		// selectorException #@#
		let nextThree = this.toParse.slice(0, 3);
		if ( nextThree == "#@#" ) {
			this.syntax['selectorException'] = this.toParse;
			// OK to have domain before it
			// OK to have +js() after it
		}
		
		// abpSnippet #$# (example: log hello world!)
		nextThree = this.toParse.slice(0, 3);
		if ( nextThree == "#$#" ) {
			this.syntax['abpSnippet'] = this.toParse;
			// Nothing allowed after it
			return;
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
				
				let matches = this.countRegExMatches(this.toParse, /:style\(|:remove\(/);
				if ( matches > 1 ) {
					this.errorHint = "Can't have action operators :style() :remove() more than once.";
					throw false;
				}
			}
		}
		
		// abpExtendedSelector #?#
		nextThree = this.toParse.slice(0, 3);
		if ( nextThree == "#?#" ) {
			
			// parse until :style() encountered
			
		}
		
		// ##+js()
		// must have domain
		// some special cases: #@#+js() is OK
		// are multiple allowed? Not sure. uBlock validator says yes. I can't find any double examples in filter lists though
		
		// cosmetic filters look similar to action operators, but we will just treat them as part of CSS selectors
		// :has(...), :has-text(...), :if(...), :if-not(...), :matches-css(...), :matches-css-before(...), :matches-css-after(...), :min-text-length(n), :not(...), :nth-ancestor(n), :upward(arg), :watch-attr(...), :xpath(...)
		
		// HTML filters take the form ##^stuff
		// Example: example.com##^script:has-text(7c9e3a5d51cdacfc)
		// we will just treat these as CSS selectors
		
		// action operators :remove() :style()
		// only 1 allowed per document
		// must be "trailing operator", that is, at the end of the filter
		
		// For reference: "nothing allowed before it" code is:
		// if ( this.string !== this.toParse ) throw false;
	}
	
	left(string, length) {
		return string.slice(0, length);
	}
	
	countRegExMatches(str, regExPattern) {
		regExPattern = new RegExp(regExPattern, "g");
		console.log(regExPattern);
		return ((str || '').match(regExPattern) || []).length;
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
	
	getHTML() {
		// TODO
		return "";
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

function escapeHTML(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
 
 function unescapeHTML(input) {
    return input
         .replace("&amp;", /&/g)
         .replace("&lt;", /</g)
         .replace("&gt;", />/g)
         .replace("&quot;", /"/g)
         .replace("&#039;", /'/g);
}

// This line not optional. Content loads top to bottom. Need to wait until DOM is fully loaded.
window.addEventListener('DOMContentLoaded', (e) => {
	let input = document.getElementById('input');
	let analyze = document.getElementById('analyze');
	let json = document.getElementById('json');
	let html = document.getElementById('html');
	
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
		let block = new AdBlockSyntaxBlock(input.value);
		json.value = block.json;
		html.value = block.html;
	});
});