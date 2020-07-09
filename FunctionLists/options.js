// Copyright https://www.RedDragonWebDesign.com/
// Permission required to use or copy code. All rights reserved.

"use strict";

// [a-z0-9\-~]  no capital letters allowed
export let optionsWithoutEquals = [
	'1p',
	'3p',
	'all',
	'badfilter',
	'cname',
	'csp', // allowed both without equals and with equals
	'css',
	'doc',
	'document',
	'ehide',
	'elemhide',
	'empty',
	'first-party',
	'font',
	'frame',
	// 'genericblock', // not supported by ubo
	'generichide',
	'ghide',
	'image',
	'important',
	'inline-font',
	'inline-script',
	'match-case',
	'media',
	'mp4',
	'object',
	'other',
	'ping',
	'popunder',
	'popup',
	'script',
	'shide',
	'specifichide',
	'stylesheet',
	'subdocument',
	'third-party',
	'webrtc',
	'websocket',
	'xhr',
	'xmlhttprequest',
];

export let optionsWithEquals = [
	'csp', // = [a-z\-:' ]  // allowed both without equals and with equals
	'denyallow', // = [a-z.|]
	'domain', // = [~|a-z.]
	'redirect', // = [a-z0-9\-./]
	'redirect-rule', // = [a-z0-9\-./]
	'rewrite', // = [a-z\-:]
	'sitekey', // = [a-z]
];