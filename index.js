#!/usr/bin/env node

/**
 * scraper
 * A cli to scrape websites
 *
 * @author Adeniyi <adeniyi.in>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const scrape = require('./utils/scrape');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	flags.scrape && (await scrape());
	debug && log(flags);
})();
