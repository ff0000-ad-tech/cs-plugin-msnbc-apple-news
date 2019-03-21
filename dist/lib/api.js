const argv = require('minimist')(process.argv.slice(2))
const path = require('path')
const fs = require('fs')
const hooks = require('@ff0000-ad-tech/hooks-regex')
const getNetwork = require('./networks/index.js')
const networksJSON = JSON.parse(argv.networks)
const targetsJSON = JSON.parse(argv.targets)

networksJSON.forEach(type => {
	createIndex(type)
})

function createIndex(networkString) {
	Object.keys(targetsJSON).forEach(target => {
		const filePath = '.' + targetsJSON[target]
		const filePathSplit = filePath.split(path.sep)
		filePathSplit.pop()
		const folderName = filePathSplit.pop()
		const dirBuildAd = './1-build/' + folderName
		// TODO - check if dir exists?

		const networkType = getNetwork(networkString)

		fs.readFile(dirBuildAd + '/index.html', 'utf8', (err, data) => {
			if (err) return console.log(err)

			console.log('file read', data)
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
							console.log('|path:', snippetPath)
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
