console.log(' - SIZMEK TEMPLATES MUST BE RUN IN LOCAL-SERVER!!!')
/**
 * Sizmek EB object doesn't initialize when inside of an iframe,
 * such as the one used when developing in Creative Server.
 * So we'll only wait for EB to initialize in non-dev environments.
 */
function onCP() {
	return /^https:\/\/client-projects.com/.test(window.location.href)
}

function onPort() {
	return /^http:\/\/portfolio.ff0000.com/.test(window.location.href)
}

function onVelvet() {
	return /^https:\/\/us-east.manta.joyent.com/.test(window.location.href)
}

if (!(isDevEnvironment() || onCP() || onPort() || onVelvet()) && !EB.isInitialized()) {
	EB.addEventListener(EBG.EventName.EB_INITIALIZED, onSizmek)
} else onSizmek()
//
function onSizmek() {
	resolve()
}
