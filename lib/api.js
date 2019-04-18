const argv = require('minimist')(process.argv.slice(2))
const networkManager = require('./network-manager.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('cs-plugin-apply-network:api')

const api = async () => {
	switch (argv.action) {
		// write specified network into context/targets
		case 'write':
			const context = argv.context || './'
			try {
				await networkManager.createIndex(context, argv.targets, argv.network)
			} catch (err) {
				log(err)
				process.exit(1)
			}
			break

		// get available networks
		case 'list':
		default:
			try {
				const networks = await networkManager.getNetworks()
				// res.text comes from console.log here
				console.log(JSON.stringify(networks, null, 2))
			} catch (err) {
				log(err)
				process.exit(1)
			}
			break
	}
}
api()
