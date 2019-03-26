this.exit = function(exit) {
	console.log('Network -> SIZMEK EXIT')
	if (typeof exit == 'function') exit.call()
	else
		console.log(
			' - ERROR: a clickTag for this platform needs to be a function that wraps a platform exit. See <Network> docs.'
		)
}
