import superagent from 'superagent'
import { getQueryParams } from 'ad-global'

const query = getQueryParams()
const indexPool = []

function init(listJSON) {
	const indexJSON = JSON.parse(query.targets)
	console.log(indexJSON)

	const indexList = document.getElementById('index-list')

	for (var key in indexJSON) {
		const [profile, size, index] = key.split('/')
		// console.warn(key, profile, size, index)
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
			if (e.target.value != obj.focus) {
				obj.mod = e.target.value
			}
			obj.focus = null
		})
		indexPool.push(obj)
	}

	function create(type, target) {
		const elem = document.createElement(type)
		target.appendChild(elem)
		return elem
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
	form.addEventListener('submit', processForm)

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
			})
		})
	})
}

function processForm(e) {
	if (e.preventDefault) e.preventDefault()

	const checkedNetwork = document.querySelector('input[name="network-name"]:checked').value
	const outputTargets = indexPool.map(src => {
		return {
			size: src.size,
			index: src.orig,
			name: src.mod || src.elem.value
		}
	})
	console.log(outputTargets)

	superagent
		.post(`/@ff0000-ad-tech/cs-plugin-apply-network/api/`)
		.send({ targets: outputTargets })
		.send({ network: checkedNetwork })
		.end((err, res) => {
			if (err) {
				return alert(err)
			}
			console.log('Index(s) create success!')
			// 	redirect back to CS/app
			location.href = query.api.replace('/api', '/app')
		})

	// You must return false to prevent the default form behavior
	return false
}

superagent
	.get(`/@ff0000-ad-tech/cs-plugin-apply-network/api/?action=list`)
	// .query({ action: 'edit', city: 'London' })
	.end((err, res) => {
		if (err) {
			alert('Error with API. Unable to proceed')
			return
		}

		try {
			const data = JSON.parse(res.text)
			const result = JSON.parse(data.stdout)
			console.log(data)
			// initialize the app with the API result
			init(result)
		} catch (e) {
			alert(e)
		}
	})
