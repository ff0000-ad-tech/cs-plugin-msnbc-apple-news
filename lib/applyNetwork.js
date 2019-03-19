const fs = require('fs-extra')
const path = require('path')
const hooks = require('@ff0000-ad-tech/hooks-regex')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('cs-plugin-apply-network:applyNetwork')

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

		const networkType = 'DC_STUDIO'

		fs.readFile(dirBuildAd + '/index.html', 'utf8', (err, data) => {
			if (err) {
				return console.log(err)
			}

			const tags = ['clicktags.js', 'exit_aux.js', 'exit.js', 'meta.html', 'onload.js', 'script.html']
			var result = data
			const pool = tags.map(tag => {
				return new Promise((resolve, reject) => {
					const regex = hooks.get('Red', 'Network', tag.split('.')[0])
					// console.log('regex:', regex)
					const match = data.match(regex)
					log('match:', match[1])
					// log('match:', match[5])
					log('match:', match[6])

					var snippetPath = path.join(__dirname, '.', 'networks', networkType, tag)
					console.log('snippetPath:', snippetPath)
					fs.readFile(snippetPath, 'utf8', (err, snippetData) => {
						result = result.replace(regex, match[1] + snippetData + match[6])
						resolve()
					})
				})
			})
			Promise.all(pool).then(() => {
				fs.writeFile(dirBuildAd + `/index__${networkType}.html`, result, 'utf8', err => {
					if (err) return console.log(err)
				})
			})
		})
	})
}

module.exports = {
	createIndex
}
