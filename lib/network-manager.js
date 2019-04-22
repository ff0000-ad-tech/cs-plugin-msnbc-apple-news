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
		const tags = networkList[network]
		if (!tags) {
			return reject(new Error(`Unrecognized network id: '${network}'`))
		}
		const targetsJSON = JSON.parse(targets)
		// requested targets
		const promises = targetsJSON.map(target => {
			return new Promise((resolve, reject) => {
				const dirBuildAd = path.resolve(context, `./1-build/${target.size}`)
				fs.readFile(`${dirBuildAd}/${target.index}`, 'utf8', (err, index) => {
					if (err) {
						return reject(err)
					}
					// each tag per target
					const tagPromises = Object.keys(tags).map(tag => {
						return new Promise((resolve, reject) => {
							const relativeDir = tags[tag]
							if (relativeDir) {
								const snippetPath = path.join(__dirname, '../', 'networks', relativeDir, tag)
								fs.readFile(snippetPath, 'utf8', (err, content) => {
									if (err) {
										return reject(err)
									}
									index = handleSnippet(index, tag, content)
									resolve()
								})
							} else {
								index = handleSnippet(index, tag, '')
								resolve()
							}
							function handleSnippet(index, tag, content) {
								const regex = hooks.get('Red', 'Network', tag.split('.')[0])
								const match = index.match(regex)
								return index.replace(regex, match[1] + content + match[6])
							}
						})
					})
					Promise.all(tagPromises).then(() => {
						fs.writeFile(`${dirBuildAd}/${target.name}`, index, 'utf8', err => {
							if (err) {
								return reject(err)
							}
							resolve()
						})
					})
				})
			})
		})
		Promise.all(promises)
			.then(() => resolve())
			.catch(err => reject(err))
	})
}

module.exports = {
	getNetworks,
	createIndex
}
