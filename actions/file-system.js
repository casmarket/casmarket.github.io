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
