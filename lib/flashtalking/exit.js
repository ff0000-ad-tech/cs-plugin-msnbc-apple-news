this.exit = function(clickTag) {
	console.log('Network -> FLASHTALKING EXIT')
	if (Object.prototype.toString.call(clickTag) == '[object Array]') {
		if (clickTag.length == 1) myFT.clickTag(clickTag[0])
		else myFT.clickTag(clickTag[0], clickTag[1])
	} else
		console.log(
			' - ERROR: a clickTag for this platform needs to be an array with an index that corresponds to the platform. See <Network> docs.'
		)
}
