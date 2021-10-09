import { fileURLToPath } from 'url';
import path from 'path';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('webpack').Configuration} */
export default {
	mode: 'development',
	entry: './docs/scripts/index.js',
	output: {
		path: path.resolve(dirname, 'docs/scripts'),
		filename: 'index.js',
		scriptType: 'module',
	},
	devtool: 'source-map',
};
