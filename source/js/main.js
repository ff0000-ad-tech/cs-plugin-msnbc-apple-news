import superagent from 'superagent'
import { getQueryParams } from 'ad-global'

const query = getQueryParams()
query.targets = JSON.parse(query.targets)
query.folders = JSON.parse(query.folders)

console.log('query', query)

let form
const sizesToTargets = {}
const textInputs = {}
const checkboxInputs = {}
const selects = {}

init()

//

function init() {
	processDOM()

	// parse sizes
	Object.keys(query.targets).forEach(target => {
		const size = target.match(/\d+x\d+/)[0]
		sizesToTargets[size] = target
	})

	// populate size options
	Object.values(selects).forEach(selectEl => {
		populateSizeSelect(selectEl, sizesToTargets)
	})

	// populate default clickTag
	// TODO: populate from API
	textInputs['default-clicktag-input'].value = 'http://msnbc.com'
}

function processDOM() {
	form = document.getElementById('main-form')
	// process diff form inputs
	for (let i = 0; i < form.elements.length; i++) {
		const input = form.elements[i]
		if (input instanceof HTMLInputElement) {
			if (input.type === 'checkbox') {
				checkboxInputs[input.id] = input
			} else {
				textInputs[input.id] = input
			}
		} else if (input instanceof HTMLSelectElement) {
			selects[input.id] = input
		}
	}
}

function populateSizeSelect(selectEl, sizesToTargets) {
	const sizes = Object.keys(sizesToTargets)
	const sizeEls = sizes.map(size => {
		const target = sizesToTargets[size]
		const opt = document.createElement('option')
		opt.value = target
		opt.innerText = size
		selectEl.appendChild(opt)
	})
	return sizeEls
}

function submitForm(event) {
	event.preventDefault()
}
