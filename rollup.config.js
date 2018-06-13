import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'index.js',
  output: {
    file: 'dist/vuex-dot-buffer.js',
    format: 'umd',
    name: 'VuexDotBuffer'
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      // these values can also be regular expressions
      // include: /node_modules/
    })
  ]
};