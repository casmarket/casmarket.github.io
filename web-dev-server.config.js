import generateEventIndexPathHTMLPairs from './generate-event-index-path-html-pairs.js';

const pathHTMLPairs = await generateEventIndexPathHTMLPairs();

/** @type {import('@web/dev-server').DevServerConfig} */
export default {
	open: true,
	watch: true,
	appIndex: '6/index.html',
	nodeResolve: true,
	esbuildTarget: 'auto',
	port: 55341,
	middleware: [
		function (context, next) {
			if (context.url.endsWith('/')) {
				context.url += 'index.html';
			}
			return next();
		},
		async function (context, next) {
			const html = pathHTMLPairs[context.url];
			if (!html) {
				return next();
			}
			await next();
			context.response.body = html;
		},
		function (context, next) {
			if (!context.url.includes('_') && !context.url.startsWith('/node_modules/')) {
				context.url = '/docs' + context.url;
				if (context.url.endsWith('/')) {
					context.url += 'index.html';
				}
			}
			return next();
		},
	],
};
