var clickTag = function() {
	Enabler.exit('clickTag')
}
var overridePlatformExit = function(url) {
	/* IMPORTANT: Invoke this type of exit in the build like:
	 * 	Network.exit(
	 *		overridePlatformExit,
	 *		'https://dynamic_exit.com'
	 *	);
	 * OR HARDCODE the URL here, like:
	 *	Enabler.exitOverride("id", "https://dynamic_exit.com");
	 * AND invoke in the build, like:
	 * 	Network.exit(overridePlatformExit);
	 */
	Enabler.exitOverride('id', url)
}
var collapsedExit = function() {
	Enabler.exit('USER_EXITED_WHILE_COLLAPSED')
}
var expandedExit = function() {
	Enabler.exit('USER_EXITED_WHILE_EXPANDED')
}
// define more as needed
