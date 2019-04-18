console.log('!!! FLASHTALKING TEMPLATES REQUIRE LOCAL-SERVER !!!')
if (isDevEnvironment()) {
	var scriptElem = document.createElement('script')
	scriptElem.type = 'text/javascript'
	scriptElem.src = matchProtocolTo('http://cdn.flashtalking.com/frameworks/js/api/2/9/html5API.js')
	document.getElementsByTagName('head')[0].appendChild(scriptElem)
	var ftLoadIntervalId = setInterval(function() {
		if (typeof myFT != 'undefined' && typeof myFT['instantAds'] != 'undefined') {
			clearInterval(ftLoadIntervalId)
			onFlashtalking()
		}
	}, 20)
} else onFlashtalking()
//
function onFlashtalking() {
	resolve()
}
