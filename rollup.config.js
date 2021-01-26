import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';

module.exports = {
  external: ['react', 'eventemitter3'],
  input: 'src/index.ts',
  plugins: [
    typescript({
      exclude: 'node_modules/**',
      typescript: require('typescript'),
    }),
    terser(),
  ],
  output: [
    {
      format: 'umd',
      name: 'clean-state',
      file: 'lib/index.min.js',
    },
  ],
};
