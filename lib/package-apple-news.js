const fsp = require('fs').promises

const APPLE_NEWS_HTML_TEMPLATE_PATH = './apple-news.ejs'

function packageAppleNews({ creativeType = '', sizeToOrientation = {}, velvetSlugs = {} }) {
	// create new directory w/ name "creativeType" (either Double or Large Banner)
	// copy ad sizes to respective orientation (either Landscape or Portrait)
	// * ensure there's a Landscape and Portrait key in sizeToOrientation obj
	// keep common scripts/css/etc.
	// make collection of script tags in each size traffic HTML plus build bundle into one script file
}

module.exports.packageAppleNews = packageAppleNews
