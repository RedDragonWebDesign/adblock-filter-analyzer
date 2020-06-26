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
	This is a tool into which you can copy/paste AdBlock filters (also known as Static Filter Syntax). It'll color code and it'll give you an explanation of what every piece of syntax does. Good for learning.
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
	JSON:<br />
	<textarea id="json" disabled></textarea>
	</p>
	
	<p>
	HTML:<br />
	<textarea id="html" disabled></textarea>
	</p>
	
	<p>
	This project is in progress. <a href="https://github.com/GeneralKenobi1/adblock-validator/issues">Report bugs on GitHub.</a>
	</p>
	
	<p>
	Reference documents:<br />
	<a href="https://help.eyeo.com/en/adblockplus/how-to-write-filters">Eyeo.com - How To Write Filters</a><br />
	<a href="https://github.com/gorhill/uBlock/wiki/Static-filter-syntax">GitHub.com - uBlock Origin's additions to the AdBlock language</a><br />
	<a href="https://github.com/gorhill/uBlock/wiki/Resources-Library">GitHub.com - uBlock Origin's JavaScript Scriptlet Syntax
	<a href="https://adblockplus.org/en/filter-cheatsheet">AdBlockPlus.org - Filter Cheat Sheet</a><br />
	<a href="https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters">AdGuard.com - How to create your own ad filters</a>
	</p>
</body>

</html>