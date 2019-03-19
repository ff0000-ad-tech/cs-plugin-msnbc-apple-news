const fs = require('fs-extra')
const path = require('path')
const hooks = require('@ff0000-ad-tech/hooks-regex')
const debug = require('@ff0000-ad-tech/debug')
const log = debug('cs-plugin-apply-network:applyNetwork')
const getNetwork = require('./networks/index.js')

function createIndex(profileName, targets) {
	log('createIndex()', profileName)
	const dir = './1-build/'

	Object.keys(targets).forEach(target => {
		const filePath = '.' + targets[target]
		const filePathSplit = filePath.split(path.sep)
		filePathSplit.pop()
		const folderName = filePathSplit.pop()
		// log('\t', target, '|', filePath, '|', folderName)
		const dirBuildAd = dir + folderName
		log('\t\t', dirBuildAd)
		// TODO - cehck if dir exists?

		// TODO - this determined by interface
		const networkString = 'STANDARD'
		const networkType = getNetwork(networkString)

		fs.readFile(dirBuildAd + '/index.html', 'utf8', (err, data) => {
			if (err) {
				return console.log(err)
			}

			var result = data
			const pool = []
			for (var tag in networkType) {
				pool.push(
					new Promise((resolve, reject) => {
						const regex = hooks.get('Red', 'Network', tag.split('.')[0])
						// console.log('regex:', regex)
						const match = data.match(regex)
						// log('match:', match[1])
						// log('match:', match[5])
						// log('match:', match[6])

						const relativeDir = networkType[tag]
						if (relativeDir) {
							var snippetPath = path.join(__dirname, '.', 'networks', relativeDir, tag)
							console.log('snippetPath:', snippetPath)
							fs.readFile(snippetPath, 'utf8', (err, snippetData) => {
								result = result.replace(regex, match[1] + snippetData + match[6])
								resolve()
							})
						} else {
							result = result.replace(regex, match[1] + match[6])
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
