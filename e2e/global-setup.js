const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

module.exports = async () => {
  const outfile = path.join(__dirname, 'fixtures/build/frameObserver.test.js');

  // FO_TARGET=dist: run integration tests against the committed build instead of src/.
  if (process.env.FO_TARGET === 'dist') {
    fs.mkdirSync(path.dirname(outfile), { recursive: true });
    fs.copyFileSync(path.join(__dirname, '../dist/frameObserver.js'), outfile);
    return;
  }

  await esbuild.build({
    entryPoints: [path.join(__dirname, 'entry.js')],
    bundle: true,
    format: 'iife',
    target: 'es2017',
    outfile,
    logLevel: 'warning',
  });
};
