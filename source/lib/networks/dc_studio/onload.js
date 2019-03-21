initDCS()
//
function initDCS() {
	if (!Enabler.isInitialized()) Enabler.addEventListener(studio.events.StudioEvent.INIT, onDoubleClickInitialized)
	else onDoubleClickInitialized()
}
function onDoubleClickInitialized() {
	console.log('Index.onDoubleClickInitialized()')
	getDeployProfile('dc-studio')['runPath'] = Enabler.getUrl('./')
	if (!Enabler.isVisible()) Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, initDCSComplete)
	else initDCSComplete()
}
function initDCSComplete() {
	resolve()
}
