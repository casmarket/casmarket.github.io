import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import generateEventIndexPathHTMLPairs from './generate-event-index-path-html-pairs.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @returns {Promise.<import('webpack').Configuration>} */
export default {
	mode: 'development',
	entry: './docs/scripts/index.js',
	output: {
		path: path.resolve(dirname, 'docs/scripts'),
		filename: 'index.js',
		scriptType: 'module',
	},
	devtool: 'source-map',
	plugins: [
		{ apply(compiler)
		{
			compiler.hooks.afterEmit.tapPromise('GenerateEventPages', async function () {
				const pathHTMLPairs = await generateEventIndexPathHTMLPairs();
				for (const filePath in pathHTMLPairs) {
					await fs.writeFile(path.resolve(dirname, 'docs' + filePath), pathHTMLPairs[filePath]);
				}
			});
		} },
	],
};
