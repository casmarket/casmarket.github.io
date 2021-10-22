import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import yaml from 'js-yaml';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * イベントIDのリストを取得します。
 * @returns {Promise.<string>}
 */
export async function getEventIds()
{
	return yaml.load(await fs.readFile(path.resolve(dirname, '../docs/events.yaml'), { encoding: 'utf-8' }))
		.filter(event => !event.static)
		.map(event => event.id);
}

/**
 * カタログデータを保存します。
 * @param {string} eventId
 * @param {Array} catalogue
 * @returns {Promise.<void>}
 */
export async function saveCatalogue(eventId, catalogue)
{
	const cataloguePath = path.resolve(dirname, `../user-data/${eventId}/catalogue.json`);
	try {
		await fs.mkdir(path.dirname(cataloguePath));
	} catch (exception) {
		// フォルダが存在する場合
	}
	await fs.writeFile(cataloguePath, JSON.stringify(catalogue, null, '\t'));
}
