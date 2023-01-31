const puppeteer = require('puppeteer');
const ora = require('ora');
const Table = require('cli-table3');
const chalk = require('chalk');
const green = chalk.green;
const greenI = chalk.green.inverse;

const spinner = ora({ text: '' });

// const cli = require('./cli');
// const flags = cli.flags;
// const { url } = flags;
// console.log('🚀 ~ file: scrape.js:11 ~ url', url);

const questions = require('./questions');

module.exports = async () => {

	const responses = await questions();

	spinner.start(chalk.dim(`Scraping Website…`));

	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	const page = await browser.newPage();
	await page.goto(responses.url);

	// Use page.evaluate() to extract information from the page
	const products = await page.evaluate(responses => {
		const {
			productElements: pElem,
			nameClass,
			priceClass,
			linkClass,
			discountClass
		} = responses;
		// Find all product elements on the page
		const productElements = Array.from(document.querySelectorAll(pElem));

		// Extract the name, amount, and link for each product
		return productElements.map(product => {
			const name = product.querySelector(nameClass)?.innerText;
			const amount = product.querySelector(priceClass)?.innerText;
			const discount = product.querySelector(discountClass)?.innerText;
			const link = product.querySelector(linkClass).getAttribute('href');
			return { name, amount, discount, link };
		});
	}, responses);

	spinner.stop();

	const sortedProducts = products.sort(
		(a, b) => parseFloat(b.discount) - parseFloat(a.discount)
	);

	// Create a new table
	const table = new Table({
		head: ['Name', 'Amount', 'Discount', 'Link'],
		colWidths: [60],
		style: {
			head: ['green'],
			'border-left': '',
			'border-right': '',
			'border-top': '',
			'border-bottom': ''
		}
	});

	// Add the products to the table
	sortedProducts.forEach(product => {
		const name = chalk.bold.cyan(product.name);
		const discount = chalk.bold.red(product.discount);
		table.push([name, product.amount, discount, product.link]);
	});

	console.log(table.toString());
	console.log(`\n${greenI(` SUCCESS `)} ${green("The operation is successful")}\n`);
	console.log(`${greenI(` ${sortedProducts.length} `)} records found!\n`);

	await browser.close();
};
