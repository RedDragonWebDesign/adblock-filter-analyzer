// Copyright https://www.RedDragonWebDesign.com/
// Permission required to use or copy code. All rights reserved.

"use strict";

// https://help.eyeo.com/en/adblockplus/how-to-write-filters#elemhide-emulation
// https://easylist-downloads.adblockplus.org/abp-filters-anti-cv.txt
export let abpExtendedSelectors = [
	':-abp-has(',
	':-abp-contains(',
	':-abp-properties(',
];