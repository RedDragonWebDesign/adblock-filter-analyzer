export let tooltips =  {
	'uboPreParsingDirective': // !#
		`<ul>
		<li>@syntax - !#</li>
		<li>@name - uBlock Origin Pre-Parsing Directive</li>
		<li>@description - The pre-parsing directives are executed before a list content is parsed, and influence the final content of a filter list.</li>
		<li>@example - !#include ublock-filters.txt</li>
		<li>@documentation - <a href="https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#pre-parsing-directives">uBlock Origin Wiki</a></li>
		<li>@plugin-variations - May only work for uBlock Origin</li>
		<li>@special-characters - !not</li>
		<li>@function-library - </li>
		<li>@tip - </li>
		</ul>`,
	'agHint': // !+
		`<ul>
		<li>@syntax - !+</li>
		<li>@name - AdGuard Hint</li>
		<li>@description - </li>
		<li>@example - !+ NOT_OPTIMIZED PLATFORM(android)</li>
		<li>@documentation - <a href="https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#hints-1">AdGuard.com KB</a></li>
		<li>@plugin-variations - May only work for AdGuard</li>
		<li>@special-characters -</li>
		<li>@function-library - </li>
		<li>@tip - </li>
		</ul>`,
	'comment': // !
		`<ul>
		<li>@syntax - ! or [</li>
		<li>@name - Comment</li>
		<li>@description - </li>
		<li>@example - ! this is a comment</li>
		<li>@documentation - <a href="https://help.eyeo.com/en/adblockplus/how-to-write-filters#comments">AdBlockPlus How To</a></li>
		<li>@plugin-variations - </li>
		<li>@special-characters -</li>
		<li>@function-library - </li>
		<li>@tip - </li>
		</ul>`,
	'domain':
		`<ul>
		<li>@syntax - </li>
		<li>@name - URL To Block</li>
		<li>@description - </li>
		<li>@example - ||picreel.com^</li>
		<li>@documentation - <a href="https://adblockplus.org/en/filter-cheatsheet">AdBlockPlus Cheat Sheet</a></li>
		<li>@plugin-variations - uBlock Origin will silently convert example.com to ||example.com^ <a href="https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#hosts-files">[More Info]</a></li>
		<li>@special-characters -
			<a href="https://adblockplus.org/filter-cheatsheet#blocking2">||domainNameAnchor</a>,
			<a href="https://adblockplus.org/filter-cheatsheet#blocking2">^separator</a>,
			<a href="https://adblockplus.org/filter-cheatsheet#blocking3">|anchor</a>,
			<a href="https://adblockplus.org/filter-cheatsheet#blocking1">*wildcard</a>,
			,multiple</li>
		<li>@function-library - </li>
		<li>@tip - Ad blockers add an invisible wildcard to the beginning and end of the URL you type in. Use the special characters above to set limits on these wildcards.</li>
		</ul>`,
	'exception': // @@
		`<ul>
		<li>@syntax - @@</li>
		<li>@name - Exception URL</li>
		<li>@description - </li>
		<li>@example - @@||cdn.optimizely.com/js/*.js</li>
		<li>@documentation - <a href="https://help.eyeo.com/en/adblockplus/how-to-write-filters#whitelist">AdBlockPlus How To</a></li>
		<li>@plugin-variations - AdBlockPlus will add a wildcard at the beginning and end of all URL's. uBlock Origin will do the same, with one exception: it silently converts example.com to ||example.com^. <a href="https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#hosts-files">More Info</a></li>
		<li>@special-characters -
			<a href="https://adblockplus.org/filter-cheatsheet#blocking2">||domainNameAnchor</a>,
			<a href="https://adblockplus.org/filter-cheatsheet#blocking2">^separator</a>,
			<a href="https://adblockplus.org/filter-cheatsheet#blocking3">|anchor</a>,
			<a href="https://adblockplus.org/filter-cheatsheet#blocking1">*wildcard</a>,
			,multiple</li>
		<li>@function-library - </li>
		<li>@tip - </li>
		</ul>`,
	'domainRegEx': // /regex/
		`<ul>
		<li>@syntax - /regex/</li>
		<li>@name - URL To Block that uses Regular Expressions</li>
		<li>@description - </li>
		<li>@example - /^https://www\.narcity\.com/assets/[0-9a-f]{24,}\.js/</li>
		<li>@documentation - <a href="https://help.eyeo.com/en/adblockplus/how-to-write-filters#regexps">AdBlockPlus How To</a>, <a href="https://regexone.com/">RegEx Tutorial</a></li>
		<li>@plugin-variations - </li>
		<li>@special-characters - RegEx -[]{}()*+?.,\^$|#/</li>
		<li>@function-library - </li>
		<li>@tip - </li>
		</ul>`,
	'exceptionRegEx': // @@/regex/
		`<ul>
		<li>@syntax - @@/regex/</li>
		<li>@name - Exception URL that uses Regular Expressions</li>
		<li>@description - </li>
		<li>@example - </li>
		<li>@documentation - <a href="https://help.eyeo.com/en/adblockplus/how-to-write-filters#regexps">AdBlockPlus How To</a>, <a href="https://regexone.com/">RegEx Tutorial</a></li>
		<li>@plugin-variations - </li>
		<li>@special-characters - RegEx -[]{}()*+?.,\^$|#/</li>
		<li>@function-library - </li>
		<li>@tip - </li>
		</ul>`, // TODO: make sure that this line displays correctly
	'option': // $
		`<ul>
		<li>@syntax - $</li>
		<li>@name - Filter Option</li>
		<li>@description - </li>
		<li>@example - $script,domain=bloombergquint.com|dnaindia.com</li>
		<li>@documentation - <a href="https://help.eyeo.com/en/adblockplus/how-to-write-filters#options">AdBlockPlus How To</a></li>
		<li>@plugin-variations - </li>
		<li>@special-characters - ~except |or ,multiple =list</li>
		<li>@function-library - </li>
		<li>@tip - </li>
		</ul>`,
	'selectorException': // #@#
		`<ul>
		<li>@syntax - #@#</li>
		<li>@name - CSS Selector Exception</li>
		<li>@description - </li>
		<li>@example - #@#.social-footer-wrapper</li>
		<li>@documentation - <a href="https://help.eyeo.com/en/adblockplus/how-to-write-filters#elemhide_exceptions">AdBlockPlus How To</a>, <a href="https://www.w3schools.com/cssref/css_selectors.asp">W3Schools CSS Selectors</a></li>
		<li>@plugin-variations - </li>
		<li>@special-characters - CSS Selectors .#*,>+~[]=|^$:()</li>
		<li>@function-library - </li>
		<li>@tip - </li>
		</ul>`,
	'selector': // ##
		`<ul>
		<li>@syntax - ##</li>
		<li>@name - CSS Selector</li>
		<li>@description - </li>
		<li>@example - ##.component-sticky.site-header div[style*="overflow: hidden; height:"]</li>
		<li>@documentation - <a href="https://help.eyeo.com/en/adblockplus/how-to-write-filters#content-filters">AdBlockPlus How To</a>, <a href="https://www.w3schools.com/cssref/css_selectors.asp">W3Schools CSS Selectors</a></li>
		<li>@plugin-variations - </li>
		<li>@special-characters - CSS Selectors .#*,>+~[]=|^$:()</li>
		<li>@function-library - </li>
		<li>@tip - Blocking an element by #id or .class are the most common. You'd type this in as example.com###id or example.com##.class</li>
		</ul>`,
	'htmlFilter': // ##^
		`<ul>
		<li>@syntax - ##^</li>
		<li>@name - HTML Filter</li>
		<li>@description - </li>
		<li>@example - ##^script:has-text(===):has-text(/[\w\W]{14000}/)</li>
		<li>@documentation - <a href="https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#html-filters">uBlock Origin Wiki</a>, <a href="https://www.w3schools.com/cssref/css_selectors.asp">W3Schools CSS Selectors</a></li>
		<li>@plugin-variations - </li>
		<li>@special-characters - CSS Selectors .#*,>+~[]=|^$:()</li>
		<li>@function-library - </li>
		<li>@tip - </li>
		</ul>`,
	'htmlFilterException': // #@#^
		`<ul>
		<li>@syntax - #@#^</li>
		<li>@name - HTML Filter Exception</li>
		<li>@description - </li>
		<li>@example - #@#^script:has-text(===):has-text(/[\w\W]{14000}/)</li>
		<li>@documentation - <a href="https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#html-filters">uBlock Origin Wiki</a>, <a href="https://www.w3schools.com/cssref/css_selectors.asp">W3Schools CSS Selectors</a></li>
		<li>@plugin-variations - </li>
		<li>@special-characters - CSS Selectors .#*,>+~[]=|^$:()</li>
		<li>@function-library - </li>
		<li>@tip - </li>
		</ul>`,
	'abpExtendedSelector': // #?#
		`<ul>
		<li>@syntax - #?#</li>
		<li>@name - AdBlockPlus Extended CSS Selector</li>
		<li>@description - </li>
		<li>@example - #?#div:-abp-has(> a[target="_self"][rel="nofollow,noindex"])</li>
		<li>@documentation - <a href="https://help.eyeo.com/en/adblockplus/how-to-write-filters#elemhide-emulation">AdBlockPlus How To</a>, <a href="https://www.w3schools.com/cssref/css_selectors.asp">W3Schools CSS Selectors</a></li>
		<li>@plugin-variations - Specifically designed for AdBlockPlus. uBlock Origin may actually understand these just fine if you use ##</li>
		<li>@special-characters - CSS Selectors .#*,>+~[]=|^$:()</li>
		<li>@function-library - </li>
		<li>@tip - </li>
		</ul>`,
	'actionOperator': // :style() :remove()
		`<ul>
		<li>@syntax - :style() or :remove()</li>
		<li>@name - Action Operator</li>
		<li>@description - </li>
		<li>@example - :style(position: absolute !important;)</li>
		<li>@documentation - <a href="https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#action-operators">uBlock Origin Wiki</a>, <a href="https://www.w3schools.com/cssref/default.asp">W3Schools CSS Properties</a></li>
		<li>@plugin-variations - </li>
		<li>@special-characters - CSS Properties :;,()!</li>
		<li>@function-library - </li>
		<li>@tip - :style(position: absolute !important;) is a great way to make floating toolbars not float anymore.</li>
		</ul>`,
	'uboScriptlet': // ##+js()
		`<ul>
		<li>@syntax - ##+js()</li>
		<li>@name - uBlock Origin Scriptlet</li>
		<li>@description - </li>
		<li>@example - ##+js(aopr, document.getElementById)</li>
		<li>@documentation - <a href="https://github.com/gorhill/uBlock/wiki/Resources-Library">uBlock Origin Wiki</a></li>
		<li>@plugin-variations - May only work for uBlock Origin</li>
		<li>@special-characters - ,</li>
		<li>@function-library - </li>
		<li>@tip - </li>
		</ul>`,
	'uboScriptletException': // #@#+js()
		`<ul>
		<li>@syntax - #@#+js()</li>
		<li>@name - uBlock Origin Scriptlet Exception</li>
		<li>@description - </li>
		<li>@example - </li>
		<li>@documentation - <a href="https://github.com/gorhill/uBlock/wiki/Resources-Library">uBlock Origin Wiki</a></li>
		<li>@plugin-variations - May only work for uBlock Origin</li>
		<li>@special-characters - ,</li>
		<li>@function-library - </li>
		<li>@tip - </li>
		</ul>`,
	'abpSnippet': // #$#
		`<ul>
		<li>@syntax - #$#</li>
		<li>@name - AdBlockPlus Snippet</li>
		<li>@description - </li>
		<li>@example - #$#abort-on-property-read TextDecoder; abort-on-property-read require; abort-current-inline-script _audiofanzineProductStack</li>
		<li>@documentation - <a href="https://help.eyeo.com/en/adblockplus/snippet-filters-tutorial">AdBlockPlus Snippet Filters Tutorial</a></li>
		<li>@plugin-variations - May only work for AdBlockPlus</li>
		<li>@special-characters - ;</li>
		<li>@function-library - </li>
		<li>@tip - </li>
		</ul>`,
};