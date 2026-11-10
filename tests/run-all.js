const { spawnSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status === null ? 1 : result.status);
  }
}

const syntaxFiles = [
  'public/script.js',
  'public/project-data.js',
  'public/portfolio-state.js',
  'src/lib/posts.mjs',
  'src/lib/portfolio.mjs',
  'src/lib/site.mjs',
];

for (const file of syntaxFiles) {
  run(process.execPath, ['--check', file]);
}

const tests = [
  'tests/script-contract.test.js',
  'tests/css-contract.test.js',
  'tests/dom-contract.test.js',
  'tests/project-data.test.js',
  'tests/portfolio-state.test.js',
  'tests/posts-contract.test.mjs',
];

for (const test of tests) {
  run(process.execPath, [test]);
}

run(process.execPath, [path.join(root, 'node_modules', 'astro', 'bin', 'astro.mjs'), 'build']);
run(process.execPath, ['tests/build-output.test.js']);

console.log('all checks passed');
