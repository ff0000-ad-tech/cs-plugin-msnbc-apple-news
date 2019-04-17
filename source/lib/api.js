const argv = require('minimist')(process.argv.slice(2))

const debug = require('@ff0000-ad-tech/debug')
var log = debug('cs-plugin-apply-network:api')

switch (argv.action) {
	// write specified network into context/targets
	case 'write':
		const context = argv.context || './'
		networkManager.createIndex(context, argv.targets, argv.network)
		break

	// get available networks
	case 'list':
	default:
		const networks = await networkManager.getNetworks()
		// res.text comes from console.log here
		console.log(JSON.stringify(networks, null, 2))
		break
}
