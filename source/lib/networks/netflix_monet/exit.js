this.exit = function(clickTag, url) {
	console.log('Network -> NETFLIX_MONET EXIT')
	try {
		Monet.logEvent('AD_EXIT', { url: url || 'DCS default exit' })
	} catch (e) {}
	if (typeof clickTag == 'function') clickTag.call(this, url)
	else throw new Error('ERROR: clickTag for this platform needs to be a callable function. See <Network> docs.')
}
