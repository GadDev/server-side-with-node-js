const got = require('got');

module.exports = async (url) => {
	try {
		const response = await got(url);
		return JSON.parse(response.body);
	} catch (error) {
		throw new Error(error.message);
	}
};
