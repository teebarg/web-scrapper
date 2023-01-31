const os = require('os');
const path = require('path');
const { Input } = require('enquirer');
const to = require('await-to-js').default;
const  handleError  = require('./err');
const { Store } = require('data-store');
const chalk = require('chalk');
const yellow = chalk.bold.yellow;

module.exports = async ({ name, message, hint, initial }) => {
	let history = false;
	if (
		!initial &&
		name !== `name` &&
		name !== `description`
	) {
		history = {
			autosave: true,
			store: new Store({
				path: path.join(os.homedir(), `.history/scrape/${name}.json`)
			})
		};
	}
	const [err, response] = await to(
		new Input({
			name,
			message,
			hint,
			initial,
			history,
			validate(value, state) {
				console.log(name)
				return !value ? `Please add a value.` : true;
			}
		})
			.on(`cancel`, () => {
				console.log(yellow(`❯ Cancelled!\n`));
				process.exit(0);
			})
			.run()
	);
	handleError(`INPUT`, err);

	return response;
};
