const isValidSyntax = require('./adblock-validator');

test('', () => {
	expect(isValidSyntax('telemundo.com##.__hub--ad, .ad--MAIN, .ad--MULTI, .ad-container, .banner-sticky-bg')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('domain.com##.class, .class, etc.')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('theblaze.com##[id^="sWidget_-_Worth_a_look"]')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('telegraph.co.uk###message, .adblocker-message')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('||menshealth.com/*/advagg_js$script,domain=menshealth.com')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('ago.vermont.gov##.navhead.rad div[style="display: block; width: 1200px; height: 29px; float: left;"]')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('gab.com##.tabs-bar, .ui .page__top:style(position: static !important;)')).toBe(true);
});
test('', () => {
	expect(isValidSyntax(':style(position: X !important;) gets rid of floating toolbars')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('golfdigest.com##.component-sticky.site-header div[style*="overflow: hidden; height:"]')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('si.com##.short-only.logo > .desktop-only.full-logo > .color-porcelain.hover-fill, .showBackground.stickyFooter, .ui-button.ui-button-close.small.is-fixed, body:not(.under-social) nav.main .under-social-logo.desktop-only, hr')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('www.yahoo.com##[class*="fixed-space"][class*="modal-open"]')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('###BackToTop')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('##.BackToTop')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('##[class*="share__icon"]')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('##[href*="facebook.com/dialog/share?"]')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('@@||100percentfedup.com^$generichide')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('abcnews.go.com#@#.social-footer-wrapper')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('6stream.xyz##body > div[style*="position: fixed;"]:has-text(/Thank you for visiting/)')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('purewow.com##.fb_digioh-lock:style(overflow-x: hidden !important; overflow-y: scroll !important;)')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('scribd.com##body.modal_open:style(overflow-x: hidden !important; overflow-y: scroll !important; padding-right: 0 !important;)')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('||izooto.com^$script,domain=bloombergquint.com|dnaindia.com')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('||lightboxcdn.com/vendor/*$domain=cnet.com')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('||picreel.com^$subdocument')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('||stacklist.com/*/subscribe-modal')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('||*/app/email-signup/inline-article-news.html$subdocument')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('||pico.tools^')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('hostinger.com##path[fill-rule="evenodd"]:style(fill: #ffffff !important;)')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('www.reuters.com##div[class="slide-image-enclosure "] > img[src*="s3.reutersmedia.net/resources/r/"]:not([style*="opacity"]):not([class="slick-loading"])')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('businessinsider.in#?#div:-abp-has(> a[target="_self"][rel="nofollow,noindex"])')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('audiofanzine.com#$#abort-on-property-read TextDecoder; abort-on-property-read require; abort-current-inline-script _audiofanzineProductStack')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('vidlox.me#$#abort-current-inline-script Math zfgloaded')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('oral-amateure.com#$#hide-if-contains-image-hash 00ff992d2c3efe08,38f8e0733b0d1f07,bf049c9cbc8c0f1e,e8caeae0e8f0f0f0')).toBe(true);
});
test('', () => {
	expect(isValidSyntax('zhlednito.cz#$#abort-on-property-read Aloader; abort-on-property-read BetterJsPop; abort-on-property-read exoDocumentProtocol; abort-on-property-read ExLdr.serve; abort-on-property-read ExoLoader; abort-on-property-read ExoLoader.addZone; abort-on-property-read ExoLoader.serve; abort-on-property-read getexoloader; abort-current-inline-script document.dispatchEvent myEl; abort-on-property-read aNB')).toBe(true);
});
test('comment', () => {
	expect(isValidSyntax('! comment')).toBe(true);
});
test('comment with two exclamations', () => {
	expect(isValidSyntax('! comment!')).toBe(true);
});
test('syntax then comment', () => {
	expect(isValidSyntax('domain.com ! comment')).toBe(false);
});
test('', () => {
	expect(isValidSyntax('@@')).toBe(false);
});