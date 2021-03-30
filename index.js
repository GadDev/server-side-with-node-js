console.log('hello');
const http = require('http');
const moment = require('moment');

const serverCallBack = (req, res) => {
	const start_time = moment().format('9:00', 'HH:mm');
	const finish_time = moment().format('18:00', 'HH:mm');
	const now = moment().format('HH:mm');
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
				<h3>I am starting to work from ${start_time} to ${finish_time} Monday to Friday.
			</main>
		</body>
	</html>
	`;

	res.writeHead('200', { 'Content-Type': 'text/html' });
	res.end(message);
};

http.createServer(serverCallBack).listen('8080');
