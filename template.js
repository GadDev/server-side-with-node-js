const renderTemplate = (children) => {
	return `	<html>
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
				${children}
			</main>
		</body>
	</html>`;
};

module.exports = renderTemplate;