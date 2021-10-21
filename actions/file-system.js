import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

/**
 * @typedef {Object} Entry
 * @property {string} name - ファイル名。
 * @property {string} md5Checksum - 16進数小文字のMD5ハッシュ値。
 */

/**
 * ファイルのMD5ハッシュ値を計算します。
 * @param {sring} filePath
 * @returns {Promise.<string>}
 */
async function hashMD5(filePath)
{
	const hash = crypto.createHash('md5');
	hash.update(await fs.readFile(filePath));
	return hash.digest('hex');
}

/**
 * 指定したフォルダ直下のファイルの情報を取得します。
 * @param {string} directoryPath
 * @returns {Promise.<Entry[]>} フォルダは含まない。
 */
export async function getFiles(directoryPath)
{
	return Promise.all((await fs.readdir(directoryPath, { withFileTypes: true }))
		.filter(entry => entry.isFile())
		.map(async entry => ({
			name: entry.name,
			md5Checksum: await hashMD5(path.resolve(directoryPath, entry.name)),
		})));
}

/**
 * フォルダを統合します。
 * @param {string} sourceDirectoryPath
 * @param {string} destinationDirectoryPath
 * @returns {Promise.<void>}
 */
export async function mergeDirectory(sourceDirectoryPath, destinationDirectoryPath)
{
	// 統合先のフォルダを作成
	try {
		await fs.mkdir(destinationDirectoryPath);
	} catch (exception) {
		// すでにフォルダが存在する場合
	}

	// 統合元のファイル・フォルダ情報を取得
	for (const sourceEntry of await fs.readdir(sourceDirectoryPath, { withFileTypes: true })) {
		const sourcePath = path.resolve(sourceDirectoryPath, sourceEntry.name);
		const destinationPath = path.resolve(destinationDirectoryPath, sourceEntry.name);

		if (sourceEntry.isDirectory()) {
			// フォルダ
			await mergeDirectory(sourcePath, destinationPath);
			continue;
		}

		// ファイルの移動
		await fs.rename(sourcePath, destinationPath);
	}
}
