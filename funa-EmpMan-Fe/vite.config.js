import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    // Load env file based on `mode` in the current directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    var env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        build: {
            outDir: 'dist',
            emptyOutDir: true,
        },
        server: {
            proxy: {
                '/api': {
                    target: 'http://localhost:5000',
                    changeOrigin: true,
                },
            },
        },
        define: {
            'process.env': env
        }
    };
});
