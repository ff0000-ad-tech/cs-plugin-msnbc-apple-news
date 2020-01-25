const path = require('path')
const fsp = require('fs').promises
const ejs = require('ejs')

function renderTemplate({ templatePath, creativePath, templateVars }) {
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
