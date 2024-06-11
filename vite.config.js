// vite.config.js
export default {
	// config options
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3001', changeOrigin: true,
			},
		}
	},
};