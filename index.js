const http = require('http');
const moment = require('moment');
const template = require('./template');
const fetchData = require('./fetch');
const fs = require('fs');

var html_content = undefined;

const serverCallBack = async (req, res) => {
	const url = req.url;
	const start_time = moment('9:00', 'HH:mm');
	const finish_time = moment('18:00', 'HH:mm');
	const now = moment().format('HH:mm');
	const start_diff = start_time.diff(moment(), 'minutes');
	const end_diff = moment().diff(finish_time, 'minutes');
	let additionalMessage = '';
	const body_begin_index = html_content.indexOf('<body>');
	const body_end_index = html_content.indexOf('</body>');
	const string_until_body = html_content.slice(0, body_begin_index + 6);
	const string_from_body = html_content.slice(body_end_index);

	const listCountries = await fetchData(
		'https://api.teleport.org/api/countries/'
	).then((res) => {
		return res._links['country:items'];
	});
	const dataCountries = await Promise.all(
		listCountries.map((country) => {
			const { name, href } = country;
			return fetchData(href).then((res) => {
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
	let html = string_from_body + html_home + string_until_body;

	res.writeHead('200', { 'Content-Type': 'text/html' });
	if (url === '/list-uni-uk') {
		let html_list = '';
		dataCountries.map((country) => {
			return (html_list += `<li>
			<h4>${country.name}</h4>
			<p>Population: ${country.population}</p>
			<p>Currency: ${country.currency}</p>
			</li>`);
		});
		let page = `
			<header><h1><a href="/">Home</a></h1></header>
				<h2>Here is the list of countries in the world.</h2>
				<ul>${html_list}</ul>
		`;
		let html = string_from_body + page + string_until_body;
		res.end(html);
	}
	res.end(html);
};

http.createServer(serverCallBack).listen('8080');

fs.readFile('./index.html', (err, html) => {
	if (err) {
		throw new Error(err);
	}
	html_content = html;
});
