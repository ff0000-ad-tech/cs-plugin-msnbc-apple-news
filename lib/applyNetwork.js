const fs = require('fs-extra')
const path = require('path')

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
		fs.copy(dirBuildAd + '/index.html', dirBuildAd + '/index_OTHER.html', err => {
			if (err) return console.error(err)
			log('copy index.html success')
		})
	})
}

module.exports = {
	createIndex
}
