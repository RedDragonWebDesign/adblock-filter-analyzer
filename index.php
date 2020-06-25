<!DOCTYPE html>

<html lang="en-us">

<head>
	<title></title>
	<link rel="stylesheet" href="style.css">
	<script src="adblock-validator.js"></script>
	<!-- needed for module.exports to work, which is needed for Jest testing framework -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"></script>
</head>

<body>
	<h1>
	AdBlock Filter Syntax<br />
	Validator & Analyzer
	</h1>
	
	<p>
	This is a tool that you can copy/paste AdBlock filters (also known as Static Filter Syntax) into and get an explanation of what every piece of syntax does. Good for learning.
	</p>
	
	<p>
	You can also write your own filters and paste them in here to verify that you wrote them correctly.
	</p>
	
	<p>
	Input:<br />
	<textarea id="input">@@domain.com$test, test, test</textarea>
	</p>
	
	<p>
	<button id="analyze">Analyze</button>
	</p>
	
	<p>
	Valid?<br />
	<input id="valid" type="text" value="" disabled />
	</p>
	
	<p>
	Analysis:<br />
	<!-- TODO: change this to HTML, color code each "syntax" differently, when hovering over each syntax with mouse display a tooltip with the info -->
	<textarea id="output" disabled></textarea>
	</p>
	
	<p>
	This project is is in progress. Want to <a href="https://github.com/GeneralKenobi1/adblock-validator">help with development</a>? Want to <a href="https://github.com/GeneralKenobi1/adblock-validator/issues">report a bug</a>? Visit our GitHub!
	</p>
	
	<p>
	Reference documents:<br />
	<a href="https://help.eyeo.com/en/adblockplus/how-to-write-filters">Eyeo.com - How To Write Filters</a><br />
	<a href="https://help.eyeo.com/en/adblockplus/snippet-filters-tutorial">Eyeo.com - Snippet Filters Tutorial</a><br />
	<a href="https://github.com/gorhill/uBlock/wiki/Static-filter-syntax">GitHub.com - uBlock Origin's additions to the AdBlock language</a><br />
	<a href="https://adblockplus.org/en/filter-cheatsheet">AdBlockPlus.org - Filter Cheat Sheet</a><br />
	</p>
</body>

</html>
