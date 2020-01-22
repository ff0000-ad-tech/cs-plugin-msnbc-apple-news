const fs = require('fs')
const fsp = fs.promises
const path = require('path')

async function packageAppleNews({ targetDir = '', creativeType = '', orientationsToSizePaths: { landscape, portrait }, velvetSlugs = {} }) {
	// create new directory w/ name "creativeType" (either Double or Large Banner)
	const creativePath = path.resolve(targetDir, creativeType)
	await ensureDir(creativePath)
	// copy ad sizes to respective orientation (either Landscape or Portrait)
	// * ensure there's a Landscape and Portrait key in sizeToOrientation obj
	if (!landscape || !portrait) {
		throw new Error('A path to an ad size must be provided for both landscape and portrait orientations in the orientationsToSizePaths arg')
	}

	await Promise.all([
		copyOrientationFiles({ sizePath: landscape, creativePath, orientation: 'landscape' }),
		copyOrientationFiles({ sizePath: portrait, creativePath, orientation: 'portrait' })
	])

	// keep common scripts/css/etc.
	// make collection of script tags in each size traffic HTML plus build bundle into one script file
}

async function copyOrientationFiles({ sizePath, creativePath, orientation }) {
	const files = ['build.bundle.js', 'fba-payload.png', 'backup.jpg']
	// TODO: make fba payload optional
	const orientationPath = path.resolve(creativePath, orientation)
	await ensureDir(orientationPath)
	const cpPromises = files.map(file => fsp.copyFile(path.resolve(sizePath, file), path.resolve(orientationPath, file)))
	await Promise.all(cpPromises)
}

function ensureDir(dirpath) {
	return fsp.mkdir(dirpath).catch(err => {
		if (err.code !== 'EEXIST') {
			throw err
		}
	})
}

module.exports.packageAppleNews = packageAppleNews
