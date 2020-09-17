// Copyright https://www.RedDragonWebDesign.com/ All rights reserved.

"use strict";

// https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters
export let uboPreParsingDirectives = [
	'endif',
	'if',
	'include',
];

export let uboPreParsingIfConditions = [
	'adguard',
	'adguard_app_windows',
	'adguard_ext_chromium',
	'adguard_ext_edge',
	'adguard_ext_firefox',
	'adguard_ext_opera',
	'cap_html_filtering',
	'cap_user_stylesheet',
	'env_chromium',
	'env_edge',
	'env_firefox',
	'env_mobile',
	'env_safari',
	'ext_ublock',
	'false',
];