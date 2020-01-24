const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const rimraf = require('rimraf')
const _ = require('lodash')

const { packageAppleNews } = require('../lib/package-apple-news')
const { ensureDir } = require('../lib/utils')

const TEMP_DIR_NAME = path.resolve('test', '.temp')
const FIXTURES_PATH = path.resolve('test', 'traffic-file-fixtures')

describe('Apple News Ad Packaging', () => {
	// set up temporary directory
	beforeAll(() => ensureDir(TEMP_DIR_NAME))

	const landscapeSize = '2208x212'
	const portraitSize = '1242x332'
	const standardArgs = {
		targetDir: TEMP_DIR_NAME,
		creativeType: 'DoubleBanner',
		templatePath: path.resolve('../templates/double-banner.ejs'),
		orientationsToSizePaths: {
			landscape: path.resolve(FIXTURES_PATH, landscapeSize),
			portrait: path.resolve(FIXTURES_PATH, portraitSize)
		}
	}

	describe('Standard case', () => {
		beforeAll(() => {
			return packageAppleNews(standardArgs)
		})

		describe('Ad file structure', () => {
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
		})

		describe('Template rendering', () => {
			test.todo('uses template listed in options')
			test.todo('renders creative name in template')
		})
	})

	describe('Required options', () => {
		const testMissingOpt = createMissingOptTester(standardArgs)

		testMissingOpt('targetDir')
		testMissingOpt('creativeType')
		testMissingOpt('orientationsToSizePaths')
		testMissingOpt('templatePath')

		function testMissingOrientation(missingOrientation, otherOrientation, otherOrientationSize) {
			test(`orientationsToSizePaths.${missingOrientation}`, () => {
				expect.assertions(1)
				return packageAppleNews({
					targetDir: TEMP_DIR_NAME,
					orientationsToSizePaths: {
						[otherOrientation]: path.resolve(FIXTURES_PATH, otherOrientationSize)
					}
				}).catch(err => {
					expect(err).toBeTruthy()
				})
			})
		}

		testMissingOrientation('landscape', 'portrait', portraitSize)
		testMissingOrientation('portrait', 'landscape', landscapeSize)
	})

	// tear down temporary directory
	// afterAll(
	// 	() =>
	// 		new Promise(resolve => {
	// 			rimraf(TEMP_DIR_NAME, resolve)
	// 		})
	// )
})

function createMissingOptTester(opts) {
	return function testMissingOpt(missingOptKey) {
		test(missingOptKey, () => {
			expect.assertions(1)
			const _opts = _.cloneDeep(opts)
			delete _opts[missingOptKey]
			return packageAppleNews(_opts).catch(err => {
				expect(err).toBeTruthy()
			})
		})
	}
}
