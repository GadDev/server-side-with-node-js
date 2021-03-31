const http = require('http');
const moment = require('moment');
const got = require('got');
const fetchData = async (url) => {
	try {
		const response = await got(url);
		return JSON.parse(response.body);
	} catch (error) {
		return new Error(error.message);
	}
};

// const renderCountries = async () => {
// 	let html = '';
// 	const response = fetchData('https://api.teleport.org/api/countries/');
// 	const countries = response._links['country:items'];
// 	const dataCountries = {};
// 	countries.map((item) => {
// 		const data = fetchData(item.href);
// 		const country = item.name;
// 		console.log(dataCountries);
// 		dataCountries[country] = {
// 			data,
// 		};
// 		html += `<li><h5>${item.name}${dataCountries[item.name]}</h5></li>`;
// 	});

// 	return html;
// };

const serverCallBack = async (req, res) => {
	const url = req.url;
	const start_time = moment('9:00', 'HH:mm');
	const finish_time = moment('18:00', 'HH:mm');
	const now = moment().format('HH:mm');
	const start_diff = start_time.diff(moment(), 'minutes');
	const end_diff = moment().diff(finish_time, 'minutes');

	let additionalMessage = '';
	if (start_diff > 0) {
		additionalMessage = `Please contact me in ${start_diff} minutes.\n`;
	}
	if (end_diff > 0) {
		additionalMessage += `Please contact me tomorrow.`;
	}
	const message = `
	<html>
		<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>
			* {
				box-sizing: border-box;
			}
			html {
				font-size: 100%;
			}
			body {
				background-color: ivory;
				font-family: Helvetica, Arial, sans-serif;
				
			}
			main {
				padding: 20px;
				width: 100%
				max-width: 960px;
				margin: 20px auto;
				background-color: midnightblue;
				color: white;
			}
			h1,h2,h3 {
				font-weight: normal;
			}

		</style>
		</head>
		<body>
			<main>	
				<h1>Hello everyone,</h1>
				<h2>Welcome to our page.</h2>
				<h3>Now, it\'s ${now}.</h3>
				<h3>I am starting to work from ${start_time.format(
					'HH:mm'
				)} to ${finish_time.format('HH:mm')} Monday to Friday.</h3>
				${additionalMessage && `<p>${additionalMessage}</p>`}
				<p>Consult <a href="/list-uni-uk">list</a> of universities in UK</p>

			</main>
		</body>
	</html>
	`;

	res.writeHead('200', { 'Content-Type': 'text/html' });
	if (url === '/list-uni-uk') {
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
					};
				});
			})
		);
		let html = '';
		dataCountries.map((country) => {
			return (html += `<li style="padding: 1rem; background: white">
			<h4>${country.name}</h4>
			<p>Population: ${country.population}</p>
			<p>Currency: ${country.currency}</p>
			</li>`);
		});
		const page = `<html>
		<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>
			* {
				box-sizing: border-box;
			}
			html {
				font-size: 100%;
			}
			body {
				background-color: ivory;
				font-family: Helvetica, Arial, sans-serif;
				
			}
			main {
				padding: 20px;
				width: 100%
				max-width: 960px;
				margin: 20px auto;
			
				color: #333;
			}
			h1,h2,h3 {
				font-weight: normal;
			}
			ul {
				list-style: none;
				display: grid;
				grid-template-columns: auto auto auto auto;
				grid-column-gap: 10px;
				grid-row-gap: 10px;
				padding: 0;
			}

		</style>
		</head>
		<body>
			<main>	
				<h1>Here is the list of coutries in UK.</h1>
				<ul style="list-style: none;display: grid; grid-template-columns: auto auto auto auto;grid-column-gap: 10px;grid-row-gap: 10px">${html}</ul>
			</main>
		</body>
	</html>`;

		res.end(page);
	}
	res.end(message);
};

http.createServer(serverCallBack).listen('8080');
