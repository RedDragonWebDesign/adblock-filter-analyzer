// Copyright https://www.RedDragonWebDesign.com/ All rights reserved.

"use strict";

// https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters
// https://github.com/gorhill/uBlock/wiki/Inline-script-tag-filtering
export let uboCosmeticFilters = [
	':has(',
	':has-text(',
	':matches-css(',
	':matches-css-before(',
	':matches-css-after(',
	':min-text-length(',
	':not(',
	':upward(',
	':watch-attr(',
	':xpath(',
	// deprecated
	':contains(', // use ##^script:has-text() instead
	':if(',
	':if-not(',
	':nth-ancestor(',
	':watch-attrs(',
];