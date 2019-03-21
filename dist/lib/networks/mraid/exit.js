this.exit = function(clickTag) {
	console.log('Network -> MRAID EXIT')
	mraid.open(this.appendMacro('%%CLICK_URL_UNESC%%', clickTag))
}
