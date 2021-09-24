
// node terser_example.js
// Should be executed via nodejs
const Terser = require('terser');
const filestream = require('fs');

// This is terser config
// Json file containig
const config = {
  compress: {
    dead_code: true,
    drop_console: false,
    drop_debugger: true,
    keep_classnames: false,
    keep_fargs: true,
    keep_fnames: false,
    keep_infinity: false
  },
  mangle: {
    eval: false,
    keep_classnames: false,
    keep_fnames: false,
    toplevel: false,
    safari10: false
  },
  module: false,
  sourceMap: false,
  output: {
    comments: 'some'
  }
};


const code = filestream.readFileSync('./JavaScriptPassword_Files/pass.js', 'utf8');

Terser.minify(code,config).then(result => {

  filestream.writeFileSync('./obfuscated_files/pass.js', result.code);

}).catch(err => {
  console.log(err);
});

