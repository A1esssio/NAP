export default {
    build: {
        outDir: './public',
        emptyOutDir: true,
    },
    server: {
        port: 5173,
        proxy: {
            // В dev-режиме /api/* → http://localhost:3000/*
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
};
