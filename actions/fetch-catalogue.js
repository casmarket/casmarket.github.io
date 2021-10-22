import { fileURLToPath } from 'url';
import path from 'path';
import * as events from './events.js';
import * as google from './google.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const auth = google.getAuth();

// 画像データの同期
await google.syncFolder(auth, process.env.GOOGLE_FOLDER_ID, path.resolve(dirname, '../user-data'));

// カタログデータの取得・保存
for (const eventId of await events.getEventIds()) {
	await events.saveCatalogue(eventId, await google.fetchCatalogue(auth, eventId));
}
