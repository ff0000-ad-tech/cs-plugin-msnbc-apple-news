const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const rimraf = require('rimraf')
const { packageAppleNews } = require('../lib/package-apple-news')

const TEMP_DIR_NAME = path.resolve('test', '.temp')

describe('Apple News Ad Packaging', () => {
	// set up temporary directory
	beforeAll(() => fsp.mkdir(TEMP_DIR_NAME))

	test('creates a directory based on creativeType', async () => {
		await packageAppleNews({ targetDir: TEMP_DIR_NAME, creativeType: 'DoubleBanner' })
		await fsp.stat(path.resolve(TEMP_DIR_NAME, 'DoubleBanner'))
	})

	test.todo('Puts listed sizes in associated ad orientations')

	describe('In each size:', () => {
		test.todo('Size-specific assets copied over')
		test.todo('build.bundle.js now includes script tags from index except adParams script tag')
	})

	// tear down temporary directory
	afterAll(
		() =>
			new Promise(resolve => {
				rimraf(TEMP_DIR_NAME, resolve)
			})
	)
})
