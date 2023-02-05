const ask = require('./ask');

module.exports = async () => {
	const url = await ask({
		name: `url`,
		message: `Website URL?`,
		initial: ``
	});
	const productElements = await ask({
		name: `productElements`,
		message: `Product Container Class?`,
		initial: `.c-prd`
	});
	const nameClass = await ask({
		name: `nameClass`,
		message: `Name Class?`,
		hint: `(kebab-case only)`,
		initial: `.name`
	});
	const priceClass = await ask({
		name: `priceClass`,
		message: `Product Class?`,
		initial: `.prc`
	});
	const linkClass = await ask({
		name: `linkClass`,
		message: `URL Class?`,
		initial: `.core`
	});
	const discountClass = await ask({
		name: `discountClass`,
		message: `Discount Class?`,
		initial: `._dsct`
	});

	const vars = {
		url,
		productElements,
		nameClass,
		priceClass,
		linkClass,
		discountClass
	};

	return vars;
};
