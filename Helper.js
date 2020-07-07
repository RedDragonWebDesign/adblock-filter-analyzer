// Copyright https://www.RedDragonWebDesign.com/
// Permission required to use or copy code. All rights reserved.

"use strict";

export class Helper {
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
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, "\"")
			.replace(/&#039;/g, "'");
	}
	
	/** Find the different characters between two strings. If the new string is shorter, it will return "" */
	static findDiff(originalStr, newStr){ 
		if ( originalStr.length > newStr.length ) return "";
        var i = 0; // originalStr pointer
        var j = 0; // newStr pointer
        var result = "";

        while (j < newStr.length) {
			if (originalStr[i] != newStr[j] || i == originalStr.length) {
				result += newStr[j];
			} else {
				i++;
			}
			j++;
        }
        return result;
	}
	
	static findDiffLocation(originalStr, newStr){ 
		if ( originalStr.length > newStr.length ) return "";
        var i = 0; // originalStr pointer
        var j = 0; // newStr pointer
        var result = "";

        while (j < newStr.length) {
			if (originalStr[i] != newStr[j] || i == originalStr.length) {
				return i;
			} else {
				i++;
			}
			j++;
        }
        return result;
	}
}