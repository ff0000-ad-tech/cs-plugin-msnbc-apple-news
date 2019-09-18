this.exit = function(clickTag) {
	var clickUrl = this.appendMacro('%%CLICK_URL_UNESC%%', clickTag)
	console.log('Network -> ESPN EXIT (Raycom)')
	window.open(clickUrl, '_blank')
}
