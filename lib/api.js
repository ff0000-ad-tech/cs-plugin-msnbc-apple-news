const _argv = require('minimist')(process.argv.slice(2))

const path = require('path')
const { packageAppleNews } = require('./package-apple-news')
const { ensureDir } = require('./utils')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('cs-plugin-msnbc-apple-news:api')

const CONSTS = require('./consts')

function processArgv(argv) {
	const processed = {}
	Object.keys(argv).forEach(key => {
		let val = argv[key]
		try {
			val = JSON.parse(val)
		} catch (err) {
			// ignore parsing exceptions
		}
		processed[key] = val
	})
	return processed
}

const api = async () => {
	const argv = processArgv(_argv)
	switch (argv.action) {
		// render responsive ad
		case 'render':
			console.log('argv', argv)
			const outputDir = path.resolve(argv.context, 'apple-news-output')
			ensureDir(outputDir)
			await packageAppleNews({
				targetDir: outputDir,
				creativeType: argv.creativeType,
				orientationsToSizePaths: argv.orientationsToSizePaths,
				// in plugin?
				templatePath: path.resolve('../templates/template.ejs'),
				clickTag: argv.clickTag,
				minify: argv.minify
			})
			break

		default:
			break
	}
}
api()
