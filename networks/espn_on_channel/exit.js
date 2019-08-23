this.exit = function(clickTag) {
	var clickUrl = this.appendMacro('%%CLICK_URL_UNESC%%', clickTag)
	var cachebuster = '%%CACHEBUSTER%%'
	if (cachebuster.search('^%%') > -1) {
		cachebuster = new Date().getTime()
	}

	switch (adParams.espnChannel) {
		case 'ESPN_FFL_APP':
			console.log('Network -> ESPN_FFL_APP EXIT (Fantasy App)')
			if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
				window.parent.app.ads.clickThrough(clickUrl + '?ord=' + cachebuster)
			} else {
				window.parent.app.ads.clickThrough(clickUrl)
			}
			break

		case 'MRAID':
			console.log('Network -> MRAID EXIT (ESPN App)')
			if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
				mraid.open(clickUrl + '?ord=' + cachebuster)
			} else {
				// do not append macro to the sportscenter deeplink
				if (clickTag.search(/^sportscenter/) > -1) {
					mraid.open(clickTag)
				} else {
					mraid.open(clickUrl)
				}
			}
			break

		case 'ESPN':
			console.log('Network -> ESPN EXIT (Dot com)')
			window.open(clickUrl, '_blank')
			break
	}
}
