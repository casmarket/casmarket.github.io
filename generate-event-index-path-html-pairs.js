import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import ejs from 'ejs';
import * as dates from './docs/scripts/dates.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @returns {Promise.<Object.<string>>}
 */
export default async function ()
{
	const pathHTMLPairs = { };
	const template = await fs.readFile(path.resolve(dirname, 'event-index-template.ejs'), { encoding: 'utf-8' });
	for (const { id, name }
		of yaml.load(await fs.readFile(path.resolve(dirname, 'docs/events.yaml'), { encoding: 'utf-8' }))
			.filter(event => !event.static)) {
		pathHTMLPairs[`/${id}/index.html`] = ejs.render(template, { id, name, start: dates.toHumanReadable({
			date: new Date(yaml.load(
				await fs.readFile(path.resolve(dirname, `docs/${id}/params.yaml`), { encoding: 'utf-8' }),
			).period.start),
			displayYear: true,
			displayTime: true,
		}) });
	}
	return pathHTMLPairs;
}
