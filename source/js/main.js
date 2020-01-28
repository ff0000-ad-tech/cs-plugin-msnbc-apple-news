import superagent from 'superagent'
import { getQueryParams } from 'ad-global'

const query = getQueryParams()
query.targets = JSON.parse(query.targets)
query.folders = JSON.parse(query.folders)

console.log('query', query)

let form, submitBtn
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
	textInputs['default-clicktag-input'].value = 'http://msnbc.com'

	// add form handlers
	setFormListeners()

	validateForm()
}

function processDOM() {
	form = document.getElementById('main-form')
	submitBtn = document.getElementById('submit-btn')

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

function setFormListeners() {
	const inputs = Object.values(textInputs).concat(Object.values(selects))

	setCreativeTypeListeners()

	inputs.forEach(input => {
		input.addEventListener('input', event => {
			submitBtn.disabled = !validateForm()
		})
	})
}

function setCreativeTypeListeners() {
	const creativeTypeInput = textInputs['creative-type-input']
	const radioInputs = Array.prototype.slice.call(document.querySelectorAll('input[type="radio"]'))

	// TODO: checking radio populates creative input with its value
	radioInputs.forEach((radio, i) => {
		const otherRadios = Array.prototype.filter.call(radioInputs, (_, j) => i !== j)

		radio.addEventListener('input', event => {
			creativeTypeInput.value = radio.value
			otherRadios.forEach(otherRadio => {
				otherRadio.checked = false
			})
		})
	})

	creativeTypeInput.addEventListener('input', event => {
		radioInputs.forEach(radio => {
			radio.checked = creativeTypeInput.value.trim() === radio.value
		})
	})
}

function validateForm() {
	const inputs = Object.values(textInputs).concat(Object.values(selects))

	for (let input of inputs) {
		if (!input.value) {
			return false
		}
	}
	return true
}

function submitForm(event) {
	event.preventDefault()
}
