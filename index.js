const argv = require('minimist')(process.argv.slice(2))
const applyNetwork = require('./lib/applyNetwork.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('cs-plugin-apply-network')

global.api = `http://${argv.api}`

switch (argv.cmd) {
	case 'apply+network':
		log(argv.profile)
		const targets = JSON.parse(argv.targets)
		log(targets)
		// const folders = JSON.parse(argv.folders)
		// log(folders)
		applyNetwork.createIndex(argv.profile, targets) //, folders)
		break
}

/*

node index.js --cmd apply+network --api '10.0.7.126:5200' --profile 'off_channel' --targets '{"off_channel/300x250__generic/index.html":"/3-traffic/off_channel/300x250__generic/","off_channel/320x50__players/index.html":"/3-traffic/off_channel/320x50__players/","off_channel/728x90__team_away/index.html":"/3-traffic/off_channel/728x90__team_away/"}'

*/

/*
node "/Users/kenny.arehart/Documents/_CLIENTS_GIT/espn__mlb_fy19/node_modules/@ff0000-ad-tech/cs-plugin-apply-network/index.js" --cmd "apply+network" --profile "default" --targets "{\"default/1024x66/index.html\":\"/3-traffic/default/1024x66/\",\"default/1280x100/index.html\":\"/3-traffic/default/1280x100/\",\"default/300x250/index.html\":\"/3-traffic/default/300x250/\",\"default/320x120/index.html\":\"/3-traffic/default/320x120/\",\"default/320x50/index.html\":\"/3-traffic/default/320x50/\",\"default/728x90/index.html\":\"/3-traffic/default/728x90/\",\"default/970x66/index.html\":\"/3-traffic/default/970x66/\",\"default/300x250/index copy.html\":\"/3-traffic/default/300x250__copy/\",\"default/300x250/index_alt.html\":\"/3-traffic/default/300x250__alt/\"}" --api "http://192.168.1.19:5200/api" --context "/Users/kenny.arehart/Documents/_CLIENTS_GIT/espn__mlb_fy19" --folders "{\"project\":\"espn__mlb_fy19\",\"build\":\"1-build\",\"debug\":\"2-debug\",\"traffic\":\"3-traffic\"}"
*/
