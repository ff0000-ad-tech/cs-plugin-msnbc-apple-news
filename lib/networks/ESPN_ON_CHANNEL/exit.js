this.exit = function(clickTag) {
	var clickUrl = this.appendMacro('%%CLICK_URL_UNESC%%', clickTag)
	var cachebuster = '%%CACHEBUSTER%%'
	if (cachebuster.search('^%%') > -1) cachebuster = new Date().getTime()

	switch (adParams.espnChannel) {
		case 'ESPN_FFL_APP':
			console.log('Network -> ESPN_FFL_APP EXIT')
			if (navigator.userAgent.toLowerCase().indexOf('android') > -1)
				window.parent.app.ads.clickThrough(clickUrl + '?ord=' + cachebuster)
			else window.parent.app.ads.clickThrough(clickUrl)
			break

		case 'MRAID':
			console.log('Network -> MRAID EXIT')
			if (clickTag.search(/^sportscenter/) > -1) mraid.open(clickTag)
			// do not append macro to the sportscenter deeplink
			else mraid.open(clickUrl)
			break

		case 'ESPN':
			console.log('Network -> ESPN EXIT')
			window.open(clickUrl, '_blank')
			break
	}
}
