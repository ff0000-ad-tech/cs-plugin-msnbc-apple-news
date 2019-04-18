import superagent from 'superagent'
import { getQueryParams } from 'ad-global'

const query = getQueryParams()
const indexPool = []
let isNetworkSelected = false

function init(listJSON) {
	const indexJSON = JSON.parse(query.targets)
	const indexList = document.getElementById('index-list')
	for (var key in indexJSON) {
		const [profile, size, index] = key.split('/')
		const li = create('li', indexList)
		const label = create('label', li)
		label.innerHTML = size + '/' + index
		const input = create('input', li)
		input.setAttribute('type', 'text')
		input.setAttribute('value', index)
		const obj = {
			elem: input,
			profile,
			size,
			orig: index,
			mod: null,
			focus: null
		}
		input.addEventListener('focus', e => {
			obj.focus = e.target.value
		})
		input.addEventListener('blur', e => {
			// check if the name collides
			if (isNetworkSelected) {
				if (e.target.value === obj.orig) {
					input.classList.add('clash')
				} else {
					input.classList.remove('clash')
				}
			}

			if (e.target.value != obj.focus) {
				obj.mod = e.target.value
			}
			obj.focus = null
		})
		indexPool.push(obj)
	}

	const networkList = document.getElementById('network-list')
	listJSON.forEach(str => {
		const markup = `<li>
			<label class="custom-checkbox">
				<input type="radio" name="network-name" value="${str}" />
				<span class="checkmark">${str}</span>
			</label>
		</li>`
		networkList.innerHTML += markup
	})

	const form = document.getElementById('network-form')
	form.addEventListener('submit', submitForm)

	// Radios
	const radios = form.querySelectorAll('input[type=radio]')
	// convert NodeList to Array first
	Array.prototype.slice.call(radios).forEach(r => {
		r.addEventListener('change', e => {
			const currentNetwork = e.target.value
			// update the inputs
			indexPool.forEach(obj => {
				const source = obj.mod || obj.orig
				const str = source.replace(/\.(?=[^.]*$)/, `__${currentNetwork}.`)
				obj.elem.value = str
				obj.elem.classList.remove('clash')
			})

			// a network has ben selected; enable submit button
			isNetworkSelected = true
			document.querySelector('button[type="submit"]').disabled = false
		})
	})
}

function submitForm(e) {
	if (e.preventDefault) e.preventDefault()

	// check the names for overwrites
	let isConflict = false
	for (var i = 0, k = indexPool.length; i < k; i++) {
		const obj = indexPool[i]
		if (obj.elem.value === obj.orig) {
			isConflict = true
			break
		}
	}
	if (isConflict) {
		var confirmation = confirm(
			`WARNING:\nIndex files named the same as source (in red).\nThis will OVERWRITE the original.\nDo you want to proceed?`
		)
		return confirmation ? processForm() : false
	} else {
		return processForm()
	}
}

function processForm() {
	const checkedNetwork = document.querySelector('input[name="network-name"]:checked').value
	const outputTargets = indexPool.map(src => {
		return {
			size: src.size,
			index: src.orig,
			name: src.mod || src.elem.value
		}
	})

	superagent
		.post(`/@ff0000-ad-tech/cs-plugin-apply-network/api/`)
		.send({ action: 'write', targets: outputTargets, network: checkedNetwork })
		.end((err, res) => {
			if (err) {
				return alert(err)
			}
			console.log('Index(s) create success!')
			// redirect back to CS/app
			location.href = query.api.replace('/api', '/app')
		})

	// You must return false to prevent the default form behavior
	return false
}

// loads in the networks
superagent.get(`/@ff0000-ad-tech/cs-plugin-apply-network/api/?action=list`).end((err, res) => {
	if (err) {
		alert('Error with API. Unable to proceed')
		return
	}

	try {
		const data = JSON.parse(res.text)
		const result = JSON.parse(data.stdout)
		// initialize the app with the API result
		init(result)
	} catch (e) {
		alert(e)
	}
})

function create(type, target) {
	const elem = document.createElement(type)
	target.appendChild(elem)
	return elem
}
