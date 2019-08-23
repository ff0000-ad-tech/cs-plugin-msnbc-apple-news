// determine espn-network
if (typeof window.parent.app === 'object') {
	adParams.espnChannel = 'ESPN_FFL_APP'
	onESPN()
} else if (typeof mraid !== 'undefined') {
	if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
		adParams.espnChannel = 'MRAID_ANDROID'
	} else {
		adParams.espnChannel = 'MRAID_IOS'
	}
	if (mraid.getState() === 'loading') {
		mraid.addEventListener('ready', onESPN)
	} else {
		onESPN()
	}
} else {
	adParams.espnChannel = 'ESPN'
	onESPN()
}
function onESPN() {
	resolve()
}
