const http = require('http');
const moment = require('moment');
const template = require('./template');
const fetchData = require('./fetch');

const serverCallBack = async (req, res) => {
	const url = req.url;
	const start_time = moment('9:00', 'HH:mm');
	const finish_time = moment('18:00', 'HH:mm');
	const now = moment().format('HH:mm');
	const start_diff = start_time.diff(moment(), 'minutes');
	const end_diff = moment().diff(finish_time, 'minutes');
	let additionalMessage = '';
	const listCountries = await fetchData(
		'https://api.teleport.org/api/countries/'
	).then((res) => {
		return res._links['country:items'];
	});
	const dataCountries = await Promise.all(
		listCountries.map((country) => {
			const { name, href } = country;
			return fetchData(href).then((res) => {
				console.log(res);
				return {
					name,
					population: res.population,
					currency: res.currency_code,
					href,
				};
			});
		})
	);
	if (start_diff > 0) {
		additionalMessage = `Please contact me in ${start_diff} minutes.\n`;
	}
	if (end_diff > 0) {
		additionalMessage += `Please contact me tomorrow.`;
	}
	const html_home = `
				<h1>Hello everyone,</h1>
				<h2>Welcome to our page.</h2>
				<h3>Now, it\'s ${now}.</h3>
				<h3>I am starting to work from ${start_time.format(
					'HH:mm'
				)} to ${finish_time.format('HH:mm')} Monday to Friday.</h3>
				${additionalMessage && `<p>${additionalMessage}</p>`}
				<p>Consult <a href="/list-uni-uk">list</a> of countries in the world</p>
	`;
	const home = template(html_home);

	res.writeHead('200', { 'Content-Type': 'text/html' });
	if (url === '/list-uni-uk') {
		let html = '';
		dataCountries.map((country) => {
			return (html += `<li>
			<h4>${country.name}</h4>
			<p>Population: ${country.population}</p>
			<p>Currency: ${country.currency}</p>
			</li>`);
		});
		const page = `
				<h1>Here is the list of countries in the world.</h1>
				<ul>${html}</ul>
		`;

		res.end(template(page));
	}
	res.end(home);
};

http.createServer(serverCallBack).listen('8080');
