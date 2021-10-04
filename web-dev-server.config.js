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
			if (!context.url.includes('_') && !context.url.startsWith('/node_modules/')) {
				context.url = '/docs' + context.url;
				if (context.url.endsWith('/')) {
					context.url += 'index.html';
				} else if (context.url.endsWith('.js')) {
					context.url = context.url.replace(/^\/docs\//u, '/src/');
				}
			}
			return next();
		},
	],
};
