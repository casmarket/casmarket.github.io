import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import drive from '@googleapis/drive';
import sheets from '@googleapis/sheets';
import * as fileSystem from './file-system.js';

/**
 * 認証情報を取得します。
 * @returns {sheets.auth.GoogleAuth}
 */
export function getAuth()
{
	return new sheets.auth.GoogleAuth({
		scopes: [
			'https://www.googleapis.com/auth/drive.readonly',
			'https://www.googleapis.com/auth/spreadsheets.readonly',
		],
		credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_SECRET_KEY),
	});
}

/**
 * 指定したフォルダ直下のフォルダ・ファイルの情報を取得します。
 * @param {drive.drive_v3.Drive} drive
 * @param {string} folderId
 * @returns {Promise.<drive.drive_v3.Schema$File[]>}
 */
async function listEntries(drive, folderId)
{
	const entries = [ ];
	let pageToken;
	do {
		const { nextPageToken, files } = (await drive.files.list({
			q: `'${folderId}' in parents`,
			fields: 'nextPageToken, files(id, mimeType, name, md5Checksum)',
			pageToken,
		})).data;
		pageToken = nextPageToken;
		entries.push(...files);
	} while (pageToken);
	return entries;
}

/**
 * ファイルを取得し保存します。
 * @param {drive.drive_v3.Drive} drive
 * @param {string} sourceFileId
 * @param {string} destinationPath
 * @returns {Promise.<void>}
 */
async function fetchAndSaveFile(drive, sourceFileId, destinationPath)
{
	const writeStream = createWriteStream(destinationPath);
	const data = (await drive.files.get({ fileId: sourceFileId, alt: 'media' }, { responseType: 'stream' })).data;
	return new Promise(function (resolve) {
		data.on('data', function (chunk) {
			writeStream.write(chunk);
		});
		data.on('end', resolve);
	});
}

/**
 * Googleドライブのフォルダの内容を同期します。
 *
 * 同期先のフォルダの削除は行いません。
 * @param {sheets.auth.GoogleAuth} auth
 * @param {string} sourceFolderId
 * @param {string} destinationDirectoryPath
 * @returns {Promise.<void>}
 */
export async function syncFolder(auth, sourceFolderId, destinationDirectoryPath)
{
	const drv = drive.drive({ version: 'v3', auth });

	// 同期元のファイル・フォルダ情報を取得
	const sourceEntries = await listEntries(drv, sourceFolderId);

	// 同期先のフォルダを作成
	try {
		await fs.mkdir(destinationDirectoryPath);
	} catch (exception) {
		// すでにフォルダが存在する場合
	}

	// 同期先のファイル情報を取得
	const destinationEntries = await fileSystem.getFiles(destinationDirectoryPath);

	for (const sourceEntry of sourceEntries) {
		if (sourceEntry.mimeType === 'application/vnd.google-apps.folder') {
			// フォルダ
			await syncFolder(auth, sourceEntry.id, path.resolve(destinationDirectoryPath, sourceEntry.name));
			continue;
		}

		if (!sourceEntry.md5Checksum) {
			continue;
		}

		const destinationEntry = destinationEntries.find(entry => entry.name === sourceEntry.name);
		if (destinationEntry) {
			// 同期先に同名のファイルが存在すれば
			if (destinationEntry.md5Checksum === sourceEntry.md5Checksum) {
				// 同一のファイルなら
				continue;
			}
			await fs.rm(path.resolve(destinationDirectoryPath, destinationEntry.name));
		}

		// コピー
		await fetchAndSaveFile(drv, sourceEntry.id, path.resolve(destinationDirectoryPath, sourceEntry.name));
	}

	// 同期元に存在しないファイルの削除
	for (const file of destinationEntries) {
		if (sourceEntries.find(sourceEntry => sourceEntry.name === file.name)) {
			continue;
		}

		await fs.rm(path.resolve(destinationDirectoryPath, file.name));
	}
}

/**
 * Googleスプレッドシートのカタログデータを取得します。
 * @param {sheets.auth.GoogleAuth} auth
 * @param {string} eventId
 * @returns {Promise.<Array>}
 */
export async function fetchCatalogue(auth, eventId)
{
	// Google認証・スプレッドシートの内容を取得
	const rows = (await sheets.sheets({ version: 'v4', auth }).spreadsheets.values.get({
		spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
		range: eventId,
	})).data.values;

	const headerNames = rows.shift();
	return rows.map(row => {
		// 列名をキーとするオブジェクトに
		const nameValuePairs = { };
		for (let i = 0; i < row.length; i++) {
			const value = row[i];
			nameValuePairs[headerNames[i]] = value ? value : null;
		}

		if (!nameValuePairs['ID']) {
			// 空の行
			return null;
		}

		const item = { id: nameValuePairs['ID'], classId: nameValuePairs['区分ID'] };
		if (item.classId === 'poster') {
			// ポスター
			item.poster = 'posters/' + nameValuePairs['画像ファイル名'];
		} else {
			// シンプル会場・テーマ会場
			item.badge = nameValuePairs['バッヂ'];
			item.exhibitor = {
				name: nameValuePairs['出展者名'],
				tsoURL: nameValuePairs['出展者TSO'],
				twitterURL: nameValuePairs['出展者Twitter'],
				icon: 'icons/' + nameValuePairs['画像ファイル名'],
			};

			if (item.classId === 'simple') {
				// シンプル会場
				item.item = {
					title: nameValuePairs['作品名'],
					url: nameValuePairs['作品URL'],
				};
			}
		}

		return item;
	}).filter(item => item); // 空の行の除去
}
