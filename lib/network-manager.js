const path = require('path')
const fs = require('fs')
const hooks = require('@ff0000-ad-tech/hooks-regex')
const networkList = require('../networks/index.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('cs-plugin-apply-network:network-manager')

const getNetworks = async () => {
	return Object.keys(networkList).map(network => network)
}

const createIndex = async (context, targets, network) => {
	return new Promise((resolve, reject) => {
		const networkType = networkList[network]
		const targetsJSON = JSON.parse(targets)
		targetsJSON.forEach(target => {
			const dirBuildAd = path.resolve(context, `./1-build/${target.size}/`)
			// TODO - check if dir exists?

			fs.readFile(dirBuildAd + target.index, 'utf8', (err, data) => {
				if (err) {
					return reject(err)
				}
				var result = data
				const pool = Object.keys(networkType).map(tag => {
					return new Promise((resolve, reject) => {
						const regex = hooks.get('Red', 'Network', tag.split('.')[0])
						const match = data.match(regex)
						const relativeDir = networkType[tag]
						if (relativeDir) {
							const snippetPath = path.join(__dirname, '../', 'networks', relativeDir, tag)
							fs.readFile(snippetPath, 'utf8', handleSnippet)
						} else {
							handleSnippet(null, '')
						}
						function handleSnippet(err, snippetData) {
							if (err) {
								reject()
							}
							result = result.replace(regex, match[1] + snippetData + match[6])
							resolve()
						}
					})
				})
				Promise.all(pool).then(() => {
					fs.writeFile(dirBuildAd + target.name, result, 'utf8', err => {
						if (err) {
							return reject(err)
						}
						resolve()
					})
				})
			})
		})
	})
}

module.exports = {
	getNetworks,
	createIndex
}
