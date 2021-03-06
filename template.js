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
				background-color: white-smoke;
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

			h1 {
				border-bottom: 1px solid #333;
				padding-bottom: 20px;
			}

			ul {
				list-style: none;
				padding: 0;
				margin: 0;
				display: grid; 
				grid-template-columns: auto auto auto auto;
				grid-column-gap: 10px;
				grid-row-gap: 10px
			}
			li {
				padding: 1rem; 
				border:1px solid #ccc
			}

			@media screen and (max-width: 640px) {
				main {
					padding: 0;
				}
				ul {
					grid-template-columns: auto auto !important;
				}
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
