const argv = require('minimist')(process.argv.slice(2))
const path = require('path')
const fs = require('fs')
const hooks = require('@ff0000-ad-tech/hooks-regex')
const networkList = require('../networks/index.js')

function createIndex() {
	const networkType = networkList[argv.network]
	const targetsJSON = JSON.parse(argv.targets)
	targetsJSON.forEach(target => {
		const dirBuildAd = `./1-build/${target.size}/`
		// TODO - check if dir exists?

		fs.readFile(dirBuildAd + target.index, 'utf8', (err, data) => {
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
				)
			}
			Promise.all(pool).then(() => {
				fs.writeFile(dirBuildAd + target.name, result, 'utf8', err => {
					if (err) return console.log(err)
				})
			})
		})
	})
}

if (argv.action === 'list') {
	let list = []
	for (var key in networkList) {
		list.push(key)
	}
	// res.text comes from console.log here
	console.log(JSON.stringify(list))
} else {
	createIndex()
}
