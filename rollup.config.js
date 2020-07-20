import html from 'rollup-plugin-html2';
import scss from 'rollup-plugin-scss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';

const isProd = process.env.BUILD === 'prod';
const isDev = process.env.BUILD === 'dev';

export default [
  {
    input: './src/main.ts',
    output: [
      {
        file: './dist/app.js',
        format: 'iife',
        globals: {
          'pixi.js': 'PIXI',
        },
      },
    ],

    plugins: [
      resolve({ base: 'src', browser: true, preferBuiltins: false }),
      typescript({}),
      commonjs({}),
      scss(),
      html({ template: './src/index.html', inject: false }),
      isProd && terser(),
      copy({
        targets: [
          {
            src: './src/assets/*',
            dest: 'dist/assets/',
          },
        ],
      }),
      isDev && serve('dist/'),
      isDev && livereload(),
    ],
  },
];
