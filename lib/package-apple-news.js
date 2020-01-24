const fs = require('fs')
const fsp = fs.promises
const path = require('path')

const { ensureDir, copyDir } = require('./utils')

async function packageAppleNews({
	targetDir = '',
	creativeType = '',
	orientationsToSizePaths: { landscape, portrait },
	templatePath = '',
	velvetSlugs = {}
}) {
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
	// ensure orientation directory exists in ad
	const orientationPath = path.resolve(creativePath, orientation)
	await ensureDir(orientationPath)

	// copy files from size to orientation
	return copyDir(sizePath, creativePath)
}

module.exports.packageAppleNews = packageAppleNews
