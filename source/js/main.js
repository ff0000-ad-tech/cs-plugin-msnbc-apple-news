import superagent from 'superagent'
import { getQueryParams } from 'ad-global'
import listJSON from '../lib/networks/list.json'

const query = getQueryParams()
const indexJSON = JSON.parse(query.targets)
// console.log(query)
// console.log(listJSON)
// console.log(indexJSON)

const indexList = document.getElementById('index-list')
for (var key in indexJSON) {
	const val = key.match(/(?<=\/).*/)[0]
	indexList.innerHTML += `<li>${val}</li>`
}

const networkList = document.getElementById('network-list')
listJSON.forEach(str => {
	const markup = `<li>
        <label class="custom-checkbox">
            <input type="checkbox" value="${str}" />
            <span class="checkmark">${str}</span>
        </label>
    </li>
    `
	networkList.innerHTML += markup
})

function processForm(e) {
	if (e.preventDefault) e.preventDefault()

	const checkboxes = e.target.querySelectorAll('input[type=checkbox]')
	// convert NodeList to Array first
	const checkedPool = Array.prototype.slice
		.call(checkboxes)
		.filter(elem => elem.checked)
		.map(elem => elem.value)
	// console.log(checkedPool)

	superagent
		.post(`/@ff0000-ad-tech/cs-plugin-apply-network/api/`)
		.send({ targets: query.targets })
		.send({ networks: checkedPool })
		.end((err, res) => {
			if (err) {
				return alert(err)
			}
			console.log('Index(s) create success!')

			// redircet back to CS/app
			location.href = query.api.replace('/api', '/app')
		})

	// You must return false to prevent the default form behavior
	return false
}

var form = document.getElementById('network-form')
form.addEventListener('submit', processForm)
