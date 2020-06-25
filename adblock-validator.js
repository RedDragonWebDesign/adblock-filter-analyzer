// package manager = Yarn
// testing framework = Jest

// TODO: change #$# to ##+js(  )   Also, it must be paired with a domain name
// TODO: there's more "action operators" than just :style()

class AdBlockSyntaxLine {
	string = "";
	toParse = "";
	syntax = {};
	
	isValidSyntax(s) {
		this.string = s;
		this.setVars();
		
		try {
			this.categorizeSyntax();
			this.splitCommas();
			this.validateEachCategory();
		} catch(e) {
			return e;
		}
		
		return "not sure";
	}
	
	setVars() {
		this.toParse = this.string;
		this.syntax = {
			'comment': '',
			'exception': '',
			'domain': '',
			'property': '',
			'elementException': '',
			'element': '',
			'complicatedElement': '',
			'style': '',
			'snippet': '',
		};
	}
	
	/** dice syntax string up into the 9 categories: comment !, exception @@, domain, property $, elementException #@#, element ##, complicatedElement #?#, style :style(), and snippet #$# */
	categorizeSyntax() {
		// comment !
		if ( this.string[0] == '!' ) {
			this.syntax['comment'] = this.string;
			throw true;
		}
		
		// exception @@
		if ( this.string[0] == '@' && this.string[1] == '@' ) {
			this.syntax['exception'] = '@@';
			this.toParse = this.string.slice(2, this.string.length);
			// @@ statements may not contain #@# ## #?# :style() #$#
			if ( this.toParse.search(/#@#|##|#\?#|:style\(|#\$#/) !== -1 ) throw false;
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
		
		// no spaces allowed in domain name
		if ( this.syntax['domain'] && this.syntax['domain'].search(/ /) !== -1 ) {
			throw false;
		}
		
		// exception @@ must have a domain
		if ( this.syntax['exception'] && ! this.syntax['domain'] ) {
			throw false;
		} 
		
		// property $ (example: image)
		if ( this.toParse[0] == '$' ) {
			this.syntax['property'] = this.toParse;
			// Nothing allowed after this one
			return;
		}
		
		// elementException #@#
		let nextThree = this.toParse.slice(0, 3);
		if ( nextThree == "#@#" ) {
			this.syntax['elementException'] = this.toParse;
			// Nothing allowed before this one
			if ( this.string !== this.toParse ) throw false;
			// Nothing allowed after this one
			return;
		}
		
		// snippet #$# (example: log hello world!)
		nextThree = this.toParse.slice(0, 3);
		if ( nextThree == "#$#" ) {
			this.syntax['snippet'] = this.toParse;
			// Nothing allowed after this one
			return;
		}
		
		// element ##
		let nextTwo = this.toParse.slice(0, 2);
		if ( nextTwo == "##" ) {
			
			// parse until :style() encountered
			
		}
		
		// complicatedElement #?#
		nextThree = this.toParse.slice(0, 3);
		if ( nextThree == "#?#" ) {
			
			// parse until :style() encountered
			
		}
		
		// only 1 :style() allowed per document
	}
	
	/** split commas */
	splitCommas() {
		// domain - split by commas
		// property - split by commas
		// element - split by commas
		// complicatedElement - split by commas
		// elementException - split by commas
		// snippet - split by SEMICOLONS
		// style - split by SEMICOLONS
	}
	
	/** now, do validation on each individual category */
	validateEachCategory() {
		// note: element syntax is definitely case sensitive. URL's might be too
	}
	
	getAnalysis() {
		let s = JSON.stringify(this.syntax);
		// add enters after commas
		s = s.replace(/",/g, '",\r\n');
		return s;
	}
}
// module.exports = isValidSyntax;

/*
class AdBlock {
	static isValid(inputString) {
		stack = [];
		closingStack = []; // Punctuation that we need to see by the end of the line for syntax to be valid. Closing parentheses style things like ) ] }
		
		
		
		return true;
	}
}
*/

// This line not optional. Content loads top to bottom. Need to wait until DOM is fully loaded.
window.addEventListener('DOMContentLoaded', (e) => {
	let input = document.getElementById('input');
	let analyze = document.getElementById('analyze');
	let output = document.getElementById('output');
	let valid = document.getElementById('valid');
	
	analyze.addEventListener('click', function(e) {
		let absl = new AdBlockSyntaxLine();
		valid.value = absl.isValidSyntax(input.value);
		output.value = absl.getAnalysis();
	});
});