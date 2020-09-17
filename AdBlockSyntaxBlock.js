// Copyright https://www.RedDragonWebDesign.com/ All rights reserved.

"use strict";

import { AdBlockSyntaxLine }  from './AdBlockSyntaxLine.js';

export class AdBlockSyntaxBlock {
	string = "";
	json = "";
	richText = "";
	countTrue = 0;
	countFalse = 0
	countNotSure = 0;
	countComments = 0;
	countMismatches = 0;
	lineCount = 0;
	
	parseString(s) {
		this._parse(s);
	}
	
	_unescapeHTML(input) {
		return input
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, "\"")
			.replace(/&#039;/g, "'");
	}
	
	parseRichText(richText) {
		let s = richText;
		// remove spans
		s = s.replace(/<span class=\".*?\">/g, "");
		s = s.replace(/<\/span>/g, "");
		// convert <br> to \n
		s = s.replace(/<br>/g, "\n");
		// remove <div> </div> - these are placed when the user hits enter
		s = s.replace(/<div>/g, "\n");
		s = s.replace(/<\/div>/g, "");
		// remove <font color="#000000"> </font> - these are placed when the user hits enter
		s = s.replace(/<font.*?>/g, "");
		s = s.replace(/<\/font>/g, "");
		// remove &nbsp;
		s = s.replace(/&nbsp;/g, " ");
		// replace tab with 4 spaces
		s = s.replace(/\t/g, "    ");
		s = this._unescapeHTML(s);
		this._parse(s);
	}
	
	getRichText() {
		return this.richText;
	}
	
	getJSON() {
		return this.json;
	}
	
	getLineCount() {
		return this.lineCount;
	}
	
	_parse(s) {
		this.string = s;
		let lines = s.split("\n");
		this.lineCount = lines.length - 1; // I'm not sure why array has an extra line, but it does, subtract 1 line from count
		let counter = 0;
		for ( let lineString of lines) {
			if ( lineString !== '' ) {
				let line = new AdBlockSyntaxLine(lineString);
				// A large amount of JSON slows down the program. Only do JSON for first few errors.
				if ( ( line.isValid === false || line.isValid === "mismatch" ) && counter < 25 ) {
					counter++;
					this.json += line.getJSON() + "\n\n";
				}
				this.richText += line.getRichText();
			
				// increment the true/false counters
				this._incrementCounters(line);
			}
			// NOTE: even though contenteditable="true" uses <div></div> for enter, we must convert it to <br>, because a blank innerHTML <div></div> does not render as enter
			this.richText += "<br>";
		}
		this.richText = this.richText.slice(0, this.richText.length - 4);
		
		// fix \n\n at end
		if ( this.json ) {
			this.json = this.json.slice(0, length - 2);
		}
		
		this.json = this.countFalse + " errors, "
			+ this.countMismatches + " mismatches"
			+ "\n"
			+ "For speed reasons, only the first few errors will be shown."
			+ "\n\n"
			+ this.json;
	}
	
	_incrementCounters(line) {
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