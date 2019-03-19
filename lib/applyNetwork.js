const fs = require('fs-extra')
const path = require('path')
const hooks = require('@ff0000-ad-tech/hooks-regex')
const debug = require('@ff0000-ad-tech/debug')
const log = debug('cs-plugin-apply-network:applyNetwork')
const getNetwork = require('./networks/index.js')

function createIndex(profileName, targets) {
	log('createIndex()', profileName)

	Object.keys(targets).forEach(target => {
		const filePath = '.' + targets[target]
		const filePathSplit = filePath.split(path.sep)
		filePathSplit.pop()
		const folderName = filePathSplit.pop()
		const dirBuildAd = './1-build/' + folderName
		// TODO - check if dir exists?

		// TODO - this determined by interface
		const networkString = 'STANDARD'
		const networkType = getNetwork(networkString)

		fs.readFile(dirBuildAd + '/index.html', 'utf8', (err, data) => {
			if (err) return console.log(err)

			var result = data
			const pool = []
			for (var tag in networkType) {
				pool.push(
					new Promise((resolve, reject) => {
						const regex = hooks.get('Red', 'Network', tag.split('.')[0])
						const match = data.match(regex)
						const relativeDir = networkType[tag]
						if (relativeDir) {
							const snippetPath = path.join(__dirname, '.', 'networks', relativeDir, tag)
							fs.readFile(snippetPath, 'utf8', handleSnippet)
						} else {
							handleSnippet(null, '')
						}

						function handleSnippet(err, snippetData) {
							result = result.replace(regex, match[1] + snippetData + match[6])
							resolve()
						}
					})
				)
			}
			Promise.all(pool).then(() => {
				fs.writeFile(dirBuildAd + `/index__${networkString}.html`, result, 'utf8', err => {
					if (err) return console.log(err)
				})
			})
		})
	})
}

module.exports = {
	createIndex
}
