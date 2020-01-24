const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const rimraf = require('rimraf')

const { packageAppleNews } = require('../lib/package-apple-news')
const { ensureDir } = require('../lib/utils')

const TEMP_DIR_NAME = path.resolve('test', '.temp')
const FIXTURES_PATH = path.resolve('test', 'traffic-file-fixtures')

describe('Apple News Ad Packaging', () => {
	// set up temporary directory
	beforeAll(() => ensureDir(TEMP_DIR_NAME))

	describe('Standard case', () => {
		const landscapeSize = '2208x212'
		const portraitSize = '1242x332'
		const standardArgs = {
			targetDir: TEMP_DIR_NAME,
			creativeType: 'DoubleBanner',
			orientationsToSizePaths: {
				landscape: path.resolve(FIXTURES_PATH, landscapeSize),
				portrait: path.resolve(FIXTURES_PATH, portraitSize)
			}
		}

		beforeAll(() => {
			return packageAppleNews(standardArgs)
		})

		test('creates a directory based on creativeType', async () => {
			await fsp.stat(path.resolve(TEMP_DIR_NAME, standardArgs.creativeType))
		})

		test('size files copied over to respective orientation', async () => {
			async function checkForAssetsInOrientation(orientation) {
				const size = orientation === 'landscape' ? landscapeSize : portraitSize
				const originalSizePath = path.resolve(FIXTURES_PATH, size)
				const resultOrientationPath = path.resolve(TEMP_DIR_NAME, standardArgs.creativeType, orientation)
				const readResults = await Promise.all([fsp.readdir(originalSizePath), fsp.readdir(resultOrientationPath)])

				const orientationFiles = readResults[0]
				const originalSizeFiles = readResults[1]
				expect(orientationFiles).toEqual(expect.arrayContaining(originalSizeFiles))
			}

			const testPromises = ['landscape', 'portrait'].map(orientation => checkForAssetsInOrientation(orientation))
			await Promise.all(testPromises)
		})

		test.todo('build.bundle.js now includes script tags from index except adParams script tag')
	})

	test('Throws error if path to ad sizes not assigned to landscape and portrait orientations', () => {
		expect.assertions(1)
		return packageAppleNews({
			targetDir: TEMP_DIR_NAME,
			orientationsToSizePaths: {
				landscape: path.resolve(FIXTURES_PATH, '2208x212')
			}
		}).catch(err => {
			expect(err).toBeTruthy()
		})
	})

	test.todo('Puts listed sizes in associated ad orientations')

	// tear down temporary directory
	// afterAll(
	// 	() =>
	// 		new Promise(resolve => {
	// 			rimraf(TEMP_DIR_NAME, resolve)
	// 		})
	// )
})
