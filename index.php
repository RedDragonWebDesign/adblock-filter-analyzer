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
	This is a tool into which you can copy/paste AdBlock filters (also known as Static Filter Syntax). It'll color code and it'll give you an explanation of what every piece of syntax does. Good for learning. Best viewed on desktop/laptop so you can hover over code and see the tooltips.
	</p>
	
	<p>
	<div id="rich-text" contenteditable="true"></div>
	</p>
	
	<p id="show-json-container">
	<a href="javascript:;" onclick="document.getElementById('json-container').style.display = 'block'; document.getElementById('show-json-container').style.display = 'none';">Show Error Details</a>
	</p>
	
	<p id="json-container">
	Error Details:<br />
	<textarea id="json" disabled></textarea>
	</p>
	
	<p>
	<a href="tooltips.php">List Of Categories</a>
	</p>
	
	<p>
	Want to report a bug or request a feature? <a href="https://github.com/GeneralKenobi1/adblock-filter-analyzer/issues">Create an issue</a> on our GitHub.
	</p>
	
	<p>
	Reference documents:<br />
	<a href="https://help.eyeo.com/en/adblockplus/how-to-write-filters">AdBlockPlus - How To Write Filters</a><br />
	<a href="https://github.com/gorhill/uBlock/wiki/Static-filter-syntax">uBlockOrigin - uBlock Origin's additions to the AdBlock language</a><br />
	<a href="https://github.com/gorhill/uBlock/wiki/Resources-Library">uBlockOrigin - uBlock Origin's JavaScript Scriptlet Syntax</a><br />
	<a href="https://adblockplus.org/en/filter-cheatsheet">AdBlockPlus - Filter Cheat Sheet</a><br />
	<a href="https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters">AdGuard - How to create your own ad filters</a>
	</p>
</body>

</html>