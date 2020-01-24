const fsp = require('fs').promises
const recursiveCopy = require('recursive-copy')

function ensureDir(dirpath) {
	return fsp.mkdir(dirpath).catch(err => {
		if (err.code !== 'EEXIST') {
			console.error('Error ensuring directory', err)
		}
	})
}

function copyDir(src, dst) {
	const copyOpts = {
		overwrite: true,
		dot: true
	}

	return recursiveCopy(src, dst, copyOpts).catch(err => {
		console.error('Error copying directory files', err)
	})
}

function ensureRequiredOptions(argObj, required) {
	for (let opt of required) {
		if (!argObj[opt]) {
			throw new Error('Missing required option: ' + opt)
		}
	}
}

module.exports = {
	ensureDir,
	copyDir,
	ensureRequiredOptions
}
