// if the mraid script is loaded, wait for it to initialize
if (typeof mraid !== 'undefined') {
	console.log(' - loading MRAID')
	if (mraid.getState() === 'loading') mraid.addEventListener('ready', onMRAID)
	else onMRAID()
} else onMRAID()
//
function onMRAID() {
	resolve()
}
