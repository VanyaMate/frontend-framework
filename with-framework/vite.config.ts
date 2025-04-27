import { defineConfig } from 'vite';
import dtsPlugin from 'vite-plugin-dts';


export default defineConfig({
    plugins: [
        dtsPlugin({
            rollupTypes: true,
            outDir     : 'dist',
            entryRoot  : 'src',
        }),
    ],
    build  : {
        outDir     : 'dist',
        target     : 'esnext',
        emptyOutDir: true,
        lib        : {
            name    : 'index',
            formats : [ 'cjs', 'es' ],
            entry   : './src/index.ts',
            fileName: 'index',
        },
    },
});