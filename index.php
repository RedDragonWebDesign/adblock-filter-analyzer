<!DOCTYPE html>

<html lang="en-us">

<head>
	<title>AdBlock Filter Analyzer</title>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" />
	<link rel="stylesheet" href="style.css">
	<script type="module" src="adblock-filter-analyzer.js"></script>
</head>

<body>
	<h1>
	AdBlock Filter Analyzer
	</h1>
	
	<p>
	This is a tool into which you can copy/paste AdBlock filters (also known as Static Filter Syntax). It'll color code and it'll give you an explanation of what every piece of syntax does. Good for learning. Best viewed on desktop/laptop so you can hover over code and see the definition.
	</p>
	
	<p>
	<button id="clear">Clear</button>
	<select id="filter-list">
		<option value="">New Filter List</option>
		<option value="./tests/test-good-filters.txt" selected>
			Test List 1 - Should Always Pass (No Errors) (373)</option>
		<option value="./tests/test-bad-filters.txt">
			Test List 2 - Should Always Fail (Errors) (137)</option>
		<option value="./tests/test-regex.txt">
			Test List 3 - RegEx</option>
		<option value="https://raw.githubusercontent.com/gorhill/uBlock/2eec28520f540440c57e9d5a465d8a61054295ea/docs/tests/static-filtering-parser-checklist.txt">
			ubo Test List</option>
		<option value="https://cdn.jsdelivr.net/gh/uBlockOrigin/uAssets@master/filters/filters.txt">
			uBlock filters (23,503)</option>
		<option value="https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/badware.txt">
			uBlock filters - Badware risks (860)</option>
		<option value="https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/privacy.txt">
			uBlock filters - Privacy (207)</option>
		<option value="https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/resource-abuse.txt">
			uBlock filters - Resource abuse (117)</option>
		<option value="https://gitcdn.xyz/repo/uBlockOrigin/uAssets/master/filters/unbreak.txt">
			uBlock filters - Unbreak (1,463)</option>
		<option value="https://filters.adtidy.org/extension/ublock/filters/2_without_easylist.txt">
			AdGuard Base (37,577)</option>
		<option value="https://filters.adtidy.org/extension/ublock/filters/11.txt">
			AdGuard Mobile Ads</option>
		<option value="https://easylist.to/easylist/easylist.txt">
			EasyList (84,037)</option>
		<option value="https://filters.adtidy.org/extension/ublock/filters/3.txt">
			AdGuard Tracking Protection</option>
		<option value="https://easylist.to/easylist/easyprivacy.txt">
			EasyPrivacy (17,912)</option>
		<option value="https://www.fanboy.co.nz/enhancedstats.txt">
			Fanboy's Enhanced Tracking List</option>
		<option value="https://glcdn.githack.com/curben/urlhaus-filter/raw/master/urlhaus-filter-online.txt">
			Online Malicious URL Blocklist (5,586)</option>
		<option value="https://raw.githubusercontent.com/Spam404/lists/master/adblock-list.txt">
			Spam404</option>
		<option value="https://filters.adtidy.org/extension/ublock/filters/14.txt">
			AdGuard Annoyances (30,038)</option>
		<option value="https://filters.adtidy.org/extension/ublock/filters/4.txt">
			AdGuard Social Media (11,057)</option>
		<option value="https://fanboy.co.nz/fanboy-antifacebook.txt">
			Anti-Facebook (68)</option>
		<option value="https://easylist-downloads.adblockplus.org/easylist-cookie.txt">
			EasyList Cookie (17,339)</option>
		<option value="https://easylist.to/easylist/fanboy-annoyance.txt">
			Fanboy's Annoyance (55,065)</option>
		<option value="https://easylist.to/easylist/fanboy-social.txt">
			Fanboy's Social (23,862)</option>
		<option value="https://gitcdn.xyz/repo/uBlockOrigin/uAssets/master/filters/annoyances.txt">
			uBlock filters - Annoyances (3,468)</option>
		<option value="https://someonewhocares.org/hosts/hosts">
			Dan Pollock's hosts file</option>
		<option value="https://winhelp2002.mvps.org/hosts.txt">
			MVPS HOSTS</option>
		<option value="https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=1&mimetype=plaintext">
			Peter Lowe's Ad and tracking server list</option>
		<option value="https://easylist-downloads.adblockplus.org/Liste_AR.txt">
			ara: Liste AR</option>
		<option value="https://easylist-downloads.adblockplus.org/easylistchina.txt">
			CHN: EasyList China (中文)</option>
		<option value="https://raw.githubusercontent.com/easylist/EasyListHebrew/master/EasyListHebrew.txt">
			ISR: EasyList Hebrew</option>
		<option value="https://raw.githubusercontent.com/yous/YousList/master/youslist.txt">
			KOR: YousList</option>
		<option value="https://easylist-downloads.adblockplus.org/advblock+cssfixes.txt">
			RUS: RU AdList</option>
		<option value="https://raw.githubusercontent.com/yourduskquibbles/webannoyances/master/ultralist.txt">
			Web Annoyances Ultralist (33,634)</option>
	</select>
	LineCount: <span id="line-count"></span>
	ProcessTime: <span id="timer"></span>
	</p>
	
	<div id="flex-container">
		<div id="rich-text" contenteditable="true"></div>
		<div id="definition">Hover over code with your mouse to see definition.</div>
	</div>
	
	<p id="show-json-container">
	<a href="javascript:;" onclick="
		document.getElementById('json-container').style.display = 'block';
		document.getElementById('show-json-container').style.display = 'none';
	">Show Error Details</a>
	</p>
	
	<p id="json-container">
	Error Details:<br />
	<textarea id="json" disabled></textarea>
	</p>
	
	<p>
	<a href="tooltips.php">List Of Categories</a>
	</p>
	
	<p>
	Want to report a bug or request a feature? <a href="https://github.com/RedDragonWebDesign/adblock-filter-analyzer/issues">Create an issue</a> on our GitHub.
	</p>
	
	<h2>
	Reference Documents
	</h2>
	
	<p>
	<a href="https://help.eyeo.com/en/adblockplus/how-to-write-filters">AdBlockPlus - How To Write Filters</a><br />
	<a href="https://github.com/gorhill/uBlock/wiki/Static-filter-syntax">uBlockOrigin - uBlock Origin's additions to the AdBlock language</a><br />
	<a href="https://github.com/gorhill/uBlock/wiki/Resources-Library">uBlockOrigin - uBlock Origin's JavaScript Scriptlet Syntax</a><br />
	<a href="https://adblockplus.org/en/filter-cheatsheet">AdBlockPlus - Filter Cheat Sheet</a><br />
	<a href="https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters">AdGuard - How to create your own ad filters</a>
	</p>
	
	<h2>Features</h2>

	<ul>
	<li>Mainly a code coloring and learning tool. But does some validation too.</li>
	<li>Handles very large files (30,000 lines will take a couple of seconds, but will parse)</li>
	<li>Gives an error count and detailed error report</li>
	<li>Colors 29 different kinds of syntax</li>
	<li>Checks for some common errors</li>
	<li>Validates RegEx</li>
	<li>Checks options and uboScriptlets against a list of valid functions, marks as error if not found.</li>
	<li>Colors and error checks as you type</li>
	</ul>

</body>

</html>