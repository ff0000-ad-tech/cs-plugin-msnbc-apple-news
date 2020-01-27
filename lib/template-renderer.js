const path = require('path')
const fsp = require('fs').promises
const ejs = require('ejs')
const htmlMinifier = require('html-minifier')

function renderTemplate({ templatePath, creativePath, templateVars, minify }) {
	return new Promise((resolve, reject) => {
		ejs.renderFile(templatePath, templateVars, (err, output) => {
			if (err) {
				reject(err)
				return
			}
			resolve(output)
		})
	})
		.then(output => {
			if (minify) {
				output = htmlMinifier.minify(output, {
					minifyCSS: true,
					minifyJS: {
						compress: {
							drop_console: true,
							join_vars: false
						},
						output: {
							beautify: false,
							semicolons: true
						}
					},
					removeComments: true,
					collapseWhitespace: true,
					caseSensitive: true,
					keepClosingSlash: true,
					maxLineLength: 32 * 1024
				})
			}
			return fsp.writeFile(path.resolve(creativePath, 'index.html'), output, 'utf8')
		})
		.catch(err => {
			console.error('Error rendering template')
			throw err
		})
}

module.exports = {
	renderTemplate
}
