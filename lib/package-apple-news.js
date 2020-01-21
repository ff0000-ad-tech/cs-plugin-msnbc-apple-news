const fs = require('fs')
const fsp = fs.promises
const path = require('path')

async function packageAppleNews({ targetDir = '', creativeType = '', sizeToOrientation = {}, velvetSlugs = {} }) {
	// create new directory w/ name "creativeType" (either Double or Large Banner)
	// copy ad sizes to respective orientation (either Landscape or Portrait)
	// * ensure there's a Landscape and Portrait key in sizeToOrientation obj
	// keep common scripts/css/etc.
	// make collection of script tags in each size traffic HTML plus build bundle into one script file
	await fsp.mkdir(path.resolve(targetDir, creativeType))
}

module.exports.packageAppleNews = packageAppleNews
