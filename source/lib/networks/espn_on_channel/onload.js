// determine espn-network
if (typeof window.parent.app === 'object') {
	adParams.espnChannel = 'ESPN_FFL_APP'
	onESPN()
} else if (typeof mraid !== 'undefined') {
	adParams.espnChannel = 'MRAID'
	if (mraid.getState() === 'loading') mraid.addEventListener('ready', onESPN)
	else {
		onESPN()
	}
} else {
	adParams.espnChannel = 'ESPN'
	onESPN()
}
function onESPN() {
	resolve()
}
