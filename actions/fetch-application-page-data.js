import * as events from './events.js';
import * as applications from './applications.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// 最新のイベントのIDを取得
const eventId = await events.fetchLatestEventId();

// 現在のカタログデータを取得
const catalogue = await events.getCurrentCatalogue(eventId);

// アイコンを保存するフォルダを作成
try {
	await fs.mkdir(path.resolve(dirname, 'data', eventId, 'icons'));
} catch (exception) {
	// フォルダが存在する場合
}

for (const item of catalogue) {
	if (item.classId === 'poster') {
		continue;
	}

	// connpassからユーザーデータを取得
	const { twitterURL, icon, iconExtension } = await applications.fetchTwitterURLAndIcon(item.connpassUserName);

	// TwitterのURLを上書き
	item.exhibitor.twitterURL = twitterURL;

	// アイコンの保存
	if (item.exhibitor.icon) {
		// すでにアイコンを取得済みなら、削除
		await fs.rm(path.resolve(dirname, 'data', eventId, item.exhibitor.icon));
	}
	const iconPath = 'icons/' + item.connpassUserName + iconExtension;
	await fs.writeFile(path.resolve(dirname, 'data', eventId, iconPath), icon);
	item.exhibitor.icon = iconPath;
}

// 保存
await events.saveCatalogue(eventId, catalogue);
