<!DOCTYPE html>

<html lang="en-us">

<head>
	<title>AdBlock Filter Categories</title>
	<link rel="stylesheet" href="style.css">
	<script type="module" src="tooltips.js"></script>
</head>

<body>
	<h1>
	AdBlock Filter Categories
	</h1>
	
	<div id="viewer">
	</div>
	
	<script type="module">
		import { tooltips } from './tooltips.js';
		
		let viewer = document.getElementById('viewer');
		
		for ( let key in tooltips ) {
			let descriptionText = `<h2><span class="` + key + `">` + key + `</span></h2>` + tooltips[key];
			descriptionText = `<div style="border:1px solid black; width: 600px;">` + descriptionText + "</div>";
			viewer.innerHTML += descriptionText;
		}
	</script>
</body>

</html>