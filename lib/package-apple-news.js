const fs = require('fs')
const fsp = fs.promises
const path = require('path')

const templateRenderer = require('./template-renderer')
const { ensureDir, copyDir, ensureRequiredOptions } = require('./utils')

async function packageAppleNews(argsObj) {
	// prettier-ignore
	ensureRequiredOptions(argsObj, [
		'targetDir',
		'creativeType',
		'orientationsToSizePaths',
		'templatePath'
	])

	const {
		targetDir,
		creativeType,
		orientationsToSizePaths: { landscape, portrait },
		templatePath,
		templateVars = {
			clickTag: 'https://msnbc.com'
		}
	} = argsObj

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

	// render EJS template
	await templateRenderer.renderTemplate({
		templatePath,
		creativePath,
		templateVars: {
			creativeType,
			...templateVars
		}
	})
}

async function copyOrientationFiles({ sizePath, creativePath, orientation }) {
	// ensure orientation directory exists in ad
	const orientationPath = path.resolve(creativePath, orientation)
	await ensureDir(orientationPath)

	// copy files from size to orientation
	return copyDir(sizePath, orientationPath)
}

module.exports.packageAppleNews = packageAppleNews
